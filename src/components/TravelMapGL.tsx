"use client";

import { useRef, useEffect, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface TravelMapGLProps {
  lat: number;
  lng: number;
  zoom?: number;
  /** Left padding in px to offset for the overlaid destination list */
  paddingLeft?: number;
  /** Whether the current destination has a travel log */
  hasLog?: boolean;
  /** Called when user clicks "View log" on the marker */
  onViewLog?: () => void;
}

// Minimal silhouette style: cream land, dark red water
const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "silhouette",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  // Render ONLY background (land) + water — nothing else
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#FFEEDD",
      },
    },
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      paint: {
        "fill-color": "#5A0000",
      },
    },
  ],
};

export default function TravelMapGL({
  lat,
  lng,
  zoom = 6,
  paddingLeft = 0,
  hasLog = false,
  onViewLog,
}: TravelMapGLProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerElRef = useRef<HTMLDivElement | null>(null);
  const viewLogElRef = useRef<HTMLButtonElement | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const onViewLogRef = useRef(onViewLog);
  const isFirstRender = useRef(true);

  onViewLogRef.current = onViewLog;

  // Create the marker DOM element once (pin + "View log" button below)
  const getMarkerEl = useCallback(() => {
    if (markerElRef.current) return markerElRef.current;

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "8px";

    const pin = document.createElement("div");
    pin.style.width = "10px";
    pin.style.height = "10px";
    pin.style.borderRadius = "50%";
    pin.style.backgroundColor = "#5A0000";
    pin.style.border = "2px solid #FFEEDD";
    pin.style.boxShadow =
      "0 0 0 4px rgba(90, 0, 0, 0.25), 0 0 20px rgba(255, 238, 221, 0.3)";
    pin.style.transition = "transform 0.3s ease";
    pin.style.position = "relative";

    // Pulse ring
    const pulse = document.createElement("div");
    pulse.style.position = "absolute";
    pulse.style.top = "50%";
    pulse.style.left = "50%";
    pulse.style.transform = "translate(-50%, -50%)";
    pulse.style.width = "24px";
    pulse.style.height = "24px";
    pulse.style.borderRadius = "50%";
    pulse.style.border = "1px solid rgba(255, 238, 221, 0.4)";
    pulse.style.animation = "map-pulse 2.5s ease-out infinite";
    pin.appendChild(pulse);
    wrapper.appendChild(pin);

    // "View log" button
    const btn = document.createElement("button");
    btn.textContent = "View log";
    btn.style.cssText = `
      font-family: var(--font-geist-sans), 'Helvetica Neue', sans-serif;
      font-size: 11px;
      color: #5A0000;
      background: rgba(255, 238, 221, 0.85);
      backdrop-filter: blur(8px);
      border: none;
      padding: 4px 10px;
      cursor: pointer;
      white-space: nowrap;
      opacity: 0;
      transform: translateY(-4px);
      transition: opacity 0.3s ease, transform 0.3s ease, background 0.15s ease;
      pointer-events: none;
    `;
    btn.addEventListener("click", () => onViewLogRef.current?.());
    btn.addEventListener("mouseenter", () => {
      btn.style.background = "rgba(255, 238, 221, 1)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "rgba(255, 238, 221, 0.85)";
    });
    viewLogElRef.current = btn;
    wrapper.appendChild(btn);

    markerElRef.current = wrapper;
    return wrapper;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [lng, lat],
      zoom,
      attributionControl: false,
      // @ts-expect-error — logoControl exists at runtime but missing from types
      logoControl: false,
      // Disable all user interaction — map only moves via flyTo
      dragPan: false,
      dragRotate: false,
      scrollZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      touchPitch: false,
      keyboard: false,
      boxZoom: false,
      pitchWithRotate: false,
      // Padding so the center accounts for the left panel
      padding: { left: paddingLeft, top: 0, right: 0, bottom: 0 },
    });

    // Remove any default controls and hide MapLibre chrome
    map.getContainer().style.cursor = "default";

    // Hide the control container (logo, attribution)
    const controlContainer = map
      .getContainer()
      .querySelector(".maplibregl-control-container");
    if (controlContainer) {
      (controlContainer as HTMLElement).style.display = "none";
    }

    // Add marker once map loads
    map.on("load", () => {
      const marker = new maplibregl.Marker({
        element: getMarkerEl(),
        anchor: "top",
        offset: [0, -5],
      })
        .setLngLat([lng, lat])
        .addTo(map);

      markerRef.current = marker;
    });

    mapRef.current = map;
    isFirstRender.current = false;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show/hide "View log" button based on hasLog
  useEffect(() => {
    const btn = viewLogElRef.current;
    if (!btn) return;
    if (hasLog) {
      btn.style.opacity = "1";
      btn.style.transform = "translateY(0)";
      btn.style.pointerEvents = "auto";
    } else {
      btn.style.opacity = "0";
      btn.style.transform = "translateY(-4px)";
      btn.style.pointerEvents = "none";
    }
  }, [hasLog]);

  // Fly to new position when destination changes
  useEffect(() => {
    if (isFirstRender.current) return;
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center: [lng, lat],
      zoom,
      speed: 0.8,
      curve: 1.42,
      essential: true,
      padding: { left: paddingLeft, top: 0, right: 0, bottom: 0 },
    });

    // Move marker
    markerRef.current?.setLngLat([lng, lat]);
  }, [lat, lng, zoom, paddingLeft]);

  return (
    <>
      {/* Pulse keyframes + hide MapLibre chrome */}
      <style>{`
        @keyframes map-pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
        .maplibregl-ctrl-bottom-left,
        .maplibregl-ctrl-bottom-right,
        .maplibregl-ctrl-top-left,
        .maplibregl-ctrl-top-right,
        .maplibregl-compact,
        .maplibregl-ctrl-attrib,
        .maplibregl-ctrl {
          display: none !important;
        }
        .maplibregl-canvas-container {
          cursor: default !important;
        }
      `}</style>
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ background: "#5A0000" }}
      />
    </>
  );
}
