"use client";

import { motion } from "framer-motion";

const round = {
  course: "Pebble Beach",
  date: "01 FEB 2026",
  holes: [
    { hole: 1, par: 4, score: 5 },
    { hole: 2, par: 5, score: 4 },
    { hole: 3, par: 3, score: 3 },
    { hole: 4, par: 4, score: 5 },
    { hole: 5, par: 4, score: 4 },
    { hole: 6, par: 5, score: 6 },
    { hole: 7, par: 3, score: 3 },
    { hole: 8, par: 4, score: 5 },
    { hole: 9, par: 4, score: 4 },
  ],
};

function scoreColor(score: number, par: number): string {
  if (score < par) return "#3A6B4F";
  if (score > par) return "#943C3C";
  return "#2A211C";
}

export default function GolfCard() {
  const totalPar = round.holes.reduce((sum, h) => sum + h.par, 0);
  const totalScore = round.holes.reduce((sum, h) => sum + h.score, 0);
  const diff = totalScore - totalPar;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className="rounded-sm shadow-lg"
        style={{
          backgroundColor: "#f5f0eb",
          width: "340px",
        }}
      >
        {/* Course header */}
        <div
          className="px-5 pt-4 pb-3"
          style={{ borderBottom: "1px solid #e8e0d8" }}
        >
          <h3
            className="text-base font-semibold"
            style={{
              color: "#2A211C",
              fontFamily:
                "var(--font-cormorant), 'Cormorant Garamond', serif",
            }}
          >
            {round.course}
          </h3>
          <p
            className="text-[9px] mt-1 tracking-[0.15em] font-mono"
            style={{ color: "#A89F91" }}
          >
            {round.date}
          </p>
        </div>

        {/* Scorecard grid */}
        <div className="px-5 py-3">
          {/* Hole numbers */}
          <div className="flex items-center">
            <span
              className="text-[8px] w-8 flex-shrink-0 font-mono"
              style={{ color: "#A89F91" }}
            >
              HOLE
            </span>
            <div className="flex flex-1 justify-between">
              {round.holes.map((h) => (
                <span
                  key={h.hole}
                  className="text-[9px] w-6 text-center font-mono"
                  style={{ color: "#A89F91" }}
                >
                  {h.hole}
                </span>
              ))}
            </div>
            <span
              className="text-[8px] w-8 text-right flex-shrink-0 font-mono font-bold"
              style={{ color: "#A89F91" }}
            >
              OUT
            </span>
          </div>

          {/* Par row */}
          <div className="flex items-center mt-1">
            <span
              className="text-[8px] w-8 flex-shrink-0 font-mono"
              style={{ color: "#A89F91" }}
            >
              PAR
            </span>
            <div className="flex flex-1 justify-between">
              {round.holes.map((h) => (
                <span
                  key={h.hole}
                  className="text-[9px] w-6 text-center font-mono"
                  style={{ color: "#5C4F45" }}
                >
                  {h.par}
                </span>
              ))}
            </div>
            <span
              className="text-[9px] w-8 text-right flex-shrink-0 font-mono"
              style={{ color: "#5C4F45" }}
            >
              {totalPar}
            </span>
          </div>

          {/* Divider */}
          <div className="my-2" style={{ borderTop: "1px solid #e8e0d8" }} />

          {/* Score row */}
          <div className="flex items-center">
            <span className="text-[8px] w-8 flex-shrink-0" />
            <div className="flex flex-1 justify-between">
              {round.holes.map((h) => (
                <span
                  key={h.hole}
                  className="text-[10px] w-6 text-center font-mono"
                  style={{
                    color: scoreColor(h.score, h.par),
                    fontWeight: h.score !== h.par ? 700 : 400,
                  }}
                >
                  {h.score}
                </span>
              ))}
            </div>
            <span
              className="text-[10px] w-8 text-right flex-shrink-0 font-mono font-bold"
              style={{ color: "#2A211C" }}
            >
              {totalScore}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 pb-3 flex justify-between items-center pt-2"
          style={{ borderTop: "1px solid #e8e0d8" }}
        >
          <span
            className="text-[8px] tracking-[0.15em] font-mono"
            style={{ color: "#A89F91" }}
          >
            FRONT 9
          </span>
          <span
            className="text-[11px] font-mono font-bold"
            style={{
              color:
                diff > 0 ? "#943C3C" : diff < 0 ? "#3A6B4F" : "#2A211C",
            }}
          >
            {diff > 0 ? `+${diff}` : diff === 0 ? "E" : diff}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
