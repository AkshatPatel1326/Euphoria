import { motion } from "framer-motion";
import type { EuphoriaEvent, EventCategory } from "@/data/events";

const categoryGradients: Record<EventCategory, string> = {
  cultural: "from-euphoria-plum via-euphoria-purple to-euphoria-plum",
  "literary-management": "from-euphoria-gold/80 via-amber-700/60 to-euphoria-gold/40",
  "science-tech": "from-euphoria-teal via-emerald-700/60 to-euphoria-aqua/40",
  sports: "from-euphoria-teal via-teal-800/60 to-emerald-900/40",
};

const categoryAccent: Record<EventCategory, string> = {
  cultural: "text-euphoria-purple",
  "literary-management": "text-euphoria-gold",
  "science-tech": "text-euphoria-aqua",
  sports: "text-euphoria-teal",
};

function PosterPlaceholder({ event }: { event: EuphoriaEvent }) {
  const gradient = categoryGradients[event.category];
  const initials = event.name
    .split("—")[0]
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative w-full aspect-[3/4] rounded-lg bg-gradient-to-br ${gradient} overflow-hidden`}
    >
      {/* Abstract shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full border border-white/10" />
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45" />
        <div className="absolute top-1/3 left-1/3 w-px h-20 bg-gradient-to-b from-transparent via-white/15 to-transparent -rotate-30" />
        {/* Star decoration */}
        <svg className="absolute top-6 right-6 w-4 h-4 text-white/15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      {/* Initials */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl sm:text-5xl font-black text-white/15 tracking-wider select-none">
          {initials}
        </span>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/50 bg-black/30 backdrop-blur-sm rounded px-2 py-1">
          Poster TBA
        </span>
      </div>
    </div>
  );
}

export function EventCard({
  event,
  index,
  onViewEvent,
}: {
  event: EuphoriaEvent;
  index: number;
  onViewEvent: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <div className="glass-card rounded-xl overflow-hidden transition-all duration-500 hover:border-euphoria-aqua/25 hover:shadow-[0_8px_40px_rgba(62,238,213,0.08)] hover:-translate-y-1">
        {/* Poster */}
        <div className="p-3">
          <PosterPlaceholder event={event} />
        </div>

        {/* Content */}
        <div className="px-4 pb-4 pt-1">
          <span
            className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${categoryAccent[event.category]}`}
          >
            {event.category === "literary-management"
              ? "Lit & Mgmt"
              : event.category === "science-tech"
                ? "Sci & Tech"
                : event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>

          <h3 className="mt-2 text-sm sm:text-base font-semibold text-white/90 leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {event.name}
          </h3>

          <p className="mt-1.5 text-xs text-white/35 leading-relaxed line-clamp-2">
            {event.description}
          </p>

          <button
            onClick={onViewEvent}
            className="mt-3 w-full text-center py-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-euphoria-aqua/70 border border-euphoria-aqua/20 rounded-md transition-all duration-300 hover:bg-euphoria-aqua/10 hover:border-euphoria-aqua/40 hover:text-euphoria-aqua"
          >
            View Event
          </button>
        </div>
      </div>
    </motion.div>
  );
}
