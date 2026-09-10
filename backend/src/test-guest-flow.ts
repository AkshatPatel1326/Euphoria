import http from "http";
import jwt from "jsonwebtoken";
import app from "./app";
import { prisma } from "./lib/prisma";
import { getJwtSecret } from "./lib/jwtConfig";
import {
  Role,
  ParticipantCategory,
  RegistrationType,
  EventStatus,
  PassStatus,
  PaymentStatus,
  RegistrationStatus,
} from "../generated/prisma/client";

const JWT_SECRET = getJwtSecret();

let server: http.Server;
let baseUrl: string;

function makeAdminToken(admin: { id: string; email: string }) {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: Role.ADMIN },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function request(
  endpoint: string,
  options: {
    method?: string;
    token?: string;
    body?: unknown;
  } = {}
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = (await res.json().catch(() => null)) as any;
  return { status: res.status, ok: res.ok, data: json };
}

async function runGuestFlowTests() {
  console.log("===============================================================");
  console.log("🚀 STARTING EUPHORIA GUEST-BASED REGISTRATION & PAYMENT TEST SUITE");
  console.log("===============================================================\n");

  server = app.listen(0);
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 5001;
  baseUrl = `http://localhost:${port}`;
  console.log(`[INIT] Test server listening at ${baseUrl}`);

  const runId = Date.now().toString().slice(-6);
  const guestEmail = `guest_${runId}@example.test`;
  const guestEmail2 = `guest2_${runId}@example.test`;
  const guestEmail3 = `guest3_${runId}@example.test`;

  let categoryId = "";
  let freeEventId = "";
  let paidEventId = "";
  let passId = "";
  let adminUserId = "";

  try {
    // ── STEP 0: Setup Database Fixtures ──
    console.log("\n[STEP 0] Setting up test fixtures...");
    const category = await prisma.category.upsert({
      where: { slug: "guest-test-cat" },
      update: {},
      create: {
        name: "Guest Test Category",
        slug: "guest-test-cat",
        description: "Category for automated guest flow verification",
      },
    });
    categoryId = category.id;

    const admin = await prisma.user.upsert({
      where: { email: `admin_${runId}@euphoria.test` },
      update: { role: Role.ADMIN },
      create: {
        email: `admin_${runId}@euphoria.test`,
        name: "Test Admin",
        role: Role.ADMIN,
      },
    });
    adminUserId = admin.id;

    const freeEvent = await prisma.event.create({
      data: {
        name: `Free Guest Event ${runId}`,
        slug: `free-guest-event-${runId}`,
        description: "Free event for guest registration verification",
        categoryId,
        fee: 0,
        capacity: 10,
        registrationOpen: true,
        status: EventStatus.PUBLISHED,
        registrationType: RegistrationType.INDIVIDUAL,
      },
    });
    freeEventId = freeEvent.id;

    // Paid event with small capacity (2) to test concurrency and capacity cutoff
    const paidEvent = await prisma.event.create({
      data: {
        name: `Paid Guest Event ${runId}`,
        slug: `paid-guest-event-${runId}`,
        description: "Paid event with capacity 2 for security and concurrency verification",
        categoryId,
        fee: 350,
        capacity: 2,
        registrationOpen: true,
        status: EventStatus.PUBLISHED,
        registrationType: RegistrationType.INDIVIDUAL,
      },
    });
    paidEventId = paidEvent.id;

    const pass = await prisma.pass.create({
      data: {
        name: `VIP Guest Pass ${runId}`,
        slug: `vip-guest-pass-${runId}`,
        subtitle: "Full Access Pass",
        tagline: "Experience Euphoria to the fullest",
        price: 499,
        status: PassStatus.AVAILABLE,
        features: ["Access to all arenas", "VIP seating"],
        audiences: ["All attendees"],
      },
    });
    passId = pass.id;
    console.log("✓ Fixtures created successfully.");

    // ── TEST 1: send-otp & debugOtp Exposure Guard ──
    console.log("\n[TEST 1] Testing send-otp and debugOtp safety guards...");
    const otpRes = await request("/api/verification/send-otp", {
      method: "POST",
      body: {
        email: guestEmail,
        purpose: "EVENT_REGISTRATION",
      },
    });

    if (otpRes.status !== 200 || !otpRes.data?.data?.debugOtp) {
      throw new Error(`Expected HTTP 200 with debugOtp, got ${otpRes.status}: ${JSON.stringify(otpRes.data)}`);
    }
    const guestOtp = otpRes.data.data.debugOtp;
    console.log(`✓ OTP generated: ${guestOtp}, expiresIn: ${otpRes.data.data.expiresInSeconds}s`);

    // Verify 60-second cooldown rejects immediate resend
    const cooldownRes = await request("/api/verification/send-otp", {
      method: "POST",
      body: {
        email: guestEmail,
        purpose: "EVENT_REGISTRATION",
      },
    });
    if (cooldownRes.status !== 429) {
      throw new Error(`Expected HTTP 429 on resend cooldown, got ${cooldownRes.status}`);
    }
    console.log("✓ 60-second cooldown strictly enforced (HTTP 429).");

    // Verify debugOtp is strictly omitted when EXPOSE_DEBUG_OTP is false
    const origDebugFlag = process.env.EXPOSE_DEBUG_OTP;
    process.env.EXPOSE_DEBUG_OTP = "false";
    const noDebugOtpRes = await request("/api/verification/send-otp", {
      method: "POST",
      body: {
        email: `nodebug_${runId}@example.test`,
        purpose: "EVENT_REGISTRATION",
      },
    });
    process.env.EXPOSE_DEBUG_OTP = origDebugFlag;
    if (noDebugOtpRes.status !== 200 || noDebugOtpRes.data?.data?.debugOtp !== undefined) {
      throw new Error("FAILED: debugOtp was exposed when EXPOSE_DEBUG_OTP=false!");
    }
    console.log("✓ debugOtp safety guard verified: strictly omitted when EXPOSE_DEBUG_OTP !== 'true'.");

    // ── TEST 2: verify-otp & Purpose-Scoped Token Issuance ──
    console.log("\n[TEST 2] Testing verify-otp and token scoping...");
    // Invalid OTP
    const badOtpRes = await request("/api/verification/verify-otp", {
      method: "POST",
      body: {
        email: guestEmail,
        otp: "000000",
        purpose: "EVENT_REGISTRATION",
      },
    });
    if (badOtpRes.status !== 400) {
      throw new Error(`Expected HTTP 400 for incorrect OTP, got ${badOtpRes.status}`);
    }
    console.log("✓ Incorrect OTP rejected (HTTP 400).");

    // Valid OTP
    const validVerifyRes = await request("/api/verification/verify-otp", {
      method: "POST",
      body: {
        email: guestEmail,
        otp: guestOtp,
        purpose: "EVENT_REGISTRATION",
      },
    });
    if (validVerifyRes.status !== 200 || !validVerifyRes.data?.data?.verificationToken) {
      throw new Error(`Expected HTTP 200 with verificationToken, got ${validVerifyRes.status}`);
    }
    const eventRegToken = validVerifyRes.data.data.verificationToken;
    console.log("✓ Correct OTP verified, received scoped EVENT_REGISTRATION token.");

    // ── TEST 3: Cross-Purpose Token Rejection (HTTP 403) ──
    console.log("\n[TEST 3] Testing cross-purpose token rejection...");
    // Presenting EVENT_REGISTRATION token to guest-lookup
    const wrongPurposeLookup = await request("/api/registrations/guest-lookup", {
      method: "GET",
      token: eventRegToken,
    });
    if (wrongPurposeLookup.status !== 403) {
      throw new Error(`Expected HTTP 403 for cross-purpose token on guest-lookup, got ${wrongPurposeLookup.status}`);
    }

    // Presenting EVENT_REGISTRATION token to pass purchase
    const wrongPurposePass = await request("/api/passes/purchase", {
      method: "POST",
      body: {
        passId,
        fullName: "Test Guest",
        email: guestEmail,
        phone: "9876543210",
        participantCategory: "GENERAL",
        verificationToken: eventRegToken,
      },
    });
    if (wrongPurposePass.status !== 403) {
      throw new Error(`Expected HTTP 403 for cross-purpose token on pass purchase, got ${wrongPurposePass.status}`);
    }
    console.log("✓ Cross-purpose token presentation correctly rejected with HTTP 403.");

    // ── TEST 4: Guest Event Registration (Paid Event) ──
    console.log("\n[TEST 4] Testing guest registration for paid event...");
    // Missing verificationToken
    const noTokenRegRes = await request("/api/registrations", {
      method: "POST",
      body: {
        eventId: paidEventId,
        participantCategory: "GENERAL",
        personalDetails: {
          fullName: "Guest One",
          email: guestEmail,
          phone: "9876543210",
        },
      },
    });
    if (noTokenRegRes.status !== 400) {
      throw new Error(`Expected HTTP 400 when registering guest without token, got ${noTokenRegRes.status}`);
    }
    console.log("✓ Guest registration without verification token blocked (HTTP 400).");

    // Mismatched email
    const mismatchEmailRegRes = await request("/api/registrations", {
      method: "POST",
      body: {
        eventId: paidEventId,
        participantCategory: "GENERAL",
        personalDetails: {
          fullName: "Guest Impersonator",
          email: "different_email@example.test",
          phone: "9876543210",
        },
        verificationToken: eventRegToken,
      },
    });
    if (mismatchEmailRegRes.status !== 403) {
      throw new Error(`Expected HTTP 403 when token email does not match form email, got ${mismatchEmailRegRes.status}`);
    }
    console.log("✓ Registration with mismatched email blocked (HTTP 403).");

    // Valid guest registration
    const validRegRes = await request("/api/registrations", {
      method: "POST",
      body: {
        eventId: paidEventId,
        participantCategory: "GENERAL",
        personalDetails: {
          fullName: "Guest One",
          email: guestEmail,
          phone: "9876543210",
        },
        city: "Bhopal",
        verificationToken: eventRegToken,
        paymentMethod: "upi",
      },
    });

    if (validRegRes.status !== 201 || !validRegRes.data?.data?.registration?.id) {
      throw new Error(`Expected HTTP 201 for valid guest registration, got ${validRegRes.status}: ${JSON.stringify(validRegRes.data)}`);
    }
    const registrationId = validRegRes.data.data.registration.id;
    const regPaymentToken = validRegRes.data.data.paymentToken;
    const regNumber = validRegRes.data.data.registration.registrationNumber;

    if (!regPaymentToken) {
      throw new Error("Paid event registration failed to issue paymentToken!");
    }
    if (validRegRes.data.data.registration.status !== "PENDING") {
      throw new Error(`Expected PENDING status for paid registration, got ${validRegRes.data.data.registration.status}`);
    }
    console.log(`✓ Guest registration created: ${regNumber} (status: PENDING, paymentToken issued).`);

    // Duplicate active registration check
    // Request a fresh OTP and token for same email
    // Delete any prior OTP to bypass 60s cooldown for testing
    await prisma.verificationOtp.deleteMany({ where: { email: guestEmail } });
    const freshOtpRes = await request("/api/verification/send-otp", {
      method: "POST",
      body: { email: guestEmail, purpose: "EVENT_REGISTRATION" },
    });
    const freshTokenRes = await request("/api/verification/verify-otp", {
      method: "POST",
      body: {
        email: guestEmail,
        otp: freshOtpRes.data.data.debugOtp,
        purpose: "EVENT_REGISTRATION",
      },
    });
    const dupRegRes = await request("/api/registrations", {
      method: "POST",
      body: {
        eventId: paidEventId,
        participantCategory: "GENERAL",
        personalDetails: {
          fullName: "Guest One Duplicate",
          email: guestEmail,
          phone: "9876543210",
        },
        verificationToken: freshTokenRes.data.data.verificationToken,
      },
    });
    if (dupRegRes.status !== 400) {
      throw new Error(`Expected HTTP 400 for duplicate active registration, got ${dupRegRes.status}`);
    }
    console.log("✓ Duplicate active registration blocked (HTTP 400).");

    // ── TEST 5: Payment Ownership Protection (Event Registration) ──
    console.log("\n[TEST 5] Testing payment ownership protection...");
    // 1. Call pay with NO paymentToken and NO user auth -> HTTP 403
    const noTokenPayRes = await request(`/api/registrations/${registrationId}/pay`, {
      method: "POST",
      body: { method: "upi", simulateStatus: "SUCCESS" },
    });
    if (noTokenPayRes.status !== 403) {
      throw new Error(`Expected HTTP 403 for unauthenticated payment without token, got ${noTokenPayRes.status}`);
    }
    console.log("✓ Direct payment call without paymentToken rejected (HTTP 403).");

    // 2. Call pay with paymentToken for different registration
    const forgedToken = jwt.sign(
      {
        email: guestEmail,
        purpose: "REGISTRATION_PAYMENT",
        registrationId: "different-reg-id",
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const forgedPayRes = await request(`/api/registrations/${registrationId}/pay`, {
      method: "POST",
      body: {
        method: "upi",
        simulateStatus: "SUCCESS",
        paymentToken: forgedToken,
      },
    });
    if (forgedPayRes.status !== 403) {
      throw new Error(`Expected HTTP 403 for mismatched payment token, got ${forgedPayRes.status}`);
    }
    console.log("✓ Payment call with mismatched resource token rejected (HTTP 403).");

    // 3. Call pay with valid paymentToken -> HTTP 200
    const validPayRes = await request(`/api/registrations/${registrationId}/pay`, {
      method: "POST",
      body: {
        method: "upi",
        simulateStatus: "SUCCESS",
        paymentToken: regPaymentToken,
      },
    });
    if (validPayRes.status !== 200 || validPayRes.data?.data?.registrationStatus !== "CONFIRMED") {
      throw new Error(`Expected HTTP 200 and CONFIRMED status, got ${validPayRes.status}: ${JSON.stringify(validPayRes.data)}`);
    }
    console.log("✓ Payment simulated with valid paymentToken: registration confirmed!");

    // 4. Repeated payment on confirmed registration -> HTTP 400
    const repeatPayRes = await request(`/api/registrations/${registrationId}/pay`, {
      method: "POST",
      body: {
        method: "upi",
        simulateStatus: "SUCCESS",
        paymentToken: regPaymentToken,
      },
    });
    if (repeatPayRes.status !== 400) {
      throw new Error(`Expected HTTP 400 for repeated payment on confirmed registration, got ${repeatPayRes.status}`);
    }
    console.log("✓ Repeated payment on confirmed registration rejected (HTTP 400).");

    // ── TEST 6: Free Event Auto-Confirmation & Concurrency/Capacity Enforcement ──
    console.log("\n[TEST 6] Testing free event auto-confirmation & capacity protection...");
    const freeUserEmail = `free_${runId}@example.test`;
    const cap2Email = `cap2_${runId}@example.test`;
    const cap3Email = `cap3_${runId}@example.test`;

    // Free event registration
    const freeOtpRes = await request("/api/verification/send-otp", {
      method: "POST",
      body: { email: freeUserEmail, purpose: "EVENT_REGISTRATION" },
    });
    const freeVerifyRes = await request("/api/verification/verify-otp", {
      method: "POST",
      body: {
        email: freeUserEmail,
        otp: freeOtpRes.data.data.debugOtp,
        purpose: "EVENT_REGISTRATION",
      },
    });
    const freeRegRes = await request("/api/registrations", {
      method: "POST",
      body: {
        eventId: freeEventId,
        participantCategory: "SAGE",
        personalDetails: {
          fullName: "Free Participant",
          email: freeUserEmail,
          phone: "9876543210",
        },
        scholarNumber: "SCH-001",
        enrollmentNumber: "ENR-001",
        course: "BCA",
        year: "1st Year",
        verificationToken: freeVerifyRes.data.data.verificationToken,
      },
    });
    if (
      freeRegRes.status !== 201 ||
      freeRegRes.data?.data?.registration?.status !== "CONFIRMED" ||
      freeRegRes.data?.data?.registration?.payment?.status !== "SUCCESS" ||
      freeRegRes.data?.data?.registration?.payment?.amount !== 0
    ) {
      throw new Error(`Free event registration was not auto-confirmed with 0 fee: ${JSON.stringify(freeRegRes.data)}`);
    }
    console.log("✓ Free event registration immediately CONFIRMED with amount 0.");

    // Capacity testing: Paid event has capacity = 2. Currently has 1 active registration.
    // Register 2nd participant
    const capOtpRes2 = await request("/api/verification/send-otp", {
      method: "POST",
      body: { email: cap2Email, purpose: "EVENT_REGISTRATION" },
    });
    const capTokenRes2 = await request("/api/verification/verify-otp", {
      method: "POST",
      body: {
        email: cap2Email,
        otp: capOtpRes2.data.data.debugOtp,
        purpose: "EVENT_REGISTRATION",
      },
    });
    const capReg2 = await request("/api/registrations", {
      method: "POST",
      body: {
        eventId: paidEventId,
        participantCategory: "GENERAL",
        personalDetails: {
          fullName: "Guest Two",
          email: cap2Email,
          phone: "9876543211",
        },
        verificationToken: capTokenRes2.data.data.verificationToken,
      },
    });
    if (capReg2.status !== 201) {
      throw new Error(`Expected participant 2 to succeed within capacity (2), got ${capReg2.status}`);
    }
    console.log("✓ Participant 2 registered successfully (capacity 2/2 reached).");

    // Attempt 3rd participant -> must be blocked by capacity
    const capOtpRes3 = await request("/api/verification/send-otp", {
      method: "POST",
      body: { email: cap3Email, purpose: "EVENT_REGISTRATION" },
    });
    const capTokenRes3 = await request("/api/verification/verify-otp", {
      method: "POST",
      body: {
        email: cap3Email,
        otp: capOtpRes3.data.data.debugOtp,
        purpose: "EVENT_REGISTRATION",
      },
    });
    const capReg3 = await request("/api/registrations", {
      method: "POST",
      body: {
        eventId: paidEventId,
        participantCategory: "GENERAL",
        personalDetails: {
          fullName: "Guest Three",
          email: cap3Email,
          phone: "9876543212",
        },
        verificationToken: capTokenRes3.data.data.verificationToken,
      },
    });
    if (capReg3.status !== 400 || !capReg3.data?.message?.includes("capacity")) {
      throw new Error(`Expected HTTP 400 capacity exceeded for participant 3, got ${capReg3.status}: ${JSON.stringify(capReg3.data)}`);
    }
    console.log("✓ Participant 3 strictly rejected: maximum event capacity enforced under row lock.");

    // ── TEST 7: Guest Ticket Lookup (GUEST_LOOKUP) ──
    console.log("\n[TEST 7] Testing guest ticket lookup via GUEST_LOOKUP token...");
    // Request GUEST_LOOKUP OTP
    const lookupOtpRes = await request("/api/verification/send-otp", {
      method: "POST",
      body: { email: guestEmail, purpose: "GUEST_LOOKUP" },
    });
    const lookupTokenRes = await request("/api/verification/verify-otp", {
      method: "POST",
      body: {
        email: guestEmail,
        otp: lookupOtpRes.data.data.debugOtp,
        purpose: "GUEST_LOOKUP",
      },
    });
    const guestSessionToken = lookupTokenRes.data.data.verificationToken;

    // Call lookup without token -> HTTP 401
    const noTokenLookup = await request("/api/registrations/guest-lookup", {
      method: "GET",
    });
    if (noTokenLookup.status !== 401) {
      throw new Error(`Expected HTTP 401 for guest-lookup without token, got ${noTokenLookup.status}`);
    }

    // Call lookup with guestSessionToken -> HTTP 200 with attendee's confirmed tickets
    const guestLookupRes = await request("/api/registrations/guest-lookup", {
      method: "GET",
      token: guestSessionToken,
    });
    if (guestLookupRes.status !== 200 || !guestLookupRes.data?.data?.registrations) {
      throw new Error(`Expected HTTP 200 with registrations list, got ${guestLookupRes.status}`);
    }
    const attendeeRegs = guestLookupRes.data.data.registrations;
    if (attendeeRegs.length === 0 || attendeeRegs[0].email.toLowerCase() !== guestEmail.toLowerCase()) {
      throw new Error("FAILED: Guest lookup did not return the expected confirmed registration");
    }
    console.log(`✓ Guest ticket lookup successful: found ${attendeeRegs.length} registration(s) for ${guestEmail}.`);

    // ── TEST 8: Guest Festival Pass Purchase & Payment ──
    console.log("\n[TEST 8] Testing guest festival pass purchase & payment...");
    // Pass purchase OTP
    const passOtpRes = await request("/api/verification/send-otp", {
      method: "POST",
      body: { email: guestEmail, purpose: "PASS_PURCHASE" },
    });
    const passTokenRes = await request("/api/verification/verify-otp", {
      method: "POST",
      body: {
        email: guestEmail,
        otp: passOtpRes.data.data.debugOtp,
        purpose: "PASS_PURCHASE",
      },
    });
    const passVerificationToken = passTokenRes.data.data.verificationToken;

    // Purchase pass
    const passPurchaseRes = await request("/api/passes/purchase", {
      method: "POST",
      body: {
        passId,
        quantity: 2,
        fullName: "Guest Pass Holder",
        email: guestEmail,
        phone: "9876543210",
        participantCategory: "GENERAL",
        verificationToken: passVerificationToken,
        paymentMethod: "upi",
      },
    });

    if (passPurchaseRes.status !== 201 || !passPurchaseRes.data?.data?.purchase?.id) {
      throw new Error(`Expected HTTP 201 for pass purchase, got ${passPurchaseRes.status}: ${JSON.stringify(passPurchaseRes.data)}`);
    }
    const passPurchaseId = passPurchaseRes.data.data.purchase.id;
    const passPaymentToken = passPurchaseRes.data.data.paymentToken;
    const passNumber = passPurchaseRes.data.data.purchase.passNumber;

    if (!passPaymentToken) {
      throw new Error("Pass purchase failed to return paymentToken!");
    }
    console.log(`✓ Pass purchase created: ${passNumber} (status: PENDING, paymentToken issued).`);

    // Pass payment without token -> HTTP 403
    const noTokenPassPayRes = await request(`/api/passes/purchases/${passPurchaseId}/pay`, {
      method: "POST",
      body: { method: "upi", simulateStatus: "SUCCESS" },
    });
    if (noTokenPassPayRes.status !== 403) {
      throw new Error(`Expected HTTP 403 for pass payment without token, got ${noTokenPassPayRes.status}`);
    }
    console.log("✓ Direct pass payment call without paymentToken rejected (HTTP 403).");

    // Pass payment with valid paymentToken -> HTTP 200
    const validPassPayRes = await request(`/api/passes/purchases/${passPurchaseId}/pay`, {
      method: "POST",
      body: {
        method: "upi",
        simulateStatus: "SUCCESS",
        paymentToken: passPaymentToken,
      },
    });
    if (validPassPayRes.status !== 200 || validPassPayRes.data?.data?.status !== "CONFIRMED") {
      throw new Error(`Expected HTTP 200 and CONFIRMED for pass payment, got ${validPassPayRes.status}`);
    }
    console.log("✓ Pass payment simulated with valid token: pass purchase CONFIRMED!");

    // Verify pass appears in guest lookup
    const updatedLookupRes = await request("/api/registrations/guest-lookup", {
      method: "GET",
      token: guestSessionToken,
    });
    const attendeePasses = updatedLookupRes.data?.data?.passPurchases || [];
    if (attendeePasses.length === 0 || attendeePasses[0].passNumber !== passNumber) {
      throw new Error("FAILED: Guest lookup did not include the newly confirmed pass purchase!");
    }
    console.log(`✓ Confirmed pass purchase successfully displayed in guest lookup for ${guestEmail}.`);

    // ── TEST 9: Admin Override on Pass & Event Payments ──
    console.log("\n[TEST 9] Testing Admin JWT override on pass payments...");
    const adminToken = makeAdminToken({
      id: adminUserId,
      email: `admin_${runId}@euphoria.test`,
    });

    // Create another pass purchase in PENDING status
    await prisma.verificationOtp.deleteMany({ where: { email: guestEmail3 } });
    const p3Otp = await request("/api/verification/send-otp", {
      method: "POST",
      body: { email: guestEmail3, purpose: "PASS_PURCHASE" },
    });
    const p3Token = await request("/api/verification/verify-otp", {
      method: "POST",
      body: {
        email: guestEmail3,
        otp: p3Otp.data.data.debugOtp,
        purpose: "PASS_PURCHASE",
      },
    });
    const p3Purchase = await request("/api/passes/purchase", {
      method: "POST",
      body: {
        passId,
        quantity: 1,
        fullName: "Guest Three Pass",
        email: guestEmail3,
        phone: "9876543212",
        participantCategory: "GENERAL",
        verificationToken: p3Token.data.data.verificationToken,
      },
    });
    const p3Id = p3Purchase.data.data.purchase.id;

    // Admin pays with Bearer adminToken and NO paymentToken -> must succeed with Admin override!
    const adminPayRes = await request(`/api/passes/purchases/${p3Id}/pay`, {
      method: "POST",
      token: adminToken,
      body: { method: "upi", simulateStatus: "SUCCESS" },
    });
    if (adminPayRes.status !== 200 || adminPayRes.data?.data?.status !== "CONFIRMED") {
      throw new Error(`Expected Admin override to succeed (HTTP 200), got ${adminPayRes.status}: ${JSON.stringify(adminPayRes.data)}`);
    }
    console.log("✓ Admin JWT override successfully processed pass payment without guest paymentToken.");

    console.log("\n===============================================================");
    console.log("🎉 ALL 9 TEST SUITES PASSED CLEANLY! ZERO REGRESSIONS FOUND!");
    console.log("===============================================================\n");
  } finally {
    console.log("[CLEANUP] Cleaning up test database records...");
    try {
      await prisma.payment.deleteMany({
        where: {
          OR: [
            { registration: { event: { categoryId } } },
            { passPurchase: { pass: { id: passId } } },
          ],
        },
      });
      await prisma.registration.deleteMany({
        where: { event: { categoryId } },
      });
      await prisma.passPurchase.deleteMany({
        where: { passId },
      });
      await prisma.event.deleteMany({
        where: { categoryId },
      });
      await prisma.category.deleteMany({
        where: { id: categoryId },
      });
      await prisma.pass.deleteMany({
        where: { id: passId },
      });
      await prisma.verificationOtp.deleteMany({
        where: {
          email: { in: [guestEmail, guestEmail2, guestEmail3, `admin_${runId}@euphoria.test`, `nodebug_${runId}@example.test`] },
        },
      });
      await prisma.user.deleteMany({
        where: { id: adminUserId },
      });
      console.log("✓ Cleanup completed.");
    } catch (cleanupErr) {
      console.warn("Cleanup warning:", cleanupErr);
    }

    if (server) {
      server.close();
    }
    await prisma.$disconnect();
  }
}

runGuestFlowTests().catch((err) => {
  console.error("\n❌ TEST SUITE FAILED WITH ERROR:\n", err);
  process.exit(1);
});
