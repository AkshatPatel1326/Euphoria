import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* All sponsor/partner logos uploaded to assets */
const sponsorLogos = [
  { src: "/assets/42.png", alt: "Partner" },
  { src: "/assets/44.png", alt: "Partner" },
  { src: "/assets/45.png", alt: "Partner" },
  { src: "/assets/46.png", alt: "Partner" },
  { src: "/assets/47.png", alt: "Partner" },
  { src: "/assets/48.png", alt: "Partner" },
  { src: "/assets/49.png", alt: "Partner" },
  { src: "/assets/50.png", alt: "Partner" },
  { src: "/assets/51.png", alt: "Partner" },
  { src: "/assets/52.png", alt: "Partner" },
  { src: "/assets/54.png", alt: "Partner" },
  { src: "/assets/56.png", alt: "Partner" },
  { src: "/assets/58.png", alt: "Partner" },
  { src: "/assets/59.png", alt: "Partner" },
  { src: "/assets/61.png", alt: "Partner" },
  { src: "/assets/62.png", alt: "Partner" },
];

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

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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

        {/* Euphoria + Radio SAGE — featured row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-16"
        >
          {/* SAGE Euphoria logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-euphoria-gold/15 bg-euphoria-gold/[0.03] p-2 flex items-center justify-center">
              <img
                src="/assets/2.png"
                alt="SAGE Euphoria logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/40">
                SAGE Euphoria 2026
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-16 bg-white/[0.06]" />
          <div className="sm:hidden w-16 h-px bg-white/[0.06]" />

          {/* Radio SAGE */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-euphoria-gold/15 bg-euphoria-gold/[0.03] p-2 flex items-center justify-center">
              <img
                src="/assets/sponcers1.png"
                alt="Radio SAGE logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-euphoria-gold/40">
                Official Media Partner
              </p>
              <p className="text-[10px] text-white/15 mt-1 tracking-wider">
                Radio SAGE
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sponsor logos grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <span className="text-[9px] tracking-[0.25em] uppercase text-white/15">
              Confirmed Partners
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
            {sponsorLogos.map((logo, i) => (
              <motion.div
                key={logo.src}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.03, duration: 0.4 }}
                className="group flex items-center justify-center aspect-square rounded-xl border border-white/[0.04] bg-white/[0.01] p-3 transition-all duration-300 hover:border-euphoria-gold/15 hover:bg-white/[0.03]"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-full h-full object-contain opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
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
