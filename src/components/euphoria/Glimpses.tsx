import { BlurFade } from "@/components/magicui/blur-fade";

const placeholders = [
  {
    label: "PAST EDITIONS",
    gradient: "from-euphoria-plum/60 via-euphoria-purple/40 to-euphoria-dark",
    span: "col-span-1 sm:col-span-2 row-span-2",
    minH: "min-h-[260px] sm:min-h-[340px]",
    border: "border-euphoria-purple/15",
  },
  {
    label: "ON THE STAGE",
    gradient: "from-euphoria-teal/40 via-euphoria-aqua/20 to-euphoria-dark",
    span: "col-span-1 row-span-1",
    minH: "min-h-[160px] sm:min-h-[200px]",
    border: "border-euphoria-teal/15",
  },
  {
    label: "STUDENT MOMENTS",
    gradient: "from-euphoria-gold/30 via-euphoria-plum/20 to-euphoria-dark",
    span: "col-span-1 row-span-1",
    minH: "min-h-[160px] sm:min-h-[200px]",
    border: "border-euphoria-gold/15",
  },
  {
    label: "BEHIND THE SCENES",
    gradient: "from-euphoria-purple/40 via-euphoria-teal/20 to-euphoria-dark",
    span: "col-span-1 row-span-1",
    minH: "min-h-[160px] sm:min-h-[200px]",
    border: "border-euphoria-purple/15",
  },
  {
    label: "FACULTY MOMENTS",
    gradient: "from-euphoria-gold/25 via-euphoria-aqua/15 to-euphoria-dark",
    span: "col-span-1 row-span-1",
    minH: "min-h-[160px] sm:min-h-[200px]",
    border: "border-euphoria-gold/15",
  },
];

export function Glimpses() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(91, 27, 82, 0.1) 0%, transparent 60%)",
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

        {/* Editorial gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {placeholders.map((item, i) => (
            <BlurFade
              key={item.label}
              delay={0.1 + i * 0.1}
              duration={0.7}
              yOffset={40}
              inViewMargin="-60px"
              className={`${item.span}`}
            >
              <div
                className={`relative ${item.minH} rounded-2xl overflow-hidden border ${item.border} group cursor-pointer`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />

                {/* Subtle grain texture */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                  }}
                />

                {/* Decorative corner accents */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-white/[0.06] rounded-tl" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-white/[0.06] rounded-br" />
                </div>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.35em] uppercase text-white/20 mb-3">
                    {item.label}
                  </span>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/10">
                    Media Coming Soon
                  </span>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-euphoria-dark/60 to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </BlurFade>
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-gold/10 to-transparent" />
    </section>
  );
}
