"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SiteNav from "@/components/SiteNav";

interface WorkEntry {
  title: string;
  duration: string;
  description: string;
  blurredImage?: string;
  clearImage?: string;
  placeholderColor: string;
}

const workEntries: WorkEntry[] = [
  {
    title: "Netic, founding designer",
    duration: "12 mo.",
    description:
      "Building netic.ai's identity through product, brand, and every touchpoint that communicates us to the world.",
    blurredImage: "/work/netic-blur.png",
    clearImage: "/work/netic-clear.png",
    placeholderColor: "#5a6e4a",
  },
  {
    title: "Ghost, product & design",
    duration: "2 yr.",
    description:
      "Worked my way as an intern to becoming an established part of the design team. Flexed deep UX muscles on the core marketplace, led product launches, and fundraising / branding.",
    blurredImage: "/work/ghost-blur.png",
    clearImage: "/work/ghost-clear.png",
    placeholderColor: "#8a7a6a",
  },
  {
    title: "Quantum Labs, founder",
    duration: "6 mo.",
    description:
      "Worked with incredibly sharp and ambitious founders to refine product, brand, and the company narrative in their infant stages.",
    blurredImage: "/work/qlabs-blur.png",
    clearImage: "/work/qlabs-clear.png",
    placeholderColor: "#c4956a",
  },
  {
    title: "Captivated, growth & design",
    duration: "1 yr.",
    description:
      "Worked with two of my closest friends (now). This was my first real jump into the world of startup. YCW23.",
    blurredImage: "/work/captivated-blur.png",
    clearImage: "/work/captivated-clear.png",
    placeholderColor: "#7a8aaa",
  },
];

const LINE_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function WorkPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeEntry = hoveredIndex !== null ? workEntries[hoveredIndex] : null;

  return (
    <main
      className="h-screen w-screen overflow-hidden relative"
      style={{
        background: "#f3f0e9",
        fontFamily: "'Helvetica Neue', var(--font-geist-sans), sans-serif",
      }}
    >
      <div className="absolute left-0 top-0 w-full z-10">
        <SiteNav variant="light" />
      </div>

      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{
          background: "rgba(157, 124, 124, 0.3)",
          transformOrigin: "top",
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: LINE_EASE, delay: 0.05 }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: LINE_EASE, delay: 0.6 }}
      >
        <div style={{ position: "relative", width: 536 }}>
          <div
            className="flex items-baseline justify-between"
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              right: 0,
              paddingBottom: 12,
              opacity: hoveredIndex !== null ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            <p className="text-[14px]" style={{ color: "#670000" }}>
              {activeEntry?.title ?? "\u00A0"}
            </p>
            <p className="text-[14px] text-right" style={{ color: "#9d7c7c" }}>
              {activeEntry?.duration ?? "\u00A0"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {workEntries.map((entry, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                aria-label={entry.title}
                style={{
                  position: "relative",
                  width: 125,
                  height: 125,
                  cursor: "pointer",
                  overflow: "hidden",
                  background: entry.placeholderColor,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
              >
                {entry.clearImage && (
                  <img
                    src={entry.clearImage}
                    alt={entry.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
                {entry.blurredImage && (
                  <img
                    src={entry.blurredImage}
                    alt=""
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "opacity 0.3s ease-out",
                      opacity: hoveredIndex === index ? 0 : 1,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div
            className="text-[14px] text-justify"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              paddingTop: 12,
              color: "#9d7c7c",
              opacity: hoveredIndex !== null ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            <p>{activeEntry?.description ?? "\u00A0"}</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
