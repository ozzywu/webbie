import { getArticleBySlug } from "@/lib/articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AllowScroll } from "@/components/AllowScroll";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${article.title} — Osmond Wu`,
    description: article.excerpt || undefined,
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

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
          <div className="flex-1 flex flex-col gap-5 p-6">
            {/* Back button */}
            <Link
              href="/athenaeum/read"
              className="text-sm hover:opacity-70 transition-opacity w-fit"
              style={{
                color: "#9d7c7c",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              back
            </Link>

            {/* Article content */}
            <div className="flex flex-col gap-10">
              {/* Hero image */}
              {article.cover_image && (
                <div
                  className="w-full overflow-hidden"
                  style={{ aspectRatio: "680/315" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.cover_image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Text content */}
              <div className="flex flex-col gap-2.5">
                {/* Title + Date */}
                <div className="flex items-center justify-between">
                  <h1
                    className="text-2xl"
                    style={{
                      color: "#670000",
                      fontFamily: "var(--font-geist-sans)",
                      fontWeight: 500,
                    }}
                  >
                    {article.title}
                  </h1>
                  <span
                    className="text-base shrink-0 ml-4"
                    style={{
                      color: "#9d7c7c",
                      fontFamily: "var(--font-geist-sans)",
                    }}
                  >
                    {formatDate(article.date)}
                  </span>
                </div>

                {/* Body */}
                <article
                  style={{
                    color: "#9d7c7c",
                    fontSize: "18px",
                    fontFamily: "var(--font-geist-sans)",
                    lineHeight: 1.7,
                  }}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p style={{ marginBottom: "1.2em" }}>{children}</p>
                      ),
                      h1: ({ children }) => (
                        <h2
                          style={{
                            color: "#670000",
                            fontSize: "22px",
                            fontWeight: 500,
                            marginTop: "1.5em",
                            marginBottom: "0.5em",
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      h2: ({ children }) => (
                        <h3
                          style={{
                            color: "#670000",
                            fontSize: "20px",
                            fontWeight: 500,
                            marginTop: "1.5em",
                            marginBottom: "0.5em",
                          }}
                        >
                          {children}
                        </h3>
                      ),
                      h3: ({ children }) => (
                        <h4
                          style={{
                            color: "#7a5555",
                            fontSize: "18px",
                            fontWeight: 500,
                            marginTop: "1.2em",
                            marginBottom: "0.4em",
                          }}
                        >
                          {children}
                        </h4>
                      ),
                      strong: ({ children }) => (
                        <strong style={{ color: "#7a5555", fontWeight: 500 }}>
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => <em>{children}</em>,
                      blockquote: ({ children }) => (
                        <blockquote
                          style={{
                            borderLeft: "2px solid rgba(157, 124, 124, 0.4)",
                            paddingLeft: "16px",
                            margin: "1.2em 0",
                            fontStyle: "italic",
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          style={{
                            color: "#670000",
                            textDecoration: "underline",
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      ul: ({ children }) => (
                        <ul
                          style={{
                            listStyleType: "disc",
                            paddingLeft: "1.5em",
                            marginBottom: "1.2em",
                          }}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          style={{
                            listStyleType: "decimal",
                            paddingLeft: "1.5em",
                            marginBottom: "1.2em",
                          }}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li style={{ marginBottom: "0.3em" }}>{children}</li>
                      ),
                      hr: () => (
                        <hr
                          style={{
                            border: "none",
                            borderTop:
                              "1px solid rgba(157, 124, 124, 0.3)",
                            margin: "2em 0",
                          }}
                        />
                      ),
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </article>

                {/* Source attribution */}
                {article.source && article.source !== "original" && article.source_url && (
                  <div
                    className="mt-8 pt-6"
                    style={{
                      borderTop: "1px solid rgba(157, 124, 124, 0.2)",
                    }}
                  >
                    <a
                      href={article.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:opacity-70 transition-opacity"
                      style={{
                        color: "#9d7c7c",
                        fontFamily: "var(--font-geist-sans)",
                      }}
                    >
                      Originally published on{" "}
                      {article.source === "substack"
                        ? "Substack"
                        : "X (Twitter)"}
                      {" →"}
                    </a>
                  </div>
                )}
              </div>
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
