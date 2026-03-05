import { getArticleBySlug } from "@/lib/articles";
import { notFound } from "next/navigation";
import { AllowScroll } from "@/components/AllowScroll";
import { ArticleShell } from "@/components/ArticleShell";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

function isHtmlContent(content: string): boolean {
  return /<(p|h[1-6]|ul|ol|blockquote|pre|div|img|hr|br)\b/i.test(content);
}

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
      <ArticleShell backHref="/athenaeum">
        <div className="flex flex-col gap-10">
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
                style={{
                  objectPosition: article.cover_image_position || "50% 50%",
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h1
                className="text-2xl"
                style={{
                  color: "var(--article-title)",
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 500,
                }}
              >
                {article.title}
              </h1>
              <span
                className="text-base shrink-0 ml-4"
                style={{
                  color: "var(--article-muted)",
                  fontFamily: "var(--font-geist-sans)",
                }}
              >
                {formatDate(article.date)}
              </span>
            </div>

            {isHtmlContent(article.content) ? (
              <ArticleHtmlContent content={article.content} />
            ) : (
              <article
                style={{
                  color: "var(--article-text)",
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
                          color: "var(--article-title)",
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
                          color: "var(--article-title)",
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
                          color: "var(--article-strong)",
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
                      <strong
                        style={{
                          color: "var(--article-strong)",
                          fontWeight: 500,
                        }}
                      >
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => <em>{children}</em>,
                    blockquote: ({ children }) => (
                      <blockquote
                        style={{
                          borderLeft: "2px solid var(--article-border)",
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
                          color: "var(--article-link)",
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
                          borderTop: "1px solid var(--article-hr)",
                          margin: "2em 0",
                        }}
                      />
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </article>
            )}

            {article.source &&
              article.source !== "original" &&
              article.source_url && (
                <div
                  className="mt-8 pt-6"
                  style={{
                    borderTop: "1px solid var(--article-source-border)",
                  }}
                >
                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                    style={{
                      color: "var(--article-muted)",
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
      </ArticleShell>
    </>
  );
}

const ARTICLE_HTML_STYLES = `
  .article-html {
    color: var(--article-text);
    font-size: 18px;
    font-family: var(--font-geist-sans);
    line-height: 1.7;
  }
  .article-html > * + * {
    margin-top: 0;
  }
  .article-html p {
    margin-bottom: 1.2em;
  }
  .article-html h1 {
    color: var(--article-title);
    font-size: 22px;
    font-weight: 500;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  .article-html h2 {
    color: var(--article-title);
    font-size: 20px;
    font-weight: 500;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  .article-html h3 {
    color: var(--article-strong);
    font-size: 18px;
    font-weight: 500;
    margin-top: 1.2em;
    margin-bottom: 0.4em;
  }
  .article-html strong {
    color: var(--article-strong);
    font-weight: 500;
  }
  .article-html blockquote {
    border-left: 2px solid var(--article-border);
    padding-left: 16px;
    margin: 1.2em 0;
    font-style: italic;
  }
  .article-html a {
    color: var(--article-link);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .article-html a:hover {
    opacity: 0.8;
  }
  .article-html ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin-bottom: 1.2em;
  }
  .article-html ol {
    list-style-type: decimal;
    padding-left: 1.5em;
    margin-bottom: 1.2em;
  }
  .article-html li {
    margin-bottom: 0.3em;
  }
  .article-html hr {
    border: none;
    border-top: 1px solid var(--article-hr);
    margin: 2em 0;
  }
  .article-html code {
    background: var(--article-code-bg);
    padding: 2px 5px;
    border-radius: 3px;
    font-family: var(--font-space-mono), monospace;
    font-size: 0.9em;
  }
  .article-html pre {
    background: var(--article-pre-bg);
    color: var(--article-pre-text);
    padding: 16px 20px;
    border-radius: 6px;
    overflow-x: hidden;
    margin: 1.4em 0;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .article-html pre code {
    background: none;
    padding: 0;
    color: inherit;
    font-size: inherit;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .article-html img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1em 0;
  }
  .article-html u {
    text-underline-offset: 2px;
  }
`;

function ArticleHtmlContent({ content }: { content: string }) {
  return (
    <>
      <style>{ARTICLE_HTML_STYLES}</style>
      <article
        className="article-html"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
