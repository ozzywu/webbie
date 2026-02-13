"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ToggleSwitch() {
  const [isOn, setIsOn] = useState(true);

  return (
    <button
      type="button"
      onClick={() => setIsOn(!isOn)}
      className="cursor-pointer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        padding: "2px",
        border: "1px solid rgba(255, 238, 221, 0.3)",
        borderRadius: "2px",
        background: "none",
      }}
    >
      {/* "On" bar — longer */}
      <motion.div
        animate={{
          opacity: isOn ? 1 : 0.2,
        }}
        transition={{
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        }}
        style={{
          width: "20px",
          height: "5px",
          borderRadius: "1px",
          background: "#fed",
        }}
      />
      {/* "Off" bar — shorter */}
      <motion.div
        animate={{
          opacity: isOn ? 0.2 : 1,
        }}
        transition={{
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        }}
        style={{
          width: "14px",
          height: "5px",
          borderRadius: "1px",
          background: "#fed",
        }}
      />
    </button>
  );
}
