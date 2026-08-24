import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { LightRays } from "@/components/magicui/light-rays";
import { Particles } from "@/components/magicui/particles";
import { Marquee, MarqueeItem } from "@/components/magicui/marquee";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

/* ── Cinematic animated background ──────────────────────────── */
function HeroBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(91, 27, 82, 0.35) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 60%, rgba(162, 50, 160, 0.10) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 75% 70%, rgba(23, 111, 99, 0.15) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 30% 30% at 80% 20%, rgba(62, 238, 213, 0.03) 0%, transparent 40%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 25% 25% at 15% 25%, rgba(175, 153, 71, 0.04) 0%, transparent 40%)",
        }}
      />
      <LightRays
        colors={[
          "rgba(162, 50, 160, 0.06)",
          "rgba(91, 27, 82, 0.08)",
          "rgba(23, 111, 99, 0.05)",
          "rgba(175, 153, 71, 0.03)",
          "rgba(62, 238, 213, 0.02)",
        ]}
        rayCount={14}
        opacity={0.3}
        speed={45}
      />
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src="/assets/images.jpg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover opacity-[0.04] ${
            reducedMotion ? "" : "animate-float"
          }`}
          style={{ filter: "blur(3px) saturate(0.3)" }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-euphoria-dark/80 via-transparent to-euphoria-dark" />
      <div className="absolute inset-0 bg-gradient-to-r from-euphoria-dark/60 via-transparent to-euphoria-dark/60" />
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}

/* ── "JOY OF COLOURS" cinematic reveal ─────────────────────── */
function ColourReveal({ phase }: { phase: number }) {
  const reducedMotion = useReducedMotion();

  /* phase 0 = waiting, 1 = appearing, 2 = holding, 3 = fading out */
  const show = phase >= 1 && phase <= 3;

  const textOpacity =
    phase === 0
      ? 0
      : phase === 1
        ? 1
        : phase === 2
          ? 1
          : 0;

  const textScale =
    phase === 0
      ? 0.88
      : phase === 1
        ? 1
        : phase === 2
          ? 1
          : 0.96;

  const textBlur =
    phase === 0
      ? "blur(14px)"
      : phase === 1
        ? "blur(0px)"
        : phase === 2
          ? "blur(0px)"
          : "blur(8px)";

  const textTransition =
    phase === 1
      ? "all 1.4s cubic-bezier(0.22, 0.61, 0.36, 1)"
      : phase === 3
        ? "all 0.8s ease-in"
        : "all 0.3s ease";

  /* Colour glows — converge during phase 1–2, dissipate in phase 3 */
  const glowOpacity = phase === 0 ? 0 : phase === 3 ? 0 : 1;
  const glowTransition =
    phase === 1
      ? "opacity 2s ease-out"
      : phase === 3
        ? "opacity 0.8s ease-in"
        : "opacity 0.3s ease";

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" aria-hidden="true">
      {/* Flowing colour glows behind the text */}
      <div
        className="absolute inset-0"
        style={{ opacity: glowOpacity, transition: glowTransition }}
      >
        {/* Gold — bottom-left drift */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            left: "25%",
            top: "35%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(175,153,71,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Purple — center-right */}
        <motion.div
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 25, -20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute"
          style={{
            right: "20%",
            top: "30%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(162,50,160,0.16) 0%, transparent 70%)",
            filter: "blur(65px)",
          }}
        />
        {/* Teal — top-left */}
        <motion.div
          animate={{
            x: [0, 30, -15, 0],
            y: [0, -20, 35, 0],
            scale: [1, 1.05, 0.92, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute"
          style={{
            left: "15%",
            top: "25%",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(23,111,99,0.15) 0%, transparent 70%)",
            filter: "blur(55px)",
          }}
        />
        {/* Aqua — right */}
        <motion.div
          animate={{
            x: [0, -25, 30, 0],
            y: [0, 30, -10, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute"
          style={{
            right: "30%",
            bottom: "30%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(62,238,213,0.12) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        {/* Magenta — center */}
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -25, 15, 0],
            scale: [1, 0.95, 1.12, 1],
          }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute"
          style={{
            left: "40%",
            top: "40%",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(180,40,140,0.10) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* "JOY OF COLOURS" text */}
      <div
        style={{
          opacity: textOpacity,
          transform: `scale(${textScale})`,
          filter: textBlur,
          transition: textTransition,
        }}
        className="text-center select-none"
      >
        <span className="block text-[8vw] sm:text-[6.5vw] md:text-[5vw] lg:text-[4vw] font-black tracking-[0.12em] text-white/80">
          JOY OF
        </span>
        <span className="block text-[12vw] sm:text-[10vw] md:text-[7.5vw] lg:text-[6vw] font-black tracking-[0.08em] bg-clip-text text-transparent bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua">
          COLOURS
        </span>
        <span className="block mt-3 text-[9px] sm:text-[10px] tracking-[0.5em] uppercase text-white/15">
          SAGE Euphoria 2026
        </span>
      </div>
    </div>
  );
}

/* ── Oversized background marquee typography ──────────────────── */
function MarqueeTypography() {
  const reducedMotion = useReducedMotion();
  const text = "SAGE EUPHORIA  ·  ";

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
        style={{ opacity: 0.03 }}
      >
        <span
          className="text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] font-black tracking-wider whitespace-nowrap"
          style={{
            WebkitTextStroke: "2px rgba(162, 50, 160, 0.20)",
            color: "transparent",
            textShadow: "0 0 80px rgba(162, 50, 160, 0.05)",
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{ opacity: 0.035 }}
    >
      <Marquee speed={40} direction="left" pauseOnHover={false}>
        {Array.from({ length: 8 }).map((_, i) => (
          <MarqueeItem key={i}>
            <span
              className="text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] font-black tracking-wider mx-0"
              style={{
                WebkitTextStroke: "2px rgba(162, 50, 160, 0.22)",
                color: "transparent",
                textShadow: "0 0 100px rgba(162, 50, 160, 0.06)",
              }}
            >
              {text}
            </span>
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  );
}

/* ── Orbital decorative ring ────────────────────────────────── */
function OrbitalRing() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      <div
        className={`w-[450px] h-[450px] sm:w-[560px] sm:h-[560px] md:w-[700px] md:h-[700px] lg:w-[850px] lg:h-[850px] rounded-full border border-euphoria-purple/[0.04] ${
          reducedMotion ? "" : "animate-spin-slow"
        }`}
        style={{ animationDuration: "40s" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-euphoria-aqua/25" />
      </div>
      <div
        className={`absolute w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[540px] md:h-[540px] lg:w-[660px] lg:h-[660px] rounded-full border border-euphoria-gold/[0.04] ${
          reducedMotion ? "" : "animate-spin-slow"
        }`}
        style={{ animationDuration: "55s", animationDirection: "reverse" }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full bg-euphoria-gold/20" />
      </div>
    </div>
  );
}

/* ── Main Hero ──────────────────────────────────────────────── */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  /* 0 = initial dark, 1 = colour reveal appearing, 2 = holding, 3 = fading to hero */
  const [introPhase, setIntroPhase] = useState<number>(() =>
    reducedMotion ? 3 : 0
  );

  useEffect(() => {
    if (reducedMotion) return;

    /* Phase 0→1: "JOY OF COLOURS" appears (starts after 0.3s) */
    const t1 = setTimeout(() => setIntroPhase(1), 300);
    /* Phase 1→2: hold (after 1.7s from phase 1) */
    const t2 = setTimeout(() => setIntroPhase(2), 2000);
    /* Phase 2→3: transition to hero (after 0.8s hold) */
    const t3 = setTimeout(() => setIntroPhase(3), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reducedMotion]);

  const heroReady = introPhase >= 3;

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <HeroBackground />
      <MarqueeTypography />
      <OrbitalRing />

      {/* Magic UI Particles */}
      <Particles
        count={25}
        colors={[
          "rgba(62, 238, 213, 0.18)",
          "rgba(175, 153, 71, 0.15)",
          "rgba(162, 50, 160, 0.10)",
          "rgba(23, 111, 99, 0.12)",
        ]}
        maxSize={2}
        speed={0.6}
      />

      {/* ── Cinematic Intro: JOY OF COLOURS ── */}
      <ColourReveal phase={introPhase} />

      {/* ── Main content — revealed after intro ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        {/* ── Large written SAGE EUPHORIA typography ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={
            heroReady
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.92, y: 15 }
          }
          transition={{
            duration: 1.0,
            delay: heroReady ? 0.5 : 0,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-5 sm:mb-7 w-full"
        >
          <h1 className="leading-[0.85] tracking-tight">
            <span className="block text-[12vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7vw] font-black text-white/90">
              SAGE
            </span>
            <span className="block text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua">
              Euphoria
            </span>
          </h1>
        </motion.div>

        {/* Year badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: heroReady ? 0.8 : 0 }}
          className="mb-5 sm:mb-6"
        >
          <span className="inline-block px-5 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/70 border border-euphoria-gold/20 rounded-full bg-euphoria-gold/[0.04]">
            2026 Edition
          </span>
        </motion.div>

        {/* Theme — Joy of Colours */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: heroReady ? 1.0 : 0 }}
          className="text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase"
        >
          <AnimatedGradientText
            gradient="linear-gradient(90deg, #AF9947, #A232A0, #176F63, #3EEED5, #AF9947)"
            speed={4}
          >
            Joy of Colours
          </AnimatedGradientText>
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={heroReady ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: heroReady ? 1.2 : 0 }}
          className="mt-4 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/25 max-w-md"
        >
          Celebrating diversity, creativity, and the emotions that colours bring to life
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: heroReady ? 1.4 : 0 }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-4"
        >
          <ShimmerButton
            shimmerColor="rgba(62, 238, 213, 0.35)"
            shimmerDuration="3s"
            background="rgba(62, 238, 213, 0.08)"
            className="px-8 sm:px-10 py-3.5 sm:py-4"
            onClick={() => scrollTo("#events")}
          >
            <span className="text-euphoria-aqua font-semibold tracking-[0.2em] uppercase text-xs sm:text-sm">
              Explore Events
            </span>
          </ShimmerButton>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo("#about")}
            className="px-8 sm:px-10 py-3.5 sm:py-4 text-white/40 font-medium tracking-[0.15em] uppercase text-xs sm:text-sm border border-white/10 rounded-lg transition-all duration-300 hover:text-white/70 hover:border-white/20 hover:bg-white/[0.02]"
          >
            Discover Euphoria
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={heroReady ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: heroReady ? 2.2 : 0, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.35em] uppercase text-white/15">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-euphoria-aqua/40"
          />
        </div>
      </motion.div>
    </section>
  );
}
