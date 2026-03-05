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
      className="h-screen w-screen overflow-hidden relative flex"
      style={{ backgroundColor: BG_COLOR }}
    >
      {/* Site navigation — spans full width above both panels */}
      <div className="absolute left-0 top-0 w-full z-20">
        <SiteNav />
      </div>

      {/* Left panel — solid background, destination nav + city info */}
      <div
        className="relative z-10 flex flex-col h-full shrink-0"
        style={{ width: 320, backgroundColor: BG_COLOR }}
      >
        <div className="flex-1 flex items-center pl-8">
          <DestinationList
            destinations={destinations}
            activeIndex={activeDestIndex}
            onSelect={setActiveDestIndex}
            bgColor={BG_COLOR}
            hasLog={!!activeLog}
            onViewLog={handleViewLog}
          />
        </div>

        <div className="pb-8 pl-8" style={{ color: "#FFEEDD" }}>
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-1">
            {activeDestination.coords}
          </p>
          <p className="text-[11px] font-sans opacity-50 max-w-[260px] leading-relaxed">
            {activeDestination.description}
          </p>
        </div>
      </div>

      {/* Right panel — map in its own container, no gradient mask */}
      <div className="flex-1 h-full relative overflow-hidden">
        <TravelMapGL
          lat={activeDestination.lat}
          lng={activeDestination.lng}
          zoom={6}
          paddingLeft={0}
        />
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
