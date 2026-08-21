import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative pt-20 pb-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-darker" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(91, 27, 82, 0.15) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-14"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl font-bold tracking-widest text-euphoria-aqua">
                SAGE
              </span>
              <span className="text-xl font-light tracking-widest text-white/70">
                Euphoria
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-euphoria-gold/70 border border-euphoria-gold/25 rounded px-1.5 py-0.5">
                2026
              </span>
            </div>
            <p className="text-xs text-white/25 max-w-xs leading-relaxed">
              SAGE University&apos;s flagship annual festival of culture, innovation,
              and sport.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-xs text-white/30 tracking-[0.15em] uppercase hover:text-euphoria-aqua/70 transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Radio SAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-10 pb-8 border-b border-white/5"
        >
          <div className="w-8 h-8 rounded-full border border-euphoria-gold/25 flex items-center justify-center">
            <span className="text-[8px] font-bold text-euphoria-gold/50 tracking-wider">RS</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-gold/40">
              Radio SAGE — Official Media Partner
            </p>
          </div>
        </motion.div>

        {/* Contact placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs text-white/15 tracking-wider">
            Full contact details and social channels will be available ahead of the event.
          </p>
        </motion.div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-[10px] text-white/15 tracking-wider">
            &copy; 2026 SAGE Euphoria. All rights reserved.
          </p>
          <p className="text-[10px] text-white/10 tracking-wider">
            SAGE University
          </p>
        </div>
      </div>
    </footer>
  );
}
