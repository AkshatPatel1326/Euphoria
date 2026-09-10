import { prisma } from "../lib/prisma";
import {
  PassStatus,
  RegistrationStatus,
  PaymentStatus,
  PaymentMethod,
  type Pass,
} from "../../generated/prisma/client";
import { HttpError } from "../lib/errors";
import { VerificationService } from "./verificationService";
import { normalizeParticipantCategory, normalizePaymentMethod } from "./registrationService";
import type { CreatePassPurchaseInput, PassPurchaseDetail } from "../types";

export class PassService {
  /**
   * Retrieves all festival passes.
   */
  public static async getAllPasses(): Promise<Pass[]> {
    const passes = await prisma.pass.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return passes;
  }

  /**
   * Retrieves a single festival pass by its slug.
   */
  public static async getPassBySlug(slug: string): Promise<Pass> {
    if (!slug || slug.trim() === "") {
      throw new HttpError("Pass slug is required", 400);
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const pass = await prisma.pass.findUnique({
      where: {
        slug: normalizedSlug,
      },
    });

    if (!pass) {
      throw new HttpError(`Pass with slug '${slug}' not found`, 404);
    }

    return pass;
  }

  /**
   * Creates a festival pass purchase for a guest or authenticated user
   */
  public static async purchasePass(
    userId: string | null | undefined,
    input: CreatePassPurchaseInput
  ): Promise<PassPurchaseDetail & { paymentToken?: string | null }> {
    if (!input.passId || input.passId.trim() === "") {
      throw new HttpError("passId is required", 400);
    }

    const pass = await prisma.pass.findFirst({
      where: {
        OR: [
          { id: input.passId.trim() },
          { slug: input.passId.trim().toLowerCase() },
        ],
      },
    });

    if (!pass) {
      throw new HttpError("Festival pass not found", 404);
    }

    if (pass.status === PassStatus.INACTIVE || pass.status === PassStatus.SOLD_OUT) {
      throw new HttpError("This pass is currently unavailable for purchase", 400);
    }

    const fullName = input.fullName?.trim();
    const email = input.email?.trim().toLowerCase();
    const phone = input.phone?.trim();

    if (!fullName) {
      throw new HttpError("Full name is required", 400);
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpError("A valid email address is required", 400);
    }
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      throw new HttpError("A valid 10-digit phone number is required", 400);
    }

    // Guest verification requirement: if not authenticated, verificationToken is mandatory and strictly checked
    if (!userId) {
      if (!input.verificationToken || input.verificationToken.trim() === "") {
        throw new HttpError("Email verification is required for pass purchases", 400);
      }
      VerificationService.validateScopedToken(
        input.verificationToken,
        "PASS_PURCHASE",
        email
      );
    }

    const participantCategory = normalizeParticipantCategory(input.participantCategory);
    const quantity = Math.max(1, Math.min(5, input.quantity || 1));
    const unitPrice = pass.price || 0;
    const totalAmount = unitPrice * quantity;
    const isFree = totalAmount <= 0;

    const passNumber = `EUPH-2026-PASS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    return await prisma.$transaction(async (tx) => {
      const initialStatus = isFree ? RegistrationStatus.CONFIRMED : RegistrationStatus.PENDING;

      const passPurchase = await tx.passPurchase.create({
        data: {
          passNumber,
          passId: pass.id,
          userId: userId || null,
          fullName,
          email,
          phone,
          participantCategory,
          collegeName: input.collegeName?.trim() || null,
          quantity,
          status: initialStatus,
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      const initialPaymentMethod = normalizePaymentMethod(input.paymentMethod);

      if (isFree) {
        await tx.payment.create({
          data: {
            passPurchaseId: passPurchase.id,
            amount: 0,
            currency: "INR",
            method: PaymentMethod.OTHER,
            status: PaymentStatus.SUCCESS,
            transactionId: `FREE_PASS_${Date.now()}`,
            gatewayReference: "FREE_PASS_PURCHASE",
            paidAt: new Date(),
          },
        });
      } else {
        await tx.payment.create({
          data: {
            passPurchaseId: passPurchase.id,
            amount: totalAmount,
            currency: "INR",
            method: initialPaymentMethod,
            status: PaymentStatus.PENDING,
            transactionId: `TXN_INIT_PASS_${passPurchase.id}_${Date.now()}`,
            gatewayReference: null,
            paidAt: null,
          },
        });
      }

      const createdPurchase = await tx.passPurchase.findUnique({
        where: { id: passPurchase.id },
        include: {
          pass: true,
          payment: true,
        },
      });

      const paymentToken = !isFree
        ? VerificationService.issuePaymentToken(email, "PASS_PAYMENT", passPurchase.id)
        : null;

      return {
        ...(createdPurchase as unknown as PassPurchaseDetail),
        paymentToken,
      };
    });
  }

  /**
   * Retrieves all pass purchases for a verified guest email
   */
  public static async getPassPurchasesByEmail(email: string): Promise<PassPurchaseDetail[]> {
    const normalizedEmail = email.trim().toLowerCase();
    const purchases = await prisma.passPurchase.findMany({
      where: {
        email: { equals: normalizedEmail, mode: "insensitive" },
      },
      include: {
        pass: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return purchases as unknown as PassPurchaseDetail[];
  }
}
