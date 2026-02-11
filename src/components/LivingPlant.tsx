"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import {
  generateString,
  interpret,
  getBounds,
  type Branch,
} from "@/lib/lsystem";

// ═══════════════════════════════════════════
// L-system configuration
// ═══════════════════════════════════════════

const PLANT_RULES = { X: "F+[[X]-X]-F[-FX]+X", F: "FF" };
const PLANT_ANGLE_DEG = 25;
const PLANT_STEP = 1.0;

// Multiple resolution levels for progressive detail
const LOD_LEVELS = [
  { iterations: 5, maxZoom: 3 },
  { iterations: 6, maxZoom: 12 },
  { iterations: 7, maxZoom: 50 },
  { iterations: 8, maxZoom: 150 },
];

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
// L-system pre-generation
// ═══════════════════════════════════════════

interface PlantLOD {
  branches: Branch[];
  bounds: ReturnType<typeof getBounds>;
  maxZoom: number;
}

function buildAllLODs(): PlantLOD[] {
  return LOD_LEVELS.map(({ iterations, maxZoom }) => {
    const str = generateString("X", PLANT_RULES, iterations);
    const branches = interpret(str, {
      stepLength: PLANT_STEP,
      angleDelta: (PLANT_ANGLE_DEG * Math.PI) / 180,
      lengthDecay: 0.82,
      angleJitter: 0.12,
      seed: 137,
    });
    return { branches, bounds: getBounds(branches), maxZoom };
  });
}

// ═══════════════════════════════════════════
// Camera state: offset (screen px) + zoom
//
// The canvas transform is:
//   ctx.translate(offset.x, offset.y)
//   ctx.scale(zoom, zoom)
//
// World point (wx, wy) → screen (offset.x + wx*zoom, offset.y + wy*zoom)
// ═══════════════════════════════════════════

interface CameraState {
  x: number; // screen-space x of world origin
  y: number; // screen-space y of world origin
}

// ═══════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════

export default function LivingPlant() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const zoomRef = useRef(1);
  const offsetRef = useRef<CameraState>({ x: 0, y: 0 });
  const animRef = useRef(0);
  const initializedRef = useRef(false);

  // Drag state
  const dragRef = useRef<{
    startMx: number;
    startMy: number;
    startOx: number;
    startOy: number;
  } | null>(null);

  // Pre-generate all LOD levels
  const lods = useMemo(() => buildAllLODs(), []);

  // Load the botanical image
  useEffect(() => {
    const img = new Image();
    img.src = "/plant.png";
    img.onload = () => {
      imgRef.current = img;
    };
  }, []);

  // Pick the appropriate LOD for the current zoom
  const getLOD = useCallback(
    (zoom: number): PlantLOD => {
      for (const lod of lods) {
        if (zoom <= lod.maxZoom) return lod;
      }
      return lods[lods.length - 1];
    },
    [lods]
  );

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
      const zoom = zoomRef.current;

      // Initialize camera offset to center the plant on first frame
      if (!initializedRef.current) {
        offsetRef.current = { x: W / 2, y: H * 0.45 };
        initializedRef.current = true;
      }

      const ox = offsetRef.current.x;
      const oy = offsetRef.current.y;

      ctx.clearRect(0, 0, W, H);
      ctx.save();

      // Apply camera transform: offset + zoom
      ctx.translate(ox, oy);
      ctx.scale(zoom, zoom);

      // ── Draw botanical image with wind ──
      const botanicalOpacity =
        zoom < 3 ? 0.85 : Math.max(0, 0.85 * (1 - (zoom - 3) / 5));

      if (botanicalOpacity > 0.001 && imgRef.current) {
        ctx.save();
        ctx.globalAlpha = botanicalOpacity;

        const sx = 0.4727 * imgRef.current.width;
        const sy = (1 - 0.9347) * imgRef.current.height;
        const sw = 0.215 * imgRef.current.width;
        const sh = 0.5085 * imgRef.current.height;

        const dw = 380;
        const dh = 600;

        const imgWind = windNoise(0.5, t) * 8;
        ctx.transform(1, 0, imgWind / dh, 1, 0, 0);
        ctx.drawImage(
          imgRef.current,
          sx,
          sy,
          sw,
          sh,
          -dw / 2,
          -dh * 0.35,
          dw,
          dh
        );

        ctx.restore();
      }

      // ── Draw L-system branches with wind ──
      const lod = getLOD(zoom);
      const { branches, bounds } = lod;

      const lsystemOpacity =
        zoom < 1.5 ? 0.12 : Math.min(1.0, 0.12 + (zoom - 1.5) / 3);

      if (lsystemOpacity > 0.001) {
        const plantH = bounds.height;
        const targetH = 500;
        const scale = targetH / plantH;
        const lsOffsetX = -((bounds.minX + bounds.maxX) / 2) * scale;

        ctx.save();
        ctx.globalAlpha = lsystemOpacity;
        ctx.scale(1, -1);
        ctx.translate(0, -targetH * 0.3);

        // Viewport culling: only draw branches visible on screen
        // Convert screen bounds to world space for the L-system layer
        // (accounting for the Y-flip and translate)
        const invZoom = 1 / zoom;
        const worldLeft = -ox * invZoom - 100 * invZoom;
        const worldRight = (W - ox) * invZoom + 100 * invZoom;
        // Y is flipped: screen top → large world Y, screen bottom → small world Y
        const worldBottom = -(H - oy) * invZoom - targetH * 0.3 - 100 * invZoom;
        const worldTop = oy * invZoom + targetH * 0.3 + 100 * invZoom;

        let maxDepth = 0;
        for (const b of branches) {
          if (b.depth > maxDepth) maxDepth = b.depth;
        }

        for (const b of branches) {
          const sx2 = b.start.x * scale + lsOffsetX;
          const sy2 = b.start.y * scale;
          const ex = b.end.x * scale + lsOffsetX;
          const ey = b.end.y * scale;

          // Viewport cull (rough): skip branches clearly off-screen
          const bMaxX = Math.max(sx2, ex);
          const bMinX = Math.min(sx2, ex);
          const bMaxY = Math.max(sy2, ey);
          const bMinY = Math.min(sy2, ey);
          if (
            bMaxX < worldLeft * scale ||
            bMinX > worldRight * scale ||
            bMaxY < worldBottom ||
            bMinY > worldTop
          ) {
            continue;
          }

          // Wind
          const avgH = (sy2 + ey) / 2 / targetH;
          const hFactor = Math.max(0, avgH);
          const hf = hFactor * hFactor;
          const wind = windNoise(avgH, t) * 15 * hf;

          // Progressive reveal
          const depthNorm = b.depth / Math.max(1, maxDepth);
          const zoomReveal = Math.log2(zoom + 1) / 4;
          const branchVisibility = Math.max(
            0,
            Math.min(1, 1 - (depthNorm - zoomReveal) * 3)
          );

          if (branchVisibility < 0.01) continue;

          // Thickness
          const baseThick = Math.max(0.5, 3.5 - b.depth * 0.4);
          const thickness = baseThick / zoom;

          // Color: trunk darker, tips brighter
          const r = Math.round(40 + depthNorm * 50);
          const g = Math.round(70 + depthNorm * 60);
          const bv = Math.round(30 + depthNorm * 30);
          const alpha = branchVisibility * Math.max(0.3, 1 - depthNorm * 0.5);

          ctx.beginPath();
          ctx.moveTo(sx2 + wind, sy2);
          ctx.lineTo(ex + wind, ey);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${bv}, ${alpha})`;
          ctx.lineWidth = thickness;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();

      // ── Draw zoom indicator when zoomed in ──
      if (zoom > 1.2) {
        const dpr = window.devicePixelRatio || 1;
        ctx.save();
        ctx.font = `${11 * dpr}px sans-serif`;
        ctx.fillStyle = `rgba(255, 238, 221, ${Math.min(0.4, (zoom - 1.2) / 2)})`;
        ctx.fillText(`${zoom.toFixed(1)}×`, 16 * dpr, H - 16 * dpr);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    },
    [lods, getLOD]
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

      // Re-center if at default zoom
      if (zoomRef.current <= 1.01) {
        offsetRef.current = { x: canvas.width / 2, y: canvas.height * 0.45 };
      }
    };

    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  // ═══════════════════════════════════════════
  // Zoom-to-cursor + drag-to-pan + keyboard
  // ═══════════════════════════════════════════
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;

    // ── Zoom toward mouse cursor ──
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const mx = e.clientX * dpr;
      const my = e.clientY * dpr;

      const oldZoom = zoomRef.current;
      const speed = 0.002;
      const newZoom = Math.max(1, Math.min(150, oldZoom * (1 + e.deltaY * speed)));

      // World point under cursor before zoom
      const wx = (mx - offsetRef.current.x) / oldZoom;
      const wy = (my - offsetRef.current.y) / oldZoom;

      // Adjust offset so that same world point stays under cursor
      offsetRef.current.x = mx - wx * newZoom;
      offsetRef.current.y = my - wy * newZoom;

      zoomRef.current = newZoom;

      // Snap offset back to center when fully zoomed out
      if (newZoom <= 1.01) {
        const canvas = canvasRef.current;
        if (canvas) {
          offsetRef.current = {
            x: canvas.width / 2,
            y: canvas.height * 0.45,
          };
        }
      }
    };

    // ── Keyboard zoom (centered on screen) ──
    const onKey = (e: KeyboardEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let factor = 0;
      if (e.key === "=" || e.key === "+") factor = 1.15;
      else if (e.key === "-" || e.key === "_") factor = 1 / 1.15;
      else if (e.key === "0") {
        // Reset zoom
        zoomRef.current = 1;
        offsetRef.current = {
          x: canvas.width / 2,
          y: canvas.height * 0.45,
        };
        return;
      } else return;

      const mx = canvas.width / 2;
      const my = canvas.height / 2;
      const oldZoom = zoomRef.current;
      const newZoom = Math.max(1, Math.min(150, oldZoom * factor));

      const wx = (mx - offsetRef.current.x) / oldZoom;
      const wy = (my - offsetRef.current.y) / oldZoom;
      offsetRef.current.x = mx - wx * newZoom;
      offsetRef.current.y = my - wy * newZoom;
      zoomRef.current = newZoom;

      if (newZoom <= 1.01) {
        offsetRef.current = {
          x: canvas.width / 2,
          y: canvas.height * 0.45,
        };
      }
    };

    // ── Drag to pan ──
    const onMouseDown = (e: MouseEvent) => {
      // Don't start drag if clicking on a link/button
      if ((e.target as HTMLElement).closest("a, button, nav")) return;
      if (zoomRef.current <= 1.01) return; // no pan at default zoom

      dragRef.current = {
        startMx: e.clientX * dpr,
        startMy: e.clientY * dpr,
        startOx: offsetRef.current.x,
        startOy: offsetRef.current.y,
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const mx = e.clientX * dpr;
      const my = e.clientY * dpr;
      offsetRef.current.x =
        dragRef.current.startOx + (mx - dragRef.current.startMx);
      offsetRef.current.y =
        dragRef.current.startOy + (my - dragRef.current.startMy);
    };

    const onMouseUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ cursor: zoomRef.current > 1.01 ? "grab" : "default" }}
    />
  );
}
