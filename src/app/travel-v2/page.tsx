"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import DestinationList from "@/components/DestinationList";

const BG_COLOR = "#5A0000";

// Dynamic import — MapLibre requires browser globals
const TravelMapGL = dynamic(() => import("@/components/TravelMapGL"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full" style={{ backgroundColor: BG_COLOR }} />
  ),
});

export default function TravelV2Page() {
  const [activeDestIndex, setActiveDestIndex] = useState(4); // Copenhagen default

  const activeDestination = destinations[activeDestIndex];

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

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-8 left-8 z-20 text-xs font-sans hover:opacity-100 transition-opacity duration-300"
        style={{ color: "#FFEEDD", opacity: 0.4 }}
      >
        ← Home
      </Link>

      {/* Destination List — Left side, vertically centered */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <DestinationList
          destinations={destinations}
          activeIndex={activeDestIndex}
          onSelect={setActiveDestIndex}
          bgColor={BG_COLOR}
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
    </main>
  );
}
