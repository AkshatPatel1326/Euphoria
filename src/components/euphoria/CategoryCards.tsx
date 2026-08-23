import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { categoryMeta, events, categoryOrder, type EventCategory } from "@/data/events";
import { BlurFade } from "@/components/magicui/blur-fade";

/* Cultural poster images — real supplied assets */
const culturalPosters = [
  "/assets/1_1_.jpg",
  "/assets/2_1_.jpg",
  "/assets/3_1_.jpg",
  "/assets/4_1_.jpg",
  "/assets/6_1_.jpg",
  "/assets/7_1_.jpg",
  "/assets/8_1_.jpg",
  "/assets/9_1_.jpg",
  "/assets/10_1_.jpg",
  "/assets/11_1_.jpg",
  "/assets/12_1_.jpg",
  "/assets/13_1_.jpg",
  "/assets/14_1_.jpg",
  "/assets/15_1_.jpg",
];

/* ── Category visual area — consistent across all four ─────── */
function CategoryVisual({
  category,
  isEven,
}: {
  category: EventCategory;
  isEven: boolean;
}) {
  const meta = categoryMeta[category];
  const navigate = useNavigate();
  const route =
    category === "cultural"
      ? "/events/cultural"
      : category === "literary-management"
        ? "/events/literary-management"
        : category === "science-tech"
          ? "/events/science-tech"
          : "/events/sports";

  const sharedVisualClass = "relative w-full lg:w-[420px] xl:w-[480px] aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden group-hover:shadow-[0_12px_60px_rgba(0,0,0,0.5)] transition-shadow duration-500 cursor-pointer";

  /* ── Cultural: real poster collage ── */
  if (category === "cultural") {
    return (
      <div
        className={`relative ${isEven ? "" : "lg:order-1"}`}
        style={{ direction: "ltr" }}
      >
        <div
          className={sharedVisualClass}
          onClick={() => navigate(route)}
        >
          {/* Base dark bg */}
          <div className="absolute inset-0 bg-euphoria-darker" />

          {/* Poster stack — layered for depth */}
          {/* Back poster */}
          <div className="absolute inset-[8%] sm:inset-[10%] rotate-[-4deg] opacity-40 group-hover:opacity-50 transition-opacity duration-700">
            <img
              src={culturalPosters[4]}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-euphoria-dark/30 rounded-lg" />
          </div>

          {/* Middle poster */}
          <div className="absolute inset-[4%] sm:inset-[5%] rotate-[2deg] opacity-60 group-hover:opacity-75 transition-opacity duration-700">
            <img
              src={culturalPosters[1]}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-euphoria-dark/20 rounded-lg" />
          </div>

          {/* Front poster — main */}
          <div className="absolute inset-0 p-[2%] sm:p-[3%]">
            <img
              src={culturalPosters[0]}
              alt="Cultural Events"
              loading="lazy"
              className="w-full h-full object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-euphoria-dark/70 via-euphoria-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 rounded-2xl" />

          {/* Label */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span
              className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase px-6 py-2.5 rounded-full border backdrop-blur-sm"
              style={{
                color: meta.color,
                borderColor: `${meta.color}40`,
                backgroundColor: `${meta.color}10`,
              }}
            >
              View Events
            </span>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-euphoria-dark to-transparent" />
        </div>
      </div>
    );
  }

  /* ── Science & Technology: branded placeholder ── */
  if (category === "science-tech") {
    return (
      <div
        className={`relative ${isEven ? "" : "lg:order-1"}`}
        style={{ direction: "ltr" }}
      >
        <div
          className={sharedVisualClass}
          onClick={() => navigate(route)}
        >
          {/* Deep teal + aqua gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-euphoria-teal/50 via-euphoria-darker to-euphoria-aqua/15" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(62,238,213,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(62,238,213,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Abstract circuit-like lines */}
          <div className="absolute inset-0">
            {/* Horizontal line */}
            <div className="absolute top-[30%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-euphoria-aqua/20 to-transparent" />
            <div className="absolute top-[70%] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-euphoria-teal/15 to-transparent" />

            {/* Vertical line */}
            <div className="absolute left-[35%] top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-euphoria-aqua/15 to-transparent" />
            <div className="absolute left-[65%] top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-euphoria-teal/10 to-transparent" />

            {/* Corner accent */}
            <div className="absolute top-4 left-4 w-10 h-10 border-l-2 border-t-2 border-euphoria-aqua/15 rounded-tl-lg" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 border-euphoria-teal/15 rounded-br-lg" />

            {/* Central glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(62,238,213,0.08) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Number watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[100px] sm:text-[120px] font-black opacity-[0.04] select-none text-euphoria-aqua">
              03
            </span>
          </div>

          {/* Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span
              className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase px-6 py-2.5 rounded-full border backdrop-blur-sm"
              style={{
                color: meta.color,
                borderColor: `${meta.color}40`,
                backgroundColor: `${meta.color}10`,
              }}
            >
              View Events
            </span>
          </div>

          {/* "Event Visuals Coming Soon" badge */}
          <div className="absolute top-4 right-4">
            <span className="text-[9px] tracking-[0.2em] uppercase text-euphoria-aqua/30 font-medium">
              Event Visuals Coming Soon
            </span>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-euphoria-dark to-transparent" />
        </div>
      </div>
    );
  }

  /* ── Default: gradient block (Literary & Management, Sports) ── */
  return (
    <div
      className={`relative ${isEven ? "" : "lg:order-1"}`}
      style={{ direction: "ltr" }}
    >
      <div
        className={sharedVisualClass}
        onClick={() => navigate(route)}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-40`} />

        {/* Accent gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.accentGradient} opacity-0 group-hover:opacity-15 transition-opacity duration-700`} />

        {/* Abstract decorative shapes */}
        <div className="absolute inset-0">
          <div
            className="absolute -top-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full border opacity-10"
            style={{ borderColor: meta.color }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45" />
          <div
            className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 opacity-10 rounded-bl-lg"
            style={{ borderColor: meta.color }}
          />
          <div
            className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 opacity-10 rounded-tr-lg"
            style={{ borderColor: meta.color }}
          />
        </div>

        {/* Center number watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[100px] sm:text-[120px] font-black opacity-[0.04] select-none"
            style={{ color: meta.color }}
          >
            {meta.number}
          </span>
        </div>

        {/* "Explore" label on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span
            className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase px-6 py-2.5 rounded-full border backdrop-blur-sm"
            style={{
              color: meta.color,
              borderColor: `${meta.color}40`,
              backgroundColor: `${meta.color}10`,
            }}
          >
            View Events
          </span>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-euphoria-dark to-transparent" />
      </div>
    </div>
  );
}

/* ── Single category row ────────────────────────────────────── */
function CategoryRow({
  category,
  index,
}: {
  category: EventCategory;
  index: number;
}) {
  const navigate = useNavigate();
  const meta = categoryMeta[category];
  const eventCount = events.filter((e) => e.category === category).length;
  const isEven = index % 2 === 0;

  const route =
    category === "cultural"
      ? "/events/cultural"
      : category === "literary-management"
        ? "/events/literary-management"
        : category === "science-tech"
          ? "/events/science-tech"
          : "/events/sports";

  return (
    <BlurFade
      delay={index * 0.1}
      duration={0.7}
      yOffset={50}
      inViewMargin="-60px"
      className={`group relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-12 items-center py-12 sm:py-16 lg:py-20 border-b border-white/[0.04] last:border-b-0`}
    >
      {/* Left — Category info */}
      <div
        className={`relative ${isEven ? "lg:text-left" : "lg:text-right lg:order-2"}`}
        style={{ direction: "ltr" }}
      >
        {/* Oversized number */}
        <div className="relative mb-2 sm:mb-3">
          <span
            className="text-[80px] sm:text-[100px] md:text-[130px] lg:text-[160px] font-black leading-none select-none tracking-tighter"
            style={{
              color: "transparent",
              WebkitTextStroke: `1.5px ${meta.color}20`,
              textShadow: `0 0 80px ${meta.color}08`,
            }}
          >
            {meta.number}
          </span>
        </div>

        {/* Category name */}
        <h3
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase"
          style={{ color: meta.color }}
        >
          {meta.label}
        </h3>

        {/* Keywords */}
        <p className="mt-3 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/25 font-light">
          {meta.keywords}
        </p>

        {/* Description */}
        <p className="mt-4 text-sm sm:text-base text-white/35 max-w-md leading-relaxed font-light">
          {meta.description}
        </p>

        {/* Event count + CTA */}
        <div
          className={`mt-6 flex items-center gap-4 ${isEven ? "" : "lg:justify-end"}`}
          style={{ direction: "ltr" }}
        >
          <span className="text-xs text-white/20 tracking-wider">
            {eventCount} events
          </span>
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(route)}
            className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300"
            style={{ color: `${meta.color}99` }}
          >
            <span className="group-hover:text-white transition-colors">
              Explore Events
            </span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        </div>
      </div>

      {/* Right — Visual area */}
      <CategoryVisual category={category} isEven={isEven} />
    </BlurFade>
  );
}

/* ── Main section ───────────────────────────────────────────── */
export function CategoryCards() {
  return (
    <section id="events" className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-darker" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 10%, rgba(91, 27, 82, 0.1) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 80% 80%, rgba(23, 111, 99, 0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <BlurFade inViewMargin="-80px" className="mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-aqua/60 mb-4">
            Disciplines
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="text-white">Find Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-gold via-euphoria-purple to-euphoria-aqua">
              Arena
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-white/30 max-w-xl leading-relaxed">
            Four disciplines. Over forty events. One standard-setting program.
          </p>
        </BlurFade>

        {/* Category rows */}
        <div>
          {categoryOrder.map((cat, i) => (
            <CategoryRow key={cat} category={cat} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-purple/10 to-transparent" />
    </section>
  );
}
