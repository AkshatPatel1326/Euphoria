"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
}

interface ParticlesProps {
  className?: string;
  count?: number;
  colors?: string[];
  maxSize?: number;
  speed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function Particles({
  className = "",
  count = 35,
  colors = [
    "rgba(62, 238, 213, 0.25)",
    "rgba(175, 153, 71, 0.20)",
    "rgba(162, 50, 160, 0.15)",
    "rgba(23, 111, 99, 0.18)",
  ],
  maxSize = 3,
  speed = 1,
}: ParticlesProps) {
  const reducedMotion = useReducedMotion();

  const particles = useMemo<Particle[]>(() => {
    const rand = seededRandom(42);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * maxSize + 0.5,
      delay: rand() * 6,
      duration: (rand() * 10 + 8) / speed,
      opacity: rand() * 0.3 + 0.05,
      color: colors[i % colors.length],
    }));
  }, [count, maxSize, colors, speed]);

  if (reducedMotion) return null;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: 0,
            filter: `blur(${p.size > 2 ? 1 : 0}px)`,
          }}
          animate={{
            opacity: [0, p.opacity, p.opacity * 0.5, p.opacity, 0],
            y: [0, -20, -10, -25, 0],
            x: [0, 5, -3, 8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
