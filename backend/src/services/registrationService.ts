import { prisma } from "../lib/prisma";
import {
  RegistrationStatus,
  PaymentStatus,
  PaymentMethod,
  ParticipantCategory,
  RegistrationType,
  Role,
  type Prisma,
} from "../../generated/prisma/client";
import { HttpError } from "../lib/errors";
import { VerificationService } from "./verificationService";
import type {
  CreateRegistrationInput,
  RegistrationDetail,
  JwtUserPayload,
} from "../types";

/**
 * Helper to normalize participant category strings from frontend or enum values
 */
export function normalizeParticipantCategory(
  cat: ParticipantCategory | string | undefined
): ParticipantCategory {
  if (!cat) {
    throw new HttpError("Participant category is required", 400);
  }

  const normalized = cat.toString().trim().toUpperCase().replace(/-/g, "_");
  if (normalized === "SAGE") return ParticipantCategory.SAGE;
  if (normalized === "OTHER_COLLEGE") return ParticipantCategory.OTHER_COLLEGE;
  if (normalized === "GENERAL") return ParticipantCategory.GENERAL;

  throw new HttpError(
    `Invalid participant category '${cat}'. Allowed: SAGE, OTHER_COLLEGE, GENERAL`,
    400
  );
}

/**
 * Helper to normalize payment method if provided
 */
export function normalizePaymentMethod(
  method: PaymentMethod | string | undefined
): PaymentMethod | null {
  if (!method) return null;
  const m = method.toString().trim().toUpperCase();
  if (m === "UPI") return PaymentMethod.UPI;
  if (m === "CARD") return PaymentMethod.CARD;
  if (m === "NETBANKING") return PaymentMethod.NETBANKING;
  if (m === "OTHER") return PaymentMethod.OTHER;
  return null;
}

/**
 * Helper to generate unique registration number
 * Example: EUPH-2026-REG-8192ABCD
 */
function generateRegistrationNumber(): string {
  const timestamp = Date.now().toString().slice(-4);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EUPH-2026-REG-${timestamp}${randomSuffix}`;
}

/**
 * Centralized Registration Service implementing all business rules,
 * capacity checks with row locking, and duplicate prevention.
 */
export class RegistrationService {
  /**
   * Creates a new event registration (individual or team) within a Prisma transaction
   * with row-level locking on the Event to guarantee capacity safety and no race conditions.
   * Supports both authenticated users and verified guests.
   */
  public static async createRegistration(
    userId: string | null | undefined,
    input: CreateRegistrationInput
  ): Promise<RegistrationDetail & { paymentToken?: string | null }> {
    if (!input.eventId || input.eventId.trim() === "") {
      throw new HttpError("eventId is required", 400);
    }

    const participantCategory = normalizeParticipantCategory(
      input.participantCategory
    );

    // Extract snapshot personal details supporting either nested personalDetails or flat structure
    const fullName = (
      input.personalDetails?.fullName ||
      input.fullName ||
      ""
    ).trim();
    const email = (
      input.personalDetails?.email ||
      input.email ||
      ""
    ).trim().toLowerCase();
    const phone = (
      input.personalDetails?.phone ||
      input.phone ||
      ""
    ).trim();

    if (!fullName) {
      throw new HttpError("Full name is required", 400);
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpError("A valid email address is required", 400);
    }
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      throw new HttpError("A valid 10-digit phone number is required", 400);
    }

    // Guest verification requirement: if not authenticated, verificationToken is strictly required
    if (!userId) {
      if (!input.verificationToken || input.verificationToken.trim() === "") {
        throw new HttpError("Email verification is required for guest registrations", 400);
      }
      VerificationService.validateScopedToken(
        input.verificationToken,
        "EVENT_REGISTRATION",
        email
      );
    }

    const scholarNumber = input.scholarNumber?.trim() || null;
    const enrollmentNumber = input.enrollmentNumber?.trim() || null;
    const collegeName = input.collegeName?.trim() || null;
    const course = input.course?.trim() || null;
    const year = input.year?.trim() || null;
    const city = input.city?.trim() || null;

    // Execute atomic registration within Prisma transaction with row-level lock
    return await prisma.$transaction(async (tx) => {
      // 1. Lock the Event row in PostgreSQL to serialize concurrent registration requests
      const lockedEvents = await tx.$queryRaw<
        Array<{
          id: string;
          name: string;
          status: string;
          registrationOpen: boolean;
          capacity: number | null;
          registrationDeadline: Date | null;
          registrationType: string;
          minTeamSize: number;
          maxTeamSize: number;
          fee: number;
        }>
      >`
        SELECT id, name, status, "registrationOpen", capacity, "registrationDeadline", "registrationType", "minTeamSize", "maxTeamSize", fee
        FROM "Event"
        WHERE id = ${input.eventId.trim()}
        FOR UPDATE
      `;

      if (!lockedEvents || lockedEvents.length === 0) {
        throw new HttpError("Event not found", 404);
      }

      const eventLock = lockedEvents[0];

      // 2. Check Event publication status
      if (eventLock.status !== "PUBLISHED") {
        throw new HttpError("This event is not published for registrations", 400);
      }

      // 3. STRICT CLOSED REGISTRATION RULE:
      // If registrationOpen is false, registration is strictly blocked for all users (NO admin bypass)
      if (!eventLock.registrationOpen) {
        throw new HttpError(
          "Registrations for this event are currently closed",
          400
        );
      }

      // 4. Check registration deadline
      if (
        eventLock.registrationDeadline &&
        new Date() > new Date(eventLock.registrationDeadline)
      ) {
        throw new HttpError(
          "The registration deadline for this event has passed",
          400
        );
      }

      // 5. Prevent duplicate active registrations by email (or userId) for this event
      const existingRegistration = await tx.registration.findFirst({
        where: {
          eventId: eventLock.id,
          status: {
            in: [RegistrationStatus.CONFIRMED, RegistrationStatus.PENDING],
          },
          OR: [
            { email: { equals: email, mode: "insensitive" } },
            ...(userId ? [{ userId }] : []),
          ],
        },
      });

      if (existingRegistration) {
        throw new HttpError(
          "An active registration already exists for this email address and event",
          400
        );
      }

      // 6. CAPACITY SAFETY:
      // Capacity represents the maximum number of active Registration records
      // (individual registration or team registration = 1 record toward capacity).
      if (eventLock.capacity !== null) {
        const activeRegistrationCount = await tx.registration.count({
          where: {
            eventId: eventLock.id,
            status: {
              in: [RegistrationStatus.CONFIRMED, RegistrationStatus.PENDING],
            },
          },
        });

        if (activeRegistrationCount >= eventLock.capacity) {
          throw new HttpError(
            "Event has reached maximum registration capacity",
            400
          );
        }
      }

      // 7. Handle Group vs Individual validation and Team creation
      let teamId: string | null = null;

      if (eventLock.registrationType === RegistrationType.GROUP) {
        const teamName = input.teamName?.trim();
        if (!teamName) {
          throw new HttpError(
            "Team name is required for group event registrations",
            400
          );
        }

        const membersInput = input.teamMembers || [];
        // Total team size = 1 (Team Leader / Current User) + additional members
        const totalTeamSize = 1 + membersInput.length;

        if (totalTeamSize < eventLock.minTeamSize) {
          throw new HttpError(
            `Group registration requires at least ${eventLock.minTeamSize} team members (including team leader)`,
            400
          );
        }

        if (totalTeamSize > eventLock.maxTeamSize) {
          throw new HttpError(
            `Group registration allows at most ${eventLock.maxTeamSize} team members (including team leader)`,
            400
          );
        }

        // Validate each member has valid name, email, phone and doesn't match leader
        for (let i = 0; i < membersInput.length; i++) {
          const m = membersInput[i];
          if (!m.fullName || !m.fullName.trim()) {
            throw new HttpError(`Team member #${i + 1} name is required`, 400);
          }
          if (!m.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) {
            throw new HttpError(
              `Team member #${i + 1} has an invalid email address`,
              400
            );
          }
          const mEmail = m.email.trim().toLowerCase();
          if (mEmail === email) {
            throw new HttpError(
              `Team member #${i + 1} (${m.fullName}) has the same email as the team leader`,
              400
            );
          }
          if (!m.phone || m.phone.replace(/\D/g, "").length < 10) {
            throw new HttpError(
              `Team member #${i + 1} requires a valid 10-digit phone number`,
              400
            );
          }
        }

        // Create Team and associated TeamMembers
        const team = await tx.team.create({
          data: {
            name: teamName,
            eventId: eventLock.id,
            leaderId: userId || null,
            leaderName: fullName,
            leaderEmail: email,
            leaderPhone: phone,
            members: {
              create: membersInput.map((m) => ({
                fullName: m.fullName.trim(),
                email: m.email.trim().toLowerCase(),
                phone: m.phone.trim(),
                scholarNumber: m.scholarNumber?.trim() || null,
                collegeName: m.collegeName?.trim() || null,
              })),
            },
          },
        });

        teamId = team.id;
      }

      // 8. Generate unique registration number
      const registrationNumber = generateRegistrationNumber();
      const isFreeEvent = eventLock.fee <= 0;
      const initialStatus = isFreeEvent
        ? RegistrationStatus.CONFIRMED
        : RegistrationStatus.PENDING;

      // 9. Create Registration record (supports optional userId and records email verification)
      const registration = await tx.registration.create({
        data: {
          registrationNumber,
          userId: userId || null,
          eventId: eventLock.id,
          teamId,
          participantCategory,
          status: initialStatus,
          fullName,
          email,
          phone,
          scholarNumber,
          enrollmentNumber,
          collegeName,
          course,
          year,
          city,
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      // 10. Create initial Payment record
      const initialPaymentMethod = normalizePaymentMethod(input.paymentMethod);

      if (isFreeEvent) {
        await tx.payment.create({
          data: {
            amount: 0,
            currency: "INR",
            method: PaymentMethod.OTHER,
            status: PaymentStatus.SUCCESS,
            transactionId: `FREE_REG_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            gatewayReference: "FREE_EVENT_REGISTRATION",
            paidAt: new Date(),
            registrationId: registration.id,
          },
        });
      } else {
        await tx.payment.create({
          data: {
            amount: eventLock.fee,
            currency: "INR",
            method: initialPaymentMethod,
            status: PaymentStatus.PENDING,
            transactionId: `TXN_INIT_${registration.id}_${Date.now()}`,
            gatewayReference: null,
            paidAt: null,
            registrationId: registration.id,
          },
        });
      }

      // 11. Retrieve complete populated registration
      const createdRegistration = await tx.registration.findUnique({
        where: { id: registration.id },
        include: {
          event: {
            include: {
              category: true,
            },
          },
          team: {
            include: {
              members: true,
            },
          },
          payment: true,
        },
      });

      // 12. Issue short-lived payment authorization token if paid event
      const paymentToken = !isFreeEvent
        ? VerificationService.issuePaymentToken(email, "REGISTRATION_PAYMENT", registration.id)
        : null;

      return {
        ...(createdRegistration as unknown as RegistrationDetail),
        paymentToken,
      };
    });
  }

  /**
   * Retrieves all registrations for a verified guest email
   */
  public static async getGuestRegistrationsByEmail(
    email: string
  ): Promise<RegistrationDetail[]> {
    const normalizedEmail = email.trim().toLowerCase();
    const registrations = await prisma.registration.findMany({
      where: {
        email: { equals: normalizedEmail, mode: "insensitive" },
      },
      include: {
        event: {
          include: {
            category: true,
          },
        },
        team: {
          include: {
            members: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return registrations as unknown as RegistrationDetail[];
  }

  /**
   * Retrieves all registrations for the authenticated user
   */
  public static async getUserRegistrations(
    userId: string
  ): Promise<RegistrationDetail[]> {
    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            category: true,
          },
        },
        team: {
          include: {
            members: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return registrations as unknown as RegistrationDetail[];
  }

  /**
   * Retrieves single registration by ID with authorization verification
   */
  public static async getRegistrationById(
    registrationId: string,
    currentUser: JwtUserPayload
  ): Promise<RegistrationDetail> {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: {
          include: {
            category: true,
          },
        },
        team: {
          include: {
            members: true,
          },
        },
        payment: true,
      },
    });

    if (!registration) {
      throw new HttpError("Registration not found", 404);
    }

    const isOwner = registration.userId === currentUser.id;
    const isTeamLeader = registration.team?.leaderId === currentUser.id;
    const isAdmin = currentUser.role === Role.ADMIN;
    const isOrganizer =
      currentUser.role === Role.ORGANIZER &&
      registration.event.organizerId === currentUser.id;

    if (!isOwner && !isTeamLeader && !isAdmin && !isOrganizer) {
      throw new HttpError(
        "Access denied. You do not have permission to view this registration.",
        403
      );
    }

    return registration as unknown as RegistrationDetail;
  }

  /**
   * Retrieves all registrations for a specific event (Admin or assigned Organizer only)
   */
  public static async getEventRegistrations(
    eventId: string,
    currentUser: JwtUserPayload,
    filters?: { status?: RegistrationStatus; search?: string }
  ): Promise<RegistrationDetail[]> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new HttpError("Event not found", 404);
    }

    const isAdmin = currentUser.role === Role.ADMIN;
    const isAssignedOrganizer =
      currentUser.role === Role.ORGANIZER &&
      event.organizerId === currentUser.id;

    if (!isAdmin && !isAssignedOrganizer) {
      throw new HttpError(
        "Access denied. Only Admins or the assigned Organizer can view event registrations.",
        403
      );
    }

    const whereClause: Prisma.RegistrationWhereInput = {
      eventId,
    };

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.search && filters.search.trim() !== "") {
      const query = filters.search.trim();
      whereClause.OR = [
        { fullName: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { registrationNumber: { contains: query, mode: "insensitive" } },
      ];
    }

    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        event: {
          include: {
            category: true,
          },
        },
        team: {
          include: {
            members: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return registrations as unknown as RegistrationDetail[];
  }

  /**
   * Allows Admin or assigned Organizer to update a registration status manually
   */
  public static async updateRegistrationStatus(
    registrationId: string,
    newStatus: RegistrationStatus,
    currentUser: JwtUserPayload
  ): Promise<RegistrationDetail> {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        payment: true,
      },
    });

    if (!registration) {
      throw new HttpError("Registration not found", 404);
    }

    const isAdmin = currentUser.role === Role.ADMIN;
    const isAssignedOrganizer =
      currentUser.role === Role.ORGANIZER &&
      registration.event.organizerId === currentUser.id;

    if (!isAdmin && !isAssignedOrganizer) {
      throw new HttpError(
        "Access denied. Only Admins or assigned Organizers can update registration status.",
        403
      );
    }

    return await prisma.$transaction(async (tx) => {
      // If manually confirming, also confirm payment if pending
      if (
        newStatus === RegistrationStatus.CONFIRMED &&
        registration.payment &&
        registration.payment.status !== PaymentStatus.SUCCESS
      ) {
        await tx.payment.update({
          where: { id: registration.payment.id },
          data: {
            status: PaymentStatus.SUCCESS,
            paidAt: new Date(),
          },
        });
      }

      const updated = await tx.registration.update({
        where: { id: registrationId },
        data: { status: newStatus },
        include: {
          event: {
            include: {
              category: true,
            },
          },
          team: {
            include: {
              members: true,
            },
          },
          payment: true,
        },
      });

      return updated as unknown as RegistrationDetail;
    });
  }
}
