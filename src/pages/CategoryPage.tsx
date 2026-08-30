import { useState, useEffect } from "react";
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

/* Category poster images for the hero background */
const categoryPosters: Record<EventCategory, string> = {
  cultural: "/assets/Cultural_.jpeg",
  "literary-management": "/assets/Literary___Management.jpeg",
  "science-tech": "/assets/Science_and_Technology.jpeg",
  sports: "/assets/Sports_.jpeg",
};

/* ── Category hero title definitions ── */
const categoryTitles: Record<
  EventCategory,
  { line1: string; line2: string; fontClass: string }
> = {
  cultural: {
    line1: "CULTURAL",
    line2: "EVENTS",
    /* Short title → larger font */
    fontClass: "text-[clamp(2rem,8vw,6rem)]",
  },
  "literary-management": {
    line1: "LITERARY | MANAGEMENT",
    line2: "EVENTS",
    /* Medium title → medium font */
    fontClass: "text-[clamp(1.4rem,5vw,3.8rem)]",
  },
  "science-tech": {
    line1: "SCIENCE AND TECHNOLOGY",
    line2: "EVENTS",
    /* Long title → smaller font */
    fontClass: "text-[clamp(1.2rem,4.2vw,3.2rem)]",
  },
  sports: {
    line1: "SPORT-O-SPARK",
    line2: "EVENTS",
    /* Medium title → medium font */
    fontClass: "text-[clamp(1.6rem,5.5vw,4.2rem)]",
  },
};

/* ── Inner content component — keyed by category so it fully remounts ── */
function CategoryContent({
  cat,
  meta,
  posterSrc,
  categoryEvents,
  navigate,
  onSelectEvent,
}: {
  cat: EventCategory;
  meta: (typeof categoryMeta)[EventCategory];
  posterSrc: string | null;
  categoryEvents: typeof events;
  navigate: (path: string) => void;
  onSelectEvent: (id: string) => void;
}) {
  const title = categoryTitles[cat];

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

      {/* ═══════════════════════════════════════════
          CATEGORY HERO — poster background + text overlay
          ═══════════════════════════════════════════ */}
      <div className="relative pt-16 w-full overflow-hidden" style={{ height: "clamp(180px, 30vw, 420px)" }}>
        {/* Background poster — blurred and darkened to hide branding */}
        {posterSrc ? (
          <>
            <img
              src={posterSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
              style={{
                objectPosition: "50% 50%",
                filter: "blur(20px) brightness(0.35) saturate(1.3)",
                transform: "scale(1.15)",
              }}
            />
            {/* Extra dark overlay to ensure no branding bleeds through */}
            <div className="absolute inset-0 bg-euphoria-dark/50" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`} />
        )}

        {/* Centered category title — the ONLY foreground content */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center select-none">
            <h1
              className={`${title.fontClass} font-black tracking-[0.06em] uppercase leading-[1.05] text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]`}
            >
              {title.line1}
            </h1>
            <p
              className="mt-1 text-[clamp(0.65rem,1.8vw,1.1rem)] font-light tracking-[0.35em] uppercase text-white/55"
            >
              {title.line2}
            </p>
          </div>
        </div>
      </div>

      {/* Events grid — UNTOUCHED */}
      <div className="relative z-10 mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {categoryEvents.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              index={i}
              onViewEvent={() => onSelectEvent(event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Scroll to top when navigating
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [category]);

  const isValid = validCategories.includes(category as EventCategory);
  const cat = category as EventCategory;
  const meta = isValid ? categoryMeta[cat] : null;
  const categoryEvents = isValid
    ? events.filter((e) => e.category === cat)
    : [];
  const selectedEventData = events.find((e) => e.id === selectedEvent) ?? null;
  const posterSrc = isValid ? categoryPosters[cat] : null;

  if (!isValid || !meta) {
    return (
      <div className="min-h-screen bg-euphoria-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Category not found.</p>
          <button
            onClick={() => navigate("/")}
            className="text-euphoria-aqua/75 text-sm tracking-wider uppercase hover:text-euphoria-aqua transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={cat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CategoryContent
            cat={cat}
            meta={meta}
            posterSrc={posterSrc}
            categoryEvents={categoryEvents}
            navigate={navigate}
            onSelectEvent={setSelectedEvent}
          />
        </motion.div>
      </AnimatePresence>

      {/* Event detail modal — rendered outside AnimatePresence to persist */}
      <EventDetailModal
        event={selectedEventData}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
