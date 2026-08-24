import { BlurFade } from "@/components/magicui/blur-fade";

/* All sponsor/partner logos uploaded to assets */
const sponsorLogos = [
  { src: "/assets/Past_Sponsors__7_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__8_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__9_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__12_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__14_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__21_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__22_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__23_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__24_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__26_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__27_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__29_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__30_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__36_.png", alt: "Partner" },
  { src: "/assets/Past_Sponsors__39_.png", alt: "Partner" },
];

export function Sponsors() {
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

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <BlurFade inViewMargin="-80px" className="text-center mb-16">
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/40 mb-4">
            Our Partners
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white/80">
            Sponsors &amp; Partners
          </h2>
          <p className="mt-4 text-sm text-white/25 max-w-md mx-auto">
            SAGE Euphoria is made possible through the valued support of our
            partners and sponsors across previous editions.
          </p>
        </BlurFade>

        {/* Euphoria + Radio SAGE — featured row */}
        <BlurFade delay={0.1} inViewMargin="-80px" className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-16">
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
        </BlurFade>

        {/* Sponsor logos grid */}
        <BlurFade delay={0.25} inViewMargin="-80px">
          <div className="text-center mb-6">
            <span className="text-[9px] tracking-[0.25em] uppercase text-white/15">
              Past Sponsors &amp; Partners
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
            {sponsorLogos.map((logo, i) => (
              <BlurFade
                key={logo.src}
                delay={0.3 + i * 0.03}
                duration={0.4}
                inViewMargin="-60px"
                className="group flex items-center justify-center aspect-square rounded-xl border border-white/[0.04] bg-white/[0.01] p-3 transition-all duration-300 hover:border-euphoria-gold/15 hover:bg-white/[0.03]"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-full h-full object-contain opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                  loading="lazy"
                />
              </BlurFade>
            ))}
          </div>
        </BlurFade>

        {/* Pro Night — accurate brochure content */}
        <BlurFade delay={0.5} inViewMargin="-60px" className="text-center mt-16">
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-purple/40 mb-3">
            Pro Night
          </span>
          <p className="text-xs text-white/15 tracking-wider">
            Headliner artist to be announced
          </p>
        </BlurFade>

        {/* Partnership inquiry */}
        <BlurFade delay={0.6} inViewMargin="-60px" className="text-center mt-6 text-[10px] text-white/12 tracking-wider">
          For partnership inquiries: sponsorship@sageuniversity.in
        </BlurFade>
      </div>

      {/* Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-gold/[0.06] to-transparent" />
    </section>
  );
}
