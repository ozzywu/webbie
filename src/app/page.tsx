"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const LivingPlant = dynamic(() => import("@/components/LivingPlant"), {
  ssr: false,
});

const navItems = [
  { label: "Travel", href: "/travel" },
  { label: "Athenaeum", href: "/athenaeum" },
  { label: "Read", href: "/read", active: true },
  { label: "About", href: "/about" },
  { label: "Inspo", href: "/inspo" },
];

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden relative bg-[#0c2203]">
      {/* Canvas — wind-animated plant with infinite zoom */}
      <LivingPlant />

      {/* Left — Greeting & Name */}
      <div className="absolute left-[7%] top-1/2 -translate-y-1/2 z-10">
        <p
          className="text-[32px] leading-tight mb-2"
          style={{
            color: "#fed",
            fontFamily: "'BiauKai', 'BiauKaiTC', 'STKaiti', 'KaiTi', serif",
          }}
        >
          你好
        </p>
        <p
          className="text-[24px] leading-tight"
          style={{
            color: "#fed",
            fontFamily: "var(--font-cormorant), 'Georgia', serif",
          }}
        >
          I&apos;m Osmond
        </p>
      </div>

      {/* Right — Navigation */}
      <nav className="absolute right-[7%] top-1/2 -translate-y-1/2 z-10 flex flex-col items-end gap-[6px]">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-[14px] font-sans transition-opacity duration-300 hover:opacity-100"
            style={{
              color: "#fed",
              opacity: item.active ? 1 : 0.5,
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
