import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function Sponsors() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="sponsors" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 80%, rgba(175, 153, 71, 0.06) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/40 mb-4">
            Supported By
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white/80">
            Our Partners
          </h2>
          <p className="mt-4 text-sm text-white/25 max-w-md mx-auto">
            SAGE Euphoria is made possible through the valued support of our
            partners.
          </p>
        </motion.div>

        {/* Radio SAGE — featured partner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-14"
        >
          <div className="flex flex-col items-center gap-4 px-12 py-8 rounded-2xl border border-white/[0.04] bg-white/[0.01] transition-all duration-300 hover:border-euphoria-gold/15">
            <img
              src="/assets/sponcers1.png"
              alt="Radio SAGE logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border border-euphoria-gold/20 bg-euphoria-gold/[0.03] p-1.5"
            />
            <div className="text-center">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-euphoria-gold/50">
                Official Media Partner
              </p>
              <p className="text-[10px] text-white/15 mt-1 tracking-wider">
                Radio SAGE
              </p>
            </div>
          </div>
        </motion.div>

        {/* Future partner slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center aspect-[3/2] rounded-xl border border-dashed border-white/[0.05] text-white/10 transition-all duration-300 hover:border-white/[0.08] hover:text-white/15"
            >
              <span className="text-[9px] tracking-[0.15em] uppercase">
                To Be Announced
              </span>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 text-[10px] text-white/12 tracking-wider"
        >
          For partnership inquiries, please reach out to the organizing
          committee.
        </motion.p>
      </div>

      {/* Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-gold/[0.06] to-transparent" />
    </section>
  );
}
