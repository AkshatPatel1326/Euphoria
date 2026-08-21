import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const highlights = [
  { value: "40+", label: "Events" },
  { value: "4", label: "Categories" },
  { value: "∞", label: "Energy" },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 50%, rgba(91, 27, 82, 0.2) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 20% 70%, rgba(23, 111, 99, 0.1) 0%, transparent 50%)",
        }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-euphoria-aqua/70 border border-euphoria-aqua/20 rounded-full px-4 py-1.5 bg-euphoria-aqua/5">
            About
          </span>
        </motion.div>

        {/* Main text */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-start">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]"
            >
              <span className="text-white">Not just a fest.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-purple to-euphoria-aqua">
                A tradition.
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 space-y-4"
            >
              <p className="text-base sm:text-lg text-white/50 leading-relaxed font-light">
                SAGE Euphoria is the flagship annual celebration at SAGE University — a
                convergence of artistic expression, intellectual competition, and athletic
                excellence that defines the campus experience.
              </p>
              <p className="text-base sm:text-lg text-white/50 leading-relaxed font-light">
                Across four disciplines — Cultural, Literary &amp; Management,
                Science &amp; Technology, and Sports — Euphoria assembles the most
                talented, driven, and creative individuals for a multi-day program that
                sets the standard for collegiate festivals.
              </p>
              <p className="text-base sm:text-lg text-white/50 leading-relaxed font-light">
                This is where ambition meets the stage.
              </p>
            </motion.div>
          </div>

          {/* Stats / decorative side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="group glass-card rounded-xl px-6 py-5 flex items-center gap-5 transition-all duration-300 hover:border-euphoria-aqua/30"
              >
                <span className="text-3xl sm:text-4xl font-black text-euphoria-aqua/80 group-hover:text-euphoria-aqua transition-colors min-w-[80px]">
                  {h.value}
                </span>
                <span className="text-sm tracking-[0.2em] uppercase text-white/40 font-medium">
                  {h.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-purple/20 to-transparent" />
    </section>
  );
}
