import { NextRequest, NextResponse } from "next/server";
import { createNote } from "@/lib/notes";

function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  const expected = process.env.BOOKMARK_TOKEN;
  if (!expected) return false;
  return token === expected;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { content?: string; title?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content, title } = body;
  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "Missing required field: content" },
      { status: 400 },
    );
  }

  const noteTitle =
    title || content.slice(0, 50).replace(/\n/g, " ").trim() || "Quick note";
  const slug =
    generateSlug(noteTitle) + "-" + Date.now().toString(36).slice(-4);

  try {
    const note = await createNote({
      title: noteTitle,
      slug,
      date: new Date().toISOString().split("T")[0],
      content,
      status: "draft",
    });

    return NextResponse.json({
      success: true,
      id: note.id,
      title: note.title,
    });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { error: "Failed to save note" },
      { status: 500 },
    );
  }
}
