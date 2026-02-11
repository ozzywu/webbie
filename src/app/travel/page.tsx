"use client";

import { useState } from "react";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import TravelOrb from "@/components/TravelOrb";
import DestinationList from "@/components/DestinationList";

const BG_COLOR = "#5C1A1A";

export default function TravelPage() {
  const [activeDestIndex, setActiveDestIndex] = useState(4); // Copenhagen default

  const activeDestination = destinations[activeDestIndex];

  return (
    <main
      className="h-screen w-screen overflow-hidden relative"
      style={{ backgroundColor: BG_COLOR }}
    >
      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-8 left-8 z-10 text-cream/50 text-xs font-sans hover:text-cream transition-colors"
      >
        ← Home
      </Link>

      {/* Name & Info — Left */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
        <p className="text-cream/50 text-xs mb-1.5 font-mono">早，</p>
        <h1 className="font-serif text-xl text-cream mb-2">I&apos;m Osmond</h1>
        <p className="text-cream/50 text-sm max-w-[220px] leading-relaxed">
          Thought is rooted in design. Learning to master it.
        </p>
      </div>

      {/* Destination List — Right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
        <DestinationList
          destinations={destinations}
          activeIndex={activeDestIndex}
          onSelect={setActiveDestIndex}
          bgColor={BG_COLOR}
        />
      </div>

      {/* Center — Globe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <TravelOrb destination={activeDestination} />
      </div>
    </main>
  );
}
