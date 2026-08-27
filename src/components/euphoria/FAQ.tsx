import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlurFade } from "@/components/magicui/blur-fade";

/* ── FAQ data ──────────────────────────────────────────────── */
const faqs = [
  {
    q: "Who can participate in the fest?",
    a: "The fest is open to students from SAGE University Indore as well as participants from other colleges, subject to event-specific eligibility criteria.",
  },
  {
    q: "How can I register for events?",
    a: "Participants can register through the official fest website by selecting their desired events and completing the registration process.",
  },
  {
    q: "Is there any registration fee?",
    a: "Yes, some events may have a nominal registration fee. The fee details are mentioned under each event.",
  },
  {
    q: "Can I participate in multiple events?",
    a: "Yes, participants can register for multiple events as long as the event timings do not clash.",
  },
  {
    q: "Will I receive a confirmation after registration?",
    a: "Yes, a confirmation message/email will be provided after successful registration.",
  },
  {
    q: "What should I bring on the event day?",
    a: "Participants must carry: College ID card, Registration confirmation, and any required materials for their specific event.",
  },
  {
    q: "Are on-spot registrations allowed?",
    a: "On-spot registrations may be available for selected events, subject to availability of slots.",
  },
  {
    q: "Will certificates be provided?",
    a: "Yes, participation certificates will be provided to all registered participants, and winners will receive certificates along with prizes.",
  },
  {
    q: "How will I get event updates?",
    a: "All updates will be shared through the official website and registered contact details.",
  },
  {
    q: "Who should I contact for queries?",
    a: "Participants can contact the event coordinators or the official fest helpdesk mentioned on the website.",
  },
];

/* ── Single FAQ row ────────────────────────────────────────── */
function FaqItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof faqs)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <BlurFade
      delay={0.08 + index * 0.05}
      inViewMargin="-60px"
    >
      <div
        className={`border-b transition-colors duration-300 ${
          isOpen
            ? "border-euphoria-gold/15"
            : "border-white/[0.04] hover:border-white/[0.08]"
        }`}
      >
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-euphoria-aqua/40 focus-visible:ring-offset-2 focus-visible:ring-offset-euphoria-dark rounded-sm"
        >
          <span
            className={`text-sm sm:text-base font-medium tracking-wide transition-colors duration-300 ${
              isOpen ? "text-white/80" : "text-white/40 group-hover:text-white/60"
            }`}
          >
            {item.q}
          </span>

          {/* Expand/collapse icon */}
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-300"
            style={{
              borderColor: isOpen
                ? "rgba(175,153,71,0.25)"
                : "rgba(255,255,255,0.06)",
              backgroundColor: isOpen
                ? "rgba(175,153,71,0.06)"
                : "rgba(255,255,255,0.02)",
            }}
          >
            <span
              className={`block w-3 h-px transition-colors duration-300 ${
                isOpen ? "bg-euphoria-gold/60" : "bg-white/20"
              }`}
            />
            <span
              className={`absolute block w-px h-3 transition-all duration-300 ${
                isOpen ? "bg-euphoria-gold/60 opacity-0 scale-0" : "bg-white/20 opacity-100 scale-100"
              }`}
            />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <p className="pb-5 sm:pb-6 text-sm sm:text-[15px] text-white/30 leading-relaxed font-light max-w-2xl">
                {item.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlurFade>
  );
}

/* ── Main FAQ Section ──────────────────────────────────────── */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback(
    (index: number) => {
      setOpenIndex((prev) => (prev === index ? null : index));
    },
    []
  );

  return (
    <section
      id="faq"
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 20%, rgba(91,27,82,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 80% 80%, rgba(23,111,99,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left — heading */}
          <div className="lg:col-span-5">
            <BlurFade inViewMargin="-100px" className="mb-6">
              <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/50">
                Solutions for Your Curiosities
              </span>
            </BlurFade>

            <BlurFade delay={0.1} inViewMargin="-100px">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.0]">
                <span className="text-white block">Euphoria</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua block mt-2">
                  Helpdesk
                </span>
              </h2>
            </BlurFade>

            <BlurFade delay={0.2} inViewMargin="-100px" className="mt-6">
              <p className="text-sm sm:text-base text-white/25 max-w-sm leading-relaxed font-light">
                Everything you need to know before the fest begins.
              </p>
            </BlurFade>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-7 lg:pt-4">
            {faqs.map((item, i) => (
              <FaqItem
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-gold/10 to-transparent" />
    </section>
  );
}
