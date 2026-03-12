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

  const activeDestination = destinations[activeDestIndex];

  // Build a set of city names that have logs for quick lookup
  const cityLogMap = useMemo(() => {
    const map = new Map<string, CityLog>();
    for (const log of cityLogs) {
      map.set(log.city, log);
    }
    return map;
  }, [cityLogs]);

  const activeLog = cityLogMap.get(activeDestination.city) || null;

  const [logPanelOpen, setLogPanelOpen] = useState(false);

  // Indices of destinations that have logs (for cycling)
  const logIndices = useMemo(() => {
    return destinations
      .map((d, i) => (cityLogMap.has(d.city) ? i : -1))
      .filter((i) => i !== -1);
  }, [cityLogMap]);

  const handleSelectDest = useCallback(
    (index: number) => {
      setActiveDestIndex(index);
      setLogPanelOpen(false);
    },
    []
  );

  const handleViewLog = useCallback(() => {
    setLogPanelOpen(true);
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
      setLogPanelOpen(true);
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
            onSelect={handleSelectDest}
            bgColor={BG_COLOR}
          />
        </div>

        <div className="pb-8 pl-8" style={{ color: "#FFEEDD" }}>
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">
            {activeDestination.coords}
          </p>
        </div>
      </div>

      {/* Right panel — map with 30px border on top, right, and bottom */}
      <div className="flex-1 h-full relative pt-[60px] pr-[60px] pb-[60px]">
        <div className="w-full h-full overflow-hidden" style={{ border: '1px solid rgba(255, 238, 221, 0.12)' }}>
          <TravelMapGL
            lat={activeDestination.lat}
            lng={activeDestination.lng}
            zoom={6}
            paddingLeft={0}
            hasLog={!!activeLog}
            onViewLog={handleViewLog}
          />
        </div>
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
