import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  CreditCard,
  Smartphone,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Calendar,
  Hash,
  AlertTriangle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import type { EuphoriaEvent, ParticipantCategory, PaymentStatus } from "@/data/events";

/* ── Helpers ── */
function isTeamEvent(event: EuphoriaEvent): boolean {
  return event.registrationType === "group" || event.maxTeamSize > 1;
}

type Step = "summary" | "type" | "details" | "review" | "payment" | "pending" | "success" | "failed";

const stepLabels: Record<Step, string> = {
  summary: "Event Summary",
  type: "Participant Type",
  details: "Your Details",
  review: "Review",
  payment: "Payment",
  pending: "Processing",
  success: "Registration Confirmed",
  failed: "Payment Failed",
};

const participantTypes: { key: ParticipantCategory; label: string; sub: string; icon: typeof User }[] = [
  { key: "sage", label: "SAGE University Student", sub: "Currently enrolled at SAGE University Indore", icon: GraduationCap },
  { key: "other-college", label: "Other College Student", sub: "Student at a different institution", icon: BookOpen },
  { key: "general", label: "General Participant", sub: "Independent / open registration", icon: User },
];

const categoryLabel: Record<string, string> = {
  cultural: "Cultural",
  "literary-management": "Literary & Management",
  "science-tech": "Science & Technology",
  sports: "Sports",
};

/* ── Animated container for step transitions ── */
function StepContainer({ step, children }: { step: Step; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Input Field ── */
function Input({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  icon: typeof User;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/45">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white/[0.04] border ${
            error ? "border-red-400/50" : "border-white/[0.08]"
          } rounded-lg pl-10 pr-4 py-2.5 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-euphoria-aqua/40 transition-colors`}
        />
      </div>
      {error && <p className="text-[10px] text-red-400/80">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN REGISTRATION FLOW
   ═══════════════════════════════════════════ */
export function RegistrationFlow({
  event,
  onClose,
}: {
  event: EuphoriaEvent;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("summary");
  const [participantType, setParticipantType] = useState<ParticipantCategory | null>(null);
  const [details, setDetails] = useState<{
    fullName: string;
    email: string;
    phone: string;
    scholarNumber?: string;
    enrollmentNumber?: string;
    course?: string;
    year?: string;
    collegeName?: string;
    city?: string;
  }>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<{ fullName: string; email: string; phone: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  /* Use centralized event.fee — no string parsing */
  const amount = event.fee;
  const team = isTeamEvent(event);

  const updateDetail = useCallback((key: string, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const addTeamMember = useCallback(() => {
    setTeamMembers((prev) => [...prev, { fullName: "", email: "", phone: "" }]);
  }, []);

  const removeTeamMember = useCallback((idx: number) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const updateTeamMember = useCallback((idx: number, key: string, value: string) => {
    setTeamMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [key]: value } : m)));
  }, []);

  /* ── Validation ── */
  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};

    if (step === "type" && !participantType) {
      errs.participantType = "Please select a participant type";
    }

    if (step === "details") {
      if (!details.fullName.trim()) errs.fullName = "Name is required";
      if (!details.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) errs.email = "Invalid email";
      if (!details.phone.trim()) errs.phone = "Phone is required";
      else if (!/^\d{10}$/.test(details.phone.replace(/\D/g, ""))) errs.phone = "Enter a valid 10-digit number";

      if (participantType === "sage") {
        if (!details.scholarNumber?.trim()) errs.scholarNumber = "Scholar number is required";
        if (!details.enrollmentNumber?.trim()) errs.enrollmentNumber = "Enrollment number is required";
        if (!details.course?.trim()) errs.course = "Course is required";
        if (!details.year?.trim()) errs.year = "Year/Semester is required";
      }
      if (participantType === "other-college") {
        if (!details.collegeName?.trim()) errs.collegeName = "College name is required";
        if (!details.course?.trim()) errs.course = "Course is required";
        if (!details.year?.trim()) errs.year = "Year is required";
      }
      if (participantType === "general") {
        if (!details.city?.trim()) errs.city = "City is required";
      }

      /* Team validation */
      if (team) {
        if (!teamName.trim()) errs.teamName = "Team name is required";
        if (event.minTeamSize > 0 && teamMembers.length < event.minTeamSize - 1) {
          errs.teamMembers = `At least ${event.minTeamSize - 1} team member(s) required (including you as team leader)`;
        }
        for (let i = 0; i < teamMembers.length; i++) {
          const m = teamMembers[i];
          if (!m.fullName.trim()) errs[`member_${i}_name`] = "Name required";
          if (!m.email.trim()) errs[`member_${i}_email`] = "Email required";
          if (!m.phone.trim()) errs[`member_${i}_phone`] = "Phone required";
          else if (!/^\d{10}$/.test(m.phone.replace(/\D/g, ""))) errs[`member_${i}_phone`] = "Invalid 10-digit number";
        }
      }
    }

    if (step === "payment" && !paymentMethod) {
      errs.paymentMethod = "Select a payment method";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [step, participantType, details, team, teamName, teamMembers, event, paymentMethod]);

  const next = useCallback(() => {
    if (!validate()) return;

    if (step === "payment") {
      /* Simulate payment processing */
      setStep("pending");
      setTimeout(() => {
        /* In production: backend/Easebuzz callback determines the status */
        /* For demo, randomly succeed (90%) or fail (10%) */
        const success = Math.random() > 0.1;
        setPaymentStatus(success ? "success" : "failed");
        setStep(success ? "success" : "failed");
      }, 2500);
      return;
    }

    const order: Step[] = ["summary", "type", "details", "review", "payment"];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  }, [step, validate]);

  const prev = useCallback(() => {
    if (step === "failed") {
      /* Allow retry from payment step */
      setPaymentStatus(null);
      setStep("payment");
      return;
    }
    const order: Step[] = ["summary", "type", "details", "review", "payment"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  }, [step]);

  /* ── Step indicators ── */
  const allSteps: Step[] = ["summary", "type", "details", "review", "payment"];
  const currentIdx = allSteps.indexOf(step);
  const progress =
    step === "success" ? 100
    : step === "failed" ? 85
    : step === "pending" ? 90
    : ((currentIdx + 1) / allSteps.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={step !== "pending" ? onClose : undefined}
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-4 sm:inset-6 md:inset-8 lg:inset-y-6 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-2xl z-[61] bg-euphoria-surface/98 backdrop-blur-2xl border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06]">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-aqua/60">
              {stepLabels[step]}
            </p>
            <h3 className="text-sm font-semibold text-white/80 mt-0.5">
              {event.name}
            </h3>
          </div>
          {step !== "pending" && (
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/50 hover:text-white/90 hover:bg-white/5 transition-all"
              aria-label="Close registration"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* ── Progress bar ── */}
        <div className="h-0.5 bg-white/[0.04]">
          <motion.div
            className={`h-full ${
              step === "success"
                ? "bg-euphoria-aqua"
                : step === "failed"
                ? "bg-red-400"
                : "bg-gradient-to-r from-euphoria-aqua to-euphoria-purple"
            }`}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* ── Step indicators ── */}
        {step === "summary" || step === "type" || step === "details" || step === "review" || step === "payment" ? (
          <div className="flex items-center gap-1 px-5 sm:px-6 py-3 overflow-x-auto">
            {allSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`size-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                    i < currentIdx
                      ? "bg-euphoria-aqua/20 text-euphoria-aqua"
                      : i === currentIdx
                      ? "bg-euphoria-aqua/30 text-euphoria-aqua ring-1 ring-euphoria-aqua/40"
                      : "bg-white/[0.04] text-white/25"
                  }`}
                >
                  {i < currentIdx ? <Check className="size-2.5" /> : i + 1}
                </div>
                {i < allSteps.length - 1 && (
                  <div className={`w-4 sm:w-6 h-px ${i < currentIdx ? "bg-euphoria-aqua/30" : "bg-white/[0.06]"}`} />
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          <StepContainer step={step}>
            {step === "summary" && (
              <SummaryStep event={event} amount={amount} team={team} />
            )}
            {step === "type" && (
              <TypeStep
                selected={participantType}
                onSelect={setParticipantType}
                error={errors.participantType}
              />
            )}
            {step === "details" && (
              <DetailsStep
                participantType={participantType!}
                details={details}
                updateDetail={updateDetail}
                errors={errors}
                team={team}
                event={event}
                teamName={teamName}
                setTeamName={setTeamName}
                teamMembers={teamMembers}
                addTeamMember={addTeamMember}
                removeTeamMember={removeTeamMember}
                updateTeamMember={updateTeamMember}
              />
            )}
            {step === "review" && (
              <ReviewStep
                event={event}
                amount={amount}
                participantType={participantType!}
                details={details}
                teamMembers={teamMembers}
                teamName={teamName}
                team={team}
              />
            )}
            {step === "payment" && (
              <PaymentStep
                event={event}
                amount={amount}
                selected={paymentMethod}
                onSelect={setPaymentMethod}
                error={errors.paymentMethod}
                team={team}
              />
            )}
            {step === "pending" && <PendingStep event={event} />}
            {step === "success" && (
              <SuccessStep
                event={event}
                amount={amount}
                details={details}
                participantType={participantType!}
                onClose={onClose}
              />
            )}
            {step === "failed" && (
              <FailedStep
                event={event}
                onRetry={prev}
                onClose={onClose}
              />
            )}
          </StepContainer>
        </div>

        {/* ── Footer / Navigation ── */}
        {step !== "success" && step !== "failed" && step !== "pending" && (
          <div className="border-t border-white/[0.06] px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
            {step === "summary" ? (
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-white/50 hover:text-white/70 transition-colors tracking-wider uppercase"
              >
                Close
              </button>
            ) : (
              <button
                onClick={prev}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs text-white/50 hover:text-white/70 transition-colors tracking-wider uppercase"
              >
                <ChevronLeft className="size-3.5" />
                Back
              </button>
            )}

            {step === "payment" ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase bg-gradient-to-r from-euphoria-aqua/80 to-euphoria-teal/80 text-white rounded-lg hover:from-euphoria-aqua hover:to-euphoria-teal transition-all duration-300 shadow-lg shadow-euphoria-aqua/10"
              >
                Pay ₹{amount.toLocaleString("en-IN")}
                <CreditCard className="size-3.5" />
              </button>
            ) : (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase bg-white/[0.06] text-white/70 rounded-lg hover:bg-white/[0.1] hover:text-white transition-all duration-300 border border-white/[0.08]"
              >
                {step === "review" ? "Proceed to Payment" : "Continue"}
                <ChevronRight className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Failed step footer */}
        {step === "failed" && (
          <div className="border-t border-white/[0.06] px-5 sm:px-6 py-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setPaymentStatus(null);
                setStep("payment");
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase bg-gradient-to-r from-euphoria-aqua/80 to-euphoria-teal/80 text-white rounded-lg hover:from-euphoria-aqua hover:to-euphoria-teal transition-all duration-300"
            >
              <RotateCcw className="size-3.5" />
              Try Again
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-xs text-white/50 hover:text-white/70 transition-colors tracking-wider uppercase"
            >
              Return to Registration
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════
   STEP COMPONENTS
   ═══════════════════════════════════════════ */

/* ── Step 1: Summary ── */
function SummaryStep({
  event,
  amount,
  team,
}: {
  event: EuphoriaEvent;
  amount: number;
  team: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-euphoria-gold/60">
          Registration Overview
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{event.name}</h2>
        <p className="text-xs text-white/55">{categoryLabel[event.category]}</p>
      </div>

      {/* Event poster */}
      {event.poster && (
        <div className="w-full max-w-xs mx-auto aspect-[3/4] rounded-xl overflow-hidden border border-white/[0.06]">
          <img src={event.poster} alt={event.name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Entry Fee", value: `₹${amount.toLocaleString("en-IN")}`, highlight: true },
          { label: "Date", value: event.date },
          { label: "Venue", value: event.venue },
          { label: "Team Size", value: event.teamSize },
          { label: "Time", value: event.time },
          { label: "Prizes", value: event.prizes },
        ]
          .filter((item) => item.value && item.value !== "TBA")
          .map((item) => (
            <div
              key={item.label}
              className={`rounded-lg p-3 ${
                item.highlight
                  ? "bg-euphoria-aqua/[0.06] border border-euphoria-aqua/15"
                  : "bg-white/[0.03] border border-white/[0.05]"
              }`}
            >
              <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-1">
                {item.label}
              </p>
              <p
                className={`text-sm font-medium ${
                  item.highlight ? "text-euphoria-aqua" : "text-white/70"
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
      </div>

      {team && (
        <div className="glass-card rounded-xl p-4 text-center space-y-2">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-purple/60">
            Team Event
          </p>
          <p className="text-xs text-white/55 leading-relaxed">
            You are registering as the <span className="text-white/80 font-semibold">Team Leader</span>.
            As Team Leader, you will enter all team member details during registration and make the
            full payment on behalf of the team. Team members cannot be added after registration is submitted.
          </p>
          <div className="text-[10px] text-white/35 space-x-2">
            <span>Team size: {event.minTeamSize}–{event.maxTeamSize}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Step 2: Participant Type ── */
function TypeStep({
  selected,
  onSelect,
  error,
}: {
  selected: ParticipantCategory | null;
  onSelect: (t: ParticipantCategory) => void;
  error?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-euphoria-gold/60">
          How are you participating?
        </p>
        <h2 className="text-lg sm:text-xl font-bold text-white">Select Your Category</h2>
      </div>

      {error && (
        <p className="text-center text-xs text-red-400/80">{error}</p>
      )}

      <div className="space-y-3">
        {participantTypes.map((pt) => {
          const Icon = pt.icon;
          const active = selected === pt.key;
          return (
            <button
              key={pt.key}
              onClick={() => onSelect(pt.key)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                active
                  ? "bg-euphoria-aqua/[0.08] border-euphoria-aqua/30 shadow-lg shadow-euphoria-aqua/5"
                  : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                    active ? "bg-euphoria-aqua/15" : "bg-white/[0.04]"
                  }`}
                >
                  <Icon className={`size-5 ${active ? "text-euphoria-aqua" : "text-white/25"}`} />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      active ? "text-white" : "text-white/65"
                    }`}
                  >
                    {pt.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{pt.sub}</p>
                </div>
                <div
                  className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    active ? "border-euphoria-aqua bg-euphoria-aqua/20" : "border-white/15"
                  }`}
                >
                  {active && <Check className="size-3 text-euphoria-aqua" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Step 3: Participant Details ── */
function DetailsStep({
  participantType,
  details,
  updateDetail,
  errors,
  team,
  event,
  teamName,
  setTeamName,
  teamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
}: {
  participantType: ParticipantCategory;
  details: {
    fullName: string;
    email: string;
    phone: string;
    scholarNumber?: string;
    enrollmentNumber?: string;
    course?: string;
    year?: string;
    collegeName?: string;
    city?: string;
  };
  updateDetail: (key: string, value: string) => void;
  errors: Record<string, string>;
  team: boolean;
  event: EuphoriaEvent;
  teamName: string;
  setTeamName: (v: string) => void;
  teamMembers: { fullName: string; email: string; phone: string }[];
  addTeamMember: () => void;
  removeTeamMember: (idx: number) => void;
  updateTeamMember: (idx: number, key: string, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-euphoria-gold/60">
          {participantType === "sage"
            ? "SAGE University Student"
            : participantType === "other-college"
            ? "Other College Student"
            : "General Participant"}
        </p>
        <h2 className="text-lg sm:text-xl font-bold text-white">Your Details</h2>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          icon={User}
          value={details.fullName}
          onChange={(v) => updateDetail("fullName", v)}
          placeholder="Enter your full name"
          error={errors.fullName}
        />
        <Input
          label="Email Address"
          icon={Mail}
          value={details.email}
          onChange={(v) => updateDetail("email", v)}
          type="email"
          placeholder="you@example.com"
          error={errors.email}
        />
        <Input
          label="Phone Number"
          icon={Phone}
          value={details.phone}
          onChange={(v) => updateDetail("phone", v)}
          type="tel"
          placeholder="10-digit number"
          error={errors.phone}
        />

        {/* ── SAGE Student fields ── */}
        {participantType === "sage" && (
          <>
            <Input
              label="Scholar Number"
              icon={Hash}
              value={details.scholarNumber || ""}
              onChange={(v) => updateDetail("scholarNumber", v)}
              placeholder="Your scholar number"
              error={errors.scholarNumber}
            />
            <Input
              label="Enrollment Number"
              icon={Hash}
              value={details.enrollmentNumber || ""}
              onChange={(v) => updateDetail("enrollmentNumber", v)}
              placeholder="Your enrollment number"
              error={errors.enrollmentNumber}
            />
            <Input
              label="Course / Department"
              icon={BookOpen}
              value={details.course || ""}
              onChange={(v) => updateDetail("course", v)}
              placeholder="e.g. B.Tech CSE"
              error={errors.course}
            />
            <Input
              label="Year / Semester"
              icon={Calendar}
              value={details.year || ""}
              onChange={(v) => updateDetail("year", v)}
              placeholder="e.g. 3rd Year"
              error={errors.year}
            />
          </>
        )}

        {/* ── Other College Student fields ── */}
        {participantType === "other-college" && (
          <>
            <Input
              label="College Name"
              icon={Building2}
              value={details.collegeName || ""}
              onChange={(v) => updateDetail("collegeName", v)}
              placeholder="Your college name"
              error={errors.collegeName}
            />
            <Input
              label="Course"
              icon={BookOpen}
              value={details.course || ""}
              onChange={(v) => updateDetail("course", v)}
              placeholder="e.g. BBA"
              error={errors.course}
            />
            <Input
              label="Year"
              icon={Calendar}
              value={details.year || ""}
              onChange={(v) => updateDetail("year", v)}
              placeholder="e.g. 2nd Year"
              error={errors.year}
            />
          </>
        )}

        {/* ── General Participant fields ── */}
        {participantType === "general" && (
          <Input
            label="City"
            icon={MapPin}
            value={details.city || ""}
            onChange={(v) => updateDetail("city", v)}
            placeholder="Your city"
            error={errors.city}
          />
        )}
      </div>

      {/* ── Team section ── */}
      {team && (
        <div className="space-y-4 pt-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          {/* Team Leader notice */}
          <div className="glass-card rounded-xl p-4 bg-euphoria-purple/[0.04] border border-euphoria-purple/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-4 text-euphoria-purple/70 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white/75">Team Leader Registration</p>
                <p className="text-[10px] text-white/45 mt-1 leading-relaxed">
                  As the Team Leader, you are registering the entire team. Enter all team member details below.
                  Team members cannot be added or modified after registration is submitted.
                </p>
                <p className="text-[10px] text-white/45 mt-1">
                  The team leader completes the full payment on behalf of the team.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Team Name"
            icon={User}
            value={teamName}
            onChange={(v) => setTeamName(v)}
            placeholder="Enter your team name"
            error={errors.teamName}
          />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/65">Team Members</p>
              <p className="text-[10px] text-white/40 mt-0.5">
                {event.minTeamSize > 1 ? `${event.minTeamSize}–${event.maxTeamSize} members total` : "Add your team member details"}
              </p>
            </div>
            <button
              onClick={addTeamMember}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-euphoria-aqua/60 border border-euphoria-aqua/15 rounded-md hover:bg-euphoria-aqua/10 hover:border-euphoria-aqua/30 transition-all"
            >
              + Add
            </button>
          </div>

          {teamMembers.map((member, idx) => (
            <div key={idx} className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40">
                  Member {idx + 1}
                </p>
                <button
                  onClick={() => removeTeamMember(idx)}
                  className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
              <input
                value={member.fullName}
                onChange={(e) => updateTeamMember(idx, "fullName", e.target.value)}
                placeholder="Full name"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-euphoria-aqua/40 transition-colors"
              />
              {errors[`member_${idx}_name`] && (
                <p className="text-[10px] text-red-400/80">{errors[`member_${idx}_name`]}</p>
              )}
              <input
                value={member.email}
                onChange={(e) => updateTeamMember(idx, "email", e.target.value)}
                placeholder="Email"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-euphoria-aqua/40 transition-colors"
              />
              {errors[`member_${idx}_email`] && (
                <p className="text-[10px] text-red-400/80">{errors[`member_${idx}_email`]}</p>
              )}
              <input
                value={member.phone}
                onChange={(e) => updateTeamMember(idx, "phone", e.target.value)}
                placeholder="Phone"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-euphoria-aqua/40 transition-colors"
              />
              {errors[`member_${idx}_phone`] && (
                <p className="text-[10px] text-red-400/80">{errors[`member_${idx}_phone`]}</p>
              )}
            </div>
          ))}

          {errors.teamMembers && (
            <p className="text-[10px] text-red-400/80 text-center">{errors.teamMembers}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Step 4: Review ── */
function ReviewStep({
  event,
  amount,
  participantType,
  details,
  teamMembers,
  teamName,
  team,
}: {
  event: EuphoriaEvent;
  amount: number;
  participantType: ParticipantCategory;
  details: {
    fullName: string;
    email: string;
    phone: string;
    scholarNumber?: string;
    enrollmentNumber?: string;
    course?: string;
    year?: string;
    collegeName?: string;
    city?: string;
  };
  teamMembers: { fullName: string; email: string; phone: string }[];
  teamName: string;
  team: boolean;
}) {
  const typeLabel =
    participantType === "sage"
      ? "SAGE University Student"
      : participantType === "other-college"
      ? "Other College Student"
      : "General Participant";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-euphoria-gold/60">
          Review & Confirm
        </p>
        <h2 className="text-lg sm:text-xl font-bold text-white">Registration Summary</h2>
      </div>

      <div className="space-y-2">
        {[
          { label: "Event", value: event.name },
          { label: "Category", value: categoryLabel[event.category] },
          { label: "Participant Type", value: typeLabel },
          { label: "Name", value: details.fullName },
          { label: "Email", value: details.email },
          { label: "Phone", value: details.phone },
          ...(participantType === "sage"
            ? [
                { label: "Scholar No.", value: details.scholarNumber || "" },
                { label: "Enrollment", value: details.enrollmentNumber || "" },
                { label: "Course", value: details.course || "" },
                { label: "Year", value: details.year || "" },
              ]
            : []),
          ...(participantType === "other-college"
            ? [
                { label: "College", value: details.collegeName || "" },
                { label: "Course", value: details.course || "" },
                { label: "Year", value: details.year || "" },
              ]
            : []),
          ...(participantType === "general"
            ? [{ label: "City", value: details.city || "" }]
            : []),
        ]
          .filter((r) => r.value)
          .map((r) => (
            <div
              key={r.label}
              className="flex items-start justify-between gap-4 py-2.5 border-b border-white/[0.04]"
            >
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40 shrink-0">
                {r.label}
              </span>
              <span className="text-xs text-white/70 text-right">{r.value}</span>
            </div>
          ))}
      </div>

      {team && (
        <div className="space-y-3">
          <div className="glass-card rounded-xl p-4 bg-euphoria-purple/[0.04] border border-euphoria-purple/10">
            <p className="text-xs font-semibold text-white/75">Team Leader: {details.fullName}</p>
            <p className="text-[10px] text-white/40 mt-1">
              The team leader completes the registration and makes the full payment on behalf of the team.
              Team members cannot be added after registration.
            </p>
          </div>

          {teamName && (
            <div className="py-2 border-b border-white/[0.04]">
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40">
                Team Name
              </span>
              <span className="text-xs text-white/70 ml-4">{teamName}</span>
            </div>
          )}

          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40">
            Team Members ({teamMembers.length})
          </p>
          {teamMembers.map((m, i) => (
            <div key={i} className="glass-card rounded-lg p-3">
              <p className="text-xs text-white/65">{m.fullName || `Member ${i + 1}`}</p>
              <p className="text-[10px] text-white/40">{m.email} · {m.phone}</p>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="glass-card rounded-xl p-5 bg-euphoria-aqua/[0.04] border border-euphoria-aqua/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40">
              Total Payable
            </p>
            <p className="text-[10px] text-white/30 mt-0.5">
              Entry fee for {event.name}
              {team ? " (team)" : ""}
            </p>
          </div>
          <p className="text-2xl font-bold text-euphoria-aqua">
            ₹{amount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Step 5: Payment ── */
function PaymentStep({
  event,
  amount,
  selected,
  onSelect,
  error,
  team,
}: {
  event: EuphoriaEvent;
  amount: number;
  selected: string | null;
  onSelect: (m: string) => void;
  error?: string;
  team: boolean;
}) {
  const methods = [
    { key: "upi", label: "UPI", sub: "Google Pay, PhonePe, Paytm", icon: Smartphone },
    { key: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: CreditCard },
    { key: "netbanking", label: "Net Banking", sub: "All major banks", icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-euphoria-gold/60">
          EUPHORIA 2026
        </p>
        <h2 className="text-lg sm:text-xl font-bold text-white">Secure Payment</h2>
        <p className="text-xs text-white/55">{event.name}</p>
      </div>

      {/* Amount display */}
      <div className="text-center py-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-2">
          Amount Payable
        </p>
        <p className="text-3xl sm:text-4xl font-black text-euphoria-aqua">
          ₹{amount.toLocaleString("en-IN")}
        </p>
        {team && (
          <p className="text-[10px] text-white/40 mt-2">
            Total team payment — handled by Team Leader
          </p>
        )}
      </div>

      {error && (
        <p className="text-center text-xs text-red-400/80">{error}</p>
      )}

      {/* Payment methods */}
      <div className="space-y-3">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40">
          Select Payment Method
        </p>
        {methods.map((m) => {
          const Icon = m.icon;
          const active = selected === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onSelect(m.key)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                active
                  ? "bg-euphoria-aqua/[0.06] border-euphoria-aqua/25"
                  : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-9 rounded-lg flex items-center justify-center ${
                    active ? "bg-euphoria-aqua/15" : "bg-white/[0.04]"
                  }`}
                >
                  <Icon className={`size-4 ${active ? "text-euphoria-aqua" : "text-white/25"}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${active ? "text-white" : "text-white/55"}`}>
                    {m.label}
                  </p>
                  <p className="text-[10px] text-white/30">{m.sub}</p>
                </div>
                <div
                  className={`size-4 rounded-full border flex items-center justify-center ${
                    active ? "border-euphoria-aqua bg-euphoria-aqua/20" : "border-white/15"
                  }`}
                >
                  {active && <Check className="size-2.5 text-euphoria-aqua" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-[10px] text-white/25 leading-relaxed">
        Payment will be processed through Easebuzz gateway. This is a frontend demo — no real payment will be charged.
      </p>
    </div>
  );
}

/* ── Step 6: Payment Pending ── */
function PendingStep({ event }: { event: EuphoriaEvent }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-6 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="size-16 rounded-full bg-euphoria-aqua/10 border border-euphoria-aqua/20 flex items-center justify-center"
      >
        <Loader2 className="size-8 text-euphoria-aqua" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-white">Processing Payment</h2>
        <p className="text-sm text-white/55">
          Please do not refresh or close this page.
        </p>
        <p className="text-xs text-white/35">
          Redirecting to payment gateway...
        </p>
      </div>

      <div className="glass-card rounded-xl p-4 max-w-sm">
        <p className="text-[10px] text-white/40 leading-relaxed">
          Your registration is being processed. In production, this step connects to the
          Easebuzz payment gateway for UPI / Card / Net Banking transactions.
        </p>
      </div>
    </div>
  );
}

/* ── Step 7: Payment Success ── */
function SuccessStep({
  event,
  amount,
  details,
  participantType,
  onClose,
}: {
  event: EuphoriaEvent;
  amount: number;
  details: { fullName: string; email: string; phone: string };
  participantType: ParticipantCategory;
  onClose: () => void;
}) {
  const typeLabel =
    participantType === "sage"
      ? "SAGE University Student"
      : participantType === "other-college"
      ? "Other College Student"
      : "General Participant";

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 py-8">
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="size-20 rounded-full bg-euphoria-aqua/10 border border-euphoria-aqua/20 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Check className="size-10 text-euphoria-aqua" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="space-y-2"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Payment Successful
        </h2>
        <p className="text-sm text-white/55">
          Your registration has been confirmed.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass-card rounded-xl p-5 space-y-3 w-full max-w-sm"
      >
        <div className="flex justify-between text-xs">
          <span className="text-white/40">Event</span>
          <span className="text-white/70 text-right">{event.name}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/40">Participant</span>
          <span className="text-white/70">{details.fullName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/40">Category</span>
          <span className="text-white/70">{typeLabel}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/40">Email</span>
          <span className="text-white/70">{details.email}</span>
        </div>
        <div className="h-px bg-white/[0.06]" />
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-white/50">Amount Paid</span>
          <span className="text-euphoria-aqua">₹{amount.toLocaleString("en-IN")}</span>
        </div>
      </motion.div>

      {/* Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="glass-card rounded-xl p-4 max-w-sm"
      >
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-gold/55 mb-1">
          Confirmation Notice
        </p>
        <p className="text-xs text-white/45 leading-relaxed">
          Your registration details have been recorded. A confirmation will be sent to your email.
          This is a frontend demo — in production, the backend will verify payment with Easebuzz
          before confirming registration.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        onClick={onClose}
        className="px-8 py-3 text-xs font-semibold tracking-[0.15em] uppercase bg-white/[0.06] text-white/65 rounded-lg hover:bg-white/[0.1] hover:text-white transition-all duration-300 border border-white/[0.08]"
      >
        Back to Events
      </motion.button>
    </div>
  );
}

/* ── Step 8: Payment Failed ── */
function FailedStep({
  event,
  onRetry,
  onClose,
}: {
  event: EuphoriaEvent;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 py-8">
      {/* Failed icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="size-20 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <X className="size-10 text-red-400" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="space-y-2"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Payment Failed
        </h2>
        <p className="text-sm text-white/55">
          Something went wrong while processing your payment.
        </p>
      </motion.div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass-card rounded-xl p-5 space-y-3 w-full max-w-sm"
      >
        <div className="flex justify-between text-xs">
          <span className="text-white/40">Event</span>
          <span className="text-white/70 text-right">{event.name}</span>
        </div>
        <div className="h-px bg-white/[0.06]" />
        <p className="text-xs text-white/45 leading-relaxed">
          Your registration has not been completed. No payment has been charged.
          You can try again or return to the registration form.
        </p>
      </motion.div>

      {/* Actions are in the footer — handled by the main component */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center"
      >
        <p className="text-xs text-white/40">
          If the issue persists, please contact the event helpdesk.
        </p>
      </motion.div>
    </div>
  );
}
