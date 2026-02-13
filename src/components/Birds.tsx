"use client";

import { useEffect, useRef, MutableRefObject } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";

// ═══════════════════════════════════════════
// Side-profile swallow silhouettes
// Filled, cursor-following, wing-flapping,
// with soft repulsion around [data-bird-avoid] elements
// ═══════════════════════════════════════════

const BIRD_COLOR = "rgb(70, 100, 45)";

// ── Avoidance ──────────────────────────────

interface AvoidZone {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

// Large padding so the spring buffer keeps birds well clear of text
const AVOID_PADDING = 80;

/**
 * Push a point away from rectangular avoid zones.
 *
 * `pushDir` (-1 or 1) determines which side a bird is sent to when
 * its target lands *inside* a zone. Using the bird's inherent offset
 * sign keeps the direction consistent — the target never flips from
 * one side of the zone to the other, which would cause the spring to
 * cut through the text.
 *
 * Outside but within AVOID_PADDING: smooth quadratic push.
 */
function applyAvoidance(
  tx: number,
  ty: number,
  zones: AvoidZone[],
  pushDir: number,
): [number, number] {
  let ax = tx;
  let ay = ty;

  for (const z of zones) {
    const isInside =
      ax >= z.left && ax <= z.right && ay >= z.top && ay <= z.bottom;

    if (isInside) {
      // Consistent horizontal push — never flips
      if (pushDir < 0) ax = z.left - AVOID_PADDING * 0.6;
      else ax = z.right + AVOID_PADDING * 0.6;
    } else {
      // Closest point on rectangle boundary
      const nearX = Math.max(z.left, Math.min(ax, z.right));
      const nearY = Math.max(z.top, Math.min(ay, z.bottom));
      const dx = ax - nearX;
      const dy = ay - nearY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < AVOID_PADDING && dist > 0.1) {
        // Smooth quadratic repulsion — zero at AVOID_PADDING, strong near edge
        const t = 1 - dist / AVOID_PADDING;
        const push = t * t * AVOID_PADDING;
        ax += (dx / dist) * push;
        ay += (dy / dist) * push;
      }
    }
  }

  return [ax, ay];
}

// ── Bird shape ─────────────────────────────

const FLAP = {
  up: "M24,8 C22,7 18,5.5 14,4 C10,0 6,-2 3,-2.5 C1,-3 0.5,-1 2,1 C4,3.5 8,6 11,7.5 C8,7.5 5,7.5 2.5,7 C0.5,6.5 0.5,9.5 2.5,9 C5,8.5 8,8.5 11,8.2 C8,8.5 4,10 2,11 C0.5,12 0.5,12.5 3,12.5 C6,11 10,9 14,9 C18,10.5 22,9 24,8 Z",
  mid: "M24,8 C22,7 18,5.5 14,4 C10,2 6,0 3,-0.5 C1,-1 0.5,0.5 2,2.5 C4,5 8,7 11,7.8 C8,7.5 5,7.5 2.5,7 C0.5,6.5 0.5,9.5 2.5,9 C5,8.5 8,8.5 11,8.2 C8,9 4,12 2,13.5 C0.5,15 0.5,16 3,16.5 C6,14.5 10,12 14,12 C18,10.5 22,9 24,8 Z",
  down: "M24,8 C22,7 18,5.5 14,4 C10,4 6,4 3,3 C1,3 0.5,3.5 2,4.5 C4,6 8,7.5 11,8 C8,7.5 5,7.5 2.5,7 C0.5,6.5 0.5,9.5 2.5,9 C5,8.5 8,8.5 11,8.2 C8,11 4,15 2,17 C0.5,18 0.5,18.5 3,19 C6,17 10,14 14,14 C18,10.5 22,9 24,8 Z",
};

// ── Flock config ───────────────────────────

interface BirdConfig {
  offsetX: number;
  offsetY: number;
  size: number;
  opacity: number;
  flapDuration: number;
  stiffness: number;
  damping: number;
}

const FLOCK: BirdConfig[] = [
  {
    offsetX: -40,
    offsetY: -35,
    size: 22,
    opacity: 0.45,
    flapDuration: 1.6,
    stiffness: 28,
    damping: 20,
  },
  {
    offsetX: 35,
    offsetY: -55,
    size: 16,
    opacity: 0.35,
    flapDuration: 1.2,
    stiffness: 18,
    damping: 16,
  },
  {
    offsetX: -65,
    offsetY: 10,
    size: 18,
    opacity: 0.38,
    flapDuration: 1.8,
    stiffness: 22,
    damping: 22,
  },
];

// ═══════════════════════════════════════════

function Bird({
  config,
  mouseX,
  mouseY,
  zonesRef,
}: {
  config: BirdConfig;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  zonesRef: MutableRefObject<AvoidZone[]>;
}) {
  // Each bird always deflects the same way (left-offset birds go left, etc.)
  const pushDir = config.offsetX < 0 ? -1 : 1;

  // Target = cursor + offset, deflected by avoidance
  const targetX = useTransform([mouseX, mouseY], ([mx, my]) => {
    const [ax] = applyAvoidance(
      (mx as number) + config.offsetX,
      (my as number) + config.offsetY,
      zonesRef.current,
      pushDir,
    );
    return ax;
  });

  const targetY = useTransform([mouseX, mouseY], ([mx, my]) => {
    const [, ay] = applyAvoidance(
      (mx as number) + config.offsetX,
      (my as number) + config.offsetY,
      zonesRef.current,
      pushDir,
    );
    return ay;
  });

  const springX = useSpring(targetX, {
    stiffness: config.stiffness,
    damping: config.damping,
  });
  const springY = useSpring(targetY, {
    stiffness: config.stiffness,
    damping: config.damping,
  });

  // ── Heading: face direction of travel ──
  const heading = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const dx = targetX.get() - springX.get();
      const dy = targetY.get() - springY.get();
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const cur = heading.get();
      while (angle - cur > 180) angle -= 360;
      while (angle - cur < -180) angle += 360;
      heading.set(angle);
    };

    const unsubX = springX.on("change", update);
    const unsubY = springY.on("change", update);
    return () => {
      unsubX();
      unsubY();
    };
  }, [springX, springY, targetX, targetY, heading]);

  const smoothHeading = useSpring(heading, { stiffness: 60, damping: 18 });

  // Center the SVG on the spring position
  const aspectRatio = 16 / 24;
  const svgH = config.size * aspectRatio;
  const displayX = useTransform(springX, (v) => v - config.size / 2);
  const displayY = useTransform(springY, (v) => v - svgH / 2);

  return (
    <motion.svg
      style={{
        x: displayX,
        y: displayY,
        rotate: smoothHeading,
        position: "absolute",
        top: 0,
        left: 0,
        transformOrigin: "center center",
      }}
      width={config.size}
      height={svgH}
      viewBox="0 0 24 16"
      overflow="visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <motion.path
        fill={BIRD_COLOR}
        opacity={config.opacity}
        animate={{
          d: [FLAP.up, FLAP.mid, FLAP.down, FLAP.mid, FLAP.up],
        }}
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

  // ── Avoidance zones from DOM elements ──
  const zonesRef = useRef<AvoidZone[]>([]);

  useEffect(() => {
    const updateZones = () => {
      const els = document.querySelectorAll("[data-bird-avoid]");
      zonesRef.current = Array.from(els).map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      });
    };

    updateZones();
    const timer = setTimeout(updateZones, 500);
    document.fonts?.ready.then(updateZones);

    window.addEventListener("resize", updateZones);

    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateZones);
      window.removeEventListener("mousemove", handler);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {FLOCK.map((config, i) => (
        <Bird
          key={i}
          config={config}
          mouseX={mouseX}
          mouseY={mouseY}
          zonesRef={zonesRef}
        />
      ))}
    </div>
  );
}
