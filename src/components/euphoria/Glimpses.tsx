import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";

/* ── Media placeholder data ──────────────────────────────────── */
const mediaItems = [
  {
    id: "past",
    label: "PAST EDITIONS",
    sublabel: "Moments from previous years",
    gradient: "from-euphoria-plum/60 via-euphoria-purple/40 to-euphoria-dark",
    glowColor: "rgba(162, 50, 160, 0.10)",
    accentColor: "#A232A0",
  },
  {
    id: "stage",
    label: "ON THE STAGE",
    sublabel: "Performances that captivated thousands",
    gradient: "from-euphoria-teal/50 via-euphoria-aqua/25 to-euphoria-dark",
    glowColor: "rgba(23, 111, 99, 0.10)",
    accentColor: "#176F63",
  },
  {
    id: "students",
    label: "STUDENT MOMENTS",
    sublabel: "The energy of the crowd",
    gradient: "from-euphoria-gold/30 via-euphoria-plum/20 to-euphoria-dark",
    glowColor: "rgba(175, 153, 71, 0.08)",
    accentColor: "#AF9947",
  },
  {
    id: "behind",
    label: "BEHIND THE SCENES",
    sublabel: "The making of Euphoria",
    gradient: "from-euphoria-purple/40 via-euphoria-teal/20 to-euphoria-dark",
    glowColor: "rgba(162, 50, 160, 0.06)",
    accentColor: "#A232A0",
  },
  {
    id: "faculty",
    label: "FACULTY MOMENTS",
    sublabel: "Guidance and celebration",
    gradient: "from-euphoria-gold/25 via-euphoria-aqua/12 to-euphoria-dark",
    glowColor: "rgba(175, 153, 71, 0.06)",
    accentColor: "#AF9947",
  },
];

/* ── Individual media frame ──────────────────────────────────── */
function MediaFrame({
  item,
  className,
  delay,
  large,
}: {
  item: (typeof mediaItems)[number];
  className: string;
  delay: number;
  large?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={className}>
      <BlurFade delay={delay} duration={0.9} yOffset={40} inViewMargin="-80px">
        <div
          className={`relative h-full min-h-[200px] ${large ? "sm:min-h-[340px] lg:min-h-[420px]" : "sm:min-h-[240px] lg:min-h-[280px]"} rounded-2xl overflow-hidden group cursor-pointer`}
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />

          {/* Atmospheric radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${item.glowColor} 0%, transparent 65%)`,
            }}
          />

          {/* Subtle grain texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Abstract geometric accent */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Thin diagonal line */}
            <div
              className="absolute w-[200%] h-px opacity-[0.06] rotate-[25deg] origin-center"
              style={{
                background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
                top: large ? "35%" : "40%",
                left: "-50%",
              }}
            />
            {/* Second thin line */}
            <div
              className="absolute w-[200%] h-px opacity-[0.04] rotate-[-15deg] origin-center"
              style={{
                background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
                top: large ? "60%" : "65%",
                left: "-50%",
              }}
            />
            {/* Corner brackets */}
            <div
              className="absolute top-4 left-4 w-6 h-6 border-l border-t opacity-[0.08] rounded-tl-sm"
              style={{ borderColor: item.accentColor }}
            />
            <div
              className="absolute bottom-4 right-4 w-6 h-6 border-r border-b opacity-[0.08] rounded-br-sm"
              style={{ borderColor: item.accentColor }}
            />
          </div>

          {/* Centered label content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-8">
            {/* Label */}
            <span
              className="text-[10px] sm:text-[11px] font-semibold tracking-[0.5em] uppercase mb-3"
              style={{ color: `${item.accentColor}50` }}
            >
              {item.label}
            </span>

            {/* Thin horizontal accent line */}
            <div
              className="w-12 h-px mb-3"
              style={{ background: `${item.accentColor}25` }}
            />

            {/* Sublabel */}
            <span className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-white/20 max-w-[220px] leading-relaxed">
              {item.sublabel}
            </span>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-euphoria-dark/60 to-transparent" />

          {/* Hover: enhanced overlay + reveal CTA */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-600" />

          {/* Hover: "Media Coming Soon" badge */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/25 font-medium px-4 py-1.5 rounded-full border border-white/[0.06] backdrop-blur-sm bg-euphoria-dark/30">
              Media Coming Soon
            </span>
          </div>

          {/* Top-right subtle play icon for large frame */}
          {large && (
            <div className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-500">
              <div className="w-0 h-0 border-l-[6px] border-l-white/40 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
            </div>
          )}
        </div>
      </BlurFade>
    </div>
  );
}

/* ── Main Glimpses section ───────────────────────────────────── */
export function Glimpses() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 lg:py-44 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(91, 27, 82, 0.10) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 80% 70%, rgba(23, 111, 99, 0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <BlurFade inViewMargin="-100px" className="mb-14 sm:mb-20 lg:mb-24">
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/50 mb-4">
            Relive the Moments
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="text-white">Glimpses of </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-purple via-euphoria-gold to-euphoria-aqua">
              Euphoria
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-white/30 max-w-xl leading-relaxed">
            Moments, memories, and experiences that bring Euphoria to life.
          </p>
        </BlurFade>

        {/* ── Asymmetric editorial gallery ── */}
        <div className="space-y-4 sm:space-y-5">
          {/* Row 1: Featured large (left 2/3) + tall side frame (right 1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-5">
            <MediaFrame
              item={mediaItems[0]}
              className=""
              delay={0.1}
              large
            />
            <MediaFrame
              item={mediaItems[1]}
              className=""
              delay={0.2}
            />
          </div>

          {/* Row 2: Three frames — medium, medium, small offset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr] gap-4 sm:gap-5">
            <MediaFrame
              item={mediaItems[2]}
              className=""
              delay={0.3}
            />
            <MediaFrame
              item={mediaItems[3]}
              className=""
              delay={0.4}
            />
            <MediaFrame
              item={mediaItems[4]}
              className=""
              delay={0.5}
            />
          </div>
        </div>

        {/* Bottom accent text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/12 font-light">
            Real moments from SAGE Euphoria — media library expanding soon
          </span>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-gold/10 to-transparent" />
    </section>
  );
}
