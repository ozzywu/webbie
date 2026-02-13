import { getNoteBySlug } from "@/lib/notes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AllowScroll } from "@/components/AllowScroll";
import {
  AnimatedLine,
  FixedRedLines,
  AnimatedContent,
} from "@/components/ArticleAnimations";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

/** Check if content is HTML (from the rich text editor) vs markdown */
function isHtmlContent(content: string): boolean {
  return /<(p|h[1-6]|ul|ol|blockquote|pre|div|img|hr|br)\b/i.test(content);
}

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    return { title: "Note Not Found" };
  }

  return {
    title: `${note.title} — Osmond Wu`,
    description: note.excerpt || undefined,
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <>
      <AllowScroll />
      <main className="min-h-screen" style={{ background: "#f3f0e9" }}>
        {/* Fixed red accent marks */}
        <FixedRedLines />

        <div
          data-article-container
          className="max-w-[730px] mx-auto min-h-screen flex"
        >
          {/* Left decorative line */}
          <AnimatedLine side="left" delay={0.05} />

          {/* Content */}
          <AnimatedContent className="flex-1 flex flex-col gap-5 p-6">
            {/* Back button */}
            <Link
              href="/athenaeum?tab=notes"
              className="text-sm hover:opacity-70 transition-opacity w-fit"
              style={{
                color: "#9d7c7c",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              back
            </Link>

            {/* Note content */}
            <div className="flex flex-col gap-10">
              {/* Hero image */}
              {note.cover_image && (
                <div
                  className="w-full overflow-hidden"
                  style={{ aspectRatio: "680/315" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={note.cover_image}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: note.cover_image_position || "50% 50%",
                    }}
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
                    {note.title}
                  </h1>
                  <span
                    className="text-base shrink-0 ml-4"
                    style={{
                      color: "#9d7c7c",
                      fontFamily: "var(--font-geist-sans)",
                    }}
                  >
                    {formatDate(note.date)}
                  </span>
                </div>

                {/* Body */}
                {note.content && isHtmlContent(note.content) ? (
                  <NoteHtmlContent content={note.content} />
                ) : note.content ? (
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
                              borderTop: "1px solid rgba(157, 124, 124, 0.3)",
                              margin: "2em 0",
                            }}
                          />
                        ),
                      }}
                    >
                      {note.content}
                    </ReactMarkdown>
                  </article>
                ) : null}
              </div>
            </div>
          </AnimatedContent>

          {/* Right decorative line */}
          <AnimatedLine side="right" delay={0.3} />
        </div>
      </main>
    </>
  );
}

// ─── HTML Content Renderer ──────────────────────────────────────────

const NOTE_HTML_STYLES = `
  .note-html { color: #9d7c7c; font-size: 18px; font-family: var(--font-geist-sans); line-height: 1.7; }
  .note-html > * + * { margin-top: 0; }
  .note-html p { margin-bottom: 1.2em; }
  .note-html h1 { color: #670000; font-size: 22px; font-weight: 500; margin-top: 1.5em; margin-bottom: 0.5em; }
  .note-html h2 { color: #670000; font-size: 20px; font-weight: 500; margin-top: 1.5em; margin-bottom: 0.5em; }
  .note-html h3 { color: #7a5555; font-size: 18px; font-weight: 500; margin-top: 1.2em; margin-bottom: 0.4em; }
  .note-html strong { color: #7a5555; font-weight: 500; }
  .note-html blockquote { border-left: 2px solid rgba(157, 124, 124, 0.4); padding-left: 16px; margin: 1.2em 0; font-style: italic; }
  .note-html a { color: #670000; text-decoration: underline; text-underline-offset: 2px; }
  .note-html a:hover { opacity: 0.8; }
  .note-html ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.2em; }
  .note-html ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1.2em; }
  .note-html li { margin-bottom: 0.3em; }
  .note-html hr { border: none; border-top: 1px solid rgba(157, 124, 124, 0.3); margin: 2em 0; }
  .note-html code { background: rgba(157, 124, 124, 0.1); padding: 2px 5px; border-radius: 3px; font-family: var(--font-space-mono), monospace; font-size: 0.9em; }
  .note-html pre { background: #2a2020; color: #e0d5d5; padding: 16px 20px; border-radius: 6px; overflow-x: auto; margin: 1.4em 0; font-size: 14px; line-height: 1.6; }
  .note-html pre code { background: none; padding: 0; color: inherit; font-size: inherit; }
  .note-html img { max-width: 100%; height: auto; border-radius: 4px; margin: 1em 0; }
  .note-html u { text-underline-offset: 2px; }
`;

function NoteHtmlContent({ content }: { content: string }) {
  return (
    <>
      <style>{NOTE_HTML_STYLES}</style>
      <article
        className="note-html"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
