"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { destinations } from "@/lib/destinations";
import SiteNav from "@/components/SiteNav";
import type { CityLog } from "@/lib/city-logs";
import DestinationList from "@/components/DestinationList";
import TravelLogPanel from "@/components/TravelLogPanel";

const BG_COLOR = "#5A0000";

// Dynamic import — MapLibre requires browser globals
const TravelMapGL = dynamic(() => import("@/components/TravelMapGL"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full" style={{ backgroundColor: BG_COLOR }} />
  ),
});

export default function TravelClient({
  cityLogs,
}: {
  cityLogs: CityLog[];
}) {
  const [activeDestIndex, setActiveDestIndex] = useState(4); // Copenhagen default
  const [logPanelOpen, setLogPanelOpen] = useState(false);

  const activeDestination = destinations[activeDestIndex];

  // Build a set of city names that have logs for quick lookup
  const cityLogMap = useMemo(() => {
    const map = new Map<string, CityLog>();
    for (const log of cityLogs) {
      map.set(log.city, log);
    }
    return map;
  }, [cityLogs]);

  // Indices of destinations that have logs (for cycling)
  const logIndices = useMemo(() => {
    return destinations
      .map((d, i) => (cityLogMap.has(d.city) ? i : -1))
      .filter((i) => i !== -1);
  }, [cityLogMap]);

  const activeLog = cityLogMap.get(activeDestination.city) || null;

  const handleViewLog = useCallback(() => {
    setLogPanelOpen((prev) => !prev);
  }, []);

  const handleCloseLog = useCallback(() => {
    setLogPanelOpen(false);
  }, []);

  // Cycle to prev/next city that has a log
  const handleCycleLog = useCallback(
    (direction: "prev" | "next") => {
      if (logIndices.length === 0) return;

      const currentPos = logIndices.indexOf(activeDestIndex);

      let nextPos: number;
      if (currentPos === -1) {
        // Current city doesn't have a log — jump to nearest
        nextPos = 0;
      } else if (direction === "next") {
        nextPos = (currentPos + 1) % logIndices.length;
      } else {
        nextPos = (currentPos - 1 + logIndices.length) % logIndices.length;
      }

      setActiveDestIndex(logIndices[nextPos]);
    },
    [activeDestIndex, logIndices]
  );

  return (
    <main
      className="h-screen w-screen overflow-hidden relative"
      style={{ backgroundColor: BG_COLOR }}
    >
      {/* Full-screen map — masked so it fades out on the left edge */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: `linear-gradient(to right,
            transparent 0%,
            transparent 13%,
            rgba(0,0,0,0.03) 19%,
            rgba(0,0,0,0.07) 23%,
            rgba(0,0,0,0.13) 26%,
            rgba(0,0,0,0.22) 30%,
            rgba(0,0,0,0.35) 34%,
            rgba(0,0,0,0.52) 38%,
            rgba(0,0,0,0.72) 42%,
            rgba(0,0,0,0.88) 47%,
            black 53%
          )`,
          maskImage: `linear-gradient(to right,
            transparent 0%,
            transparent 13%,
            rgba(0,0,0,0.03) 19%,
            rgba(0,0,0,0.07) 23%,
            rgba(0,0,0,0.13) 26%,
            rgba(0,0,0,0.22) 30%,
            rgba(0,0,0,0.35) 34%,
            rgba(0,0,0,0.52) 38%,
            rgba(0,0,0,0.72) 42%,
            rgba(0,0,0,0.88) 47%,
            black 53%
          )`,
        }}
      >
        <TravelMapGL
          lat={activeDestination.lat}
          lng={activeDestination.lng}
          zoom={6}
          paddingLeft={380}
        />
      </div>

      {/* Site navigation */}
      <div className="absolute left-0 top-0 z-20">
        <SiteNav />
      </div>

      {/* Destination List — Left side, vertically centered */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <DestinationList
          destinations={destinations}
          activeIndex={activeDestIndex}
          onSelect={setActiveDestIndex}
          bgColor={BG_COLOR}
          hasLog={!!activeLog}
          onViewLog={handleViewLog}
        />
      </div>

      {/* Active city info — bottom left */}
      <div
        className="absolute bottom-8 left-8 z-20"
        style={{ color: "#FFEEDD" }}
      >
        <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-1">
          {activeDestination.coords}
        </p>
        <p className="text-[11px] font-sans opacity-50 max-w-[260px] leading-relaxed">
          {activeDestination.description}
        </p>
      </div>

      {/* Travel Log Panel — right side overlay */}
      <TravelLogPanel
        open={logPanelOpen}
        cityLog={activeLog}
        onClose={handleCloseLog}
        onCycle={handleCycleLog}
        totalLogs={logIndices.length}
      />
    </main>
  );
}
