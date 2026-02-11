"use client";

import { motion } from "framer-motion";
import { Destination } from "@/lib/destinations";

interface TravelOrbProps {
  destination?: Destination;
}

export default function TravelOrb({ destination }: TravelOrbProps) {
  // Derive a pin position from lat/lng for visual variety
  const pinTop = destination
    ? 40 + ((90 - destination.lat) / 180) * 20
    : 42;
  const pinLeft = destination
    ? 40 + ((destination.lng + 180) / 360) * 20
    : 54;

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* The orb */}
      <div
        className="relative w-48 h-48 rounded-full overflow-hidden"
        style={{
          backgroundColor: "rgba(245, 240, 235, 0.9)",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Cartographic grid */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 192 192"
        >
          <g opacity="0.06" stroke="#2A211C" fill="none">
            <line x1="0" y1="48" x2="192" y2="48" strokeWidth="0.5" />
            <line x1="0" y1="96" x2="192" y2="96" strokeWidth="0.5" />
            <line x1="0" y1="144" x2="192" y2="144" strokeWidth="0.5" />
            <line x1="48" y1="0" x2="48" y2="192" strokeWidth="0.5" />
            <line x1="96" y1="0" x2="96" y2="192" strokeWidth="0.5" />
            <line x1="144" y1="0" x2="144" y2="192" strokeWidth="0.5" />
            {/* Crosshair center */}
            <circle cx="96" cy="96" r="4" strokeWidth="0.5" />
            <line x1="96" y1="84" x2="96" y2="108" strokeWidth="0.5" />
            <line x1="84" y1="96" x2="108" y2="96" strokeWidth="0.5" />
          </g>
        </svg>

        {/* Location indicator — animated position */}
        <motion.div
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: "#943C3C",
            boxShadow: "0 0 8px rgba(148, 60, 60, 0.5)",
          }}
          animate={{
            top: `${pinTop}%`,
            left: `${pinLeft}%`,
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        />

        {/* Pulse ring around pin */}
        <motion.div
          className="absolute w-4 h-4 rounded-full border"
          style={{
            borderColor: "rgba(148, 60, 60, 0.3)",
            transform: "translate(-25%, -25%)",
          }}
          animate={{
            top: `${pinTop}%`,
            left: `${pinLeft}%`,
            scale: [1, 1.8, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            top: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
            left: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>

      {/* Coordinates */}
      <motion.p
        className="text-[10px] tracking-[0.15em] font-mono"
        style={{ color: "rgba(245, 240, 235, 0.3)" }}
        key={destination?.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {destination?.coords ?? "48.8566° N, 2.3522° E"}
      </motion.p>
    </motion.div>
  );
}
