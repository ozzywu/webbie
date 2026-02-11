"use client";

interface TechnicalAnnotationProps {
  children: React.ReactNode;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  rotation?: number;
  className?: string;
}

export default function TechnicalAnnotation({
  children,
  position,
  rotation = 0,
  className = "",
}: TechnicalAnnotationProps) {
  const positionClasses = {
    "top-left": "top-24 left-10",
    "top-right": "top-24 right-10 text-right",
    "bottom-left": "bottom-24 left-10",
    "bottom-right": "bottom-24 right-10 text-right",
  };

  return (
    <div
      className={`
        absolute w-32 text-[0.9rem] leading-tight text-[#5C4F45] italic
        pointer-events-none
        ${positionClasses[position]}
        ${className}
      `}
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {children}
    </div>
  );
}
