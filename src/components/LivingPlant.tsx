"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { generateString, interpret, getBounds } from "@/lib/lsystem";

// ═══════════════════════════════════════════
// L-system configuration
// ═══════════════════════════════════════════

const PLANT_RULES = { X: "F+[[X]-X]-F[-FX]+X", F: "FF" };
const PLANT_ANGLE_DEG = 25;
const PLANT_STEP = 1.0;
const ITERATIONS = 7; // detail level that matches the ~17x view
const PLANT_SCALE = 30; // locked zoom level

// ═══════════════════════════════════════════
// Wind noise
// ═══════════════════════════════════════════

function windNoise(y: number, t: number): number {
  const breathe = Math.sin(t * 0.4) * 0.5 + Math.sin(t * 0.7 + 1.3) * 0.3;
  const gust = Math.sin(t * 1.1 + y * 2.0) * 0.25;
  const flutter = Math.sin(t * 2.3 + y * 3.0) * 0.08;
  const tremble = Math.sin(t * 4.0 + y * 6.0) * 0.02;
  return breathe + gust + flutter + tremble;
}

// ═══════════════════════════════════════════
// Pre-generate plant geometry
// ═══════════════════════════════════════════

function buildPlant() {
  const str = generateString("X", PLANT_RULES, ITERATIONS);
  const branches = interpret(str, {
    stepLength: PLANT_STEP,
    angleDelta: (PLANT_ANGLE_DEG * Math.PI) / 180,
    lengthDecay: 0.82,
    angleJitter: 0.12,
    seed: 137,
  });
  return { branches, bounds: getBounds(branches) };
}

// ═══════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════

export default function LivingPlant() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  const plant = useMemo(() => buildPlant(), []);

  // Animation loop
  const draw = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const t = time / 1000;

      ctx.clearRect(0, 0, W, H);
      ctx.save();

      const { branches, bounds } = plant;
      const targetH = 500;
      const scale = targetH / bounds.height;

      // Center of the plant bounding box in scaled coordinates
      const centerX = ((bounds.minX + bounds.maxX) / 2) * scale;
      const centerY = ((bounds.minY + bounds.maxY) / 2) * scale;

      // Place plant center on screen (shifted right to avoid left clipping), scale up, flip Y
      ctx.translate(W * 0.85, H / 2);
      ctx.scale(PLANT_SCALE, -PLANT_SCALE);
      ctx.translate(-centerX, -centerY);

      let maxDepth = 0;
      for (const b of branches) {
        if (b.depth > maxDepth) maxDepth = b.depth;
      }

      for (const b of branches) {
        const sx = b.start.x * scale;
        const sy = b.start.y * scale;
        const ex = b.end.x * scale;
        const ey = b.end.y * scale;

        // Wind — height-dependent sway
        const avgH = (sy + ey) / 2 / targetH;
        const hFactor = Math.max(0, avgH);
        const hf = hFactor * hFactor;
        const wind = windNoise(avgH, t) * 15 * hf;

        // Depth-based styling
        const depthNorm = b.depth / Math.max(1, maxDepth);

        // Thickness: divide by scale so screen-space size stays consistent
        const baseThick = Math.max(0.5, 3.5 - b.depth * 0.4);
        const thickness = baseThick / PLANT_SCALE;

        // Color: trunk darker, tips brighter
        const r = Math.round(40 + depthNorm * 50);
        const g = Math.round(70 + depthNorm * 60);
        const bv = Math.round(30 + depthNorm * 30);
        const alpha = Math.max(0.3, 1 - depthNorm * 0.5);

        ctx.beginPath();
        ctx.moveTo(sx + wind, sy);
        ctx.lineTo(ex + wind, ey);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${bv}, ${alpha})`;
        ctx.lineWidth = thickness;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    },
    [plant],
  );

  // Start animation loop + resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };

    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
