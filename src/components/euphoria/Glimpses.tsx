import { BlurFade } from "@/components/magicui/blur-fade";

const mediaItems = [
  {
    label: "PAST EDITIONS",
    sublabel: "Moments from previous years",
    gradient: "from-euphoria-plum/50 via-euphoria-purple/30 to-euphoria-dark",
    border: "border-euphoria-purple/15",
    glowColor: "rgba(162, 50, 160, 0.06)",
  },
  {
    label: "ON THE STAGE",
    sublabel: "Performances that captivated",
    gradient: "from-euphoria-teal/40 via-euphoria-aqua/20 to-euphoria-dark",
    border: "border-euphoria-teal/15",
    glowColor: "rgba(23, 111, 99, 0.06)",
  },
  {
    label: "STUDENT MOMENTS",
    sublabel: "Energy of the crowd",
    gradient: "from-euphoria-gold/25 via-euphoria-plum/15 to-euphoria-dark",
    border: "border-euphoria-gold/15",
    glowColor: "rgba(175, 153, 71, 0.06)",
  },
  {
    label: "BEHIND THE SCENES",
    sublabel: "The making of Euphoria",
    gradient: "from-euphoria-purple/35 via-euphoria-teal/15 to-euphoria-dark",
    border: "border-euphoria-purple/12",
    glowColor: "rgba(162, 50, 160, 0.04)",
  },
  {
    label: "FACULTY MOMENTS",
    sublabel: "Guidance and celebration",
    gradient: "from-euphoria-gold/20 via-euphoria-aqua/10 to-euphoria-dark",
    border: "border-euphoria-gold/12",
    glowColor: "rgba(175, 153, 71, 0.04)",
  },
];

function MediaFrame({
  item,
  className,
  delay,
}: {
  item: (typeof mediaItems)[number];
  className: string;
  delay: number;
}) {
  return (
    <BlurFade
      delay={delay}
      duration={0.8}
      yOffset={30}
      inViewMargin="-80px"
      className={className}
    >
      <div
        className={`relative h-full min-h-[180px] sm:min-h-[220px] rounded-2xl overflow-hidden border ${item.border} group`}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />

        {/* Atmospheric glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${item.glowColor} 0%, transparent 70%)`,
          }}
        />

        {/* Subtle grain */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Corner accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-3 left-3 w-5 h-5 border-l border-t border-white/[0.05] rounded-tl" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-white/[0.05] rounded-br" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-5 sm:p-6">
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.4em] uppercase text-white/18 mb-2">
            {item.label}
          </span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/08 max-w-[200px] leading-relaxed">
            {item.sublabel}
          </span>
          <div className="mt-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-[9px] tracking-[0.25em] uppercase text-white/20">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-euphoria-dark/50 to-transparent" />

        {/* Hover glow */}
        <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </BlurFade>
  );
}

export function Glimpses() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(91, 27, 82, 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <BlurFade inViewMargin="-100px" className="mb-12 sm:mb-16 lg:mb-20">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 auto-rows-fr">
          {/* Row 1: Featured (large) + 2 supporting */}
          <MediaFrame
            item={mediaItems[0]}
            className="sm:col-span-2 lg:col-span-2 min-h-[260px] sm:min-h-[320px]"
            delay={0.1}
          />
          <MediaFrame item={mediaItems[1]} className="" delay={0.2} />

          {/* Row 2: 3 equal frames */}
          <MediaFrame item={mediaItems[2]} className="" delay={0.25} />
          <MediaFrame item={mediaItems[3]} className="" delay={0.3} />
          <MediaFrame item={mediaItems[4]} className="" delay={0.35} />
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-gold/10 to-transparent" />
    </section>
  );
}
