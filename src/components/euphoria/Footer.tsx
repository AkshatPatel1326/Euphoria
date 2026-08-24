import { useRef } from "react";
import { useInView } from "framer-motion";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Marquee, MarqueeItem } from "@/components/magicui/marquee";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Contact", href: "#contact" },
];

/* ── Cinematic footer background ─────────────────────────────── */
function FooterBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-euphoria-darker" />

      {/* Deep plum glow — bottom center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(91, 27, 82, 0.15) 0%, transparent 60%)",
        }}
      />

      {/* Teal glow — bottom right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 80% 90%, rgba(23, 111, 99, 0.08) 0%, transparent 50%)",
        }}
      />

      {/* Purple atmospheric — left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 35% 40% at 15% 70%, rgba(162, 50, 160, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Subtle noise grain */}
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

/* ── Large background marquee typography ──────────────────────── */
function FooterMarquee() {
  const text = "EUPHORIA  ·  ";

  return (
    <div
      className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{ opacity: 0.02 }}
    >
      <Marquee speed={15} direction="left" pauseOnHover={false}>
        {Array.from({ length: 8 }).map((_, i) => (
          <MarqueeItem key={i}>
            <span
              className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black tracking-wider mx-0"
              style={{
                WebkitTextStroke: "1.5px rgba(162, 50, 160, 0.20)",
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

/* ── Animated gradient divider ────────────────────────────────── */
function GradientDivider() {
  return (
    <div className="relative w-full h-px mb-12 overflow-hidden">
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

/* ── Main Footer ─────────────────────────────────────────────── */
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
      className="relative pt-24 pb-8 overflow-hidden"
    >
      <FooterBackground />
      <FooterMarquee />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <GradientDivider />

        {/* Top section */}
        <BlurFade inViewMargin="-40px" className="mb-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl font-bold tracking-widest text-euphoria-aqua/60">
                  SAGE
                </span>
                <span className="text-xl font-light tracking-widest text-white/50">
                  Euphoria
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-euphoria-gold/50 border border-euphoria-gold/20 rounded px-1.5 py-0.5">
                  2026
                </span>
              </div>
              <p className="text-xs text-white/20 max-w-xs leading-relaxed">
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
                  className="relative text-xs text-white/25 tracking-[0.15em] uppercase transition-colors duration-300 hover:text-euphoria-aqua/70 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-euphoria-aqua/40 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>
          </div>
        </BlurFade>

        {/* Radio SAGE + SAGE University */}
        <BlurFade
          delay={0.15}
          inViewMargin="-40px"
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 pb-8 border-b border-white/[0.04]"
        >
          <div className="flex items-center gap-3">
            <img
              src="/assets/sponcers1.png"
              alt="Radio SAGE"
              className="w-7 h-7 object-contain rounded-full border border-euphoria-gold/15"
            />
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-gold/30">
              Radio SAGE — Official Media Partner
            </p>
          </div>
        </BlurFade>

        {/* Contact details — from brochure */}
        <BlurFade delay={0.25} inViewMargin="-40px" className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/15 font-semibold block mb-2">
                Contact
              </span>
              <p className="text-xs text-white/20 mb-1">
                sage.euphoria@sageuniversity.in
              </p>
              <p className="text-xs text-white/20">
                sponsorship@sageuniversity.in
              </p>
            </div>
            <div>
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/15 font-semibold block mb-2">
                Follow Us
              </span>
              <p className="text-xs text-white/20">
                Instagram: @sage.euphoria
              </p>
            </div>
          </div>
        </BlurFade>

        {/* University info */}
        <BlurFade delay={0.3} inViewMargin="-40px" className="mb-10 pb-8 border-b border-white/[0.04]">
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/12 font-semibold block mb-2">
            About SAGE University
          </span>
          <p className="text-[11px] text-white/12 leading-relaxed max-w-lg">
            Established in 2007, SAGE University Indore is NAAC A+ accredited and
            approved by UGC and AICTE, offering 131 programs across 14
            multidisciplinary institutes.
          </p>
        </BlurFade>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.04]">
          <p className="text-[10px] text-white/12 tracking-wider">
            &copy; 2026 SAGE Euphoria. All rights reserved.
          </p>
          <p className="text-[10px] text-white/8 tracking-wider">
            SAGE University, Indore
          </p>
        </div>
      </div>
    </footer>
  );
}
