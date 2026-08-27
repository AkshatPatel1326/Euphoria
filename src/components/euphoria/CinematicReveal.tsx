import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Cinematic crowd/performer reveal.
 *
 * Placed between Hero and About, this section creates the emotional
 * moment where Euphoria "comes alive" — the viewer scrolls past
 * the dark identity reveal and suddenly sees the real festival:
 * a performer on stage with a sea of phone lights.
 */

const IMAGE = "/assets/Hero_page_image.jpeg";

export function CinematicReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.2, once: false });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-euphoria-dark"
      style={{ height: "clamp(60vh, 85vw, 100vh)" }}
    >
      {/* ── background image ── */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={IMAGE}
          alt=""
          aria-hidden="true"
          loading="lazy"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={
            inView
              ? { scale: 1.0, opacity: 1 }
              : { scale: 1.12, opacity: 0 }
          }
          transition={{
            duration: reducedMotion ? 0.01 : 2.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: "50% 35%",
            filter: "saturate(1.2) brightness(0.72)",
          }}
        />

        {/* seamless fade from hero (top) into image */}
        <div className="absolute inset-0 bg-gradient-to-b from-euphoria-dark via-transparent to-euphoria-dark" />
        {/* side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-euphoria-dark/40 via-transparent to-euphoria-dark/40" />

        {/* subtle Euphoria colour wash */}
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(162,50,160,0.10) 0%, transparent 70%)",
          }}
        />

        {/* grain */}
        <div className="noise-overlay absolute inset-0" />
      </div>

      {/* ── minimal text overlay ── */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 16, filter: "blur(6px)" }
          }
          transition={{
            duration: reducedMotion ? 0.01 : 1.0,
            delay: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="text-[clamp(1.8rem,5.5vw,4rem)] font-black tracking-[0.08em] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua select-none"
        >
          EUPHORIA BEGINS.
        </motion.p>
      </div>
    </section>
  );
}
