"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type PointerEvent,
} from "react";

/**
 * ImagePositioner — X-style "Edit media" crop repositioner.
 *
 * Shows the full image with a dimmed overlay outside the crop frame
 * (680/315 aspect ratio matching the public display). Users drag to
 * reposition the image within the frame. Emits a CSS `object-position`
 * value via `onChange`.
 */

interface ImagePositionerProps {
  src: string;
  /** CSS object-position value, e.g. "50% 30%" */
  value: string;
  onChange: (position: string) => void;
  onReplace: () => void;
  onRemove: () => void;
}

function parsePosition(pos: string) {
  const parts = pos.split(/\s+/).map((s) => parseFloat(s));
  return { x: parts[0] ?? 50, y: parts[1] ?? 50 };
}

const FRAME_ASPECT = 680 / 315;

export function ImagePositioner({
  src,
  value,
  onChange,
  onReplace,
  onRemove,
}: ImagePositionerProps) {
  const [position, setPosition] = useState(parsePosition(value));
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  // Use refs for values needed synchronously during drag (avoids stale closures)
  const draggingRef = useRef(false);
  const positionRef = useRef(position);
  const dragStartRef = useRef({ clientY: 0, startY: 0 });

  // Keep ref in sync with state
  positionRef.current = position;

  // Sync from parent value prop
  useEffect(() => {
    const parsed = parsePosition(value);
    setPosition(parsed);
    positionRef.current = parsed;
  }, [value]);

  // Track container width via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    },
    []
  );

  // --- Geometry ---
  const frameHeight = containerWidth > 0 ? containerWidth / FRAME_ASPECT : 0;
  const imageAspect = naturalSize
    ? naturalSize.w / naturalSize.h
    : FRAME_ASPECT;
  const imageDisplayHeight =
    containerWidth > 0 ? containerWidth / imageAspect : 0;

  const canPanY = imageDisplayHeight > frameHeight + 1;
  const yOverflow = Math.max(0, imageDisplayHeight - frameHeight);

  // Container shows the frame + some context padding to reveal cropped areas
  const contextPadding = canPanY ? Math.min(yOverflow * 0.35, 60) : 0;
  const containerHeight =
    naturalSize && containerWidth > 0
      ? frameHeight + contextPadding * 2
      : 0;
  const frameTop = contextPadding;

  // Image Y position based on position.y percentage
  // 0% → top of image aligns with top of frame
  // 100% → bottom of image aligns with bottom of frame
  const imageY = frameTop - (position.y / 100) * yOverflow;

  const loaded = naturalSize !== null && containerWidth > 0;

  // --- Pointer-based drag (refs prevent stale closures) ---

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      containerRef.current?.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      setDragging(true);
      dragStartRef.current = {
        clientY: e.clientY,
        startY: positionRef.current.y,
      };
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || yOverflow <= 0) return;

      const dy = e.clientY - dragStartRef.current.clientY;
      // Drag down → image slides down → reveals more top → position.y decreases
      const deltaPct = (-dy / yOverflow) * 100;
      const newY = Math.max(
        0,
        Math.min(100, dragStartRef.current.startY + deltaPct)
      );

      const newPos = { x: positionRef.current.x, y: newY };
      positionRef.current = newPos;
      setPosition(newPos);
    },
    [yOverflow]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      containerRef.current?.releasePointerCapture(e.pointerId);
      draggingRef.current = false;
      setDragging(false);

      const pos = positionRef.current;
      onChange(`${Math.round(pos.x)}% ${Math.round(pos.y)}%`);
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Positioner area */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded select-none"
        style={{
          height: loaded ? containerHeight : undefined,
          aspectRatio: loaded ? undefined : "680/315",
          cursor: dragging ? "grabbing" : canPanY ? "grab" : "default",
          background: "#1a1a1a",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Full image, positioned absolutely */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Cover preview"
          className="absolute pointer-events-none"
          style={{
            top: loaded ? imageY : 0,
            left: 0,
            width: "100%",
            height: loaded ? imageDisplayHeight : "100%",
            objectFit: loaded ? undefined : "cover",
          }}
          onLoad={handleImageLoad}
          draggable={false}
        />

        {loaded && (
          <>
            {/* Dim overlay — top */}
            {frameTop > 0 && (
              <div
                className="absolute top-0 left-0 w-full pointer-events-none"
                style={{
                  height: frameTop,
                  background: "rgba(0,0,0,0.45)",
                }}
              />
            )}

            {/* Dim overlay — bottom */}
            {containerHeight - frameTop - frameHeight > 0.5 && (
              <div
                className="absolute bottom-0 left-0 w-full pointer-events-none"
                style={{
                  height: Math.max(
                    0,
                    containerHeight - frameTop - frameHeight
                  ),
                  background: "rgba(0,0,0,0.45)",
                }}
              />
            )}

            {/* Frame border */}
            <div
              className="absolute left-0 w-full pointer-events-none"
              style={{
                top: frameTop,
                height: frameHeight,
                boxShadow: "inset 0 0 0 2px rgba(103, 0, 0, 0.55)",
              }}
            />
          </>
        )}

        {/* Drag hint — shown on hover, hidden while dragging */}
        {canPanY && hovered && !dragging && (
          <div
            className="absolute left-0 w-full flex items-center justify-center pointer-events-none"
            style={{ top: frameTop, height: frameHeight }}
          >
            <span
              className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
              style={{
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              Drag to reposition
            </span>
          </div>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs"
          style={{
            color: "#999",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          {canPanY
            ? "Drag image to adjust position"
            : "Image fits frame perfectly"}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReplace}
            className="px-3 py-1 rounded text-xs font-medium border hover:opacity-70 transition-opacity"
            style={{
              borderColor: "rgba(0,0,0,0.15)",
              color: "#374151",
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            Replace
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-1 rounded text-xs font-medium border hover:opacity-70 transition-opacity"
            style={{
              borderColor: "rgba(0,0,0,0.15)",
              color: "#dc2626",
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
