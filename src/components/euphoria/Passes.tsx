import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Ticket, Lock, Star, Crown } from "lucide-react";

/* ─── Pass data structure (data-driven, ready for backend) ─── */
interface PassData {
  id: string;
  name: string;
  tagline: string;
  price: number | null;
  status: "available" | "coming-soon";
  color: string; // accent
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const passes: PassData[] = [
  {
    id: "single-day",
    name: "DAY PASS",
    tagline: "One day. All the energy.",
    price: null,
    status: "coming-soon",
    color: "euphoria-aqua",
    features: [
      "Access to all events for one day",
      "Pro Night entry",
      "Festival merchandise (limited)",
      "Food court access",
    ],
    icon: <Ticket className="size-6" />,
  },
  {
    id: "full-fest",
    name: "FULL FEST PASS",
    tagline: "Three days. Everything Euphoria.",
    price: null,
    status: "coming-soon",
    color: "euphoria-purple",
    features: [
      "Full 3-day festival access",
      "Pro Night entry",
      "Priority registration for events",
      "Exclusive fest kit",
      "Food court access",
      "Digital certificate",
    ],
    icon: <Star className="size-6" />,
    popular: true,
  },
  {
    id: "vip",
    name: "VIP PASS",
    tagline: "The ultimate Euphoria experience.",
    price: null,
    status: "coming-soon",
    color: "euphoria-gold",
    features: [
      "Full 3-day VIP access",
      "Backstage Pro Night entry",
      "Priority event seating",
      "Exclusive VIP lounge",
      "Premium fest kit",
      "Meet & greet (artist pending)",
      "Food & beverages included",
      "Personalised certificate",
    ],
    icon: <Crown className="size-6" />,
  },
];

/* ─── Fade-up animation helper ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  }),
};

export function Passes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const introInView = useInView(introRef, { once: true, amount: 0.3 });
  const teaserInView = useInView(teaserRef, { once: true, amount: 0.25 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.15 });

  const [selectedPass, setSelectedPass] = useState<PassData | null>(null);

  return (
    <section
      ref={sectionRef}
      id="passes"
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* ─── Atmospheric background ─── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-euphoria-dark" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-euphoria-purple/[0.06] blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-euphoria-aqua/[0.04] blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-euphoria-gold/[0.03] blur-[200px]" />
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
      <div ref={introRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20 sm:mb-28">
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          style={{ fontFamily: "var(--font-heading, inherit)" }}
        >
          <span className="text-white/90">YOUR PASS TO</span>
          <br />
          <span className="bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua bg-clip-text text-transparent">
            EUPHORIA.
          </span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={introInView ? "visible" : "hidden"}
          custom={2}
          className="mt-6 text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed"
        >
          Three days. Countless experiences.
          <br />
          One unforgettable Euphoria.
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
      {/* PART 2 — PRO NIGHT / ARTIST TEASER         */}
      {/* ────────────────────────────────────────── */}
      <div ref={teaserRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Cinematic stage backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-euphoria-dark via-[#0d0816] to-euphoria-dark" />

          {/* Animated stage light beams */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ opacity: [0.08, 0.18, 0.08], rotate: [-2, 2, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[2px] h-[250%] bg-gradient-to-b from-euphoria-purple/60 via-euphoria-purple/20 to-transparent"
              style={{ transformOrigin: "top center" }}
            />
            <motion.div
              animate={{ opacity: [0.06, 0.14, 0.06], rotate: [3, -1, 3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-20 left-[35%] w-[2px] h-[250%] bg-gradient-to-b from-euphoria-aqua/40 via-euphoria-aqua/10 to-transparent"
              style={{ transformOrigin: "top center" }}
            />
            <motion.div
              animate={{ opacity: [0.05, 0.12, 0.05], rotate: [-3, 1, -3] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -top-20 left-[65%] w-[2px] h-[250%] bg-gradient-to-b from-euphoria-gold/30 via-euphoria-gold/10 to-transparent"
              style={{ transformOrigin: "top center" }}
            />
            {/* Atmospheric haze */}
            <motion.div
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-euphoria-purple/[0.08] to-transparent"
            />
          </div>

          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 md:px-20 md:py-24 text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={teaserInView ? "visible" : "hidden"}
              custom={0}
              className="mb-4"
            >
              <span className="inline-block text-[10px] sm:text-xs font-medium tracking-[0.35em] uppercase text-euphoria-purple/80 border border-euphoria-purple/20 rounded-full px-4 py-1.5">
                Pro Night
              </span>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={teaserInView ? "visible" : "hidden"}
              custom={1}
              className="mb-6"
            >
              <h3
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white/90 leading-tight"
                style={{ fontFamily: "var(--font-heading, inherit)" }}
              >
                SOMETHING BIG
                <br />
                <span className="bg-gradient-to-r from-euphoria-purple via-euphoria-aqua to-euphoria-purple bg-clip-text text-transparent">
                  IS COMING.
                </span>
              </h3>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={teaserInView ? "visible" : "hidden"}
              custom={2}
              className="mb-8"
            >
              <p className="text-white/55 text-sm sm:text-base tracking-wide">
                The stage is waiting. The announcement is coming.
              </p>
            </motion.div>

            {/* Headliner teaser */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={teaserInView ? "visible" : "hidden"}
              custom={3}
              className="relative inline-block"
            >
              <div className="relative px-8 py-5 sm:px-12 sm:py-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
                <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-euphoria-gold/70 mb-2">
                  Headliner
                </p>
                <p
                  className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-white/80"
                  style={{ fontFamily: "var(--font-heading, inherit)" }}
                >
                  TO BE ANNOUNCED
                </p>
                {/* Pulsing reveal indicator */}
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.02, 0.95] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-3 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-euphoria-gold/50 to-transparent"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────── */}
      {/* PART 3 — PASS SELECTION                     */}
      {/* ────────────────────────────────────────── */}
      <div ref={cardsRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            custom={0}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
            style={{ fontFamily: "var(--font-heading, inherit)" }}
          >
            <span className="text-white/90">CHOOSE</span>
            <br />
            <span className="bg-gradient-to-r from-euphoria-aqua via-euphoria-purple to-euphoria-gold bg-clip-text text-transparent">
              YOUR EXPERIENCE.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            custom={1}
            className="mt-4 text-sm sm:text-base text-white/60"
          >
            One festival. Multiple ways to experience it.
          </motion.p>
        </div>

        {/* Pass cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {passes.map((pass, i) => (
            <PassCard
              key={pass.id}
              pass={pass}
              index={i}
              inView={cardsInView}
              isSelected={selectedPass?.id === pass.id}
              onSelect={() => setSelectedPass(pass)}
            />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={cardsInView ? "visible" : "hidden"}
          custom={6}
          className="mt-12 text-center text-[11px] sm:text-xs text-white/40 tracking-wide"
        >
          Pass details and pricing will be announced soon.
          <br />
          Open to SAGE University students, college students, and general attendees.
        </motion.p>
      </div>

      {/* ─── Registration Modal ─── */}
      {selectedPass && (
        <PassRegistrationModal
          pass={selectedPass}
          onClose={() => setSelectedPass(null)}
        />
      )}
    </section>
  );
}

/* ─── Individual Pass Card ─── */
function PassCard({
  pass,
  index,
  inView,
  isSelected,
  onSelect,
}: {
  pass: PassData;
  index: number;
  inView: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const accentMap: Record<string, { border: string; glow: string; text: string; bg: string; iconColor: string }> = {
    "euphoria-aqua": {
      border: "border-euphoria-aqua/15 hover:border-euphoria-aqua/35",
      glow: "group-hover:shadow-[0_0_40px_rgba(62,238,213,0.08)]",
      text: "text-euphoria-aqua",
      bg: "bg-euphoria-aqua/[0.04]",
      iconColor: "text-euphoria-aqua/70",
    },
    "euphoria-purple": {
      border: "border-euphoria-purple/15 hover:border-euphoria-purple/35",
      glow: "group-hover:shadow-[0_0_40px_rgba(147,51,234,0.08)]",
      text: "text-euphoria-purple",
      bg: "bg-euphoria-purple/[0.04]",
      iconColor: "text-euphoria-purple/70",
    },
    "euphoria-gold": {
      border: "border-euphoria-gold/15 hover:border-euphoria-gold/35",
      glow: "group-hover:shadow-[0_0_40px_rgba(251,191,36,0.08)]",
      text: "text-euphoria-gold",
      bg: "bg-euphoria-gold/[0.04]",
      iconColor: "text-euphoria-gold/70",
    },
  };

  const accent = accentMap[pass.color] || accentMap["euphoria-aqua"];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index + 2}
      className={`group relative rounded-2xl border ${accent.border} ${accent.glow} bg-white/[0.015] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 flex flex-col ${
        pass.popular ? "md:-translate-y-2 md:hover:-translate-y-3" : ""
      }`}
    >
      {/* Popular badge */}
      {pass.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase bg-gradient-to-r from-euphoria-purple to-euphoria-aqua text-white/90 rounded-full px-4 py-1 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-6 sm:p-8 flex flex-col flex-1">
        {/* Icon + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`${accent.iconColor} transition-colors duration-300`}>
            {pass.icon}
          </div>
          <h3
            className="text-lg sm:text-xl font-bold tracking-wider text-white/85"
            style={{ fontFamily: "var(--font-heading, inherit)" }}
          >
            {pass.name}
          </h3>
        </div>

        {/* Tagline */}
        <p className="text-sm text-white/55 mb-6">{pass.tagline}</p>

        {/* Price */}
        <div className="mb-6">
          {pass.price !== null ? (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-white/85">
                ₹{pass.price.toLocaleString("en-IN")}
              </span>
            </div>
          ) : (
            <span className="text-sm font-medium tracking-wide text-white/40 border border-white/10 rounded-lg px-3 py-1.5 inline-block">
              PRICE TO BE ANNOUNCED
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {pass.features.map((feature, fi) => (
            <li key={fi} className="flex items-start gap-2.5 text-sm text-white/60">
              <ChevronRight className={`size-3.5 mt-0.5 flex-shrink-0 ${accent.text}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={onSelect}
          className={`w-full py-3 sm:py-3.5 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
            pass.popular
              ? "bg-gradient-to-r from-euphoria-purple to-euphoria-aqua text-white shadow-[0_0_20px_rgba(147,51,234,0.2)] hover:shadow-[0_0_30px_rgba(147,51,234,0.35)]"
              : `border border-white/10 text-white/70 hover:border-white/20 hover:text-white/90 hover:bg-white/[0.03]`
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {pass.status === "coming-soon" ? (
              <>
                <Lock className="size-3.5" />
                Coming Soon
              </>
            ) : (
              "Get This Pass"
            )}
          </span>
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Registration Modal (frontend-only) ─── */
function PassRegistrationModal({
  pass,
  onClose,
}: {
  pass: PassData;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative w-full max-w-md bg-euphoria-dark/95 border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Pass info */}
        <div className="text-center mb-6">
          <div className="mb-3 text-euphoria-gold/70 flex justify-center">{pass.icon}</div>
          <h3
            className="text-xl sm:text-2xl font-bold tracking-wider text-white/90"
            style={{ fontFamily: "var(--font-heading, inherit)" }}
          >
            {pass.name}
          </h3>
          <p className="text-sm text-white/55 mt-1">{pass.tagline}</p>
        </div>

        {/* Coming soon notice */}
        <div className="text-center py-8 border border-white/[0.06] rounded-xl bg-white/[0.015]">
          <Lock className="size-8 text-euphoria-gold/50 mx-auto mb-3" />
          <p className="text-sm font-medium tracking-wide text-white/65 mb-1">
            Pass Registration Coming Soon
          </p>
          <p className="text-xs text-white/40 max-w-xs mx-auto">
            Final pass details, pricing, and registration will be available soon.
            Follow us for updates.
          </p>
        </div>

        {/* Close CTA */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl border border-white/10 text-white/60 hover:text-white/80 hover:border-white/20 transition-all duration-300 text-sm font-medium tracking-wide"
        >
          Got It
        </button>
      </motion.div>
    </motion.div>
  );
}
