import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { events, categoryMeta, type EventCategory } from "@/data/events";
import { EventCard } from "./EventCard";
import { EventDetailModal } from "./EventDetailModal";

const categories: (EventCategory | "all")[] = [
  "all",
  "cultural",
  "literary-management",
  "science-tech",
  "sports",
];

export function Events() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filtered =
    activeCategory === "all"
      ? events
      : events.filter((e) => e.category === activeCategory);

  const selectedEventData = events.find((e) => e.id === selectedEvent) ?? null;

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

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <span className="text-white">Choose Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-euphoria-purple to-euphoria-aqua">
              Arena
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/35 max-w-xl mx-auto">
            Four categories. Forty-plus events. One unforgettable experience.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const meta = cat === "all" ? null : categoryMeta[cat];

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-euphoria-aqua/15 text-euphoria-aqua border border-euphoria-aqua/40 shadow-[0_0_20px_rgba(62,238,213,0.1)]"
                    : "text-white/35 border border-white/8 hover:text-white/60 hover:border-white/15"
                }`}
              >
                {meta ? (
                  <span className="flex items-center gap-1.5">
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                  </span>
                ) : (
                  "All Events"
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Event count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <span className="text-xs text-white/20 tracking-wider">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
          </span>
        </motion.div>

        {/* Event grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {filtered.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                onViewEvent={() => setSelectedEvent(event.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Event detail modal */}
      <EventDetailModal
        event={selectedEventData}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-purple/15 to-transparent" />
    </section>
  );
}
