"use client";

import { motion } from "framer-motion";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import SiteNav from "@/components/SiteNav";

const workEntries = [
  {
    title: "Netic, founding designer",
    description:
      "Building netic.ai's identity through product, brand, and every touchpoint that communicates us to the world.",
  },
  {
    title: "Quantum Labs, founder",
    description:
      "Worked with incredibly sharp and ambitious founders to refine product, brand, and the company narrative in their infant stages. This is where I learned solo agency work was not for me.",
  },
  {
    title: "Ghost, product & design",
    description: [
      "Worked my way as an intern to becoming an established part of the design team. This is where I flexed my deep UX muscles by working on the core marketplace, leading product launches, and fundrasing / branding.",
      "Prior to design, this was my first touchpoint to Ghost. Naïve and ignorant, I was fortunate enough to work closely on our Series B raise and learned every crevice of our business and how to tell a good story.",
    ],
  },
  {
    title: "Captivated, growth & design",
    description:
      "Worked with two of my closest friends (now). This was my first real jump into the world of startup. YCW23.",
  },
];

const LINE_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function WorkPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [accentPos, setAccentPos] = useState<{
    top: number;
    height: number;
  } | null>(null);
  const [showAccent, setShowAccent] = useState(false);

  const activeIndex = hoveredIndex ?? 0;

  // Delay accent bar until after line-draw animation completes
  useEffect(() => {
    const timer = setTimeout(() => setShowAccent(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Measure active entry position relative to the viewport (= main)
  // so the accent bar can be positioned on the vertical divider rail
  useLayoutEffect(() => {
    const measure = () => {
      const el = entryRefs.current[activeIndex];
      if (el) {
        const rect = el.getBoundingClientRect();
        setAccentPos({
          top: rect.top,
          height: rect.height,
        });
      }
    };
    measure();

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  return (
    <main
      className="h-screen w-screen overflow-hidden relative"
      style={{
        background: "#f3f0e9",
        fontFamily: "'Helvetica Neue', var(--font-geist-sans), sans-serif",
      }}
    >
      {/* ── Navigation ── */}
      <div className="absolute left-0 top-0 z-10">
        <SiteNav variant="light" />
      </div>

      {/* ── Line-drawing on load ── */}

      {/* Left edge decorative line */}
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

      {/* Main vertical divider */}
      <motion.div
        className="absolute top-0 bottom-0 w-px"
        style={{
          left: "57%",
          background: "rgba(157, 124, 124, 0.3)",
          transformOrigin: "top",
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: LINE_EASE, delay: 0.4 }}
      />

      {/* ── Traveling red accent bar — rides on the vertical divider rail ── */}
      {showAccent && accentPos && (
        <motion.div
          className="absolute w-px"
          style={{
            left: "57%",
            background: "#670000",
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            top: accentPos.top,
            height: accentPos.height,
          }}
          transition={{
            opacity: { duration: 0.3 },
            top: { type: "spring", stiffness: 400, damping: 35 },
            height: { type: "spring", stiffness: 400, damping: 35 },
          }}
        />
      )}

      {/* ── Work entries ── */}
      <motion.div
        ref={containerRef}
        className="absolute"
        style={{ left: "59.6%", top: "41%", width: "36.5%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: LINE_EASE, delay: 1.0 }}
      >
        {workEntries.map((entry, index) => (
          <div
            key={index}
            ref={(el) => {
              entryRefs.current[index] = el;
            }}
            className="px-3 py-2 cursor-default"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <p
              className="text-[16px] leading-snug"
              style={{ color: "#670000" }}
            >
              {entry.title}
            </p>
            <div
              className="mt-1 text-[16px] leading-relaxed"
              style={{ color: "#9d7c7c" }}
            >
              {Array.isArray(entry.description) ? (
                entry.description.map((para, i) => (
                  <p key={i} className={i > 0 ? "mt-4" : ""}>
                    {para}
                  </p>
                ))
              ) : (
                <p>{entry.description}</p>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </main>
  );
}
