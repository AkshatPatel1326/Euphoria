import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Cinematic crowd/performer reveal — the emotional bridge between
 * the Euphoria hero identity and the rest of the site.
 *
 * Appears as the user scrolls past the hero, revealing the real
 * festival energy: a performer on stage with a sea of phone lights.
 */

const IMAGE = "/assets/Hero_page_image.jpeg";

export function CinematicReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  /* ---- scroll-linked visibility ---- */
  const inView = useInView(sectionRef, { amount: 0.15, once: false });

  /* ---- responsive text sizing ---- */
  const headingClasses =
    "text-[clamp(1.6rem,5vw,3.6rem)] font-black tracking-[0.06em] leading-[1.1] text-center";

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-euphoria-dark"
      style={{ minHeight: "clamp(340px, 85vw, 100vh)" }}
    >
      {/* ── background image with slow cinematic drift ── */}
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
            duration: reducedMotion ? 0.01 : 2.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: "50% 35%",
            filter: "saturate(1.15) brightness(0.75)",
          }}
        />

        {/* dark cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-euphoria-dark via-euphoria-dark/30 to-euphoria-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-euphoria-dark/50 via-transparent to-euphoria-dark/50" />

        {/* subtle Euphoria colour atmosphere */}
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(162,50,160,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(ellipse 40% 40% at 35% 55%, rgba(62,238,213,0.06) 0%, transparent 60%)",
          }}
        />

        {/* grain overlay */}
        <div className="noise-overlay absolute inset-0" />
      </div>

      {/* ── text layer ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[clamp(340px,85vw,100vh)] px-6 sm:px-10 text-center">
        {/* line 1 */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(8px)" }
          }
          transition={{ duration: reducedMotion ? 0.01 : 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className={`${headingClasses} text-white/15`}
        >
          THE LIGHTS COME ON.
        </motion.p>

        {/* line 2 */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(8px)" }
          }
          transition={{ duration: reducedMotion ? 0.01 : 0.9, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={`${headingClasses} text-white/20`}
        >
          THE CROWD ROARS.
        </motion.p>

        {/* line 3 — hero colour accent */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(8px)" }
          }
          transition={{ duration: reducedMotion ? 0.01 : 0.9, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className={`${headingClasses} bg-clip-text text-transparent bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua`}
        >
          EUPHORIA BEGINS.
        </motion.p>

        {/* subtle divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            inView
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: reducedMotion ? 0.01 : 1.0, delay: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 h-px w-32 sm:w-48 origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(175,153,71,0.4), rgba(162,50,160,0.4), rgba(23,111,99,0.4), transparent)",
          }}
        />
      </div>
    </section>
  );
}
