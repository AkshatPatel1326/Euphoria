import { prisma } from "../lib/prisma";
import {
  RegistrationStatus,
  PaymentStatus,
  PaymentMethod,
  Role,
} from "../../generated/prisma/client";
import { HttpError } from "../lib/errors";
import { VerificationService } from "./verificationService";
import type {
  PaymentSimulationInput,
  RegistrationDetail,
  JwtUserPayload,
} from "../types";
import { normalizePaymentMethod } from "./registrationService";

/**
 * Service for DEVELOPMENT/TEST PAYMENT SIMULATION only.
 * This simulates payment gateway transitions (e.g. Easebuzz UPI/Card/NetBanking)
 * without calling any real external payment gateway.
 * Can be cleanly swapped with real Easebuzz initiation & webhook handlers in production.
 */
export class PaymentSimulationService {
  private static assertSimulationAllowed(): void {
    const isProd = process.env.NODE_ENV === "production";
    const gateway = (process.env.PAYMENT_GATEWAY || "").toLowerCase().trim();
    if (isProd || gateway === "easebuzz") {
      throw new HttpError(
        "Payment simulation is disabled. Please initiate payment through the payment gateway.",
        403
      );
    }
  }

  public static async simulatePayment(
    registrationId: string,
    input: PaymentSimulationInput,
    currentUser?: JwtUserPayload | null,
    providedPaymentToken?: string | null
  ): Promise<{
    registrationId: string;
    registrationStatus: RegistrationStatus;
    payment: {
      id: string;
      amount: number;
      currency: string;
      method: string | null;
      status: PaymentStatus;
      transactionId: string | null;
      gatewayReference: string | null;
      paidAt: Date | null;
    };
    simulationDetails: {
      simulated: true;
      environment: string;
      mode: "DEVELOPMENT_SIMULATION";
    };
  }> {
    this.assertSimulationAllowed();

    if (!registrationId || registrationId.trim() === "") {
      throw new HttpError("registrationId is required", 400);
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId.trim() },
      include: {
        event: true,
        payment: true,
      },
    });

    if (!registration) {
      throw new HttpError("Registration not found", 404);
    }

    // Ownership Verification:
    // Caller must be an authenticated Admin, the authenticated owner, OR provide a valid scoped paymentToken
    const isAdmin = currentUser?.role === Role.ADMIN;
    const isOwnerUser = Boolean(
      currentUser?.id && registration.userId && registration.userId === currentUser.id
    );

    let isTokenAuthorized = false;
    const paymentToken = input.paymentToken || providedPaymentToken;

    if (paymentToken) {
      try {
        const decoded = VerificationService.validateScopedToken(
          paymentToken,
          "REGISTRATION_PAYMENT",
          registration.email,
          registration.id
        );
        if (decoded) {
          isTokenAuthorized = true;
        }
      } catch {
        // Invalid or expired payment token
      }
    }

    if (!isAdmin && !isOwnerUser && !isTokenAuthorized) {
      throw new HttpError(
        "Access denied. Valid payment authorization matching this registration's email is required.",
        403
      );
    }

    if (registration.status === RegistrationStatus.CONFIRMED) {
      throw new HttpError(
        "This registration is already confirmed and paid",
        400
      );
    }

    if (registration.event.fee <= 0) {
      throw new HttpError(
        "This event is free of charge and does not require payment processing",
        400
      );
    }

    const simulateStatus =
      input.simulateStatus?.toUpperCase() === "FAILED" ? "FAILED" : "SUCCESS";
    const paymentMethod = normalizePaymentMethod(input.method) || "UPI";

    const simTxnId = `SIM_TXN_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const simRef = `SIM_REF_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    return await prisma.$transaction(async (tx) => {
      if (simulateStatus === "SUCCESS") {
        // Upsert payment record to SUCCESS
        let payment;
        if (registration.payment) {
          payment = await tx.payment.update({
            where: { id: registration.payment.id },
            data: {
              status: PaymentStatus.SUCCESS,
              method: paymentMethod,
              transactionId: simTxnId,
              gatewayReference: simRef,
              gatewayResponse: {
                simulated: true,
                environment: process.env.NODE_ENV || "development",
                note: "Development / test payment simulation",
                timestamp: new Date().toISOString(),
              },
              paidAt: new Date(),
            },
          });
        } else {
          payment = await tx.payment.create({
            data: {
              registrationId: registration.id,
              amount: registration.event.fee,
              currency: "INR",
              status: PaymentStatus.SUCCESS,
              method: paymentMethod,
              transactionId: simTxnId,
              gatewayReference: simRef,
              gatewayResponse: {
                simulated: true,
                environment: process.env.NODE_ENV || "development",
                note: "Development / test payment simulation",
                timestamp: new Date().toISOString(),
              },
              paidAt: new Date(),
            },
          });
        }

        // Update registration status to CONFIRMED
        const updatedReg = await tx.registration.update({
          where: { id: registration.id },
          data: { status: RegistrationStatus.CONFIRMED },
        });

        return {
          registrationId: updatedReg.id,
          registrationStatus: updatedReg.status,
          payment: {
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            method: payment.method,
            status: payment.status,
            transactionId: payment.transactionId,
            gatewayReference: payment.gatewayReference,
            paidAt: payment.paidAt,
          },
          simulationDetails: {
            simulated: true,
            environment: process.env.NODE_ENV || "development",
            mode: "DEVELOPMENT_SIMULATION",
          },
        };
      } else {
        // Simulate payment failure
        let payment;
        if (registration.payment) {
          payment = await tx.payment.update({
            where: { id: registration.payment.id },
            data: {
              status: PaymentStatus.FAILED,
              method: paymentMethod,
              transactionId: simTxnId,
              gatewayReference: simRef,
              gatewayResponse: {
                simulated: true,
                environment: process.env.NODE_ENV || "development",
                status: "failed",
                reason: "Simulated payment failure (dev test mode)",
                timestamp: new Date().toISOString(),
              },
            },
          });
        } else {
          payment = await tx.payment.create({
            data: {
              registrationId: registration.id,
              amount: registration.event.fee,
              currency: "INR",
              status: PaymentStatus.FAILED,
              method: paymentMethod,
              transactionId: simTxnId,
              gatewayReference: simRef,
              gatewayResponse: {
                simulated: true,
                environment: process.env.NODE_ENV || "development",
                status: "failed",
                reason: "Simulated payment failure (dev test mode)",
                timestamp: new Date().toISOString(),
              },
            },
          });
        }

        // Registration remains PENDING so participant can retry
        return {
          registrationId: registration.id,
          registrationStatus: RegistrationStatus.PENDING,
          payment: {
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            method: payment.method,
            status: payment.status,
            transactionId: payment.transactionId,
            gatewayReference: payment.gatewayReference,
            paidAt: null,
          },
          simulationDetails: {
            simulated: true,
            environment: process.env.NODE_ENV || "development",
            mode: "DEVELOPMENT_SIMULATION",
          },
        };
      }
    });
  }

  /**
   * Simulates payment for a festival pass purchase with ownership verification
   */
  public static async simulatePassPayment(
    passPurchaseId: string,
    input: PaymentSimulationInput,
    currentUser?: JwtUserPayload | null,
    providedPaymentToken?: string | null
  ) {
    this.assertSimulationAllowed();

    if (!passPurchaseId || passPurchaseId.trim() === "") {
      throw new HttpError("passPurchaseId is required", 400);
    }

    const purchase = await prisma.passPurchase.findUnique({
      where: { id: passPurchaseId.trim() },
      include: {
        pass: true,
        payment: true,
      },
    });

    if (!purchase) {
      throw new HttpError("Pass purchase not found", 404);
    }

    // Ownership check
    const isAdmin = currentUser?.role === Role.ADMIN;
    const isOwnerUser = Boolean(
      currentUser?.id && purchase.userId && purchase.userId === currentUser.id
    );

    let isTokenAuthorized = false;
    const paymentToken = input.paymentToken || providedPaymentToken;

    if (paymentToken) {
      try {
        const decoded = VerificationService.validateScopedToken(
          paymentToken,
          "PASS_PAYMENT",
          purchase.email,
          purchase.id
        );
        if (decoded) {
          isTokenAuthorized = true;
        }
      } catch {
        // Invalid payment token
      }
    }

    if (!isAdmin && !isOwnerUser && !isTokenAuthorized) {
      throw new HttpError(
        "Access denied. Valid payment authorization matching this pass purchase is required.",
        403
      );
    }

    if (purchase.status === RegistrationStatus.CONFIRMED) {
      throw new HttpError("This pass purchase is already confirmed and paid", 400);
    }

    const paymentMethod = normalizePaymentMethod(input.method) || PaymentMethod.UPI;
    const isSuccess = input.simulateStatus !== "FAILED";
    const simTxnId = `SIM_PASS_TXN_${purchase.id}_${Date.now()}`;
    const simRef = `SIM_PASS_REF_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    return await prisma.$transaction(async (tx) => {
      let paymentRecord = purchase.payment;

      if (isSuccess) {
        if (paymentRecord) {
          paymentRecord = await tx.payment.update({
            where: { id: paymentRecord.id },
            data: {
              status: PaymentStatus.SUCCESS,
              method: paymentMethod,
              transactionId: simTxnId,
              gatewayReference: simRef,
              paidAt: new Date(),
            },
          });
        } else {
          paymentRecord = await tx.payment.create({
            data: {
              passPurchaseId: purchase.id,
              amount: (purchase.pass.price || 0) * purchase.quantity,
              currency: "INR",
              status: PaymentStatus.SUCCESS,
              method: paymentMethod,
              transactionId: simTxnId,
              gatewayReference: simRef,
              paidAt: new Date(),
            },
          });
        }

        await tx.passPurchase.update({
          where: { id: purchase.id },
          data: { status: RegistrationStatus.CONFIRMED },
        });

        return {
          passPurchaseId: purchase.id,
          passNumber: purchase.passNumber,
          status: RegistrationStatus.CONFIRMED,
          payment: paymentRecord,
        };
      } else {
        if (paymentRecord) {
          paymentRecord = await tx.payment.update({
            where: { id: paymentRecord.id },
            data: {
              status: PaymentStatus.FAILED,
              method: paymentMethod,
              transactionId: simTxnId,
              gatewayReference: simRef,
            },
          });
        }

        return {
          passPurchaseId: purchase.id,
          passNumber: purchase.passNumber,
          status: RegistrationStatus.PENDING,
          payment: paymentRecord,
        };
      }
    });
  }
}
