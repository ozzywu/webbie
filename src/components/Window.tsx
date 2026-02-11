"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WindowProps {
  children: React.ReactNode;
  expandedContent?: React.ReactNode;
  className?: string;
  expandedClassName?: string;
  label?: string;
}

export default function Window({
  children,
  expandedContent,
  className = "",
  expandedClassName = "",
  label = "Expandable window",
}: WindowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  return (
    <>
      {/* Minimized window */}
      <motion.div
        ref={windowRef}
        role="button"
        aria-label={label}
        aria-expanded={isExpanded}
        tabIndex={0}
        className={`relative cursor-pointer overflow-hidden select-none ${className}`}
        onClick={() => setIsExpanded(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(true);
          }
        }}
        onDragStart={(e) => e.preventDefault()}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {children}
        
        {/* Subtle expand hint on hover */}
        <motion.div
          className="absolute inset-0 bg-cream/5 opacity-0 pointer-events-none"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Expanded overlay */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-burgundy-dark/90 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
            />

            {/* Expanded content */}
            <motion.div
              className={`fixed z-50 bg-burgundy border border-cream/20 rounded-sm overflow-hidden top-1/2 left-1/2 ${expandedClassName}`}
              initial={{ 
                opacity: 0,
                scale: 0.9,
                x: "-50%",
                y: "-50%",
              }}
              animate={{ 
                opacity: 1,
                scale: 1,
                x: "-50%",
                y: "-50%",
              }}
              exit={{ 
                opacity: 0,
                scale: 0.9,
                x: "-50%",
                y: "-50%",
              }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 4L4 12M4 4l8 8" />
                </svg>
              </button>

              {expandedContent || children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
