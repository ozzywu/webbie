"use client";

import { motion } from "framer-motion";

// ═══════════════════════════════════════════
// Wind-blown open book — stencil / outline
// ═══════════════════════════════════════════
//
// Refinements:
//   1. Each page has a distinct edge profile
//      (convex, concave, corner curl, wave)
//   2. Stroke gradient fades from spine → free edge
//   3. Soft ground shadow for depth
//   4. Spine breathes with the wind
// ═══════════════════════════════════════════

interface BookAnimationProps {
  color?: string;
}

// Each page has a unique silhouette so they read as
// individual sheets even when overlapping at rest.
const PAGES = [
  // ── gentle convex bow on free edge ──
  {
    delay: 0,
    dur: 3.1,
    rot: 4,
    lift: 3,
    sx: 0.88,
    o: 0.50,
    d: "M110 23 C125 21 185 25 192 30 C198 55 200 105 200 128 C196 133 125 139 110 139",
  },
  // ── concave free edge, curling inward ──
  {
    delay: 0.6,
    dur: 2.4,
    rot: 10,
    lift: 9,
    sx: 0.55,
    o: 0.40,
    d: "M110 25 C127 23 183 27 190 32 C184 58 182 102 188 126 C184 131 127 137 110 137",
  },
  // ── S-curve wave on right edge ──
  {
    delay: 1.4,
    dur: 4.3,
    rot: 5,
    lift: 4,
    sx: 0.82,
    o: 0.32,
    d: "M110 27 C129 25 180 29 187 34 C192 55 184 100 192 124 C188 129 129 135 110 135",
  },
  // ── corner curl at top-right ──
  {
    delay: 0.2,
    dur: 1.9,
    rot: 13,
    lift: 11,
    sx: 0.42,
    o: 0.38,
    d: "M110 26 C128 24 170 26 178 30 Q188 22 183 18 Q178 25 182 34 L190 126 C186 131 128 136 110 136",
  },
  // ── clean flat edge, acts as contrast ──
  {
    delay: 2.1,
    dur: 5.1,
    rot: 3,
    lift: 2,
    sx: 0.93,
    o: 0.18,
    d: "M110 29 C131 27 180 31 186 36 L194 123 C190 128 131 133 110 133",
  },
  // ── aggressive curl, page really caught by wind ──
  {
    delay: 0.9,
    dur: 2.0,
    rot: 16,
    lift: 14,
    sx: 0.30,
    o: 0.30,
    d: "M110 24 C126 22 165 24 174 28 Q186 18 180 14 Q172 22 178 34 C184 60 188 100 192 128 C188 133 126 138 110 138",
  },
  // ── wavy right edge, gentle undulation ──
  {
    delay: 1.8,
    dur: 3.7,
    rot: 7,
    lift: 6,
    sx: 0.72,
    o: 0.24,
    d: "M110 28 C130 26 178 30 185 35 C190 50 184 70 190 90 C196 110 188 122 192 124 C188 129 130 134 110 134",
  },
];

export default function BookAnimation({
  color = "#670000",
}: BookAnimationProps) {
  return (
    <motion.svg
      viewBox="0 0 220 160"
      fill="none"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* ── Definitions: gradient + shadow filter ── */}
      <defs>
        {/* Stroke gradient: strong at spine, fading at free edge */}
        <linearGradient
          id="pageStroke"
          x1="110"
          y1="0"
          x2="205"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>

        {/* Soft blur for ground shadow */}
        <filter
          id="bookShadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse
        cx="110"
        cy="150"
        rx="88"
        ry="6"
        fill="rgba(0,0,0,0.07)"
        filter="url(#bookShadow)"
      />

      {/* ── Left cover ── */}
      <path
        d="M110 20 C95 18 28 24 22 30 L14 130 C18 136 95 142 110 142"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ── Right cover ── */}
      <path
        d="M110 20 C125 18 192 24 198 30 L206 130 C202 136 125 142 110 142"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ── Living spine — breathes with the wind ── */}
      <motion.path
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        animate={{
          d: [
            "M110 16 C109 50 111 110 110 144",
            "M110 16 C107 50 113 110 110 144",
            "M110 16 C111 50 109 110 110 144",
            "M110 16 C109 50 111 110 110 144",
          ],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.75, 1],
        }}
      />

      {/* ── Stacked-page edges visible on left side ── */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={`edge-${i}`}
          d={`M110 ${22 + i * 1.5} C${96 + i} ${20 + i * 1.5} ${30 + i * 2} ${26 + i * 1.5} ${24 + i * 2} ${32 + i * 1.5}`}
          stroke={color}
          strokeWidth=".4"
          opacity={0.3 - i * 0.06}
        />
      ))}

      {/* ── Wind-blown fluttering pages (right side) ── */}
      {PAGES.map(({ delay, dur, rot, lift, sx, o, d }, i) => (
        <motion.g
          key={i}
          style={{ transformOrigin: "110px 80px" }}
          animate={{
            rotate: [0, -rot * 0.3, -rot, -rot * 0.5, -rot * 0.2, 0],
            y: [0, -lift * 0.2, -lift, -lift * 0.6, -lift * 0.15, 0],
            scaleX: [
              1,
              1 - (1 - sx) * 0.4,
              sx,
              1 - (1 - sx) * 0.6,
              1 - (1 - sx) * 0.2,
              1,
            ],
          }}
          transition={{
            duration: dur,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.45, 0.65, 0.85, 1],
          }}
        >
          <path
            d={d}
            stroke="url(#pageStroke)"
            strokeWidth={Math.max(0.3, 0.7 - i * 0.05)}
            opacity={o}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </motion.g>
      ))}
    </motion.svg>
  );
}
