"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  background?: string;
  borderRadius?: string;
  onClick?: () => void;
}

export function ShimmerButton({
  children,
  className = "",
  shimmerColor = "rgba(62, 238, 213, 0.4)",
  shimmerSize = "200px",
  shimmerDuration = "2.5s",
  background = "rgba(62, 238, 213, 0.08)",
  borderRadius = "0.75rem",
  onClick,
}: ShimmerButtonProps) {
  const reducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={buttonRef}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative group overflow-hidden ${className}`}
      style={{
        background,
        borderRadius,
      }}
    >
      {/* Shimmer sweep overlay */}
      {!reducedMotion && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${shimmerColor} 45%, ${shimmerColor} 55%, transparent 60%)`,
            backgroundSize: `${shimmerSize} 100%`,
            animation: `shimmer ${shimmerDuration} ease-in-out infinite`,
            borderRadius,
          }}
        />
      )}
      {/* Glow on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
        style={{
          boxShadow: `0 0 30px rgba(62, 238, 213, 0.15), inset 0 0 30px rgba(62, 238, 213, 0.05)`,
          borderRadius,
        }}
      />
      {/* Border */}
      <span
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          borderRadius,
          border: "1px solid rgba(62, 238, 213, 0.3)",
        }}
      />
      {/* Content */}
      <span className="relative z-10 block">{children}</span>
    </motion.button>
  );
}
