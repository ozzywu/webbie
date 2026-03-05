"use client";

import { useState } from "react";
import Link from "next/link";

const LIGHT_VARS = {
  "--article-bg": "#f3f0e9",
  "--article-text": "#9d7c7c",
  "--article-title": "#670000",
  "--article-muted": "#9d7c7c",
  "--article-strong": "#7a5555",
  "--article-link": "#670000",
  "--article-line": "rgba(157, 124, 124, 0.3)",
  "--article-border": "rgba(157, 124, 124, 0.4)",
  "--article-hr": "rgba(157, 124, 124, 0.3)",
  "--article-code-bg": "rgba(157, 124, 124, 0.1)",
  "--article-pre-bg": "#2a2020",
  "--article-pre-text": "#e0d5d5",
  "--article-source-border": "rgba(157, 124, 124, 0.2)",
};

const DARK_VARS = {
  "--article-bg": "#1a1f3d",
  "--article-text": "#afa7af",
  "--article-title": "#ffeedd",
  "--article-muted": "#5f5d6d",
  "--article-strong": "#c8c0c8",
  "--article-link": "#ffeedd",
  "--article-line": "rgba(95, 93, 109, 0.3)",
  "--article-border": "rgba(95, 93, 109, 0.4)",
  "--article-hr": "rgba(95, 93, 109, 0.3)",
  "--article-code-bg": "rgba(175, 167, 175, 0.12)",
  "--article-pre-bg": "#12152e",
  "--article-pre-text": "#d5d0d5",
  "--article-source-border": "rgba(95, 93, 109, 0.2)",
};

export function ArticleShell({
  backHref,
  children,
}: {
  backHref: string;
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);
  const vars = isDark ? DARK_VARS : LIGHT_VARS;
  const toggleBorder = isDark ? "#5f5d6d" : "#9d7c7c";
  const toggleActive = isDark ? "#ffeedd" : "#670000";

  return (
    <main
      className="min-h-screen"
      style={{
        ...(vars as unknown as React.CSSProperties),
        background: "var(--article-bg)",
      }}
    >
      <div
        data-article-container
        className="max-w-[730px] mx-auto min-h-screen flex overflow-hidden"
      >
        <div
          className="w-px shrink-0 hidden md:block"
          style={{ background: "var(--article-line)" }}
        />

        <div className="flex-1 min-w-0 flex flex-col gap-5 p-6">
          <div className="flex items-center justify-between">
            <Link
              href={backHref}
              className="text-sm hover:opacity-70 transition-opacity w-fit"
              style={{
                color: "var(--article-muted)",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              back
            </Link>

            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-0.5 p-0.5 cursor-pointer"
              style={{
                border: `1px solid ${toggleBorder}`,
                borderRadius: "2px",
              }}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <div
                className="h-[5px] w-4 rounded-[1px]"
                style={{
                  background: toggleActive,
                  opacity: isDark ? 0 : 1,
                }}
              />
              <div
                className="h-[5px] w-4 rounded-[1px]"
                style={{
                  background: toggleActive,
                  opacity: isDark ? 1 : 0,
                }}
              />
            </button>
          </div>

          {children}
        </div>

        <div
          className="w-px shrink-0 hidden md:block"
          style={{ background: "var(--article-line)" }}
        />
      </div>
    </main>
  );
}
