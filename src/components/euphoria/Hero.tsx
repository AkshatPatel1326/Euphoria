import { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
      {/* Deep base */}
      <div className="absolute inset-0 bg-euphoria-dark" />

      {/* Large plum glow — top center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(91, 27, 82, 0.4) 0%, transparent 60%)",
        }}
      />

      {/* Purple atmospheric — left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 60%, rgba(162, 50, 160, 0.15) 0%, transparent 50%)",
        }}
      />

      {/* Teal glow — bottom right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 75% 70%, rgba(23, 111, 99, 0.2) 0%, transparent 50%)",
        }}
      />

      {/* Aqua accent — subtle top-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 30% 30% at 80% 20%, rgba(62, 238, 213, 0.05) 0%, transparent 40%)",
        }}
      />

      {/* Gold light orb — top left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 25% 25% at 15% 25%, rgba(175, 153, 71, 0.06) 0%, transparent 40%)",
        }}
      />

      {/* Light Rays — atmospheric stage lighting */}
      <LightRays
        colors={[
          "rgba(162, 50, 160, 0.10)",
          "rgba(91, 27, 82, 0.12)",
          "rgba(23, 111, 99, 0.08)",
          "rgba(175, 153, 71, 0.05)",
          "rgba(62, 238, 213, 0.04)",
        ]}
        rayCount={16}
        opacity={0.4}
        speed={40}
      />

      {/* Faded fest background image */}
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
          className={`absolute inset-0 w-full h-full object-cover opacity-[0.05] ${
            reducedMotion ? "" : "animate-float"
          }`}
          style={{ filter: "blur(2px) saturate(0.4)" }}
        />
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-euphoria-dark/80 via-transparent to-euphoria-dark" />
      <div className="absolute inset-0 bg-gradient-to-r from-euphoria-dark/60 via-transparent to-euphoria-dark/60" />

      {/* Very subtle grain */}
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}

/* ── Magic UI Marquee typography ────────────────────────────── */
function MarqueeTypography() {
  const reducedMotion = useReducedMotion();
  const text = "SAGE EUPHORIA 2026  ·  ";

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
        style={{ opacity: 0.03 }}
      >
        <span
          className="text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[5vw] font-black tracking-wider whitespace-nowrap"
          style={{
            WebkitTextStroke: "1px rgba(162, 50, 160, 0.3)",
            color: "transparent",
            textShadow: "0 0 40px rgba(162, 50, 160, 0.08)",
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
      style={{ opacity: 0.04 }}
    >
      <Marquee speed={45} direction="left" pauseOnHover={false}>
        {Array.from({ length: 6 }).map((_, i) => (
          <MarqueeItem key={i}>
            <span
              className="text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[5vw] font-black tracking-wider mx-0"
              style={{
                WebkitTextStroke: "1px rgba(162, 50, 160, 0.3)",
                color: "transparent",
                textShadow: "0 0 40px rgba(162, 50, 160, 0.08)",
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
        className={`w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[520px] md:h-[520px] rounded-full border border-euphoria-purple/[0.06] ${
          reducedMotion ? "" : "animate-spin-slow"
        }`}
        style={{ animationDuration: "40s" }}
      >
        {/* Dot on orbit */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-euphoria-aqua/30" />
      </div>
      {/* Inner orbit */}
      <div
        className={`absolute w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] rounded-full border border-euphoria-gold/[0.05] ${
          reducedMotion ? "" : "animate-spin-slow"
        }`}
        style={{ animationDuration: "55s", animationDirection: "reverse" }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full bg-euphoria-gold/25" />
      </div>
    </div>
  );
}

/* ── Main Hero ──────────────────────────────────────────────── */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

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

      {/* Magic UI Particles — subtle floating lights */}
      <Particles
        count={30}
        colors={[
          "rgba(62, 238, 213, 0.20)",
          "rgba(175, 153, 71, 0.18)",
          "rgba(162, 50, 160, 0.12)",
          "rgba(23, 111, 99, 0.15)",
        ]}
        maxSize={2.5}
        speed={0.8}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        {/* Euphoria Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <div className="relative">
            <img
              src="/assets/2.png"
              alt="SAGE Euphoria logo"
              className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain mx-auto drop-shadow-[0_0_60px_rgba(175,153,71,0.15)]"
            />
          </div>
        </motion.div>

        {/* Year badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-5 sm:mb-6"
        >
          <span className="inline-block px-5 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/70 border border-euphoria-gold/20 rounded-full bg-euphoria-gold/[0.04]">
            2026 Edition
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9]"
        >
          <span className="text-white">SAGE </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua">
            Euphoria
          </span>
        </motion.h1>

        {/* Headline — Magic UI Animated Gradient Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase"
        >
          <AnimatedGradientText
            gradient="linear-gradient(90deg, #A232A0, #AF9947, #176F63, #3EEED5, #A232A0)"
            speed={4}
          >
            Where Culture Meets Competition
          </AnimatedGradientText>
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-3 text-[11px] sm:text-xs tracking-[0.3em] uppercase text-euphoria-gold/40"
        >
          Dance &middot; Music &middot; Ideas &middot; Innovation &middot; Sport
        </motion.p>

        {/* CTAs — Magic UI ShimmerButton for primary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
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
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
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
