"use client";

import { useState, useEffect } from "react";
import {
  destinations,
  calculateTotalDistance,
  Destination,
} from "@/lib/destinations";
import DestinationEntry from "./DestinationEntry";
import DestinationDetail from "./DestinationDetail";
import TravelMap from "./TravelMap";

interface TravelLogViewProps {
  onClose?: () => void;
}

export default function TravelLogView({ onClose }: TravelLogViewProps) {
  const [activeDestination, setActiveDestination] =
    useState<Destination | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const totalDistance = calculateTotalDistance(destinations);

  // Select first destination on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDestinationClick(destinations[0]);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDestinationClick = (dest: Destination) => {
    setIsDetailVisible(false);
    setActiveDestination(dest);

    setTimeout(() => {
      setIsDetailVisible(true);
    }, 100);
  };

  return (
    <div
      className="w-[90vw] max-w-6xl h-[80vh] flex overflow-hidden"
      style={{
        fontFamily: "'Space Mono', monospace",
        color: "#2A211C",
        background: "#F4F0E6",
      }}
    >
      {/* Sidebar - Departures board style */}
      <aside
        className="w-[280px] flex-shrink-0 flex flex-col border-r border-[#2A211C]"
        style={{ background: "#F4F0E6" }}
      >
        {/* Header - simple */}
        <div
          className="px-5 py-4 border-b border-[#2A211C]"
          style={{ background: "#2A211C" }}
        >
          <div className="text-[0.65rem] text-[#F4F0E6]/50 uppercase tracking-widest mb-1">
            Destinations
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[#F4F0E6] text-[0.8rem] uppercase tracking-wide">
              City
            </span>
            <span className="text-[#F4F0E6]/50 text-[0.7rem] uppercase tracking-wide">
              Arrived
            </span>
          </div>
        </div>

        {/* Destination list */}
        <ul className="flex-1 overflow-y-auto list-none m-0 p-0 divide-y divide-[#D6CEC0]">
          {destinations.map((dest, index) => (
            <DestinationEntry
              key={dest.id}
              destination={dest}
              index={index}
              isActive={activeDestination?.id === dest.id}
              onClick={() => handleDestinationClick(dest)}
            />
          ))}
        </ul>

        {/* Footer - Total */}
        <div
          className="px-5 py-4 border-t border-[#2A211C] flex justify-between items-baseline"
          style={{ background: "#2A211C" }}
        >
          <span className="text-[0.65rem] text-[#F4F0E6]/50 uppercase tracking-widest">
            Total
          </span>
          <span className="text-[#F4F0E6] text-[0.85rem] tracking-wide">
            {totalDistance.toLocaleString()} KM
          </span>
        </div>
      </aside>

      {/* Main - Map */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <div className="flex-1 relative p-6">
          <TravelMap
            destinations={destinations}
            activeDestination={activeDestination}
            onDestinationClick={handleDestinationClick}
          />
        </div>

        {/* Detail card */}
        <DestinationDetail
          destination={activeDestination}
          isVisible={isDetailVisible}
        />
      </main>
    </div>
  );
}
