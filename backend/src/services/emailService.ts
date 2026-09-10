// ─────────────────────────────────────────────────────────────
// Email Service — Provider-Agnostic SMTP & Development Console
// ─────────────────────────────────────────────────────────────

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { HttpError } from "../lib/errors";

export interface EmailProvider {
  sendOtp(email: string, otp: string, purpose: string): Promise<void>;
  sendRegistrationConfirmation(email: string, registration: unknown): Promise<void>;
  sendPassConfirmation(email: string, passPurchase: unknown): Promise<void>;
}

/**
 * Human-readable purpose description for email templates
 */
function formatPurpose(purpose: string): { title: string; description: string } {
  switch (purpose) {
    case "EVENT_REGISTRATION":
      return {
        title: "Event Registration Verification",
        description: "verify your email address for your Euphoria 2026 event registration",
      };
    case "PASS_PURCHASE":
      return {
        title: "Festival Pass Verification",
        description: "verify your email address for your Euphoria 2026 festival pass purchase",
      };
    case "GUEST_LOOKUP":
      return {
        title: "My Tickets Access Code",
        description: "access your Euphoria 2026 festival passes and event registrations",
      };
    case "REGISTRATION_PAYMENT":
      return {
        title: "Registration Payment Verification",
        description: "authorize your registration payment",
      };
    case "PASS_PAYMENT":
      return {
        title: "Festival Pass Payment Verification",
        description: "authorize your festival pass purchase payment",
      };
    default:
      return {
        title: "Verification Code",
        description: "complete your verification request",
      };
  }
}

/**
 * Generates responsive branded HTML email for OTP delivery
 */
function generateOtpHtml(otp: string, purpose: string): string {
  const { title, description } = formatPurpose(purpose);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Euphoria 2026</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #06030a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #06030a;
      padding: 40px 15px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background: linear-gradient(180deg, #130a1c 0%, #0c0612 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }
    .header {
      padding: 36px 30px 24px;
      text-align: center;
      background: linear-gradient(135deg, rgba(162, 50, 160, 0.25) 0%, rgba(62, 238, 213, 0.1) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .festival-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #3EEED5;
      margin-bottom: 8px;
    }
    .brand-title {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #ffffff;
    }
    .content {
      padding: 32px 30px;
      text-align: center;
    }
    .lead-text {
      font-size: 15px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.75);
      margin: 0 0 28px;
    }
    .otp-box {
      background: rgba(62, 238, 213, 0.06);
      border: 1px solid rgba(62, 238, 213, 0.3);
      border-radius: 14px;
      padding: 22px 20px;
      margin: 0 auto 28px;
      max-width: 320px;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3EEED5;
      margin-bottom: 8px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 0.3em;
      color: #ffffff;
      padding-left: 0.3em;
      margin: 0;
    }
    .notice-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 14px 18px;
      font-size: 13px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.55);
      margin: 0 0 24px;
    }
    .footer {
      padding: 22px 30px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="festival-tag">Euphoria 2026 • Annual Fest</div>
        <h1 class="brand-title">${title}</h1>
      </div>
      <div class="content">
        <p class="lead-text">
          Use the 6-digit verification code below to ${description}:
        </p>
        <div class="otp-box">
          <div class="otp-label">Verification Code</div>
          <div class="otp-code">${otp}</div>
        </div>
        <div class="notice-box">
          ⏰ <strong>This code is valid for 10 minutes.</strong><br>
          For your security, never share this verification code with anyone.
        </div>
      </div>
      <div class="footer">
        This automated email was sent by Euphoria 2026.<br>
        If you did not request this code, you can safely ignore this email.
      </div>
    </div>
  </div>
</body>
</html>
`.trim();
}

/**
 * Generates plain text fallback for OTP delivery
 */
function generateOtpText(otp: string, purpose: string): string {
  const { title, description } = formatPurpose(purpose);
  return `
EUPHORIA 2026 - ${title.toUpperCase()}
====================================================

Your 6-digit verification code is: ${otp}

Use this code to ${description}.

This code is valid for 10 minutes.
For your security, never share this verification code with anyone.

If you did not request this code, you can safely ignore this message.
`.trim();
}

/**
 * Production-ready, provider-agnostic SMTP transport
 */
class SmtpEmailProvider implements EmailProvider {
  private transporter: Transporter;
  private fromAddress: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    this.fromAddress =
      process.env.EMAIL_FROM ||
      (user ? `"Euphoria 2026" <${user}>` : `"Euphoria 2026" <no-reply@euphoria.fest>`);

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  public async sendOtp(email: string, otp: string, purpose: string): Promise<void> {
    const { title } = formatPurpose(purpose);
    const subject = `[Euphoria 2026] ${title} - ${otp}`;

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: email,
        subject,
        text: generateOtpText(otp, purpose),
        html: generateOtpHtml(otp, purpose),
      });
    } catch (error: any) {
      // Security rule: In production, NEVER log the plaintext OTP or credentials
      if (process.env.NODE_ENV === "production") {
        console.error(
          "[EmailService] Production SMTP email delivery failed for recipient:",
          email,
          "Reason:",
          error?.message || "Unknown error"
        );
        throw new HttpError(
          "Failed to deliver verification code to your email. Please try again later.",
          500
        );
      } else {
        console.error("[EmailService] SMTP email delivery failed:", error?.message || error);
        throw new HttpError(
          `Failed to deliver verification email via SMTP: ${error?.message || "Check SMTP settings"}`,
          500
        );
      }
    }
  }

  public async sendRegistrationConfirmation(
    email: string,
    registration: unknown
  ): Promise<void> {
    const reg = registration as { registrationNumber?: string; event?: { name?: string } };
    const subject = `[Euphoria 2026] Registration Confirmed: ${reg.event?.name || "Event"}`;
    const text = `
EUPHORIA 2026 - EVENT REGISTRATION CONFIRMED
====================================================
Registration Number: ${reg.registrationNumber || "N/A"}
Event: ${reg.event?.name || "Euphoria Event"}

Your registration has been confirmed! Please keep your registration number handy.
`.trim();

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: email,
        subject,
        text,
      });
    } catch (err: any) {
      console.warn("[EmailService] Non-critical confirmation email failed:", err?.message);
    }
  }

  public async sendPassConfirmation(
    email: string,
    passPurchase: unknown
  ): Promise<void> {
    const p = passPurchase as { passNumber?: string; pass?: { name?: string } };
    const subject = `[Euphoria 2026] Pass Purchase Confirmed: ${p.pass?.name || "Pass"}`;
    const text = `
EUPHORIA 2026 - FESTIVAL PASS CONFIRMED
====================================================
Pass Number: ${p.passNumber || "N/A"}
Pass: ${p.pass?.name || "Euphoria Pass"}

Your festival pass purchase has been confirmed!
`.trim();

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: email,
        subject,
        text,
      });
    } catch (err: any) {
      console.warn("[EmailService] Non-critical pass confirmation email failed:", err?.message);
    }
  }
}

/**
 * Console/Mock transport for local development ONLY.
 * NEVER active when NODE_ENV === 'production'.
 */
class ConsoleEmailProvider implements EmailProvider {
  public async sendOtp(email: string, otp: string, purpose: string): Promise<void> {
    const timestamp = new Date().toISOString();
    console.log(`
┌──────────────────────────────────────────────────────────┐
│ 📧 [MOCK EMAIL SERVICE] OTP DISPATCH (DEV ONLY)          │
├──────────────────────────────────────────────────────────┤
│ To:        ${email.padEnd(45)} │
│ Purpose:   ${purpose.padEnd(45)} │
│ Code:      ${otp.padEnd(45)} │
│ Valid For: 10 minutes                                    │
│ Time:      ${timestamp.padEnd(45)} │
└──────────────────────────────────────────────────────────┘
`);
  }

  public async sendRegistrationConfirmation(
    email: string,
    registration: unknown
  ): Promise<void> {
    const reg = registration as { registrationNumber?: string; event?: { name?: string } };
    console.log(`
┌──────────────────────────────────────────────────────────┐
│ 🎟️  [MOCK EMAIL SERVICE] REGISTRATION CONFIRMED          │
├──────────────────────────────────────────────────────────┤
│ To:        ${email.padEnd(45)} │
│ Reg No:    ${(reg.registrationNumber || "N/A").padEnd(45)} │
│ Event:     ${(reg.event?.name || "Euphoria Event").slice(0, 45).padEnd(45)} │
└──────────────────────────────────────────────────────────┘
`);
  }

  public async sendPassConfirmation(
    email: string,
    passPurchase: unknown
  ): Promise<void> {
    const p = passPurchase as { passNumber?: string; pass?: { name?: string } };
    console.log(`
┌──────────────────────────────────────────────────────────┐
│ 🎟️  [MOCK EMAIL SERVICE] PASS PURCHASE CONFIRMED         │
├──────────────────────────────────────────────────────────┤
│ To:        ${email.padEnd(45)} │
│ Pass No:   ${(p.passNumber || "N/A").padEnd(45)} │
│ Pass Name: ${(p.pass?.name || "Euphoria Pass").slice(0, 45).padEnd(45)} │
└──────────────────────────────────────────────────────────┘
`);
  }
}

/**
 * Service instance managing active email transport.
 * Strict rule: Production NEVER falls back to console mock delivery.
 */
class EmailServiceInstance {
  private provider: EmailProvider | null = null;

  private getProvider(): EmailProvider {
    if (this.provider) {
      return this.provider;
    }

    const isProduction = process.env.NODE_ENV === "production";
    const emailProviderMode = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();
    const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

    // Production mode: MUST use real email delivery. NEVER fall back to console logging.
    if (isProduction) {
      if (!hasSmtpConfig) {
        console.error(
          "[EmailService] CRITICAL: SMTP configuration is missing in production environment."
        );
        throw new HttpError(
          "Email verification service is temporarily unavailable. Please contact support.",
          500
        );
      }
      this.provider = new SmtpEmailProvider();
      return this.provider;
    }

    // Development mode: Use SMTP if explicitly requested and configured, otherwise Console mock
    if (emailProviderMode === "smtp" && hasSmtpConfig) {
      this.provider = new SmtpEmailProvider();
    } else {
      this.provider = new ConsoleEmailProvider();
    }

    return this.provider;
  }

  public setProvider(provider: EmailProvider): void {
    this.provider = provider;
  }

  public async sendOtp(email: string, otp: string, purpose: string): Promise<void> {
    const provider = this.getProvider();
    await provider.sendOtp(email, otp, purpose);
  }

  public async sendRegistrationConfirmation(
    email: string,
    registration: unknown
  ): Promise<void> {
    try {
      const provider = this.getProvider();
      await provider.sendRegistrationConfirmation(email, registration);
    } catch (err: any) {
      console.warn("[EmailService] Confirmation email skipped/failed:", err?.message);
    }
  }

  public async sendPassConfirmation(
    email: string,
    passPurchase: unknown
  ): Promise<void> {
    try {
      const provider = this.getProvider();
      await provider.sendPassConfirmation(email, passPurchase);
    } catch (err: any) {
      console.warn("[EmailService] Pass confirmation email skipped/failed:", err?.message);
    }
  }
}

export const emailService = new EmailServiceInstance();
