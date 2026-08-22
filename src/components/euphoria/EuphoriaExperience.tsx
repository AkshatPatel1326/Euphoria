import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const words = [
  { text: "CREATE.", color: "from-euphoria-gold to-amber-400" },
  { text: "COMPETE.", color: "from-euphoria-purple to-fuchsia-500" },
  { text: "PERFORM.", color: "from-euphoria-aqua to-cyan-300" },
  { text: "CONNECT.", color: "from-euphoria-teal to-emerald-400" },
];

export function EuphoriaExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-28 sm:py-36 lg:py-44 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-euphoria-dark" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91, 27, 82, 0.15) 0%, transparent 60%)",
        }}
      />

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-gold/[0.06] to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-euphoria-teal/[0.06] to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase text-euphoria-gold/50 mb-4">
            The Euphoria Experience
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white/90 mb-4">
            More Than Events.
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-euphoria-gold/40 to-transparent mx-auto mb-16 sm:mb-20" />
        </motion.div>

        {/* Words — staggered reveal */}
        <div className="space-y-6 sm:space-y-8">
          {words.map((word, i) => (
            <motion.div
              key={word.text}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: "easeOut" }}
            >
              <span
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter bg-gradient-to-r ${word.color} bg-clip-text text-transparent`}
                style={{
                  textShadow: "0 0 80px rgba(0,0,0,0.3)",
                }}
              >
                {word.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Decorative bottom accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 sm:mt-20 flex justify-center gap-3"
        >
          {["bg-euphoria-gold", "bg-euphoria-purple", "bg-euphoria-aqua", "bg-euphoria-teal"].map(
            (color) => (
              <div key={color} className={`w-1 h-8 rounded-full ${color} opacity-20`} />
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
