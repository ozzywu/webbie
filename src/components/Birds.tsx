"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";

// ═══════════════════════════════════════════
// Tiny vectorized birds — stencil / outline
// style matching the BookAnimation aesthetic
// ═══════════════════════════════════════════

const BIRD_COLOR = "rgb(85, 115, 55)";

// Each bird has a slightly different wing silhouette
// (mirrors the distinct page-edge profiles in BookAnimation)
const BIRD_PATHS = [
  // graceful, wide wings
  {
    up: "M0,5 C1.5,1.5 3.5,0 7,3 C10.5,0 12.5,1.5 14,5",
    down: "M0,3.5 C1.5,2.8 3.5,2.8 7,3.5 C10.5,2.8 12.5,2.8 14,3.5",
    w: 14,
  },
  // tighter, quicker bird
  {
    up: "M0,4.5 C1,1 3,0.5 6,3 C9,0.5 11,1 12,4.5",
    down: "M0,3 C1,2.2 3,2.5 6,3 C9,2.5 11,2.2 12,3",
    w: 12,
  },
  // elongated, soaring
  {
    up: "M0,5 C2,1 4.5,0 8,3.5 C11.5,0 14,1 16,5",
    down: "M0,3.5 C2,2.8 4.5,2.5 8,3.5 C11.5,2.5 14,2.8 16,3.5",
    w: 16,
  },
];

interface BirdConfig {
  offsetX: number;
  offsetY: number;
  size: number;
  opacity: number;
  flapDuration: number;
  stiffness: number;
  damping: number;
  pathIdx: number;
}

const FLOCK: BirdConfig[] = [
  {
    offsetX: -35,
    offsetY: -30,
    size: 16,
    opacity: 0.25,
    flapDuration: 1.8,
    stiffness: 28,
    damping: 20,
    pathIdx: 0,
  },
  {
    offsetX: 30,
    offsetY: -50,
    size: 11,
    opacity: 0.18,
    flapDuration: 1.3,
    stiffness: 18,
    damping: 16,
    pathIdx: 1,
  },
  {
    offsetX: -60,
    offsetY: 8,
    size: 13,
    opacity: 0.2,
    flapDuration: 2.1,
    stiffness: 22,
    damping: 22,
    pathIdx: 2,
  },
];

// ═══════════════════════════════════════════

function Bird({
  config,
  mouseX,
  mouseY,
}: {
  config: BirdConfig;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const targetX = useTransform(mouseX, (v) => v + config.offsetX);
  const targetY = useTransform(mouseY, (v) => v + config.offsetY);

  const x = useSpring(targetX, {
    stiffness: config.stiffness,
    damping: config.damping,
  });
  const y = useSpring(targetY, {
    stiffness: config.stiffness,
    damping: config.damping,
  });

  const paths = BIRD_PATHS[config.pathIdx];

  return (
    <motion.svg
      style={{ x, y, position: "absolute", top: 0, left: 0 }}
      width={config.size}
      height={config.size * 0.45}
      viewBox={`0 0 ${paths.w} 6`}
      fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <motion.path
        stroke={BIRD_COLOR}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={config.opacity}
        fill="none"
        animate={{ d: [paths.up, paths.down, paths.up] }}
        transition={{
          duration: config.flapDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.svg>
  );
}

// ═══════════════════════════════════════════

export default function Birds() {
  const mouseX = useMotionValue(
    typeof window !== "undefined" ? window.innerWidth * 0.5 : 500,
  );
  const mouseY = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight * 0.4 : 350,
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {FLOCK.map((config, i) => (
        <Bird key={i} config={config} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}
