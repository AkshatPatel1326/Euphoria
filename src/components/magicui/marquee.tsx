"use client";

import { useReducedMotion } from "framer-motion";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className = "",
  speed = 30,
  direction = "left",
  pauseOnHover = true,
}: MarqueeProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const duration = `${speed}s`;
  const animationDirection = direction === "right" ? "reverse" : "normal";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className={`flex w-max ${pauseOnHover ? "group" : ""}`}
        style={{
          animation: `marquee ${duration} linear infinite`,
          animationDirection,
        }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}

interface MarqueeItemProps {
  children: React.ReactNode;
  className?: string;
}

export function MarqueeItem({ children, className = "" }: MarqueeItemProps) {
  return <div className={`flex shrink-0 ${className}`}>{children}</div>;
}
