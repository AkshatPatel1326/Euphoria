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
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(91, 27, 82, 0.35) 0%, transparent 60%)",
        }}
      />

      {/* Purple atmospheric — left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 60%, rgba(162, 50, 160, 0.10) 0%, transparent 50%)",
        }}
      />

      {/* Teal glow — bottom right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 75% 70%, rgba(23, 111, 99, 0.15) 0%, transparent 50%)",
        }}
      />

      {/* Aqua accent — subtle top-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 30% 30% at 80% 20%, rgba(62, 238, 213, 0.03) 0%, transparent 40%)",
        }}
      />

      {/* Gold light orb — top left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 25% 25% at 15% 25%, rgba(175, 153, 71, 0.04) 0%, transparent 40%)",
        }}
      />

      {/* Light Rays — reduced intensity so logo dominates */}
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
          className={`absolute inset-0 w-full h-full object-cover opacity-[0.04] ${
            reducedMotion ? "" : "animate-float"
          }`}
          style={{ filter: "blur(3px) saturate(0.3)" }}
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

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        {/* ── Euphoria Logo — cinematic entrance ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, filter: "blur(16px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 1.5,
            delay: 0.3,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className="mb-4 sm:mb-6 relative"
        >
          <div className="relative">
            <img
              src="/assets/2.png"
              alt="SAGE Euphoria logo"
              className="w-56 h-56 sm:w-72 sm:h-72 md:w-[22rem] md:h-[22rem] lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] object-contain mx-auto drop-shadow-[0_0_120px_rgba(175,153,71,0.15)]"
            />

            {/* ── One-time light sweep across logo ── */}
            {!reducedMotion && (
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "200%", opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 1.6,
                  delay: 2.0,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 30%, rgba(175, 153, 71, 0.15) 45%, rgba(255, 255, 255, 0.08) 50%, rgba(62, 238, 213, 0.10) 55%, transparent 70%)",
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── Large written SAGE EUPHORIA typography ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.6,
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-5 sm:mb-6"
        >
          <span className="inline-block px-5 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/70 border border-euphoria-gold/20 rounded-full bg-euphoria-gold/[0.04]">
            2026 Edition
          </span>
        </motion.div>

        {/* Theme — Joy of Colours */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase"
        >
          <AnimatedGradientText
            gradient="linear-gradient(90deg, #AF9947, #A232A0, #176F63, #3EEED5, #AF9947)"
            speed={4}
          >
            Joy of Colours
          </AnimatedGradientText>
        </motion.p>

        {/* Subtext — authentic brochure messaging */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="mt-4 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/25 max-w-md"
        >
          Celebrating diversity, creativity, and the emotions that colours bring to life
        </motion.p>

        {/* CTAs — Magic UI ShimmerButton for primary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
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
        transition={{ delay: 2.5, duration: 1 }}
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
