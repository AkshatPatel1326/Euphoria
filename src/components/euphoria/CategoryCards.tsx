import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { categoryMeta, events, type EventCategory } from "@/data/events";

const categoryRoute: Record<EventCategory, string> = {
  cultural: "/events/cultural",
  "literary-management": "/events/literary-management",
  "science-tech": "/events/science-tech",
  sports: "/events/sports",
};

function CategoryCard({
  category,
  index,
}: {
  category: EventCategory;
  index: number;
}) {
  const navigate = useNavigate();
  const meta = categoryMeta[category];
  const eventCount = events.filter((e) => e.category === category).length;

  return (
    <motion.button
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(categoryRoute[category])}
      className="group relative text-left"
    >
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:border-white/15 hover:shadow-[0_12px_50px_rgba(0,0,0,0.4)]">
        {/* Gradient header */}
        <div
          className={`relative h-44 sm:h-52 bg-gradient-to-br ${meta.gradient} overflow-hidden`}
        >
          {/* Decorative shapes */}
          <div className="absolute inset-0">
            <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-white/10" />
            <div className="absolute bottom-8 left-8 w-14 h-14 rounded-full border border-white/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12" />
            <div className="absolute top-8 left-1/3 w-px h-16 bg-gradient-to-b from-transparent via-white/15 to-transparent -rotate-12" />
            {/* Star */}
            <svg
              className="absolute top-5 left-5 w-5 h-5 text-white/20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Large icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl sm:text-7xl opacity-20 select-none group-hover:opacity-30 transition-opacity duration-500">
              {meta.icon}
            </span>
          </div>

          {/* Event count badge */}
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-bold tracking-wider text-white/40 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
              {eventCount} events
            </span>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-euphoria-card to-transparent" />
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
            <motion.span
              className="text-euphoria-aqua/50 group-hover:text-euphoria-aqua transition-colors"
              whileHover={{ x: 4 }}
            >
              →
            </motion.span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed line-clamp-2">
            {meta.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export function CategoryCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const categories: EventCategory[] = [
    "cultural",
    "literary-management",
    "science-tech",
    "sports",
  ];

  return (
    <section id="events" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-darker" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(162, 50, 160, 0.08) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-euphoria-aqua/70 border border-euphoria-aqua/20 rounded-full px-4 py-1.5 bg-euphoria-aqua/5 mb-6">
            Events
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            <span className="text-white">Find Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-purple to-euphoria-aqua">
              Arena
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/35 max-w-xl mx-auto">
            Four disciplines. Over forty events. One standard-setting program.
          </p>
        </motion.div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {categories.map((cat, i) => (
            <CategoryCard key={cat} category={cat} index={i} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-purple/15 to-transparent" />
    </section>
  );
}
