"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountryFlag } from "@/components/CountryFlag";
import { getNativeCityName } from "@/lib/countries";
import type { CityLog } from "@/lib/city-logs";

interface TravelLogPanelProps {
  open: boolean;
  cityLog: CityLog | null;
  onClose: () => void;
  onCycle: (direction: "prev" | "next") => void;
  totalLogs: number;
}

const PANEL_BG = "#f3f0e9";
const ACCENT = "#5a0000";
const ACCENT_DEEP = "#670000";
const MUTED = "#9d7c7c";

export default function TravelLogPanel({
  open,
  cityLog,
  onClose,
  onCycle,
  totalLogs,
}: TravelLogPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && cityLog && (
        <>
          {/* Backdrop dim — click to close */}
          <motion.div
            className="absolute inset-0 z-30"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Centering wrapper — flex layout avoids transform conflicts */}
          <motion.div
            ref={panelRef}
            className="absolute top-0 right-0 bottom-0 z-40 flex items-center pr-6"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="overflow-hidden relative"
              style={{
                width: 679,
                maxHeight: "calc(100vh - 48px)",
                backgroundColor: PANEL_BG,
              }}
            >
              {/* Faint world map background */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ opacity: 0.07 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/world-map.svg"
                  alt=""
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    width: "170%",
                    height: "140%",
                    top: "-20%",
                    left: "-35%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                className="flex items-end p-6 relative z-10"
                style={{ height: "calc(100vh - 48px)" }}
              >
                <div className="flex flex-1 items-center justify-between h-full min-h-0 min-w-0">
                  {/* Left column — info */}
                  <div className="flex flex-col h-full items-start justify-between w-[319px] shrink-0">
                    {/* Top: "Logs" label + chevrons */}
                    <div className="flex flex-col items-start gap-2.5">
                      <span
                        className="text-sm font-sans select-none"
                        style={{
                          color: ACCENT,
                          opacity: 0.8,
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        Logs
                      </span>
                      {totalLogs > 1 && (
                        <div className="flex flex-col items-center gap-0">
                          <button
                            onClick={() => onCycle("prev")}
                            className="bg-transparent border-none cursor-pointer p-0.5 opacity-40 hover:opacity-80 transition-opacity"
                            aria-label="Previous city log"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={ACCENT}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="18 15 12 9 6 15" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onCycle("next")}
                            className="bg-transparent border-none cursor-pointer p-0.5 opacity-40 hover:opacity-80 transition-opacity"
                            aria-label="Next city log"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={ACCENT}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom: City info + Jots */}
                    <div className="flex flex-col gap-10 w-full">
                      {/* Flag + Native name + one-liner */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {cityLog.country_code ? (
                            <CountryFlag
                              code={cityLog.country_code}
                              className="w-8 h-6 rounded-[1px]"
                            />
                          ) : cityLog.flag_emoji ? (
                            <span className="text-base leading-none">
                              {cityLog.flag_emoji}
                            </span>
                          ) : null}
                          <span
                            className="text-xl leading-tight"
                            style={{
                              color: ACCENT_DEEP,
                              fontFamily:
                                "'Helvetica Neue', 'Helvetica', Arial, sans-serif",
                              fontWeight: 500,
                            }}
                          >
                            {getNativeCityName(cityLog.city)}
                          </span>
                        </div>
                        {cityLog.one_liner && (
                          <p
                            className="text-sm font-sans leading-relaxed"
                            style={{ color: MUTED }}
                          >
                            {cityLog.one_liner}
                          </p>
                        )}
                      </div>

                      {/* Jots */}
                      {cityLog.jots && (
                        <div className="flex flex-col gap-2">
                          <p
                            className="text-sm font-sans"
                            style={{
                              color: ACCENT,
                              fontWeight: 600,
                            }}
                          >
                            Jots
                          </p>
                          <p
                            className="text-sm font-sans leading-relaxed"
                            style={{ color: MUTED }}
                          >
                            {cityLog.jots}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right column — scrollable images */}
                  <div
                    className="flex flex-col gap-3 h-full items-end justify-center overflow-y-auto shrink-0"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {cityLog.images.length > 0 ? (
                      cityLog.images.map((url, i) => (
                        <div
                          key={i}
                          className="flex-none overflow-hidden"
                          style={{ width: 261, height: 266 }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`${getNativeCityName(cityLog.city)} photo ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div
                        className="flex items-center justify-center text-sm font-sans"
                        style={{
                          width: 261,
                          height: 266,
                          color: MUTED,
                          opacity: 0.5,
                        }}
                      >
                        No photos yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
