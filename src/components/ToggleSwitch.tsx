"use client";

import { motion } from "framer-motion";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  activeColor?: string;
  borderColor?: string;
}

export default function ToggleSwitch({
  isOn,
  onToggle,
  activeColor = "#fed",
  borderColor = "rgba(255, 238, 221, 0.3)",
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="cursor-pointer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        padding: "2px",
        border: `1px solid ${borderColor}`,
        borderRadius: "2px",
        background: "none",
      }}
    >
      <motion.div
        animate={{ opacity: isOn ? 1 : 0.2 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        style={{
          width: "20px",
          height: "5px",
          borderRadius: "1px",
          background: activeColor,
        }}
      />
      <motion.div
        animate={{ opacity: isOn ? 0.2 : 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        style={{
          width: "14px",
          height: "5px",
          borderRadius: "1px",
          background: activeColor,
        }}
      />
    </button>
  );
}
