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
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-euphoria-surface/95 backdrop-blur-xl border-l border-euphoria-purple/15 overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* Poster placeholder */}
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-euphoria-plum via-euphoria-purple/60 to-euphoria-dark relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center">
                  <span className="text-2xl font-black text-white/15">SE</span>
                </div>
              </div>
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
              <p className="text-sm text-white/45 leading-relaxed">
                {event.description}
              </p>

              {/* Pre-filled details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-white/30 w-24 shrink-0">Schedule</span>
                  <span className="text-white/60">{event.time}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-white/30 w-24 shrink-0">Venue</span>
                  <span className="text-white/60">{event.venue}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-white/30 w-24 shrink-0">Team Size</span>
                  <span className="text-white/60">{event.teamSize}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-white/30 w-24 shrink-0">Prizes</span>
                  <span className="text-white/60">{event.prizes}</span>
                </div>
              </div>

              {/* Rules */}
              <div className="glass-card rounded-xl p-4">
                <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-2">
                  Rules &amp; Guidelines
                </h4>
                <p className="text-xs text-white/35 leading-relaxed">
                  {event.rules}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Registration form (visual placeholder) */}
              <div className="space-y-4">
                <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-euphoria-gold/60">
                  Register for this event
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] tracking-[0.15em] uppercase text-white/30 block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/50 placeholder:text-white/20 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.15em] uppercase text-white/30 block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/50 placeholder:text-white/20 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.15em] uppercase text-white/30 block mb-1.5">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/50 placeholder:text-white/20 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.15em] uppercase text-white/30 block mb-1.5">
                      College / Department
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your college or department"
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/50 placeholder:text-white/20 cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  disabled
                  className="w-full py-3 rounded-lg border border-white/10 text-white/25 text-xs font-semibold tracking-[0.15em] uppercase cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-euphoria-gold/30 animate-glow-pulse" />
                  Registration opening soon
                </button>
              </div>

              {/* Back */}
              <button
                onClick={onClose}
                className="w-full py-3 text-sm text-white/30 hover:text-white/60 transition-colors tracking-wider uppercase"
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
