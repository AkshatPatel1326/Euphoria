"use client";

import { useReducedMotion } from "framer-motion";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  speed?: number;
}

export function AnimatedGradientText({
  children,
  className = "",
  gradient = "linear-gradient(90deg, #A232A0, #AF9947, #176F63, #3EEED5, #A232A0)",
  speed = 4,
}: AnimatedGradientTextProps) {
  const reducedMotion = useReducedMotion();

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: "200% 100%",
        animation: reducedMotion
          ? "none"
          : `shimmer ${speed}s ease-in-out infinite`,
      }}
    >
      {children}
    </span>
  );
}
