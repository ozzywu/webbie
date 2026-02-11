import { getPublishedArticles } from "@/lib/articles";
import Link from "next/link";
import { AllowScroll } from "@/components/AllowScroll";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Read — Osmond Wu",
  description: "Articles and essays by Osmond Wu",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export default async function ReadPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <AllowScroll />
      <main className="min-h-screen" style={{ background: "#f3f0e9" }}>
        <div className="max-w-[730px] mx-auto min-h-screen flex">
          {/* Left decorative line */}
          <div
            className="w-px shrink-0 hidden md:block"
            style={{ background: "rgba(157, 124, 124, 0.3)" }}
          />

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Back to home */}
            <Link
              href="/"
              className="text-sm hover:opacity-70 transition-opacity"
              style={{
                color: "#9d7c7c",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              back
            </Link>

            {/* Page title */}
            <h1
              className="mt-12 text-3xl"
              style={{
                color: "#670000",
                fontFamily: "var(--font-cormorant)",
                fontWeight: 400,
                fontStyle: "italic",
              }}
            >
              Read
            </h1>

            {/* Article list */}
            <div className="mt-8 flex flex-col">
              {articles.length === 0 && (
                <p
                  className="text-base"
                  style={{
                    color: "#9d7c7c",
                    fontFamily: "var(--font-geist-sans)",
                  }}
                >
                  No articles yet.
                </p>
              )}

              {articles.map((article, index) => (
                <div key={article.id}>
                  {index > 0 && (
                    <div
                      className="w-full h-px my-6"
                      style={{ background: "rgba(157, 124, 124, 0.2)" }}
                    />
                  )}
                  <Link
                    href={`/athenaeum/read/${article.slug}`}
                    className="group block"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h2
                        className="text-xl group-hover:opacity-70 transition-opacity"
                        style={{
                          color: "#670000",
                          fontFamily: "var(--font-geist-sans)",
                          fontWeight: 500,
                        }}
                      >
                        {article.title}
                      </h2>
                      <span
                        className="text-sm shrink-0"
                        style={{
                          color: "#9d7c7c",
                          fontFamily: "var(--font-geist-sans)",
                        }}
                      >
                        {formatDate(article.date)}
                      </span>
                    </div>
                    {article.excerpt && (
                      <p
                        className="mt-2 text-base leading-relaxed"
                        style={{
                          color: "#9d7c7c",
                          fontFamily: "var(--font-geist-sans)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.excerpt}
                      </p>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right decorative line */}
          <div
            className="w-px shrink-0 hidden md:block"
            style={{ background: "rgba(157, 124, 124, 0.3)" }}
          />
        </div>
      </main>
    </>
  );
}
