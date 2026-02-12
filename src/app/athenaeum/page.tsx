import { getPublishedArticles } from "@/lib/articles";
import Link from "next/link";
import { AllowScroll } from "@/components/AllowScroll";
import BookAnimation from "@/components/BookAnimation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Athenaeum — Osmond Wu",
  description: "Writings and readings by Osmond Wu",
};

const navItems = [
  { label: "Travel", href: "/travel" },
  { label: "Write", href: "#" },
  { label: "Read", href: "/athenaeum/read" },
  { label: "About", href: "/about" },
  { label: "Inspo", href: "/inspo" },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export default async function AtheneumPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <AllowScroll />
      <main
        className="min-h-screen relative"
        style={{
          background: "#1a1f3d",
          fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
        }}
      >
        {/* ── Top navigation ── */}
        <nav className="flex items-center gap-2 px-8 pt-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm transition-opacity duration-300 hover:opacity-100"
              style={{
                color: "#fed",
                opacity: item.label === "Travel" ? 1 : 0.5,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ── Main two-column content ── */}
        <div className="flex min-h-[calc(100vh-80px)] px-8">
          {/* ── Left sidebar ── */}
          <div className="flex flex-col justify-between w-[300px] shrink-0 pt-32 pb-10">
            <div>
              {/* Book animation viewport */}
              <div className="w-[127px] h-[125px] mb-8">
                <BookAnimation color="rgba(255, 238, 221, 0.6)" />
              </div>

              {/* Title */}
              <h1
                className="text-[26px] leading-tight"
                style={{ color: "#fed", fontWeight: 500 }}
              >
                The Athenaeum
              </h1>

              {/* Subtitle */}
              <p
                className="mt-4 text-[18px]"
                style={{
                  color: "rgba(225, 213, 213, 0.75)",
                  fontWeight: 400,
                }}
              >
                Writing is how I make sense of reality
              </p>
            </div>

            {/* Bottom tabs */}
            <div className="flex items-center gap-4">
              <span
                className="text-[18px] cursor-pointer transition-opacity hover:opacity-100"
                style={{
                  color: "rgba(225, 213, 213, 0.75)",
                  fontWeight: 400,
                }}
              >
                writings
              </span>
              <span
                className="text-[18px]"
                style={{ color: "#fed", fontWeight: 400 }}
              >
                readings
              </span>
            </div>
          </div>

          {/* ── Right article list ── */}
          <div className="flex-1 flex justify-end pt-32">
            <div className="w-full max-w-[490px]">
              {articles.map((article, index) => {
                const isFirst = index === 0;
                return (
                  <Link
                    key={article.id}
                    href={`/athenaeum/read/${article.slug}`}
                    className="group block"
                  >
                    <div className="flex items-center justify-between py-[10px] px-[10px]">
                      <span
                        className="text-[16px] transition-opacity group-hover:opacity-70"
                        style={{
                          color: "#fed",
                          fontWeight: isFirst ? 500 : 400,
                        }}
                      >
                        {article.title}
                      </span>
                      <span
                        className="text-[16px] shrink-0 ml-4"
                        style={{
                          color: "rgba(225, 213, 213, 0.75)",
                          fontWeight: 400,
                        }}
                      >
                        {formatDate(article.date)}
                      </span>
                    </div>
                  </Link>
                );
              })}

              {articles.length === 0 && (
                <p
                  className="text-[16px] py-3 px-[10px]"
                  style={{ color: "rgba(225, 213, 213, 0.5)" }}
                >
                  No articles yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
