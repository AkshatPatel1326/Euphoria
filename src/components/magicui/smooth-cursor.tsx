"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  cursorVariant: "default" | "hover" | "button" | "poster";
}

export function SmoothCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    cursorVariant: "default",
  });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [cursorX, cursorY, isVisible],
  );

  const handleMouseDown = useCallback(
    () => setCursorState((s) => ({ ...s, isClicking: true })),
    [],
  );

  const handleMouseUp = useCallback(
    () => setCursorState((s) => ({ ...s, isClicking: false })),
    [],
  );

  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);

  useEffect(() => {
    // Check if device supports hover (desktop)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    // Set up hover detection for interactive elements
    const setupHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'button, a, [role="button"], .event-card, .shimmer-button',
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () =>
          setCursorState((s) => ({
            ...s,
            isHovering: true,
            cursorVariant: el.closest(".event-card")
              ? "poster"
              : "button",
          })),
        );
        el.addEventListener("mouseleave", () =>
          setCursorState((s) => ({
            ...s,
            isHovering: false,
            cursorVariant: "default",
          })),
        );
      });
    };

    // Initial setup + re-setup on DOM changes
    setupHoverListeners();
    const observer = new MutationObserver(setupHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter,
      );
      observer.disconnect();
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseEnter]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) {
    return null;
  }

  const ringScale =
    cursorState.cursorVariant === "button"
      ? 1.8
      : cursorState.cursorVariant === "poster"
        ? 2.2
        : 1;

  const ringSize = cursorState.isClicking ? 0.8 : ringScale;

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        @media (hover: hover) {
          * { cursor: none !important; }
        }
      `}</style>

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            scale: cursorState.isClicking ? 0.6 : 1,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 500 }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "rgba(62, 238, 213, 0.9)" }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 0.5 : 0,
        }}
      >
        <motion.div
          animate={{
            scale: ringSize,
            borderColor: cursorState.isHovering
              ? "rgba(62, 238, 213, 0.4)"
              : "rgba(255, 255, 255, 0.2)",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-8 h-8 rounded-full border"
          style={{
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        />
      </motion.div>
    </>
  );
}
