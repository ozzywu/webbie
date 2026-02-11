"use client";

import { motion } from "framer-motion";

const books = [
  { title: "Ways of Seeing", author: "John Berger", current: true },
  { title: "Design as Art", author: "Bruno Munari", current: false },
  {
    title: "The Architecture of Happiness",
    author: "Alain de Botton",
    current: false,
  },
  { title: "Essentialism", author: "Greg McKeown", current: false },
];

export default function ReadingStack() {
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
          width: "260px",
        }}
      >
        {/* Header */}
        <div
          className="px-5 pt-4 pb-3"
          style={{ borderBottom: "1px solid #e8e0d8" }}
        >
          <p
            className="text-[9px] tracking-[0.2em] font-mono"
            style={{ color: "#A89F91" }}
          >
            CURRENTLY READING
          </p>
        </div>

        {/* Book list */}
        <div className="px-5 py-4 flex flex-col gap-4">
          {books.map((book, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-[7px] flex-shrink-0">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: book.current ? "#2D4A7A" : "#e8e0d8",
                  }}
                />
              </div>
              <div>
                <p
                  className="text-[14px] leading-tight"
                  style={{
                    color: book.current ? "#2A211C" : "#5C4F45",
                    fontFamily:
                      "var(--font-cormorant), 'Cormorant Garamond', serif",
                    fontWeight: book.current ? 600 : 400,
                    fontStyle: "italic",
                  }}
                >
                  {book.title}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#A89F91" }}>
                  {book.author}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-5 pb-3 pt-2"
          style={{ borderTop: "1px solid #e8e0d8" }}
        >
          <p
            className="text-[8px] tracking-[0.15em] font-mono"
            style={{ color: "#A89F91" }}
          >
            {books.length} ON THE NIGHTSTAND
          </p>
        </div>
      </div>
    </motion.div>
  );
}
