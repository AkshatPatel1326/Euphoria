// ─────────────────────────────────────────────────────────────
// Easebuzz Payment Gateway Service (Test/Sandbox & Production)
// ─────────────────────────────────────────────────────────────

import crypto from "node:crypto";
import { prisma } from "../lib/prisma";
import {
  PaymentStatus,
  PaymentMethod,
  RegistrationStatus,
  Role,
} from "../../generated/prisma/client";
import { HttpError } from "../lib/errors";
import { VerificationService } from "./verificationService";
import { emailService } from "./emailService";
import { PaymentSimulationService } from "./paymentSimulationService";
import type {
  InitiatePaymentInput,
  InitiatePaymentResult,
  JwtUserPayload,
} from "../types";

/**
 * Normalizes payment mode from Easebuzz callback to Prisma PaymentMethod
 */
function parsePaymentMode(mode?: string): PaymentMethod {
  if (!mode) return PaymentMethod.OTHER;
  const upper = mode.toUpperCase();
  if (upper.includes("UPI")) return PaymentMethod.UPI;
  if (upper.includes("NB") || upper.includes("NET")) return PaymentMethod.NETBANKING;
  if (upper.includes("CARD") || upper.includes("CC") || upper.includes("DC")) return PaymentMethod.CARD;
  return PaymentMethod.OTHER;
}

export class EasebuzzService {
  /**
   * Generates SHA-512 initiate hash according to official Easebuzz specifications:
   * key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
   */
  public static generateInitiateHash(params: {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    salt: string;
  }): string {
    const sequence = [
      params.key.trim(),
      params.txnid.trim(),
      params.amount.trim(),
      params.productinfo.trim(),
      params.firstname.trim(),
      params.email.trim(),
      (params.udf1 || "").trim(),
      (params.udf2 || "").trim(),
      (params.udf3 || "").trim(),
      (params.udf4 || "").trim(),
      (params.udf5 || "").trim(),
      "", // udf6
      "", // udf7
      "", // udf8
      "", // udf9
      "", // udf10
      params.salt.trim(),
    ];

    const hashString = sequence.join("|");
    return crypto.createHash("sha512").update(hashString).digest("hex").toLowerCase();
  }

  /**
   * Verifies SHA-512 response hash using official Easebuzz reverse hash formula:
   * salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
   */
  public static verifyResponseHash(
    body: Record<string, any>,
    salt: string
  ): boolean {
    const receivedHash = (body.hash || "").trim().toLowerCase();
    if (!receivedHash || receivedHash.length !== 128) {
      return false;
    }

    const sequence = [
      salt.trim(),
      (body.status || "").trim(),
      (body.udf10 || "").trim(),
      (body.udf9 || "").trim(),
      (body.udf8 || "").trim(),
      (body.udf7 || "").trim(),
      (body.udf6 || "").trim(),
      (body.udf5 || "").trim(),
      (body.udf4 || "").trim(),
      (body.udf3 || "").trim(),
      (body.udf2 || "").trim(),
      (body.udf1 || "").trim(),
      (body.email || "").trim(),
      (body.firstname || "").trim(),
      (body.productinfo || "").trim(),
      (body.amount || "").trim(),
      (body.txnid || "").trim(),
      (body.key || "").trim(),
    ];

    const reverseHashString = sequence.join("|");
    const computedHash = crypto
      .createHash("sha512")
      .update(reverseHashString)
      .digest("hex")
      .toLowerCase();

    try {
      return crypto.timingSafeEqual(
        Buffer.from(computedHash, "utf8"),
        Buffer.from(receivedHash, "utf8")
      );
    } catch {
      return false;
    }
  }

  /**
   * Initiates payment for an Event Registration or Festival Pass Purchase.
   * Reuses existing Payment record to strictly preserve unique database relations across retries.
   */
  public static async initiatePayment(
    input: InitiatePaymentInput,
    currentUser: JwtUserPayload | null,
    headerToken?: string | null
  ): Promise<InitiatePaymentResult> {
    const isRegistration = Boolean(input.registrationId && input.registrationId.trim() !== "");
    const isPass = Boolean(input.passPurchaseId && input.passPurchaseId.trim() !== "");

    if (!isRegistration && !isPass) {
      throw new HttpError("Either registrationId or passPurchaseId is required", 400);
    }

    const paymentToken = input.paymentToken || headerToken;
    const gatewayMode = (process.env.PAYMENT_GATEWAY || "simulation").toLowerCase().trim();

    // ─────────────────────────────────────────────────────────
    // 1. Resolve Target Record & Ownership
    // ─────────────────────────────────────────────────────────
    let targetId: string;
    let targetType: "REGISTRATION" | "PASS";
    let amount: number;
    let fullName: string;
    let email: string;
    let phone: string;
    let productInfo: string;
    let existingPayment: any;

    if (isRegistration) {
      targetId = input.registrationId!.trim();
      targetType = "REGISTRATION";

      const reg = await prisma.registration.findUnique({
        where: { id: targetId },
        include: { event: true, payment: true },
      });

      if (!reg) throw new HttpError("Registration not found", 404);

      // Ownership authorization
      const isAdmin = currentUser?.role === Role.ADMIN;
      const isOwnerUser = Boolean(currentUser?.id && reg.userId && reg.userId === currentUser.id);
      let isTokenAuthorized = false;

      if (paymentToken) {
        try {
          const decoded = VerificationService.validateScopedToken(
            paymentToken,
            "REGISTRATION_PAYMENT",
            reg.email,
            reg.id
          );
          if (decoded) isTokenAuthorized = true;
        } catch {
          // invalid token
        }
      }

      if (!isAdmin && !isOwnerUser && !isTokenAuthorized) {
        throw new HttpError(
          "Access denied. Valid authorization matching this registration is required.",
          403
        );
      }

      if (reg.status === RegistrationStatus.CONFIRMED) {
        throw new HttpError("This registration is already confirmed and paid", 400);
      }

      if (reg.event.fee <= 0) {
        throw new HttpError("This event is free and does not require payment", 400);
      }

      amount = reg.event.fee;
      fullName = reg.fullName;
      email = reg.email;
      phone = reg.phone;
      productInfo = `Euphoria 2026 - ${reg.event.name}`.slice(0, 80);
      existingPayment = reg.payment;
    } else {
      targetId = input.passPurchaseId!.trim();
      targetType = "PASS";

      const purchase = await prisma.passPurchase.findUnique({
        where: { id: targetId },
        include: { pass: true, payment: true },
      });

      if (!purchase) throw new HttpError("Pass purchase not found", 404);

      // Ownership authorization
      const isAdmin = currentUser?.role === Role.ADMIN;
      const isOwnerUser = Boolean(currentUser?.id && purchase.userId && purchase.userId === currentUser.id);
      let isTokenAuthorized = false;

      if (paymentToken) {
        try {
          const decoded = VerificationService.validateScopedToken(
            paymentToken,
            "PASS_PAYMENT",
            purchase.email,
            purchase.id
          );
          if (decoded) isTokenAuthorized = true;
        } catch {
          // invalid token
        }
      }

      if (!isAdmin && !isOwnerUser && !isTokenAuthorized) {
        throw new HttpError(
          "Access denied. Valid authorization matching this pass purchase is required.",
          403
        );
      }

      if (purchase.status === RegistrationStatus.CONFIRMED) {
        throw new HttpError("This pass purchase is already confirmed and paid", 400);
      }

      amount = (purchase.pass.price || 0) * purchase.quantity;
      if (amount <= 0) {
        throw new HttpError("This pass is free and does not require payment", 400);
      }

      fullName = purchase.fullName;
      email = purchase.email;
      phone = purchase.phone;
      productInfo = `Euphoria 2026 - ${purchase.pass.name}`.slice(0, 80);
      existingPayment = purchase.payment;
    }

    // ─────────────────────────────────────────────────────────
    // 2. Simulation Mode Fallback (Preserved for offline dev)
    // ─────────────────────────────────────────────────────────
    if (gatewayMode === "simulation") {
      if (targetType === "REGISTRATION") {
        const simResult = await PaymentSimulationService.simulatePayment(
          targetId,
          { method: input.paymentMethod || "UPI", simulateStatus: "SUCCESS", paymentToken: paymentToken || undefined },
          currentUser,
          paymentToken
        );
        return {
          mode: "SIMULATION",
          txnid: simResult.payment.transactionId || `SIM_${Date.now()}`,
          amount,
          simulationResult: simResult,
        };
      } else {
        const simResult = await PaymentSimulationService.simulatePassPayment(
          targetId,
          { method: input.paymentMethod || "UPI", simulateStatus: "SUCCESS", paymentToken: paymentToken || undefined },
          currentUser,
          paymentToken
        );
        return {
          mode: "SIMULATION",
          txnid: simResult.payment?.transactionId || `SIM_PASS_${Date.now()}`,
          amount,
          simulationResult: simResult,
        };
      }
    }

    // ─────────────────────────────────────────────────────────
    // 3. Easebuzz Gateway Initiation
    // ─────────────────────────────────────────────────────────
    const key = process.env.EASEBUZZ_KEY;
    const salt = process.env.EASEBUZZ_SALT;
    const envMode = (process.env.EASEBUZZ_ENV || "test").toLowerCase().trim();

    if (!key || !salt) {
      throw new HttpError(
        "Easebuzz gateway credentials are not configured on this server.",
        500
      );
    }

    const initiateEndpoint =
      envMode === "prod"
        ? "https://pay.easebuzz.in/payment/initiateLink"
        : "https://testpay.easebuzz.in/payment/initiateLink";

    const checkoutBase =
      envMode === "prod"
        ? "https://pay.easebuzz.in/pay/"
        : "https://testpay.easebuzz.in/pay/";

    const backendBaseUrl = process.env.APP_BACKEND_URL || "http://localhost:5000";

    // Generate unique transaction ID for this attempt
    const prefix = targetType === "REGISTRATION" ? "EUPH_REG" : "EUPH_PASS";
    const txnid = `${prefix}_${targetId.slice(-6)}_${Date.now()}`;

    // ─────────────────────────────────────────────────────────
    // 4. Unique Relationship Retry Safety
    // ─────────────────────────────────────────────────────────
    // Update or create the singular linked Payment record in place without violating unique constraints
    await prisma.$transaction(async (tx) => {
      if (existingPayment) {
        const priorHistory = Array.isArray(existingPayment.gatewayResponse?.history)
          ? existingPayment.gatewayResponse.history
          : existingPayment.gatewayResponse ? [existingPayment.gatewayResponse] : [];

        await tx.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: PaymentStatus.PENDING,
            transactionId: txnid,
            gatewayReference: null,
            gatewayResponse: {
              currentAttempt: { initiatedAt: new Date().toISOString(), txnid },
              history: priorHistory,
            },
          },
        });
      } else {
        if (targetType === "REGISTRATION") {
          await tx.payment.create({
            data: {
              registrationId: targetId,
              amount,
              currency: "INR",
              status: PaymentStatus.PENDING,
              transactionId: txnid,
              gatewayResponse: {
                currentAttempt: { initiatedAt: new Date().toISOString(), txnid },
              },
            },
          });
        } else {
          await tx.payment.create({
            data: {
              passPurchaseId: targetId,
              amount,
              currency: "INR",
              status: PaymentStatus.PENDING,
              transactionId: txnid,
              gatewayResponse: {
                currentAttempt: { initiatedAt: new Date().toISOString(), txnid },
              },
            },
          });
        }
      }
    });

    // ─────────────────────────────────────────────────────────
    // 5. Call Easebuzz initiateLink
    // ─────────────────────────────────────────────────────────
    const formattedAmount = amount.toFixed(2);
    const surl = `${backendBaseUrl}/api/payments/easebuzz/response`;
    const furl = `${backendBaseUrl}/api/payments/easebuzz/response`;
    const cleanFirstName = (fullName.trim().split(" ")[0] || "Participant")
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 50) || "Participant";
    const cleanPhone = phone.replace(/\D/g, "").slice(-10) || "9999999999";
    const cleanProductInfo = productInfo
      .replace(/[—–]/g, "-")
      .replace(/[^a-zA-Z0-9\s_-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50) || "Euphoria 2026";

    const hash = this.generateInitiateHash({
      key,
      txnid,
      amount: formattedAmount,
      productinfo: cleanProductInfo,
      firstname: cleanFirstName,
      email,
      udf1: targetType,
      udf2: targetId,
      salt,
    });

    const formData = new URLSearchParams({
      key,
      txnid,
      amount: formattedAmount,
      productinfo: cleanProductInfo,
      firstname: cleanFirstName,
      email,
      phone: cleanPhone,
      surl,
      furl,
      hash,
      udf1: targetType,
      udf2: targetId,
    });

    let easebuzzRes: any;
    try {
      const response = await fetch(initiateEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      });

      easebuzzRes = await response.json();
    } catch (err: any) {
      console.error("[EasebuzzService] Network error calling initiateLink:", err.message);
      throw new HttpError("Failed to communicate with payment gateway. Please try again.", 502);
    }

    if (!easebuzzRes || easebuzzRes.status !== 1 || !easebuzzRes.data) {
      console.error("[EasebuzzService] Easebuzz returned initiation error:", easebuzzRes);
      const errMsg = easebuzzRes?.error_desc || easebuzzRes?.data || "Payment initiation failed";
      throw new HttpError(`Easebuzz initiation error: ${errMsg}`, 400);
    }

    const accessKey = easebuzzRes.data;
    const paymentUrl = `${checkoutBase}${accessKey}`;

    return {
      mode: "EASEBUZZ",
      accessKey,
      paymentUrl,
      txnid,
      amount,
    };
  }

  /**
   * Handles Easebuzz browser callback or S2S webhook response.
   * Fully validates reverse hash, amounts, and performs idempotent reconciliation.
   */
  public static async handlePaymentCallback(
    body: Record<string, any>
  ): Promise<{
    status: "success" | "failed" | "cancelled";
    txnid: string;
    targetType: string;
    targetId: string;
    redirectUrl: string;
  }> {
    const salt = process.env.EASEBUZZ_SALT;
    if (!salt) {
      throw new HttpError("Server configuration error: EASEBUZZ_SALT is not set.", 500);
    }

    // 1. Verify Reverse Hash
    const isValidSignature = this.verifyResponseHash(body, salt);
    if (!isValidSignature) {
      console.error("[EasebuzzService] SECURITY ALERT: Reverse hash mismatch for txnid:", body.txnid);
      throw new HttpError("Payment callback signature verification failed.", 400);
    }

    const txnid = (body.txnid || "").trim();
    if (!txnid) {
      throw new HttpError("Missing txnid in payment callback.", 400);
    }

    // 2. Find Payment Record
    const payment = await prisma.payment.findUnique({
      where: { transactionId: txnid },
      include: {
        registration: { include: { event: true } },
        passPurchase: { include: { pass: true } },
      },
    });

    if (!payment) {
      console.error("[EasebuzzService] Payment record not found for txnid:", txnid);
      throw new HttpError("Payment record not found for this transaction ID.", 404);
    }

    const targetType = body.udf1 || (payment.registrationId ? "REGISTRATION" : "PASS");
    const targetId = body.udf2 || payment.registrationId || payment.passPurchaseId || "";
    const frontendBaseUrl = process.env.APP_FRONTEND_URL || "http://localhost:5173";

    // 3. Amount Reconciliation
    const incomingAmount = parseFloat(body.amount);
    if (isNaN(incomingAmount) || Math.abs(incomingAmount - payment.amount) > 0.01) {
      console.error(
        "[EasebuzzService] Amount mismatch! Stored:",
        payment.amount,
        "Received:",
        body.amount
      );
      throw new HttpError("Payment amount mismatch detected.", 400);
    }

    // 4. Idempotency Guard: if already SUCCESS, don't duplicate mutations or emails
    const registrationNumber = payment.registration?.registrationNumber;
    const passNumber = payment.passPurchase?.passNumber;
    const identifier = registrationNumber || passNumber || "";

    if (payment.status === PaymentStatus.SUCCESS) {
      return {
        status: "success",
        txnid,
        targetType,
        targetId,
        redirectUrl: `${frontendBaseUrl}/payment/result?status=success&txnid=${txnid}&type=${targetType}&id=${targetId}&number=${identifier}`,
      };
    }

    // 5. Reconcile Status Atomically
    const easebuzzStatus = (body.status || "").toLowerCase().trim();
    const isSuccess = easebuzzStatus === "success";
    const isCancelled = easebuzzStatus === "usercancelled";
    const easepayid = body.easepayid || null;
    const mode = parsePaymentMode(body.mode);

    if (isSuccess) {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.SUCCESS,
            gatewayReference: easepayid,
            method: mode,
            paidAt: new Date(),
            gatewayResponse: body,
          },
        });

        if (payment.registrationId) {
          await tx.registration.update({
            where: { id: payment.registrationId },
            data: { status: RegistrationStatus.CONFIRMED },
          });
        } else if (payment.passPurchaseId) {
          await tx.passPurchase.update({
            where: { id: payment.passPurchaseId },
            data: { status: RegistrationStatus.CONFIRMED },
          });
        }
      });

      // Dispatch confirmation email in background
      if (payment.registration) {
        emailService.sendRegistrationConfirmation(payment.registration.email, payment.registration);
      } else if (payment.passPurchase) {
        emailService.sendPassConfirmation(payment.passPurchase.email, payment.passPurchase);
      }

      return {
        status: "success",
        txnid,
        targetType,
        targetId,
        redirectUrl: `${frontendBaseUrl}/payment/result?status=success&txnid=${txnid}&type=${targetType}&id=${targetId}&number=${identifier}`,
      };
    } else {
      const finalPaymentStatus = isCancelled ? PaymentStatus.CANCELLED : PaymentStatus.FAILED;

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: finalPaymentStatus,
          gatewayReference: easepayid,
          gatewayResponse: body,
        },
      });

      // Registration/Pass remains PENDING to permit retry
      const resultStatus = isCancelled ? "cancelled" : "failed";
      return {
        status: resultStatus,
        txnid,
        targetType,
        targetId,
        redirectUrl: `${frontendBaseUrl}/payment/result?status=${resultStatus}&txnid=${txnid}&type=${targetType}&id=${targetId}`,
      };
    }
  }
}
