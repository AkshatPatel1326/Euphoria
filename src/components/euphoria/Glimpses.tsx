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
            {/* YouTube embed */}
            <div className="absolute inset-0 bg-black">
              <iframe
                src="https://www.youtube.com/embed/O8MIClJWYr4?rel=0&modestbranding=1&color=white"
                title="Glimpses of Euphoria"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-euphoria-dark/50 to-transparent pointer-events-none z-10" />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-white/[0.06] rounded-tl-sm pointer-events-none z-10" />
            <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-white/[0.06] rounded-tr-sm pointer-events-none z-10" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-white/[0.06] rounded-bl-sm pointer-events-none z-10" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-white/[0.06] rounded-br-sm pointer-events-none z-10" />
          </motion.div>
        </BlurFade>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-purple/10 to-transparent" />
    </section>
  );
}
