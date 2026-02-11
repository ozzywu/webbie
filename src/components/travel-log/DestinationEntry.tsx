"use client";

import { Destination } from "@/lib/destinations";

interface DestinationEntryProps {
  destination: Destination;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export default function DestinationEntry({
  destination,
  index,
  isActive,
  onClick,
}: DestinationEntryProps) {
  return (
    <li
      className={`
        relative flex items-center justify-between
        px-5 py-3 cursor-pointer
        transition-all duration-150
        ${isActive ? "bg-[#2A211C] text-[#F4F0E6]" : "hover:bg-[#2A211C]/5"}
      `}
      onClick={onClick}
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {/* City name */}
      <span
        className={`
          text-[0.85rem] tracking-wide uppercase
          ${isActive ? "text-[#F4F0E6]" : "text-[#2A211C]"}
        `}
      >
        {destination.city}
      </span>

      {/* Date/status */}
      <span
        className={`
          text-[0.75rem] tracking-wide
          ${isActive ? "text-[#F4F0E6]/70" : "text-[#5C4F45]"}
        `}
      >
        {destination.date}
      </span>
    </li>
  );
}
