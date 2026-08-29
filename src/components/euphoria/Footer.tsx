import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Marquee, MarqueeItem } from "@/components/magicui/marquee";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "FAQ", href: "#faq" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Contact", href: "#contact" },
];

/* ── Closing statement lines ──────────────────────────────── */
const closingLines = [
  { text: "MORE HUES.", delay: 0 },
  { text: "MORE PASSION.", delay: 0.25 },
  { text: "MORE POWER.", delay: 0.5 },
];

/* ── Cinematic background ─────────────────────────────────── */
function FooterBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-euphoria-darker" />

      {/* Deep plum glow — bottom center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 100%, rgba(91,27,82,0.18) 0%, transparent 55%)",
        }}
      />

      {/* Teal glow — bottom right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 35% 30% at 80% 90%, rgba(23,111,99,0.10) 0%, transparent 50%)",
        }}
      />

      {/* Purple atmospheric — left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 30% 35% at 15% 70%, rgba(162,50,160,0.06) 0%, transparent 50%)",
        }}
      />

      {/* Gold accent — center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 25% 20% at 50% 60%, rgba(175,153,71,0.04) 0%, transparent 40%)",
        }}
      />

      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

/* ── Large background marquee ─────────────────────────────── */
function FooterMarquee() {
  const text = "EUPHORIA  ·  ";

  return (
    <div
      className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{ opacity: 0.025 }}
    >
      <Marquee speed={12} direction="left" pauseOnHover={false}>
        {Array.from({ length: 8 }).map((_, i) => (
          <MarqueeItem key={i}>
            <span
              className="text-[11vw] sm:text-[9vw] md:text-[7.5vw] font-black tracking-wider mx-0"
              style={{
                WebkitTextStroke: "1.5px rgba(162, 50, 160, 0.22)",
                color: "transparent",
                textShadow: "0 0 60px rgba(162, 50, 160, 0.04)",
              }}
            >
              {text}
            </span>
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  );
}

/* ── Animated gradient divider ─────────────────────────────── */
function GradientDivider() {
  return (
    <div className="relative w-full h-px mb-14 overflow-hidden">
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(162,50,160,0.3), rgba(175,153,71,0.4), rgba(23,111,99,0.3), transparent)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}

/* ── Main Footer ──────────────────────────────────────────── */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const inView = useInView(footerRef, { once: true, margin: "-80px" });

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative overflow-hidden"
    >
      <FooterBackground />
      <FooterMarquee />

      {/* ═══ CINEMATIC CLOSING STATEMENT ═══════════════════════ */}
      <div className="relative z-10 flex flex-col items-center justify-center py-28 sm:py-36 lg:py-44">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {closingLines.map((line, i) => (
            <motion.div
              key={line.text}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={
                inView
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 20, filter: "blur(8px)" }
              }
              transition={{
                duration: 0.8,
                delay: 0.3 + line.delay,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <span
                className="block font-black tracking-[0.08em] text-center"
                style={{
                  fontSize: "clamp(1.8rem, 5.5vw, 4.5rem)",
                  background:
                    i === 0
                      ? "linear-gradient(90deg, #AF9947, #d4af37)"
                      : i === 1
                        ? "linear-gradient(90deg, #A232A0, #c94dc9)"
                        : "linear-gradient(90deg, #176F63, #3EEED5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {line.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Subtle atmospheric glow behind closing text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-[400px] h-[300px] sm:w-[600px] sm:h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(162,50,160,0.06) 0%, rgba(175,153,71,0.04) 40%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>
      </div>

      {/* ═══ MINIMAL PRACTICAL FOOTER ═════════════════════════ */}
      <div className="relative z-10 mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <GradientDivider />

        {/* Top section */}
        <BlurFade inViewMargin="-40px" className="mb-12">            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg font-bold tracking-widest text-euphoria-aqua/50">
                  SAGE
                </span>
                <span className="text-lg font-light tracking-widest text-white/35">
                  Euphoria
                </span>
                <span className="text-[8px] font-semibold tracking-wider text-euphoria-gold/35 border border-euphoria-gold/15 rounded px-1.5 py-0.5">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-white/20 max-w-xs leading-relaxed">
                SAGE University Indore&apos;s flagship annual festival — a
                three-day celebration of culture, innovation, and sport.
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="relative text-[11px] text-white/25 tracking-[0.15em] uppercase transition-colors duration-300 hover:text-euphoria-aqua/70 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-euphoria-aqua/30 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>
          </div>
        </BlurFade>

        {/* Contact */}
        <BlurFade delay={0.2} inViewMargin="-40px" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <span className="text-[8px] tracking-[0.3em] uppercase text-white/30 font-semibold block mb-2">
                Contact
              </span>
              <p className="text-[11px] text-white/20 mb-0.5">
                sage.euphoria@sageuniversity.in
              </p>
              <p className="text-[11px] text-white/20">
                sponsorship@sageuniversity.in
              </p>
            </div>
            <div>
              <span className="text-[8px] tracking-[0.3em] uppercase text-white/30 font-semibold block mb-2">
                Follow Us
              </span>
              <p className="text-[11px] text-white/20">
                Instagram: @sage.euphoria
              </p>
            </div>
          </div>
        </BlurFade>

        {/* University info */}
        <BlurFade delay={0.25} inViewMargin="-40px" className="mb-8 pb-6 border-b border-white/[0.03]">
          <span className="text-[8px] tracking-[0.3em] uppercase text-white/30 font-semibold block mb-2">
            About SAGE University
          </span>
          <p className="text-[10px] text-white/20 leading-relaxed max-w-lg">
            Established in 2007, SAGE University Indore is NAAC A+ accredited and
            approved by UGC and AICTE, offering 131 programs across 14
            multidisciplinary institutes.
          </p>
        </BlurFade>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-white/[0.03]">
          <p className="text-[9px] text-white/15 tracking-wider">
            &copy; 2026 SAGE Euphoria. All rights reserved.
          </p>
          <p className="text-[9px] text-white/15 tracking-wider">
            SAGE University, Indore
          </p>
        </div>
      </div>
    </footer>
  );
}
