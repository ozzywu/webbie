"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Travel", href: "/travel" },
  { label: "Athenaeum", href: "/athenaeum" },
  { label: "Projects", href: "/work" },
];

interface SiteNavProps {
  /** "dark" for dark backgrounds, "light" for light backgrounds */
  variant?: "dark" | "light";
}

export default function SiteNav({ variant = "dark" }: SiteNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/athenaeum") {
      return pathname.startsWith("/athenaeum");
    }
    if (href === "/work") {
      return pathname.startsWith("/work");
    }
    return pathname.startsWith(href);
  }

  const activeColor = variant === "dark" ? "#fed" : "#670000";
  const inactiveColor = variant === "dark" ? "rgba(255,238,221,0.5)" : "#9d7c7c";

  return (
    <nav
      className="flex items-center justify-start gap-2 w-full px-6 pt-5"
      style={{
        fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
      }}
    >
      <Link
        href="/"
        className="flex items-center justify-center transition-opacity duration-300 hover:opacity-80 rounded-[1px]"
        style={{
          fontFamily: "'BiauKai', 'BiauKaiTC', 'STKaiti', 'KaiTi', serif",
          fontSize: "16px",
          width: 20,
          height: 20,
          color: variant === "dark" ? "#fed" : "#fed",
          backgroundColor: variant === "dark" ? "rgba(255,238,221,0.15)" : "#670000",
        }}
      >
        胡
      </Link>

      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-[14px] transition-colors duration-300 hover:opacity-90 whitespace-nowrap"
          style={{
            color: isActive(item.href) ? activeColor : inactiveColor,
            opacity: isActive(item.href) ? 1 : 0.5,
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
