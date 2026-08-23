import { BlurFade } from "@/components/magicui/blur-fade";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 50%, rgba(23, 111, 99, 0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 10% 70%, rgba(175, 153, 71, 0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left — Large headline + copy */}
          <div className="lg:col-span-7">
            <BlurFade className="mb-6" delay={0} inViewMargin="-100px">
              <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/50">
                About
              </span>
            </BlurFade>

            <BlurFade delay={0.1} inViewMargin="-100px">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.0]">
                <span className="text-white block">Not just a fest.</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua block mt-2">
                  A tradition.
                </span>
              </h2>
            </BlurFade>

            <BlurFade delay={0.3} inViewMargin="-100px" className="mt-8 sm:mt-10 space-y-5 max-w-xl">
              <p className="text-base sm:text-lg text-white/40 leading-relaxed font-light">
                SAGE Euphoria is the flagship annual celebration at SAGE
                University — a convergence of artistic expression, intellectual
                competition, and athletic excellence that defines the campus
                experience.
              </p>
              <p className="text-base sm:text-lg text-white/40 leading-relaxed font-light">
                Across four disciplines — Cultural, Literary &amp; Management,
                Science &amp; Technology, and Sports — Euphoria assembles the
                most talented, driven, and creative individuals for a
                multi-day program that sets the standard for collegiate
                festivals.
              </p>
              <p className="text-sm sm:text-base text-white/25 leading-relaxed font-light italic border-l-2 border-euphoria-gold/20 pl-5">
                This is where ambition meets the stage.
              </p>
            </BlurFade>
          </div>

          {/* Right — Stats / decorative */}
          <div className="lg:col-span-5 lg:pt-16">
            <BlurFade delay={0.3} yOffset={20} blur={8} inViewMargin="-100px" className="space-y-0">
              {[
                { value: "40+", label: "Events", accent: "text-euphoria-aqua/70" },
                { value: "04", label: "Disciplines", accent: "text-euphoria-purple/70" },
                { value: "∞", label: "Energy", accent: "text-euphoria-gold/70" },
              ].map((h, i) => (
                <div
                  key={h.label}
                  className="flex items-baseline gap-4 py-5 border-b border-white/[0.04] last:border-b-0 group"
                >
                  <span
                    className={`text-4xl sm:text-5xl font-black ${h.accent} group-hover:text-white transition-colors duration-300 min-w-[100px]`}
                  >
                    {h.value}
                  </span>
                  <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/20 font-medium">
                    {h.label}
                  </span>
                </div>
              ))}
            </BlurFade>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-gold/10 to-transparent" />
    </section>
  );
}
