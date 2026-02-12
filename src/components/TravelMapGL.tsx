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
  paddingLeft = 300,
}: TravelMapGLProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerElRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const isFirstRender = useRef(true);

  // Create the marker DOM element once
  const getMarkerEl = useCallback(() => {
    if (markerElRef.current) return markerElRef.current;

    const el = document.createElement("div");
    el.style.width = "10px";
    el.style.height = "10px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = "#5A0000";
    el.style.border = "2px solid #FFEEDD";
    el.style.boxShadow =
      "0 0 0 4px rgba(90, 0, 0, 0.25), 0 0 20px rgba(255, 238, 221, 0.3)";
    el.style.transition = "transform 0.3s ease";

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
    el.appendChild(pulse);

    markerElRef.current = el;
    return el;
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
    const controlContainer = map.getContainer().querySelector(
      ".maplibregl-control-container"
    );
    if (controlContainer) {
      (controlContainer as HTMLElement).style.display = "none";
    }

    // Add marker once map loads
    map.on("load", () => {
      const marker = new maplibregl.Marker({
        element: getMarkerEl(),
        anchor: "center",
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
