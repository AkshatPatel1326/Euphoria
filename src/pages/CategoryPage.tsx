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
import {
  detectTitleRow,
  titleToObjectPosition,
  loadImage,
} from "@/lib/posterCrop";

const validCategories: EventCategory[] = [
  "cultural",
  "literary-management",
  "science-tech",
  "sports",
];

/* Category poster images for the hero banner — EXACT same assets as homepage category cards */
const categoryPosters: Record<EventCategory, string> = {
  cultural: "/assets/Cultural_.jpeg",
  "literary-management": "/assets/Literary___Management.jpeg",
  "science-tech": "/assets/Science_and_Technology.jpeg",
  sports: "/assets/Sports_.jpeg",
};



/* ── Hook: detect poster title position → object-position string ── */
function usePosterCrop(posterSrc: string | null) {
  const [objectPos, setObjectPos] = useState<string>("50% 50%");

  useEffect(() => {
    if (!posterSrc) return;
    let cancelled = false;

    (async () => {
      try {
        const img = await loadImage(posterSrc);
        if (cancelled) return;

        // Analyse at a small size for speed
        const ANALYSIS_W = 200;
        const ANALYSIS_H = Math.round(200 / (img.naturalWidth / img.naturalHeight));

        const canvas = document.createElement("canvas");
        canvas.width = ANALYSIS_W;
        canvas.height = ANALYSIS_H;
        const ctx = canvas.getContext("2d")!;

        const titleRow = detectTitleRow(canvas, ctx, img);
        // Convert back to natural-image coordinate
        const naturalTitleRow = (titleRow / ANALYSIS_H) * img.naturalHeight;
        const pos = titleToObjectPosition(img.naturalHeight, naturalTitleRow);
        if (!cancelled) setObjectPos(pos);
      } catch {
        // Fallback to center
        if (!cancelled) setObjectPos("50% 50%");
      }
    })();

    return () => { cancelled = true; };
  }, [posterSrc]);

  return objectPos;
}

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
  const objectPos = usePosterCrop(posterSrc);

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

      {/* Hero banner — aggressively cropped poster showing ONLY the category title */}
      <div className="relative pt-16 overflow-hidden">
        {posterSrc ? (
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "5 / 1" }}
          >
            <img
              src={posterSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
              draggable={false}
              style={{ objectPosition: objectPos }}
            />
          </div>
        ) : (
          <div
            className={`relative w-full bg-gradient-to-br ${meta.gradient}`}
            style={{ aspectRatio: "5 / 1" }}
          />
        )}
      </div>

      {/* Events grid */}
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
