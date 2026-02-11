"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Destination } from "@/lib/destinations";

interface DestinationDetailProps {
  destination: Destination | null;
  isVisible: boolean;
}

export default function DestinationDetail({
  destination,
  isVisible,
}: DestinationDetailProps) {
  if (!destination) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute bottom-10 right-10 w-80 p-6 z-20"
          style={{
            background: "#F4F0E6",
            border: "1px solid #2A211C",
            boxShadow: "10px 10px 0 rgba(42, 33, 28, 0.1)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-baseline pb-3 mb-3"
            style={{ borderBottom: "1px solid #D6CEC0" }}
          >
            <h2
              className="text-[1.8rem] leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {destination.city}
            </h2>
            <span
              className="font-mono text-[0.7rem] uppercase tracking-wide"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {destination.city.substring(0, 2).toUpperCase()}-
              {String(destination.id).padStart(2, "0")}
            </span>
          </div>

          {/* Description */}
          <p
            className="text-[1.1rem] leading-relaxed text-[#5C4F45]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {destination.description}
          </p>

          {/* Stats grid */}
          <div
            className="mt-4 grid grid-cols-2 gap-3 font-mono text-[0.7rem] text-[#5C4F45]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <div>
              <strong className="block text-[#2A211C] mb-0.5">ELEVATION</strong>
              <span>{destination.elevation}</span>
            </div>
            <div>
              <strong className="block text-[#2A211C] mb-0.5">COORDINATES</strong>
              <span className="text-[0.6rem]">{destination.coords}</span>
            </div>
            <div>
              <strong className="block text-[#2A211C] mb-0.5">ARRIVAL</strong>
              <span>{destination.date}</span>
            </div>
            <div>
              <strong className="block text-[#2A211C] mb-0.5">DURATION</strong>
              <span>{destination.duration}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
