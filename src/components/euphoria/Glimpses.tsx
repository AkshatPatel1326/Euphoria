import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BlurFade } from "@/components/magicui/blur-fade";

export function Glimpses() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="glimpses"
      ref={sectionRef}
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(91, 27, 82, 0.10) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 70% 70%, rgba(23, 111, 99, 0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <BlurFade inViewMargin="-100px" className="mb-10 sm:mb-14 text-center">
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/50 mb-4">
            Past Editions — 2023 · 2024 · 2025
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
            <span className="text-white">Glimpses of </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-purple via-euphoria-gold to-euphoria-aqua">
              Euphoria
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-white/30 max-w-xl mx-auto leading-relaxed">
            Experience the energy, creativity, and unforgettable moments that define Euphoria.
          </p>
        </BlurFade>

        {/* Video feature area */}
        <BlurFade delay={0.2} inViewMargin="-60px">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
            animate={
              inView
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : {}
            }
            transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
            className="relative w-full aspect-video max-h-[600px] rounded-2xl overflow-hidden border border-white/[0.06] group cursor-pointer"
          >
            {/* Video / Placeholder */}
            {/* If a video asset exists, replace the placeholder div below with:
                <video auto muted loop playsInline className="w-full h-full object-cover" src="/assets/past-euphoria.mp4" />
            */}
            <div className="absolute inset-0 bg-gradient-to-br from-euphoria-plum/40 via-euphoria-darker to-euphoria-teal/30" />

            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(162,50,160,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(162,50,160,0.3) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            {/* Atmospheric glow */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(162,50,160,0.08) 0%, transparent 60%)",
              }}
            />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/15 flex items-center justify-center bg-white/[0.03] backdrop-blur-sm group-hover:border-euphoria-aqua/30 group-hover:bg-white/[0.06] transition-all duration-500"
              >
                <div className="w-0 h-0 border-l-[12px] border-l-white/60 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1.5 group-hover:border-l-euphoria-aqua/80 transition-colors duration-500" />
              </motion.div>
            </div>

            {/* Overlay text */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 sm:p-8">
              <div className="text-center">
                <span className="block text-[10px] sm:text-[11px] tracking-[0.5em] uppercase text-white/15 font-semibold mb-2">
                  Past Euphoria
                </span>
                <span className="block text-[9px] tracking-[0.3em] uppercase text-white/10">
                  Video Coming Soon
                </span>
              </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-euphoria-dark/70 to-transparent" />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-white/[0.06] rounded-tl-sm" />
            <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-white/[0.06] rounded-tr-sm" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-white/[0.06] rounded-bl-sm" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-white/[0.06] rounded-br-sm" />
          </motion.div>
        </BlurFade>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-purple/10 to-transparent" />
    </section>
  );
}
