"use client";

import { motion, useReducedMotion } from "framer-motion";

interface LightRaysProps {
  className?: string;
  colors?: string[];
  rayCount?: number;
  opacity?: number;
  speed?: number;
}

export function LightRays({
  className = "",
  colors = [
    "rgba(162, 50, 160, 0.12)",
    "rgba(91, 27, 82, 0.15)",
    "rgba(23, 111, 99, 0.10)",
    "rgba(62, 238, 213, 0.06)",
  ],
  rayCount = 14,
  opacity = 0.5,
  speed = 35,
}: LightRaysProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  const rays = Array.from({ length: rayCount }, (_, i) => ({
    id: i,
    angle: (360 / rayCount) * i,
    color: colors[i % colors.length],
    width: 2 + (i % 3) * 0.5,
    length: 50 + (i % 4) * 8,
  }));

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity, scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            transformOrigin: "50% 50%",
            animation: `spin-slow ${speed}s linear infinite`,
          }}
        >
          {rays.map((ray) => (
            <div
              key={ray.id}
              className="absolute left-1/2 top-1/2 origin-left"
              style={{
                transform: `rotate(${ray.angle}deg)`,
                width: `${ray.length}%`,
                height: `${ray.width}px`,
                background: `linear-gradient(90deg, ${ray.color} 0%, transparent 100%)`,
                filter: "blur(1px)",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
