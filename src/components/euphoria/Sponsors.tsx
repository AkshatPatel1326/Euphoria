import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const placeholderSponsors = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  label: `Sponsor ${i + 1}`,
}));

export function Sponsors() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="sponsors" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 80%, rgba(23, 111, 99, 0.1) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-euphoria-aqua/70 border border-euphoria-aqua/20 rounded-full px-4 py-1.5 bg-euphoria-aqua/5 mb-6">
            Partners &amp; Sponsors
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Our Partners
          </h2>
          <p className="mt-4 text-sm text-white/30 max-w-md mx-auto">
            SAGE Euphoria is made possible by the support of our valued partners.
          </p>
        </motion.div>

        {/* Radio SAGE — featured partner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-14"
        >
          <div className="glass-card rounded-2xl px-10 py-8 flex flex-col items-center gap-4 max-w-xs transition-all duration-300 hover:border-euphoria-gold/25">
            {/* Radio SAGE logo placeholder */}
            <div className="w-20 h-20 rounded-full border-2 border-euphoria-gold/30 flex items-center justify-center bg-euphoria-gold/5">
              <div className="text-center">
                <div className="text-lg font-black text-euphoria-gold tracking-wider leading-none">
                  RADIO
                </div>
                <div className="text-[10px] font-bold tracking-[0.3em] text-euphoria-gold/60 mt-0.5">
                  SAGE
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-euphoria-gold/70">
                Official Media Partner
              </p>
              <p className="text-[10px] text-white/25 mt-1 tracking-wider">
                Radio SAGE
              </p>
            </div>
          </div>
        </motion.div>

        {/* Placeholder sponsor grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {placeholderSponsors.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
              className="group flex items-center justify-center aspect-[4/3] rounded-xl border border-dashed border-white/8 text-white/15 hover:border-white/15 hover:text-white/25 transition-all duration-300"
            >
              <span className="text-[10px] tracking-[0.15em] uppercase">{s.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-[10px] text-white/15 tracking-wider"
        >
          For partnership inquiries, please reach out to the organizing committee.
        </motion.p>
      </div>

      {/* Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-purple/15 to-transparent" />
    </section>
  );
}
