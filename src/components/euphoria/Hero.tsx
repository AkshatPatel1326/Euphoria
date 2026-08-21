import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

function HeroParticles() {
  const particles = useMemo(() => {
    const seed = 42;
    let s = seed;
    const rand = () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 3 + 1,
      delay: rand() * 5,
      duration: rand() * 8 + 6,
      opacity: rand() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-euphoria-aqua/30 animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function HeroBackgroundImage() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* Faded fest background image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        className="relative w-full h-full"
      >
        <img
          src="/assets/images.jpg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover opacity-[0.07] ${
            reducedMotion ? "" : "animate-float"
          }`}
          style={{ filter: "blur(1px) saturate(0.6)" }}
        />
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-euphoria-dark via-transparent to-euphoria-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-euphoria-dark via-transparent to-euphoria-dark" />
      </motion.div>
    </div>
  );
}

function CTAButton({
  children,
  primary,
  onClick,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick: () => void;
}) {
  if (primary) {
    return (
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(62, 238, 213, 0.3)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="relative group px-8 py-4 bg-euphoria-aqua/10 border border-euphoria-aqua/50 text-euphoria-aqua font-semibold tracking-[0.15em] uppercase text-sm rounded-lg transition-all duration-300 hover:bg-euphoria-aqua/20 hover:border-euphoria-aqua/80 hover:text-white overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-euphoria-aqua/0 via-euphoria-aqua/10 to-euphoria-aqua/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="px-8 py-4 text-white/50 font-medium tracking-[0.1em] uppercase text-sm border border-white/10 rounded-lg transition-all duration-300 hover:text-white/80 hover:border-white/20"
    >
      {children}
    </motion.button>
  );
}

export function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise-overlay"
    >
      {/* Atmospheric backgrounds */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(91, 27, 82, 0.35) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 60%, rgba(23, 111, 99, 0.15) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 70% 30%, rgba(62, 238, 213, 0.06) 0%, transparent 50%)",
        }}
      />

      <HeroParticles />
      <HeroBackgroundImage />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        {/* SAGE Euphoria logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <img
              src="/assets/logo.png"
              alt="SAGE Euphoria 2026 logo"
              className="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 object-contain mx-auto drop-shadow-[0_0_40px_rgba(175,153,71,0.2)]"
            />
            <div className="absolute -inset-4 rounded-full border border-euphoria-aqua/10 animate-spin-slow pointer-events-none" />
          </div>
        </motion.div>

        {/* Year badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 text-[10px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-euphoria-gold/80 border border-euphoria-gold/25 rounded-full bg-euphoria-gold/5">
            2026 Edition
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]"
        >
          <span className="text-white">SAGE </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-purple via-euphoria-aqua to-euphoria-purple">
            Euphoria
          </span>
        </motion.h1>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl font-light tracking-[0.15em] uppercase text-white/70"
        >
          The Defining Campus Experience
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mt-3 text-xs sm:text-sm tracking-[0.25em] uppercase text-euphoria-gold/50"
        >
          Artistry &middot; Ambition &middot; Innovation &middot; Excellence
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-4"
        >
          <CTAButton primary onClick={() => scrollTo("#events")}>
            Explore Events
          </CTAButton>
          <CTAButton onClick={() => scrollTo("#about")}>
            About Euphoria
          </CTAButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-euphoria-aqua/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
