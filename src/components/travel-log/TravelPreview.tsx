"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { destinations } from "@/lib/destinations";

// Simple projection for preview
function projectToMap(
  lat: number,
  lng: number,
  width: number,
  height: number,
  padding: number = 20
): { x: number; y: number } {
  const x = ((lng + 180) / 360) * (width - padding * 2) + padding;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = ((1 - mercN / Math.PI) / 2) * (height - padding * 2) + padding;
  return { x, y };
}

export default function TravelPreview() {
  const width = 200;
  const height = 200;

  const positions = useMemo(() => {
    return destinations.map((dest) => ({
      dest,
      ...projectToMap(dest.lat, dest.lng, width, height, 30),
    }));
  }, []);

  const pathD = useMemo(() => {
    if (positions.length < 2) return "";
    return positions
      .map((pos, i) => `${i === 0 ? "M" : "L"} ${pos.x} ${pos.y}`)
      .join(" ");
  }, [positions]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Subtle grid */}
        <defs>
          <pattern
            id="previewGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              opacity="0.2"
            />
          </pattern>
        </defs>

        <rect width={width} height={height} fill="url(#previewGrid)" />

        {/* Travel path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4,2"
          strokeLinecap="round"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Markers */}
        {positions.map(({ dest, x, y }, index) => {
          const isHome = dest.date === "HOME";
          return (
            <motion.g
              key={dest.id}
              transform={`translate(${x}, ${y})`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
              }}
            >
              {isHome ? (
                <>
                  <circle r="6" fill="currentColor" opacity="0.2" />
                  <circle r="3" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle r="1" fill="currentColor" />
                </>
              ) : (
                <circle r="2" fill="currentColor" opacity="0.7" />
              )}
            </motion.g>
          );
        })}

        {/* Decorative corners */}
        <g stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3">
          <path d="M 10 10 L 10 25 M 10 10 L 25 10" />
          <path d={`M ${width - 10} 10 L ${width - 10} 25 M ${width - 10} 10 L ${width - 25} 10`} />
          <path d={`M 10 ${height - 10} L 10 ${height - 25} M 10 ${height - 10} L 25 ${height - 10}`} />
          <path d={`M ${width - 10} ${height - 10} L ${width - 10} ${height - 25} M ${width - 10} ${height - 10} L ${width - 25} ${height - 10}`} />
        </g>

        {/* Small label */}
        <text
          x={width / 2}
          y={height - 12}
          textAnchor="middle"
          fill="currentColor"
          fontSize="8"
          fontFamily="'Space Mono', monospace"
          opacity="0.5"
        >
          {destinations.length} DESTINATIONS
        </text>
      </svg>
    </div>
  );
}
