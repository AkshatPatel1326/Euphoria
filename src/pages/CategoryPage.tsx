import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  events,
  categoryMeta,
  type EventCategory,
} from "@/data/events";
import { EventCard } from "@/components/euphoria/EventCard";
import { EventDetailModal } from "@/components/euphoria/EventDetailModal";

const validCategories: EventCategory[] = [
  "cultural",
  "literary-management",
  "science-tech",
  "sports",
];

/* Category poster images for the hero banner */
const categoryPosters: Partial<Record<EventCategory, string>> = {
  "literary-management": "/assets/L_M_Category_Poster.jpg",
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Scroll to top when navigating to this category page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const isValid = validCategories.includes(category as EventCategory);
  const cat = category as EventCategory;
  const meta = isValid ? categoryMeta[cat] : null;
  const categoryEvents = isValid
    ? events.filter((e) => e.category === cat)
    : [];
  const selectedEventData = events.find((e) => e.id === selectedEvent) ?? null;
  const posterSrc = isValid ? categoryPosters[cat] : undefined;

  if (!isValid || !meta) {
    return (
      <div className="min-h-screen bg-euphoria-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 mb-4">Category not found.</p>
          <button
            onClick={() => navigate("/")}
            className="text-euphoria-aqua/60 text-sm tracking-wider uppercase hover:text-euphoria-aqua transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-euphoria-dark text-white overflow-x-hidden">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-euphoria-dark/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm tracking-wider">Back</span>
            </button>
            <div className="h-4 w-px bg-white/[0.06]" />
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-bold tracking-[0.15em]"
                style={{ color: meta.color }}
              >
                {meta.number}
              </span>
              <span
                className="text-sm font-semibold tracking-[0.15em] uppercase"
                style={{ color: meta.color }}
              >
                {meta.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero banner with category poster */}
      <div className="relative pt-16 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-15`} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(10,6,18,1) 0%, transparent 70%)",
          }}
        />

        {/* Category poster background (if available) */}
        {posterSrc && (
          <div className="absolute inset-0">
            <img
              src={posterSrc}
              alt=""
              className="w-full h-full object-cover opacity-[0.08]"
              style={{ filter: "blur(2px) saturate(0.4)" }}
            />
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Large number */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-[80px] sm:text-[100px] md:text-[120px] font-black leading-none select-none block mb-2"
              style={{
                color: "transparent",
                WebkitTextStroke: `1px ${meta.color}30`,
              }}
            >
              {meta.number}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
            >
              <span className="text-white/80">{meta.label}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-3 text-[11px] tracking-[0.25em] uppercase text-white/20 font-light"
            >
              {meta.keywords}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-4 text-sm sm:text-base text-white/30 max-w-lg mx-auto"
            >
              {meta.description}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-3 text-xs text-white/15 tracking-wider"
            >
              {categoryEvents.length} events
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Events grid with staggered reveal */}
      <div ref={ref} className="relative z-10 mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {categoryEvents.map((event, i) => (
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
    </div>
  );
}
