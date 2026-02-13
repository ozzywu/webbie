"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINE_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/**
 * A vertical decorative line that draws itself in from the top on load,
 * matching the line-drawing animation from the /work page.
 */
export function AnimatedLine({
  side,
  delay = 0.05,
}: {
  side: "left" | "right";
  delay?: number;
}) {
  return (
    <motion.div
      className="w-px shrink-0 hidden md:block"
      style={{
        background: "rgba(157, 124, 124, 0.3)",
        transformOrigin: "top",
      }}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 1.2, ease: LINE_EASE, delay }}
    />
  );
}

/**
 * Two short fixed red accent marks that sit exactly on top of the
 * muted decorative lines. Measures the actual rendered position of
 * the content container (via data-article-container) and places the
 * accents at those exact pixel coordinates — guaranteed alignment
 * regardless of scrollbar width or body margins.
 */
export function FixedRedLines() {
  const [pos, setPos] = useState<{ left: number; right: number } | null>(null);

  useEffect(() => {
    const sync = () => {
      const el = document.querySelector(
        "[data-article-container]",
      ) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        setPos({ left: rect.left, right: rect.right });
      }
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  if (!pos) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 hidden md:block"
      aria-hidden
    >
      {/* Left red accent — sits on left muted line */}
      <motion.div
        className="absolute w-px"
        style={{
          left: pos.left,
          top: "50%",
          height: "60px",
          background: "#670000",
          transformOrigin: "center",
        }}
        initial={{ opacity: 0, scaleY: 0, y: "-50%" }}
        animate={{ opacity: 1, scaleY: 1, y: "-50%" }}
        transition={{ duration: 0.8, ease: LINE_EASE, delay: 1.2 }}
      />
      {/* Right red accent — sits on right muted line */}
      <motion.div
        className="absolute w-px"
        style={{
          left: pos.right - 1,
          top: "50%",
          height: "60px",
          background: "#670000",
          transformOrigin: "center",
        }}
        initial={{ opacity: 0, scaleY: 0, y: "-50%" }}
        animate={{ opacity: 1, scaleY: 1, y: "-50%" }}
        transition={{ duration: 0.8, ease: LINE_EASE, delay: 1.4 }}
      />
    </div>
  );
}

/**
 * Wrapper that fades content in after the line-drawing animation completes.
 */
export function AnimatedContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: LINE_EASE, delay: 0.9 }}
    >
      {children}
    </motion.div>
  );
}
