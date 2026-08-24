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

      <div className="relative z-10 mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left — Large headline + copy */}
          <div className="lg:col-span-7">
            <BlurFade className="mb-6" delay={0} inViewMargin="-100px">
              <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/50">
                About
              </span>
            </BlurFade>

            <BlurFade delay={0.1} inViewMargin="-100px">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.0]">
                <span className="text-white block">The Fourth</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua block mt-2">
                  Edition.
                </span>
              </h2>
            </BlurFade>

            <BlurFade delay={0.3} inViewMargin="-100px" className="mt-8 sm:mt-10 space-y-5 max-w-xl">
              <p className="text-base sm:text-lg text-white/40 leading-relaxed font-light">
                SAGE Euphoria 2026 marks the fourth edition of SAGE University
                Indore&apos;s flagship annual university fest — a three-day
                celebration of art, music, culture, and innovation.
              </p>
              <p className="text-base sm:text-lg text-white/40 leading-relaxed font-light">
                Featuring live music, thrilling competitions, tech showcases,
                dynamic forums, and high-energy performances, Euphoria brings
                together thousands of students for an unforgettable experience
                where diversity, creativity, and the emotions that colours bring
                to life take centre stage.
              </p>
              <p className="text-sm sm:text-base text-white/25 leading-relaxed font-light italic border-l-2 border-euphoria-gold/20 pl-5">
                Joy of Colours — each colour representing a different expression of Euphoria.
              </p>
            </BlurFade>
          </div>

          {/* Right — Stats / decorative */}
          <div className="lg:col-span-5 lg:pt-16">
            <BlurFade delay={0.3} yOffset={20} blur={8} inViewMargin="-100px" className="space-y-0">
              {[
                { value: "20K+", label: "Expected Attendees — 2026", accent: "text-euphoria-aqua/70" },
                { value: "3K+", label: "Expected Participants — 2026", accent: "text-euphoria-gold/70" },
                { value: "03", label: "Days of Celebration", accent: "text-euphoria-purple/70" },
                { value: "25+", label: "Events Across Various Genres", accent: "text-euphoria-aqua/70" },
              ].map((h, i) => (
                <div
                  key={h.label}
                  className="flex items-baseline gap-4 py-5 border-b border-white/[0.04] last:border-b-0 group"
                >
                  <span
                    className={`text-3xl sm:text-4xl font-black ${h.accent} group-hover:text-white transition-colors duration-300 min-w-[100px]`}
                  >
                    {h.value}
                  </span>
                  <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/20 font-medium">
                    {h.label}
                  </span>
                </div>
              ))}
            </BlurFade>

            {/* Historical reach */}
            <BlurFade delay={0.5} yOffset={15} blur={6} inViewMargin="-100px" className="mt-8">
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/15 font-semibold mb-3 block">
                Previous Edition — Digital Reach
              </span>
              <div className="space-y-2">
                {[
                  { value: "500K+", label: "Facebook Reach" },
                  { value: "2M+", label: "Instagram Impressions" },
                  { value: "100K+", label: "Video Views" },
                  { value: "800K+", label: "Website Visits" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-b-0">
                    <span className="text-base sm:text-lg font-bold text-white/30">{stat.value}</span>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-white/12">{stat.label}</span>
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-gold/10 to-transparent" />
    </section>
  );
}
