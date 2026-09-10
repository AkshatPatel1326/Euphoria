import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Ticket,
  Mail,
  Check,
  ShieldCheck,
  CreditCard,
  Loader2,
  ChevronRight,
  User,
  Phone,
  Building2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";
import { apiPost } from "@/lib/api";

interface PassData {
  id: string;
  name: string;
  subtitle?: string | null;
  price: number | null;
}

export function PassPurchaseModal({
  isOpen,
  onClose,
  pass,
}: {
  isOpen: boolean;
  onClose: () => void;
  pass: PassData;
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "verify" | "processing" | "success" | "failed">("details");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<"SAGE" | "OTHER_COLLEGE" | "GENERAL">("SAGE");
  const [collegeName, setCollegeName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [otpCode, setOtpCode] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [confirmedPass, setConfirmedPass] = useState<{
    passNumber: string;
    quantity: number;
    amount: number;
  } | null>(null);

  const unitPrice = pass.price || 0;
  const totalAmount = unitPrice * quantity;

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("details");
      setOtpCode("");
      setVerificationToken(null);
      setDebugOtp(null);
      setApiError(null);
      setErrors({});
    }
  }, [isOpen]);

  const validateDetails = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Valid email address is required";
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      errs.phone = "Valid 10-digit phone number is required";
    }
    if (category === "OTHER_COLLEGE" && !collegeName.trim()) {
      errs.collegeName = "College name is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sendOtp = async () => {
    setIsSendingOtp(true);
    setApiError(null);
    try {
      const res = await apiPost<{
        status: string;
        message: string;
        data?: { debugOtp?: string };
      }>("/verification/send-otp", {
        email: email.trim(),
        purpose: "PASS_PURCHASE",
      });

      setCountdown(60);
      if (res.data?.debugOtp) {
        setDebugOtp(res.data.debugOtp);
      }
      setStep("verify");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to send verification code");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) return;
    await sendOtp();
  };

  const handleVerifyAndPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpCode.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setApiError("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifyingOtp(true);
    setApiError(null);
    try {
      // 1. Verify OTP
      const verifyRes = await apiPost<{
        status: string;
        data: { verificationToken: string };
      }>("/verification/verify-otp", {
        email: email.trim(),
        otp: cleanOtp,
        purpose: "PASS_PURCHASE",
      });

      const token = verifyRes.data.verificationToken;
      setVerificationToken(token);
      setStep("processing");

      // 2. Submit Pass Purchase
      const purchaseRes = await apiPost<{
        status: string;
        data: {
          purchase: {
            id: string;
            passNumber: string;
            quantity: number;
            status: string;
          };
          paymentToken?: string;
        };
      }>("/passes/purchase", {
        passId: pass.id,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        participantCategory: category,
        collegeName: category === "OTHER_COLLEGE" ? collegeName.trim() : undefined,
        quantity,
        verificationToken: token,
      });

      const purchase = purchaseRes.data.purchase;
      const paymentToken = purchaseRes.data.paymentToken;

      // 3. Initiate payment if paid pass
      if (totalAmount > 0 && paymentToken) {
        const payRes = await apiPost<{
          status: string;
          data: {
            mode: "EASEBUZZ" | "SIMULATION";
            paymentUrl?: string;
            txnid?: string;
            passPurchaseStatus?: string;
            payment?: { id: string; status: string };
          };
        }>("/payments/easebuzz/initiate", {
          passPurchaseId: purchase.id,
          paymentToken,
          paymentMethod: "upi",
        });

        if (payRes.data.mode === "EASEBUZZ" && payRes.data.paymentUrl) {
          window.location.href = payRes.data.paymentUrl;
          return;
        }

        if (payRes.data.mode === "SIMULATION" && payRes.data.passPurchaseStatus !== "CONFIRMED") {
          throw new Error("Payment confirmation failed. Please try again.");
        }
      }

      setConfirmedPass({
        passNumber: purchase.passNumber,
        quantity: purchase.quantity,
        amount: totalAmount,
      });
      setStep("success");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Purchase failed. Please try again.");
      setStep("failed");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step !== "processing" ? onClose : undefined}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-euphoria-surface/95 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Ticket className="size-4 text-euphoria-gold" />
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">{pass.name}</h3>
                <p className="text-[10px] uppercase tracking-widest text-euphoria-gold/80">
                  {pass.subtitle || "Festival Pass"}
                </p>
              </div>
            </div>
            {step !== "processing" && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* STEP 1: Details */}
            {step === "details" && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="text-center pb-2">
                  <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-euphoria-aqua">
                    Guest Pass Registration
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">Enter Your Details</h4>
                  <p className="text-xs text-white/50">
                    No account needed. Your pass will be linked to your verified email.
                  </p>
                </div>

                {apiError && (
                  <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-center">
                    <p className="text-xs text-red-400">{apiError}</p>
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-white/40">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-euphoria-aqua/50 transition-all"
                    />
                  </div>
                  {errors.fullName && <p className="text-[10px] text-red-400">{errors.fullName}</p>}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-white/40">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-euphoria-aqua/50 transition-all"
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-400">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-white/40">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-euphoria-aqua/50 transition-all"
                      />
                    </div>
                    {errors.phone && <p className="text-[10px] text-red-400">{errors.phone}</p>}
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-white/40">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "SAGE", label: "SAGE Student", icon: GraduationCap },
                      { id: "OTHER_COLLEGE", label: "Other College", icon: Building2 },
                      { id: "GENERAL", label: "General Public", icon: User },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const active = category === cat.id;
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => setCategory(cat.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            active
                              ? "bg-euphoria-gold/15 border-euphoria-gold/40 text-white"
                              : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-white/[0.04]"
                          }`}
                        >
                          <Icon className={`size-3.5 mx-auto mb-1 ${active ? "text-euphoria-gold" : "text-white/30"}`} />
                          <span className="text-[11px] font-medium block">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* College Name if other-college */}
                {category === "OTHER_COLLEGE" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-white/40">
                      College Name
                    </label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="Name of your institution"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-euphoria-aqua/50 transition-all"
                    />
                    {errors.collegeName && <p className="text-[10px] text-red-400">{errors.collegeName}</p>}
                  </div>
                )}

                {/* Quantity & Total Calculation */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40 block">
                      Number of Passes
                    </span>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="size-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white flex items-center justify-center font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-white font-mono">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                        className="size-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40 block">
                      Total Payable
                    </span>
                    <span className="text-xl font-extrabold text-euphoria-gold">
                      {unitPrice > 0 ? `₹${totalAmount.toLocaleString("en-IN")}` : "FREE"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gradient-to-r from-euphoria-gold to-amber-500 text-black hover:opacity-95 transition-all shadow-lg shadow-euphoria-gold/10 flex items-center justify-center gap-2"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending Verification Code...
                    </>
                  ) : (
                    <>
                      Continue to Verification
                      <ChevronRight className="size-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Email OTP Verification */}
            {step === "verify" && (
              <form onSubmit={handleVerifyAndPurchase} className="space-y-5 py-2">
                <div className="text-center space-y-1.5">
                  <div className="size-11 rounded-full bg-euphoria-gold/15 border border-euphoria-gold/30 flex items-center justify-center mx-auto text-euphoria-gold">
                    <ShieldCheck className="size-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">Verify Your Email</h4>
                  <p className="text-xs text-white/50">
                    We sent a 6-digit code to <span className="text-white font-medium">{email}</span>
                  </p>
                  <p className="text-[11px] text-white/40">
                    Please check your inbox (and spam/junk folder). Code expires in 10 minutes.
                  </p>
                </div>

                {debugOtp && (
                  <div className="p-3 rounded-xl bg-euphoria-gold/10 border border-euphoria-gold/20 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-euphoria-gold font-semibold">
                      Development Mode OTP
                    </p>
                    <p className="text-lg font-mono font-bold text-white mt-0.5 tracking-widest">
                      {debugOtp}
                    </p>
                  </div>
                )}

                {apiError && (
                  <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-center">
                    <p className="text-xs text-red-400">{apiError}</p>
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="······"
                    className="w-full text-center text-2xl font-mono tracking-[0.35em] py-2.5 px-4 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-euphoria-gold/50 transition-all"
                    autoFocus
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
                  <span className="text-white/50">{quantity}x {pass.name}</span>
                  <span className="font-bold text-euphoria-gold">₹{totalAmount}</span>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp || otpCode.trim().length !== 6}
                  className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase bg-gradient-to-r from-euphoria-gold to-amber-500 text-black hover:opacity-95 transition-all shadow-lg shadow-euphoria-gold/10 flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Verifying & Processing...
                    </>
                  ) : (
                    <>
                      Verify & Complete Purchase
                      <CreditCard className="size-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    Back to Details
                  </button>

                  {countdown > 0 ? (
                    <span className="text-white/40 font-mono">Resend in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="text-euphoria-gold hover:underline font-medium"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* STEP 3: Processing */}
            {step === "processing" && (
              <div className="py-12 text-center space-y-4">
                <Loader2 className="size-10 text-euphoria-gold animate-spin mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-white">Finalizing Your Pass</h4>
                  <p className="text-xs text-white/50 mt-1">
                    Processing payment and generating pass tickets...
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: Success */}
            {step === "success" && confirmedPass && (
              <div className="py-4 text-center space-y-5">
                <div className="size-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="size-7" />
                </div>

                <div>
                  <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-emerald-400">
                    Pass Purchase Confirmed
                  </span>
                  <h4 className="text-xl font-bold text-white mt-1">Welcome to Euphoria 2026!</h4>
                  <p className="text-xs text-white/50 max-w-xs mx-auto mt-1">
                    Your festival pass has been verified and registered.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-euphoria-gold/[0.06] border border-euphoria-gold/20 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-white/40 uppercase tracking-wider text-[10px]">Pass Number</span>
                    <span className="font-mono font-bold text-euphoria-gold">{confirmedPass.passNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Attendee</span>
                    <span className="text-white/80 font-medium">{fullName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Quantity</span>
                    <span className="text-white/80">{confirmedPass.quantity} Pass(es)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Linked Email</span>
                    <span className="text-white/80">{email}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/my-registrations");
                    }}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase bg-euphoria-gold text-black hover:opacity-90 transition-all"
                  >
                    View in My Tickets
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-xs text-white/50 hover:text-white border border-white/[0.08] hover:bg-white/[0.04] transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Failed */}
            {step === "failed" && (
              <div className="py-6 text-center space-y-4">
                <div className="size-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                  <X className="size-6" />
                </div>
                <h4 className="text-base font-bold text-white">Purchase Failed</h4>
                <p className="text-xs text-red-400/90 max-w-xs mx-auto">{apiError}</p>
                <button
                  onClick={() => setStep("verify")}
                  className="px-6 py-2 rounded-xl text-xs font-semibold uppercase bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.1] transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
