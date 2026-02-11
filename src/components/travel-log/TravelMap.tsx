"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Destination } from "@/lib/destinations";

interface TravelMapProps {
  destinations: Destination[];
  activeDestination: Destination | null;
  onDestinationClick: (dest: Destination) => void;
}

// Simple Mercator-ish projection for our purposes
function projectToMap(
  lat: number,
  lng: number,
  width: number,
  height: number,
  padding: number = 40
): { x: number; y: number } {
  // Normalize longitude to 0-1
  const x = ((lng + 180) / 360) * (width - padding * 2) + padding;
  // Mercator-style latitude projection
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = ((1 - mercN / Math.PI) / 2) * (height - padding * 2) + padding;
  return { x, y };
}

export default function TravelMap({
  destinations,
  activeDestination,
  onDestinationClick,
}: TravelMapProps) {
  const width = 600;
  const height = 500;

  // Calculate positions for all destinations
  const positions = useMemo(() => {
    return destinations.map((dest) => ({
      dest,
      ...projectToMap(dest.lat, dest.lng, width, height, 60),
    }));
  }, [destinations]);

  // Generate the travel path
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
        className="w-full h-full max-w-[600px]"
        style={{ overflow: "visible" }}
      >
        {/* Background grid - subtle graph paper effect */}
        <defs>
          <pattern
            id="smallGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#D6CEC0"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="#C4B8A8"
              strokeWidth="1"
            />
          </pattern>
          {/* Marker glow for active state */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#grid)" />

        {/* Compass Rose */}
        <g transform="translate(540, 60)" opacity="0.6">
          <circle r="25" fill="none" stroke="#2A211C" strokeWidth="1" />
          <circle r="20" fill="none" stroke="#2A211C" strokeWidth="0.5" />
          <path d="M 0 -28 L 0 28 M -28 0 L 28 0" stroke="#2A211C" strokeWidth="0.5" />
          {/* N arrow */}
          <path d="M 0 -18 L 4 -8 L 0 -12 L -4 -8 Z" fill="#B56B5D" />
          <text
            y="-32"
            textAnchor="middle"
            fill="#2A211C"
            fontSize="8"
            fontFamily="'Space Mono', monospace"
          >
            N
          </text>
          <text
            y="40"
            textAnchor="middle"
            fill="#2A211C"
            fontSize="8"
            fontFamily="'Space Mono', monospace"
          >
            S
          </text>
          <text
            x="38"
            y="3"
            textAnchor="middle"
            fill="#2A211C"
            fontSize="8"
            fontFamily="'Space Mono', monospace"
          >
            E
          </text>
          <text
            x="-38"
            y="3"
            textAnchor="middle"
            fill="#2A211C"
            fontSize="8"
            fontFamily="'Space Mono', monospace"
          >
            W
          </text>
        </g>

        {/* Scale bar */}
        <g transform="translate(60, 460)">
          <line x1="0" y1="0" x2="80" y2="0" stroke="#2A211C" strokeWidth="1" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#2A211C" strokeWidth="1" />
          <line x1="80" y1="-4" x2="80" y2="4" stroke="#2A211C" strokeWidth="1" />
          <line x1="40" y1="-2" x2="40" y2="2" stroke="#2A211C" strokeWidth="1" />
          <text
            x="40"
            y="14"
            textAnchor="middle"
            fill="#5C4F45"
            fontSize="8"
            fontFamily="'Space Mono', monospace"
          >
            ~ 5,000 KM
          </text>
        </g>

        {/* Travel path - dashed line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#B56B5D"
          strokeWidth="1.5"
          strokeDasharray="8,4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Destination markers and labels */}
        {positions.map(({ dest, x, y }, index) => {
          const isActive = activeDestination?.id === dest.id;
          const isHome = dest.date === "HOME";

          return (
            <g
              key={dest.id}
              transform={`translate(${x}, ${y})`}
              onClick={() => onDestinationClick(dest)}
              style={{ cursor: "pointer" }}
            >
              {/* Connection line to label */}
              <motion.line
                x1="0"
                y1="0"
                x2={index % 2 === 0 ? 20 : -20}
                y2={index % 2 === 0 ? -20 : 20}
                stroke="#2A211C"
                strokeWidth="0.5"
                opacity="0.4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              />

              {/* City label */}
              <motion.g
                transform={`translate(${index % 2 === 0 ? 24 : -24}, ${index % 2 === 0 ? -24 : 24})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <text
                  textAnchor={index % 2 === 0 ? "start" : "end"}
                  fill={isActive ? "#B56B5D" : "#2A211C"}
                  fontSize="11"
                  fontFamily="'Cormorant Garamond', serif"
                  fontWeight={isActive ? "600" : "400"}
                  fontStyle="italic"
                >
                  {dest.city}
                </text>
                <text
                  y="12"
                  textAnchor={index % 2 === 0 ? "start" : "end"}
                  fill="#5C4F45"
                  fontSize="7"
                  fontFamily="'Space Mono', monospace"
                  opacity="0.7"
                >
                  {dest.date}
                </text>
              </motion.g>

              {/* Marker */}
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 300,
                }}
                whileHover={{ scale: 1.2 }}
              >
                {isHome ? (
                  // Home marker - special star shape
                  <>
                    <motion.circle
                      r={isActive ? 16 : 12}
                      fill="rgba(249, 224, 118, 0.5)"
                      filter={isActive ? "url(#glow)" : undefined}
                      animate={{ r: isActive ? 16 : 12 }}
                    />
                    <circle r="6" fill="#F4F0E6" stroke="#2A211C" strokeWidth="1.5" />
                    <circle r="2" fill="#B56B5D" />
                  </>
                ) : (
                  // Regular marker
                  <>
                    {isActive && (
                      <motion.circle
                        r="14"
                        fill="rgba(181, 107, 93, 0.2)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                    <circle
                      r={isActive ? 5 : 4}
                      fill={isActive ? "#B56B5D" : "#F4F0E6"}
                      stroke={isActive ? "#B56B5D" : "#2A211C"}
                      strokeWidth="1.5"
                    />
                    {isActive && <circle r="2" fill="#F4F0E6" />}
                  </>
                )}
              </motion.g>

              {/* Index number near marker */}
              <text
                x="8"
                y="4"
                fill="#5C4F45"
                fontSize="7"
                fontFamily="'Space Mono', monospace"
                opacity="0.6"
              >
                {String(index + 1).padStart(2, "0")}
              </text>
            </g>
          );
        })}

        {/* Title annotation */}
        <g transform="translate(60, 40)">
          <text
            fill="#2A211C"
            fontSize="12"
            fontFamily="'Cormorant Garamond', serif"
            fontStyle="italic"
          >
            FIG. 2 — Route Overview
          </text>
          <line
            x1="0"
            y1="6"
            x2="120"
            y2="6"
            stroke="#2A211C"
            strokeWidth="0.5"
          />
        </g>

        {/* Decorative border corners */}
        <g stroke="#2A211C" strokeWidth="1" fill="none" opacity="0.3">
          <path d="M 20 20 L 20 40 M 20 20 L 40 20" />
          <path d={`M ${width - 20} 20 L ${width - 20} 40 M ${width - 20} 20 L ${width - 40} 20`} />
          <path d={`M 20 ${height - 20} L 20 ${height - 40} M 20 ${height - 20} L 40 ${height - 20}`} />
          <path d={`M ${width - 20} ${height - 20} L ${width - 20} ${height - 40} M ${width - 20} ${height - 20} L ${width - 40} ${height - 20}`} />
        </g>
      </svg>
    </div>
  );
}
