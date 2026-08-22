import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { EuphoriaEvent } from "@/data/events";

const categoryColor: Record<string, string> = {
  cultural: "text-euphoria-purple",
  "literary-management": "text-euphoria-gold",
  "science-tech": "text-euphoria-aqua",
  sports: "text-euphoria-teal",
};

const categoryLabel: Record<string, string> = {
  cultural: "Cultural",
  "literary-management": "Literary & Management",
  "science-tech": "Science & Technology",
  sports: "Sports",
};

const categoryGradients: Record<string, string> = {
  cultural: "from-euphoria-plum via-euphoria-purple/60 to-euphoria-dark",
  "literary-management": "from-amber-800/40 via-euphoria-gold/20 to-euphoria-dark",
  "science-tech": "from-euphoria-teal/60 via-emerald-700/30 to-euphoria-dark",
  sports: "from-emerald-900/40 via-euphoria-teal/30 to-euphoria-dark",
};

export function EventDetailModal({
  event,
  onClose,
}: {
  event: EuphoriaEvent | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-euphoria-surface/95 backdrop-blur-xl border-l border-white/[0.06] overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/30 hover:text-white/80 hover:bg-white/5 transition-all"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* Poster area */}
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              {event.poster ? (
                <img
                  src={event.poster}
                  alt={`${event.name} poster`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${categoryGradients[event.category]}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-white/[0.06] flex items-center justify-center">
                      <span className="text-2xl font-black text-white/10">
                        {event.name
                          .split("—")[0]
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-euphoria-surface to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Category */}
              <span
                className={`text-[10px] font-semibold tracking-[0.3em] uppercase ${categoryColor[event.category]}`}
              >
                {categoryLabel[event.category]}
              </span>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {event.name}
              </h2>

              {/* Description */}
              <p className="text-sm text-white/40 leading-relaxed">
                {event.description}
              </p>

              {/* Details */}
              <div className="space-y-3">
                {[
                  { label: "Schedule", value: event.time },
                  { label: "Venue", value: event.venue },
                  { label: "Team Size", value: event.teamSize },
                  { label: "Prizes", value: event.prizes },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="text-white/25 w-24 shrink-0 text-xs">
                      {item.label}
                    </span>
                    <span className="text-white/55 text-xs">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rules */}
              <div className="glass-card rounded-xl p-4">
                <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-2">
                  Rules &amp; Guidelines
                </h4>
                <p className="text-xs text-white/30 leading-relaxed">
                  {event.rules}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Registration placeholder */}
              <div className="space-y-3">
                <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-gold/50">
                  Registration
                </div>
                <div className="glass-card rounded-xl p-4 flex items-center justify-center py-6">
                  <div className="text-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-euphoria-gold/30 animate-glow-pulse mx-auto mb-3" />
                    <p className="text-xs text-white/30 tracking-wider uppercase">
                      Registration details will be available soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Back */}
              <button
                onClick={onClose}
                className="w-full py-3 text-sm text-white/25 hover:text-white/50 transition-colors tracking-wider uppercase"
              >
                Back to events
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
