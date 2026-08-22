import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ReliveTheEnergy() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-darker" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(162, 50, 160, 0.08) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-aqua/50 mb-4">
            Relive the Energy
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white/80">
            The Moments That Made Euphoria.
          </h2>
        </motion.div>

        {/* Media placeholder — cinematic dark frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/[0.06]"
        >
          {/* Cinematic gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-euphoria-plum/30 via-euphoria-dark to-euphoria-teal/10" />

          {/* Abstract shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 rounded-full border border-white/[0.04]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-white/[0.06]" />
            {/* Play icon placeholder */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/10 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[10px] sm:border-t-[12px] border-t-transparent border-b-[10px] sm:border-b-[12px] border-b-transparent border-l-[16px] sm:border-l-[18px] border-l-white/20 ml-1" />
            </div>
          </div>

          {/* Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/15 mb-2">
              Past Euphoria
            </span>
            <span className="text-sm sm:text-base tracking-[0.2em] uppercase text-white/10 font-semibold">
              Media Coming Soon
            </span>
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-euphoria-dark/60 via-transparent to-euphoria-dark/40" />

          {/* Top-left and bottom-right accent lines */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-white/10 rounded-tl-sm" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-white/10 rounded-br-sm" />
        </motion.div>
      </div>

      {/* Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-purple/10 to-transparent" />
    </section>
  );
}
