import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Lock, Check } from "lucide-react";

/* ─── Single pass data (data-driven, ready for backend) ─── */
const euphoriaPass = {
  id: "euphoria-2026-general",
  name: "EUPHORIA 2026",
  subtitle: "GENERAL PASS",
  tagline: "Your entry into the celebration.",
  price: null as number | null,
  status: "coming-soon" as const,
  audiences: [
    "SAGE University students",
    "Students from other colleges",
    "General public / outsiders",
  ],
  features: [
    "Access to the Euphoria festival experience",
    "Entry to eligible events and activities",
    "Festival updates and announcements",
    "Access to designated festival areas",
    "More details to be announced",
  ],
};

/* ─── Fade-up animation helper ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function Passes() {
  const introRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const introInView = useInView(introRef, { once: true, amount: 0.3 });
  const cardInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <section
      id="passes"
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* ─── Atmospheric background ─── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-euphoria-dark" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-euphoria-purple/[0.06] blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-euphoria-aqua/[0.04] blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-euphoria-gold/[0.025] blur-[220px]" />
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ────────────────────────────────────────── */}
      {/* PART 1 — CINEMATIC INTRO                   */}
      {/* ────────────────────────────────────────── */}
      <div
        ref={introRef}
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 sm:mb-24"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={introInView ? "visible" : "hidden"}
          custom={0}
          className="mb-6"
        >
          <span className="inline-block text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase text-euphoria-gold/70">
            Passes
          </span>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={introInView ? "visible" : "hidden"}
          custom={1}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
          style={{ fontFamily: "var(--font-heading, inherit)" }}
        >
          <span className="text-white/90">ONE FESTIVAL.</span>
          <br />
          <span className="text-white/90">ONE PASS.</span>
          <br />
          <span className="bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua bg-clip-text text-transparent">
            ENDLESS EUPHORIA.
          </span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={introInView ? "visible" : "hidden"}
          custom={2}
          className="mt-6 text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed"
        >
          One pass. Open to everyone.
          <br />
          Students, outsiders, creators, dreamers — experience Euphoria
          together.
        </motion.p>

        {/* Subtle divider */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={introInView ? "visible" : "hidden"}
          custom={3}
          className="mt-10 mx-auto w-20 h-px bg-gradient-to-r from-transparent via-euphoria-gold/40 to-transparent"
        />
      </div>

      {/* ────────────────────────────────────────── */}
      {/* PART 2 — SINGLE PASS CARD                  */}
      {/* ────────────────────────────────────────── */}
      <div
        ref={cardRef}
        className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={cardInView ? "visible" : "hidden"}
          custom={0}
          className="relative group"
        >
          {/* Animated gradient border glow */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-euphoria-aqua/20 via-euphoria-purple/15 to-euphoria-gold/20 opacity-60 group-hover:opacity-100 transition-opacity duration-700 blur-[1px]" />
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-euphoria-aqua/10 via-transparent to-euphoria-gold/10 opacity-0 group-hover:opacity-60 transition-opacity duration-700" />

          {/* Card body */}
          <div className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-xl overflow-hidden">
            {/* Top accent bar */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-euphoria-aqua/30 to-transparent" />

            {/* "Open to everyone" badge */}
            <div className="text-center pt-8 sm:pt-10">
              <motion.span
                variants={fadeUp}
                initial="hidden"
                animate={cardInView ? "visible" : "hidden"}
                custom={1}
                className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-euphoria-aqua/80 border border-euphoria-aqua/15 rounded-full px-5 py-1.5 bg-euphoria-aqua/[0.04]"
              >
                Open to Everyone
              </motion.span>
            </div>

            {/* Card content */}
            <div className="px-6 sm:px-10 py-8 sm:py-10 text-center">
              <motion.h3
                variants={fadeUp}
                initial="hidden"
                animate={cardInView ? "visible" : "hidden"}
                custom={2}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white/90 leading-tight mb-2"
                style={{ fontFamily: "var(--font-heading, inherit)" }}
              >
                {euphoriaPass.name}
              </motion.h3>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate={cardInView ? "visible" : "hidden"}
                custom={3}
                className="text-sm sm:text-base font-medium tracking-[0.2em] uppercase text-euphoria-gold/70 mb-1"
              >
                {euphoriaPass.subtitle}
              </motion.p>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate={cardInView ? "visible" : "hidden"}
                custom={3.5}
                className="text-sm text-white/55 mb-8"
              >
                {euphoriaPass.tagline}
              </motion.p>

              {/* Eligible audiences */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={cardInView ? "visible" : "hidden"}
                custom={4}
                className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8"
              >
                {euphoriaPass.audiences.map((audience) => (
                  <span
                    key={audience}
                    className="flex items-center gap-1.5 text-xs sm:text-sm text-white/50"
                  >
                    <Check className="size-3.5 text-euphoria-aqua/70" />
                    {audience}
                  </span>
                ))}
              </motion.div>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

              {/* Features */}
              <motion.ul
                variants={fadeUp}
                initial="hidden"
                animate={cardInView ? "visible" : "hidden"}
                custom={5}
                className="space-y-3 mb-8 max-w-md mx-auto"
              >
                {euphoriaPass.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-white/60"
                  >
                    <Check className="size-3.5 mt-0.5 flex-shrink-0 text-euphoria-purple/70" />
                    <span>{feature}</span>
                  </li>
                ))}
              </motion.ul>

              {/* Price */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={cardInView ? "visible" : "hidden"}
                custom={6}
                className="mb-6"
              >
                <span className="text-sm font-medium tracking-wide text-white/45 border border-white/10 rounded-lg px-4 py-2 inline-block">
                  PRICE TO BE ANNOUNCED
                </span>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={cardInView ? "visible" : "hidden"}
                custom={7}
              >
                <button
                  disabled
                  className="w-full sm:w-72 mx-auto py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-euphoria-purple/40 via-euphoria-aqua/30 to-euphoria-gold/30 text-white/50 text-sm font-semibold tracking-wider uppercase cursor-not-allowed border border-white/[0.06] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Lock className="size-3.5" />
                  Coming Soon
                </button>
              </motion.div>
            </div>

            {/* Bottom accent bar */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-euphoria-gold/20 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* ────────────────────────────────────────── */}
      {/* PART 3 — PRO NIGHT / ARTIST TEASER         */}
      {/* ────────────────────────────────────────── */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={cardInView ? "visible" : "hidden"}
          custom={8}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Stage backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-euphoria-dark via-[#0d0816] to-euphoria-dark" />

          {/* Animated stage light beams */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ opacity: [0.06, 0.15, 0.06], rotate: [-2, 2, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-[1.5px] h-[250%] bg-gradient-to-b from-euphoria-purple/50 via-euphoria-purple/15 to-transparent"
              style={{ transformOrigin: "top center" }}
            />
            <motion.div
              animate={{ opacity: [0.05, 0.12, 0.05], rotate: [3, -1, 3] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -top-10 left-[38%] w-[1.5px] h-[250%] bg-gradient-to-b from-euphoria-aqua/35 via-euphoria-aqua/10 to-transparent"
              style={{ transformOrigin: "top center" }}
            />
            <motion.div
              animate={{ opacity: [0.04, 0.10, 0.04], rotate: [-3, 1, -3] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute -top-10 left-[62%] w-[1.5px] h-[250%] bg-gradient-to-b from-euphoria-gold/25 via-euphoria-gold/08 to-transparent"
              style={{ transformOrigin: "top center" }}
            />
          </div>

          <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 text-center">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-euphoria-purple/70 mb-4">
              Pro Night
            </p>
            <p
              className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white/80 leading-snug mb-2"
              style={{ fontFamily: "var(--font-heading, inherit)" }}
            >
              YOUR NIGHT.
              <br />
              <span className="bg-gradient-to-r from-euphoria-purple via-euphoria-aqua to-euphoria-gold bg-clip-text text-transparent">
                A NEW HEADLINER.
              </span>
            </p>
            <p className="text-xs sm:text-sm text-white/45 tracking-wide">
              Artist reveal — coming soon.
            </p>
            {/* Pulsing indicator */}
            <motion.div
              animate={{ opacity: [0.25, 0.6, 0.25] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mt-5 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-euphoria-gold/40 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
