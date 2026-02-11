"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Sample images - replace with your own
const images = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    alt: "Mountain landscape",
    date: "OCT 23",
  },
  {
    src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
    alt: "Temple in Japan",
    date: "NOV 12",
  },
  {
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop",
    alt: "City skyline",
    date: "DEC 05",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    alt: "Portrait",
    date: "JAN 18",
  },
  {
    src: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=800&h=600&fit=crop",
    alt: "Ocean view",
    date: "FEB 02",
  },
  {
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop",
    alt: "Portrait 2",
    date: "MAR 14",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop",
    alt: "Snowy mountain",
    date: "APR 22",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",
    alt: "Lake reflection",
    date: "MAY 30",
  },
];

interface GalleryProps {
  className?: string;
}

export default function Gallery({ className = "" }: GalleryProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#1a1a1a] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Film strip preview - shows first image with frame */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div className="relative w-full h-full">
          {/* Sprocket holes - left */}
          <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-around py-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2 h-3 bg-[#2a2a2a] rounded-sm" />
            ))}
          </div>
          
          {/* Sprocket holes - right */}
          <div className="absolute right-0 top-0 bottom-0 w-3 flex flex-col justify-around py-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2 h-3 bg-[#2a2a2a] rounded-sm" />
            ))}
          </div>

          {/* Main image area */}
          <div className="absolute inset-0 mx-4">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover"
              sizes="300px"
              draggable={false}
            />
            
            {/* Frame number overlay */}
            <div 
              className="absolute bottom-1 right-1 font-mono text-[8px] text-orange-400/80"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              01A
            </div>
          </div>

          {/* Hover indicator */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span 
              className="text-white/80 text-xs font-mono"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {images.length} FRAMES
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Expanded gallery view - Film Contact Sheet
export function GalleryExpanded() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div 
      className="w-[85vw] max-w-5xl p-8"
      style={{
        background: "#1a1a1a",
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-baseline mb-6 pb-4 border-b border-white/10">
        <div>
          <h3 
            className="text-lg text-white/90 mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Contact Sheet
          </h3>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            ROLL 001 • {images.length} EXPOSURES
          </span>
        </div>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">
          35MM • 400 ISO
        </span>
      </div>

      {/* Film strip container */}
      <div className="relative">
        {/* Sprocket holes - top */}
        <div className="flex justify-around px-8 mb-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-3 h-2 bg-white/5 rounded-sm" />
          ))}
        </div>

        {/* Contact sheet grid */}
        <div className="grid grid-cols-4 gap-1 bg-white/5 p-1">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative aspect-[3/2] cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedIndex(index)}
            >
              {/* Image */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                draggable={false}
              />
              
              {/* Frame overlay */}
              <div className="absolute inset-0 border border-white/10 pointer-events-none" />
              
              {/* Frame number */}
              <div className="absolute bottom-1 left-1 text-[8px] text-orange-400/70">
                {String(index + 1).padStart(2, "0")}A
              </div>
              
              {/* Date */}
              <div className="absolute bottom-1 right-1 text-[8px] text-white/40">
                {image.date}
              </div>

              {/* Hover state */}
              <motion.div
                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>

        {/* Sprocket holes - bottom */}
        <div className="flex justify-around px-8 mt-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-3 h-2 bg-white/5 rounded-sm" />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
        <span className="text-[10px] text-white/30">
          PROCESSED: 2024
        </span>
        <span className="text-[10px] text-white/30">
          KODAK PORTRA 400
        </span>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            {/* Main image */}
            <motion.div
              className="relative max-w-4xl max-h-[80vh] w-full mx-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                width={1200}
                height={800}
                className="object-contain w-full h-full"
                draggable={false}
              />
              
              {/* Frame info */}
              <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-[10px] text-white/50">
                <span>FRAME {String(selectedIndex + 1).padStart(2, "0")}A</span>
                <span>{images[selectedIndex].date}</span>
              </div>
            </motion.div>

            {/* Navigation */}
            <button
              className="absolute left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-4 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === null ? 0 : (prev - 1 + images.length) % images.length
                );
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-4 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === null ? 0 : (prev + 1) % images.length
                );
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Close hint */}
            <div className="absolute top-8 right-8 text-[10px] text-white/30">
              ESC TO CLOSE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
