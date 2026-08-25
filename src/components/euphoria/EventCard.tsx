import { motion } from "framer-motion";
import type { EuphoriaEvent, EventCategory } from "@/data/events";

const categoryAccent: Record<EventCategory, string> = {
  cultural: "text-euphoria-purple",
  "literary-management": "text-euphoria-gold",
  "science-tech": "text-euphoria-aqua",
  sports: "text-euphoria-teal",
};

const categoryGradients: Record<EventCategory, string> = {
  cultural: "from-euphoria-plum via-euphoria-purple/60 to-euphoria-plum",
  "literary-management": "from-amber-800/60 via-euphoria-gold/40 to-amber-900/30",
  "science-tech": "from-euphoria-teal/80 via-emerald-700/50 to-euphoria-aqua/30",
  sports: "from-emerald-900/60 via-euphoria-teal/40 to-emerald-800/30",
};

const categoryLabels: Record<EventCategory, string> = {
  cultural: "Cultural",
  "literary-management": "Lit & Mgmt",
  "science-tech": "Sci & Tech",
  sports: "Sports",
};

/* Poster display - real image or branded placeholder */
function EventPoster({ event }: { event: EuphoriaEvent }) {
  if (event.poster) {
    return (
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-euphoria-darker">
        <img
          src={event.poster}
          alt={`${event.name} poster`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    );
  }

  const gradient = categoryGradients[event.category];
  const initials = event.name
    .split("\u2014")[0]
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative w-full aspect-[3/4] rounded-lg bg-gradient-to-br ${gradient} overflow-hidden`}
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full border border-white/[0.06]" />
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full border border-white/[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl sm:text-5xl font-black text-white/10 tracking-wider select-none">
          {initials}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/40 bg-black/20 backdrop-blur-sm rounded px-2 py-1">
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
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      className="group h-full"
    >
      <div className="glass-card rounded-xl overflow-hidden transition-all duration-500 hover:border-white/15 hover:shadow-[0_8px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1 h-full flex flex-col">
        <div className="p-3 flex-shrink-0">
          <EventPoster event={event} />
        </div>
        <div className="px-4 pb-4 pt-1 flex flex-col flex-1">
          <span
            className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${categoryAccent[event.category]}`}
          >
            {categoryLabels[event.category]}
          </span>
          <h3 className="mt-2 text-sm sm:text-[15px] font-semibold text-white/85 leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {event.name}
          </h3>
          <p className="mt-1.5 text-xs text-white/30 leading-relaxed line-clamp-2">
            {event.description}
          </p>
          <div className="mt-auto pt-3">
            <button
              onClick={onViewEvent}
              className="w-full text-center py-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-euphoria-aqua/60 border border-euphoria-aqua/15 rounded-md transition-all duration-300 hover:bg-euphoria-aqua/10 hover:border-euphoria-aqua/40 hover:text-euphoria-aqua"
            >
              View Event
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
