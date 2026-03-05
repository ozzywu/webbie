"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BookAnimation from "@/components/BookAnimation";
import ToggleSwitch from "@/components/ToggleSwitch";
import SiteNav from "@/components/SiteNav";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  date: string;
}

interface NoteItem {
  id: string;
  title: string;
  slug: string;
  date: string;
}

interface BookItem {
  id: string;
  title: string;
  author: string;
  slug: string;
}

type TabKey = "essays" | "notes" | "readings";

interface AtheneumContentProps {
  articles: ArticleItem[];
  notes: NoteItem[];
  books: BookItem[];
}

const themes = {
  dark: {
    bg: "#1a1f3d",
    primary: "#fed",
    secondary: "rgba(225, 213, 213, 0.75)",
    tabActive: "#fed",
    tabInactive: "#afa7af",
    bookColor: "rgba(255, 238, 221, 0.6)",
    toggleColor: "#fed",
    toggleBorder: "rgba(255, 238, 221, 0.3)",
    emptyText: "rgba(225, 213, 213, 0.5)",
  },
  light: {
    bg: "#f0ebe3",
    primary: "#670000",
    secondary: "rgba(103, 0, 0, 0.55)",
    tabActive: "#670000",
    tabInactive: "#a09090",
    bookColor: "rgba(103, 0, 0, 0.5)",
    toggleColor: "#670000",
    toggleBorder: "rgba(103, 0, 0, 0.3)",
    emptyText: "rgba(103, 0, 0, 0.4)",
  },
} as const;

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function AtheneumContentInner({
  articles,
  notes,
  books,
}: AtheneumContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (tabParam === "notes") return "notes";
    if (tabParam === "readings") return "readings";
    return "essays";
  });

  const [isDark, setIsDark] = useState(true);
  const t = isDark ? themes.dark : themes.light;

  useEffect(() => {
    if (tabParam === "notes") setActiveTab("notes");
    else if (tabParam === "readings") setActiveTab("readings");
    else setActiveTab("essays");
  }, [tabParam]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "essays", label: "Essays" },
    { key: "notes", label: "Notes" },
    { key: "readings", label: "Readings" },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ background: t.bg }}
    >
      <SiteNav variant={isDark ? "dark" : "light"} />
      <div className="flex justify-center px-6 pt-[50px] pb-10">
        <div className="flex flex-col gap-[40px] w-[490px]">
          <div className="flex flex-col gap-[20px]">
            <div className="w-[127px] h-[125px]">
              <BookAnimation color={t.bookColor} />
            </div>

            <div className="flex flex-col gap-[10px]">
              <h1
                className="text-[24px] leading-tight transition-colors duration-500"
                style={{ color: t.primary, fontWeight: 500 }}
              >
                The Athenaeum
              </h1>
              <p
                className="text-[16px] transition-colors duration-500"
                style={{ color: t.secondary, fontWeight: 400 }}
              >
                Writing and reading is how I make sense of reality
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="text-[16px] cursor-pointer transition-colors duration-200 hover:opacity-90 p-[2px]"
                style={{
                  color: activeTab === tab.key ? t.tabActive : t.tabInactive,
                  fontWeight: 400,
                  background: "none",
                  border: "none",
                  fontFamily: "inherit",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col w-full">
            <div className="p-[10px]">
              <ToggleSwitch
                isOn={isDark}
                onToggle={() => setIsDark((v) => !v)}
                activeColor={t.toggleColor}
                borderColor={t.toggleBorder}
              />
            </div>

            <div className="flex flex-col">
              {activeTab === "essays" && (
                <EssaysList articles={articles} theme={t} />
              )}
              {activeTab === "notes" && (
                <NotesList notes={notes} theme={t} />
              )}
              {activeTab === "readings" && (
                <ReadingsList books={books} theme={t} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AtheneumContent(props: AtheneumContentProps) {
  return (
    <Suspense>
      <AtheneumContentInner {...props} />
    </Suspense>
  );
}

type Theme = (typeof themes)[keyof typeof themes];

/* ── Essays list (articles) ── */
function EssaysList({
  articles,
  theme: t,
}: {
  articles: ArticleItem[];
  theme: Theme;
}) {
  return (
    <>
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
                style={{ color: t.primary, fontWeight: isFirst ? 500 : 400 }}
              >
                {article.title}
              </span>
              <span
                className="text-[16px] shrink-0 ml-4"
                style={{ color: t.secondary, fontWeight: 400 }}
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
          style={{ color: t.emptyText }}
        >
          No essays yet.
        </p>
      )}
    </>
  );
}

/* ── Notes list ── */
function NotesList({
  notes,
  theme: t,
}: {
  notes: NoteItem[];
  theme: Theme;
}) {
  return (
    <>
      {notes.map((note, index) => {
        const isFirst = index === 0;
        return (
          <Link
            key={note.id}
            href={`/athenaeum/note/${note.slug}`}
            className="group block"
          >
            <div className="flex items-center justify-between py-[10px] px-[10px]">
              <span
                className="text-[16px] transition-opacity group-hover:opacity-70"
                style={{ color: t.primary, fontWeight: isFirst ? 500 : 400 }}
              >
                {note.title}
              </span>
              <span
                className="text-[16px] shrink-0 ml-4"
                style={{ color: t.secondary, fontWeight: 400 }}
              >
                {formatDate(note.date)}
              </span>
            </div>
          </Link>
        );
      })}

      {notes.length === 0 && (
        <p
          className="text-[16px] py-3 px-[10px]"
          style={{ color: t.emptyText }}
        >
          No notes yet.
        </p>
      )}
    </>
  );
}

/* ── Readings list ── */
function ReadingsList({
  books,
  theme: t,
}: {
  books: BookItem[];
  theme: Theme;
}) {
  return (
    <>
      {books.map((book, index) => {
        const isFirst = index === 0;
        return (
          <Link
            key={book.id}
            href={`/athenaeum/book/${book.slug}`}
            className="group block"
          >
            <div className="flex items-center justify-between py-[10px] px-[10px]">
              <span
                className="text-[16px] transition-opacity group-hover:opacity-70"
                style={{ color: t.primary, fontWeight: isFirst ? 500 : 400 }}
              >
                {book.title}
              </span>
              <span
                className="text-[16px] shrink-0 ml-4"
                style={{ color: t.secondary, fontWeight: 400 }}
              >
                {book.author}
              </span>
            </div>
          </Link>
        );
      })}

      {books.length === 0 && (
        <p
          className="text-[16px] py-3 px-[10px]"
          style={{ color: t.emptyText }}
        >
          No books yet.
        </p>
      )}
    </>
  );
}
