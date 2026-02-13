import { getPublishedArticles } from "@/lib/articles";
import { getPublishedBooks } from "@/lib/books";
import { getPublishedNotes } from "@/lib/notes";
import { AllowScroll } from "@/components/AllowScroll";
import SiteNav from "@/components/SiteNav";
import AtheneumContent from "@/components/AtheneumTabs";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Athenaeum — Osmond Wu",
  description: "Writings and readings by Osmond Wu",
};

export default async function AtheneumPage() {
  const [articles, notes, books] = await Promise.all([
    getPublishedArticles(),
    getPublishedNotes(),
    getPublishedBooks(),
  ]);

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
        <SiteNav />

        <AtheneumContent
          articles={articles.map((a) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            date: a.date,
          }))}
          notes={notes.map((n) => ({
            id: n.id,
            title: n.title,
            slug: n.slug,
            date: n.date,
          }))}
          books={books.map((b) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            slug: b.slug,
          }))}
        />
      </main>
    </>
  );
}
