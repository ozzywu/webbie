"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Travel", href: "/travel" },
  { label: "Athenaeum", href: "/athenaeum" },
  { label: "Projects", href: "/work" },
  { label: "Inspo", href: "/inspo" },
];

interface SiteNavProps {
  /** "dark" for dark backgrounds (#1a1f3d), "light" for light backgrounds (#f3f0e9) */
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
  const inactiveColor = variant === "dark" ? "#afa7af" : "#9d7c7c";

  return (
    <nav
      className="flex items-center justify-between w-full px-6 pt-5"
      style={{
        fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
      }}
    >
      <Link
        href="/"
        className="flex items-center justify-center transition-opacity duration-300 hover:opacity-80 rounded-[1px]"
        style={{
          fontFamily: "'BiauKai', 'BiauKaiTC', 'STKaiti', 'KaiTi', serif",
          fontSize: "19px",
          width: 28,
          height: 28,
          color: variant === "dark" ? "#1a1f3d" : "#fed",
          backgroundColor: variant === "dark" ? "#fed" : "#670000",
        }}
      >
        胡
      </Link>

      <div className="flex items-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-[16px] p-[2px] transition-colors duration-300 hover:opacity-90"
            style={{
              color: isActive(item.href) ? activeColor : inactiveColor,
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
