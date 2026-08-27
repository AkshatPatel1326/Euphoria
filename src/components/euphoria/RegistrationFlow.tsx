import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check, CreditCard, Smartphone, Building2, User, Mail, Phone, MapPin, GraduationCap, BookOpen, Calendar, Hash } from "lucide-react";
import type { EuphoriaEvent } from "@/data/events";

/* ── Helpers ── */
function parseFee(fee: string): number {
  return parseInt(fee.replace(/[₹,\s]/g, ""), 10) || 0;
}

function isTeamEvent(event: EuphoriaEvent): boolean {
  const t = event.teamSize.toLowerCase();
  return t.includes("member") || t.includes("pair") || t.includes("group") || t.includes("–");
}

type ParticipantType = "sage" | "other-college" | "general";

interface ParticipantDetails {
  fullName: string;
  email: string;
  phone: string;
  enrollmentNumber?: string;
  course?: string;
  year?: string;
  collegeName?: string;
  city?: string;
  teamName?: string;
}

interface TeamMember {
  fullName: string;
  email: string;
  phone: string;
}

type Step = "summary" | "type" | "details" | "review" | "payment" | "confirmation";

const stepLabels: Record<Step, string> = {
  summary: "Event Summary",
  type: "Participant Type",
  details: "Your Details",
  review: "Review",
  payment: "Payment",
  confirmation: "Confirmation",
};

const participantTypes: { key: ParticipantType; label: string; sub: string; icon: typeof User }[] = [
  { key: "sage", label: "SAGE University Student", sub: "Currently enrolled at SAGE University Indore", icon: GraduationCap },
  { key: "other-college", label: "Other College Student", sub: "Student at a different institution", icon: BookOpen },
  { key: "general", label: "General Participant", sub: "Independent / open registration", icon: User },
];

const categoryColor: Record<string, string> = {
  cultural: "text-euphoria-purple",
  "literary-management": "text-euphoria-gold",
  "science-tech": "text-euphoria-aqua",
  sports: "text-euphoria-teal",
};

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
      <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30">
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
  const [participantType, setParticipantType] = useState<ParticipantType | null>(null);
  const [details, setDetails] = useState<ParticipantDetails>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const amount = useMemo(() => parseFee(event.registrationFee), [event.registrationFee]);
  const team = useMemo(() => isTeamEvent(event), [event]);

  const updateDetail = useCallback((key: keyof ParticipantDetails, value: string) => {
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

  const updateTeamMember = useCallback((idx: number, key: keyof TeamMember, value: string) => {
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
    }

    if (step === "payment" && !paymentMethod) {
      errs.paymentMethod = "Select a payment method";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [step, participantType, details, paymentMethod]);

  const next = useCallback(() => {
    if (!validate()) return;
    const order: Step[] = ["summary", "type", "details", "review", "payment", "confirmation"];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  }, [step, validate]);

  const prev = useCallback(() => {
    const order: Step[] = ["summary", "type", "details", "review", "payment", "confirmation"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  }, [step]);

  /* ── Step indicators ── */
  const allSteps: Step[] = ["summary", "type", "details", "review", "payment"];
  const currentIdx = allSteps.indexOf(step);
  const progress = step === "confirmation" ? 100 : ((currentIdx + 1) / allSteps.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
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
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-aqua/50">
              {stepLabels[step]}
            </p>
            <h3 className="text-sm font-semibold text-white/80 mt-0.5">
              {event.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/30 hover:text-white/80 hover:bg-white/5 transition-all"
            aria-label="Close registration"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── Progress bar ── */}
        <div className="h-0.5 bg-white/[0.04]">
          <motion.div
            className="h-full bg-gradient-to-r from-euphoria-aqua to-euphoria-purple"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* ── Step indicators ── */}
        {step !== "confirmation" && (
          <div className="flex items-center gap-1 px-5 sm:px-6 py-3 overflow-x-auto">
            {allSteps.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`size-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                    i < currentIdx
                      ? "bg-euphoria-aqua/20 text-euphoria-aqua"
                      : i === currentIdx
                      ? "bg-euphoria-aqua/30 text-euphoria-aqua ring-1 ring-euphoria-aqua/40"
                      : "bg-white/[0.04] text-white/20"
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
        )}

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
              />
            )}
            {step === "confirmation" && (
              <ConfirmationStep event={event} amount={amount} details={details} onClose={onClose} />
            )}
          </StepContainer>
        </div>

        {/* ── Footer / Navigation ── */}
        {step !== "confirmation" && (
          <div className="border-t border-white/[0.06] px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
            {step === "summary" ? (
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-white/30 hover:text-white/60 transition-colors tracking-wider uppercase"
              >
                Close
              </button>
            ) : (
              <button
                onClick={prev}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs text-white/30 hover:text-white/60 transition-colors tracking-wider uppercase"
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
        <p className="text-xs text-white/30">{categoryLabel[event.category]}</p>
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
              <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/25 mb-1">
                {item.label}
              </p>
              <p
                className={`text-sm font-medium ${
                  item.highlight ? "text-euphoria-aqua" : "text-white/60"
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
      </div>

      {team && (
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-purple/60">
            Team Event
          </p>
          <p className="text-xs text-white/30 mt-1">
            Team member details will be collected in the next steps.
          </p>
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
  selected: ParticipantType | null;
  onSelect: (t: ParticipantType) => void;
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
                      active ? "text-white" : "text-white/60"
                    }`}
                  >
                    {pt.label}
                  </p>
                  <p className="text-xs text-white/25 mt-0.5">{pt.sub}</p>
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
  teamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
}: {
  participantType: ParticipantType;
  details: ParticipantDetails;
  updateDetail: (key: keyof ParticipantDetails, value: string) => void;
  errors: Record<string, string>;
  team: boolean;
  teamMembers: TeamMember[];
  addTeamMember: () => void;
  removeTeamMember: (idx: number) => void;
  updateTeamMember: (idx: number, key: keyof TeamMember, value: string) => void;
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

        {participantType === "sage" && (
          <>
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

      {/* Team section */}
      {team && (
        <div className="space-y-4 pt-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/60">Team Members</p>
              <p className="text-[10px] text-white/25 mt-0.5">Add your team member details</p>
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
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30">
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
              <input
                value={member.email}
                onChange={(e) => updateTeamMember(idx, "email", e.target.value)}
                placeholder="Email"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-euphoria-aqua/40 transition-colors"
              />
              <input
                value={member.phone}
                onChange={(e) => updateTeamMember(idx, "phone", e.target.value)}
                placeholder="Phone"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-euphoria-aqua/40 transition-colors"
              />
            </div>
          ))}
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
  team,
}: {
  event: EuphoriaEvent;
  amount: number;
  participantType: ParticipantType;
  details: ParticipantDetails;
  teamMembers: TeamMember[];
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
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/25 shrink-0">
                {r.label}
              </span>
              <span className="text-xs text-white/60 text-right">{r.value}</span>
            </div>
          ))}
      </div>

      {team && teamMembers.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25">
            Team Members ({teamMembers.length})
          </p>
          {teamMembers.map((m, i) => (
            <div key={i} className="glass-card rounded-lg p-3">
              <p className="text-xs text-white/50">{m.fullName || `Member ${i + 1}`}</p>
              <p className="text-[10px] text-white/25">{m.email} · {m.phone}</p>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="glass-card rounded-xl p-5 bg-euphoria-aqua/[0.04] border border-euphoria-aqua/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30">
              Total Payable
            </p>
            <p className="text-[10px] text-white/20 mt-0.5">Entry fee for {event.name}</p>
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
}: {
  event: EuphoriaEvent;
  amount: number;
  selected: string | null;
  onSelect: (m: string) => void;
  error?: string;
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
        <p className="text-xs text-white/30">{event.name}</p>
      </div>

      {/* Amount display */}
      <div className="text-center py-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 mb-2">
          Amount Payable
        </p>
        <p className="text-3xl sm:text-4xl font-black text-euphoria-aqua">
          ₹{amount.toLocaleString("en-IN")}
        </p>
      </div>

      {error && (
        <p className="text-center text-xs text-red-400/80">{error}</p>
      )}

      {/* Payment methods */}
      <div className="space-y-3">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25">
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
                  <p className={`text-sm font-medium ${active ? "text-white" : "text-white/50"}`}>
                    {m.label}
                  </p>
                  <p className="text-[10px] text-white/20">{m.sub}</p>
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

      <p className="text-center text-[10px] text-white/15 leading-relaxed">
        This is a frontend demo. No real payment will be processed.
        <br />
        A production version will integrate Razorpay or similar gateway.
      </p>
    </div>
  );
}

/* ── Step 6: Confirmation ── */
function ConfirmationStep({
  event,
  amount,
  details,
  onClose,
}: {
  event: EuphoriaEvent;
  amount: number;
  details: ParticipantDetails;
  onClose: () => void;
}) {
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
          PAYMENT DEMO COMPLETE
        </h2>
        <p className="text-sm text-white/30">
          Your registration details are ready for submission.
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
          <span className="text-white/25">Event</span>
          <span className="text-white/60 text-right">{event.name}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/25">Participant</span>
          <span className="text-white/60">{details.fullName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/25">Email</span>
          <span className="text-white/60">{details.email}</span>
        </div>
        <div className="h-px bg-white/[0.06]" />
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-white/40">Amount</span>
          <span className="text-euphoria-aqua">₹{amount.toLocaleString("en-IN")}</span>
        </div>
      </motion.div>

      {/* Demo notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="glass-card rounded-xl p-4 max-w-sm"
      >
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-gold/50 mb-1">
          Frontend Demo Notice
        </p>
        <p className="text-xs text-white/25 leading-relaxed">
          This is a demonstration of the registration and payment flow.
          No real payment has been processed. In production, this will connect to a payment gateway.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        onClick={onClose}
        className="px-8 py-3 text-xs font-semibold tracking-[0.15em] uppercase bg-white/[0.06] text-white/60 rounded-lg hover:bg-white/[0.1] hover:text-white transition-all duration-300 border border-white/[0.08]"
      >
        Back to Events
      </motion.button>
    </div>
  );
}
