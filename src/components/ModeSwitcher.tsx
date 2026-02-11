"use client";

import { motion } from "framer-motion";
import type { Mode } from "@/lib/modes";

const modes: Mode[] = ["red", "green", "blue"];

const modeLabels: Record<Mode, string> = {
  red: "Food & Travel",
  green: "Sports",
  blue: "Work & Intellect",
};

interface ModeSwitcherProps {
  activeMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function ModeSwitcher({
  activeMode,
  onModeChange,
}: ModeSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5">
      {modes.map((mode) => {
        const isActive = activeMode === mode;
        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            aria-label={`Switch to ${modeLabels[mode]}`}
            className="p-1.5 cursor-pointer"
          >
            <motion.div
              className="rounded-full"
              animate={{
                width: isActive ? 24 : 6,
                height: 6,
                backgroundColor: isActive
                  ? "rgba(245, 240, 235, 0.9)"
                  : "rgba(245, 240, 235, 0.25)",
              }}
              whileHover={{
                backgroundColor: isActive
                  ? "rgba(245, 240, 235, 0.9)"
                  : "rgba(245, 240, 235, 0.5)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </button>
        );
      })}
    </div>
  );
}
