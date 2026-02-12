"use client";

import { useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Destination } from "@/lib/destinations";

interface DestinationListProps {
  destinations: Destination[];
  activeIndex: number;
  onSelect: (index: number) => void;
  bgColor: string;
  hasLog?: boolean;
  onViewLog?: () => void;
}

const ITEM_HEIGHT = 22;
const VISIBLE_ITEMS = 9; // must be odd so there's a true center
const HALF = Math.floor(VISIBLE_ITEMS / 2);
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

/** Wrap index into [0, length) */
function wrap(i: number, length: number) {
  return ((i % length) + length) % length;
}

export default function DestinationList({
  destinations,
  activeIndex,
  onSelect,
  bgColor,
  hasLog,
  onViewLog,
}: DestinationListProps) {
  const total = destinations.length;
  const activeDestination = destinations[activeIndex];
  const scrollAccum = useRef(0);

  // Build the visible window: VISIBLE_ITEMS slots, center = active
  const slots = Array.from({ length: VISIBLE_ITEMS }, (_, i) => {
    const offset = i - HALF; // -4 … 0 … +4
    const destIndex = wrap(activeIndex + offset, total);
    return { offset, destIndex, dest: destinations[destIndex] };
  });

  // Opacity based on distance from center
  const getOpacity = useCallback((offset: number) => {
    const d = Math.abs(offset);
    if (d === 0) return 1;
    if (d === 1) return 0.5;
    if (d === 2) return 0.3;
    if (d === 3) return 0.15;
    return 0.08;
  }, []);

  // Move selection by delta (positive = scroll down / next item)
  const moveBy = useCallback(
    (delta: number) => {
      onSelect(wrap(activeIndex + delta, total));
    },
    [activeIndex, total, onSelect],
  );

  // Mouse wheel handler — accumulate small deltas
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      scrollAccum.current += e.deltaY;
      const threshold = 40;
      if (scrollAccum.current > threshold) {
        moveBy(1);
        scrollAccum.current = 0;
      } else if (scrollAccum.current < -threshold) {
        moveBy(-1);
        scrollAccum.current = 0;
      }
    },
    [moveBy],
  );

  // Click handler: item at `offset` from center → move by that offset
  const handleItemClick = useCallback(
    (offset: number) => {
      if (offset !== 0) moveBy(offset);
    },
    [moveBy],
  );

  return (
    <div
      className="flex items-center gap-3"
      style={{ height: CONTAINER_HEIGHT }}
      onWheel={handleWheel}
    >
      {/* Column 1: Keyword */}
      <div
        className="relative flex items-center justify-end"
        style={{ width: 60, height: CONTAINER_HEIGHT }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={activeDestination?.keyword}
            className="text-xs font-sans select-none"
            style={{ color: "var(--cream)", opacity: 0.5 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            {activeDestination?.keyword}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Column 2: Divider */}
      <div
        className="relative flex flex-col items-center"
        style={{ width: 1, height: CONTAINER_HEIGHT }}
      >
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ backgroundColor: "var(--cream)", opacity: 0.12 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px"
          style={{
            height: 11,
            backgroundColor: "var(--cream)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* Column 3: Circular city list — masked edges instead of color overlays */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 110,
          height: CONTAINER_HEIGHT,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {slots.map(({ offset, destIndex, dest }) => {
            const isCenter = offset === 0;
            const opacity = getOpacity(offset);
            const yPos = (offset + HALF) * ITEM_HEIGHT;

            return (
              <motion.button
                key={dest.id}
                onClick={() => handleItemClick(offset)}
                className="absolute left-0 w-full text-left cursor-pointer bg-transparent border-none outline-none p-0"
                style={{
                  height: ITEM_HEIGHT,
                  WebkitTapHighlightColor: "transparent",
                }}
                initial={{ y: yPos, opacity: 0 }}
                animate={{ y: yPos, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  y: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
                  opacity: { duration: 0.2 },
                }}
              >
                <motion.span
                  className="block text-xs font-sans leading-none select-none"
                  style={{ color: "var(--cream)" }}
                  animate={{
                    opacity,
                    fontWeight: isCenter ? 500 : 400,
                  }}
                  whileHover={{ opacity: Math.max(opacity, 0.7) }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  {dest.city}
                </motion.span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Column 4: "View log" — only visible when the active city has a log */}
      <AnimatePresence>
        {hasLog && onViewLog && (
          <motion.div
            className="flex items-center gap-2"
            style={{ height: CONTAINER_HEIGHT }}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Short divider */}
            <div
              className="w-px self-center"
              style={{
                height: 11,
                backgroundColor: "var(--cream)",
                opacity: 0.25,
              }}
            />
            <button
              onClick={onViewLog}
              className="flex items-center gap-1.5 bg-transparent border-none outline-none cursor-pointer p-0"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span
                className="text-xs font-sans select-none"
                style={{ color: "var(--cream)", opacity: 0.8 }}
              >
                View log
              </span>
              {/* Book icon */}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--cream)", opacity: 0.6 }}
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
