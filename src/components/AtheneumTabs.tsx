"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BookAnimation from "@/components/BookAnimation";
import ToggleSwitch from "@/components/ToggleSwitch";

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
    <div className="flex h-[calc(100vh-80px)] px-10">
      {/* ── Left sidebar ── */}
      <div className="flex flex-col w-[354px] shrink-0 pb-10">
        {/* Center group — vertically centered between nav and tabs */}
        <div className="flex-1 flex items-center">
          <div className="flex flex-col gap-5">
            {/* Book animation viewport */}
            <div className="w-[127px] h-[125px]">
              <BookAnimation color="rgba(255, 238, 221, 0.6)" />
            </div>

            {/* Title + Subtitle */}
            <div className="flex flex-col gap-[10px]">
              <h1
                className="text-[24px] leading-tight"
                style={{ color: "#fed", fontWeight: 500 }}
              >
                The Athenaeum
              </h1>
              <p
                className="text-[16px]"
                style={{
                  color: "rgba(225, 213, 213, 0.75)",
                  fontWeight: 400,
                }}
              >
                Writing and reading is how I make sense of reality
              </p>
            </div>
          </div>
        </div>

        {/* Bottom tabs */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="text-[16px] cursor-pointer transition-colors duration-200 hover:opacity-90 p-[2px]"
              style={{
                color: activeTab === tab.key ? "#fed" : "#afa7af",
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
      </div>

      {/* ── Right content list ── */}
      <div className="flex-1 flex flex-row items-center self-stretch">
        <div className="flex flex-col h-full w-full max-w-[490px] ml-auto">
          {/* Toggle switch */}
          <div className="p-[10px]">
            <ToggleSwitch />
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "essays" && <EssaysList articles={articles} />}
            {activeTab === "notes" && <NotesList notes={notes} />}
            {activeTab === "readings" && <ReadingsList books={books} />}
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

/* ── Essays list (articles) ── */
function EssaysList({ articles }: { articles: ArticleItem[] }) {
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
          No essays yet.
        </p>
      )}
    </>
  );
}

/* ── Notes list ── */
function NotesList({ notes }: { notes: NoteItem[] }) {
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
                style={{
                  color: "#fed",
                  fontWeight: isFirst ? 500 : 400,
                }}
              >
                {note.title}
              </span>
              <span
                className="text-[16px] shrink-0 ml-4"
                style={{
                  color: "rgba(225, 213, 213, 0.75)",
                  fontWeight: 400,
                }}
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
          style={{ color: "rgba(225, 213, 213, 0.5)" }}
        >
          No notes yet.
        </p>
      )}
    </>
  );
}

/* ── Readings list ── */
function ReadingsList({ books }: { books: BookItem[] }) {
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
                style={{
                  color: "#fed",
                  fontWeight: isFirst ? 500 : 400,
                }}
              >
                {book.title}
              </span>
              <span
                className="text-[16px] shrink-0 ml-4"
                style={{
                  color: "rgba(225, 213, 213, 0.75)",
                  fontWeight: 400,
                }}
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
          style={{ color: "rgba(225, 213, 213, 0.5)" }}
        >
          No books yet.
        </p>
      )}
    </>
  );
}
