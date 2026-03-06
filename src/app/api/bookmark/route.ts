import { NextRequest, NextResponse } from "next/server";
import { createBookmark, getBookmarkByUrl } from "@/lib/bookmarks";
import { scrapeOgMetadata } from "@/lib/og-scraper";

function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  const expected = process.env.BOOKMARK_TOKEN;
  if (!expected) return false;
  return token === expected;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "Missing required field: url" },
      { status: 400 },
    );
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const existing = await getBookmarkByUrl(url);
  if (existing) {
    return NextResponse.json({
      success: true,
      id: existing.id,
      title: existing.title,
      duplicate: true,
    });
  }

  const metadata = await scrapeOgMetadata(url);

  try {
    const bookmark = await createBookmark({
      url,
      title: metadata.title,
      author: metadata.author,
      excerpt: metadata.excerpt,
      og_image: metadata.og_image,
      source: metadata.source,
      notes: "",
      status: "saved",
    });

    return NextResponse.json({
      success: true,
      id: bookmark.id,
      title: bookmark.title,
    });
  } catch (error) {
    console.error("Failed to create bookmark:", error);
    return NextResponse.json(
      { error: "Failed to save bookmark" },
      { status: 500 },
    );
  }
}
