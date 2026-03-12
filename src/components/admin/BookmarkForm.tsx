"use client";

import { useActionState } from "react";
import { saveBookmarkAction } from "@/app/admin/actions";
import type { Bookmark } from "@/lib/bookmarks";
import { RichTextEditor } from "./RichTextEditor";
import { uploadImageAction } from "@/app/admin/actions";
import Link from "next/link";
import { useCallback } from "react";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function BookmarkForm({ bookmark }: { bookmark: Bookmark }) {
  const [state, formAction, isPending] = useActionState(
    saveBookmarkAction,
    null,
  );

  const handleContentImageUpload = useCallback(
    async (file: File): Promise<string | null> => {
      if (!file.type.startsWith("image/")) return null;
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("bucket", "bookmark-images");
        const result = await uploadImageAction(fd);
        return result.url || null;
      } catch {
        return null;
      }
    },
    [],
  );

  const font = "var(--font-geist-sans), system-ui, sans-serif";

  return (
    <form action={formAction} className="flex flex-col gap-0">
      <style>{FORM_STYLES}</style>

      <input type="hidden" name="id" value={bookmark.id} />

      {state?.error && (
        <div className="bmf-error" style={{ fontFamily: font }}>
          {state.error}
        </div>
      )}

      {/* Top bar */}
      <div className="bmf-topbar">
        <Link href="/admin/bookmarks" className="bmf-back" style={{ fontFamily: font }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Bookmarks
        </Link>

        <div className="bmf-actions">
          <select
            name="status"
            defaultValue={bookmark.status}
            className="bmf-status"
            style={{ fontFamily: font }}
          >
            <option value="saved">Saved</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            disabled={isPending}
            className="bmf-save"
            style={{ fontFamily: font }}
          >
            {isPending ? "Saving..." : "Update"}
          </button>
        </div>
      </div>

      {/* Source card */}
      <div className="bmf-source-card">
        {bookmark.og_image && (
          <div className="bmf-og-image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bookmark.og_image} alt="" className="bmf-og-image" />
          </div>
        )}
        <div className="bmf-source-info">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bmf-source-link"
            style={{ fontFamily: font }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {getDomain(bookmark.url)}
          </a>
          <span className="bmf-source-date" style={{ fontFamily: font }}>
            Saved {formatDate(bookmark.created_at)}
          </span>
        </div>
      </div>

      {/* Editor card */}
      <div className="bmf-card">
        <input
          name="title"
          type="text"
          required
          defaultValue={bookmark.title}
          placeholder="Title"
          className="bmf-title"
          style={{ fontFamily: font }}
        />

        <input
          name="author"
          type="text"
          defaultValue={bookmark.author || ""}
          placeholder="Author"
          className="bmf-author"
          style={{ fontFamily: font }}
        />

        {/* Notes editor */}
        <div className="bmf-notes-section">
          <label className="bmf-notes-label" style={{ fontFamily: font }}>
            Your notes
          </label>
          <RichTextEditor
            name="notes"
            defaultValue={bookmark.notes || ""}
            placeholder="Write your notes, thoughts, annotations..."
            onImageUpload={handleContentImageUpload}
            borderless
          />
        </div>
      </div>
    </form>
  );
}

const FORM_STYLES = `
  .bmf-error {
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    background: #fef2f2;
    color: #dc2626;
    margin-bottom: 12px;
  }

  .bmf-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    margin-bottom: 8px;
  }

  .bmf-back {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #6b7280;
    text-decoration: none;
    transition: color 0.15s;
  }
  .bmf-back:hover { color: #111; }

  .bmf-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bmf-status {
    padding: 6px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 13px;
    color: #374151;
    background: #fff;
    cursor: pointer;
    outline: none;
  }

  .bmf-save {
    padding: 7px 20px;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    background: #111;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .bmf-save:hover { opacity: 0.85; }
  .bmf-save:disabled { opacity: 0.4; cursor: default; }

  .bmf-source-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);
  }

  .bmf-og-image-wrap {
    width: 56px;
    height: 56px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
    background: #f3f4f6;
  }

  .bmf-og-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .bmf-source-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .bmf-source-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #2563eb;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .bmf-source-link:hover { opacity: 0.7; }

  .bmf-source-date {
    font-size: 12px;
    color: #9ca3af;
  }

  .bmf-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);
    overflow: hidden;
  }

  .bmf-title {
    display: block;
    width: 100%;
    padding: 16px 40px 0;
    border: none;
    outline: none;
    font-size: 24px;
    font-weight: 600;
    color: #111;
    background: transparent;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }
  .bmf-title::placeholder { color: #d1d5db; }

  .bmf-author {
    display: block;
    width: 100%;
    padding: 6px 40px 0;
    border: none;
    outline: none;
    font-size: 14px;
    color: #6b7280;
    background: transparent;
    line-height: 1.4;
  }
  .bmf-author::placeholder { color: #d1d5db; }

  .bmf-notes-section {
    padding: 16px 0 0;
  }

  .bmf-notes-label {
    display: block;
    padding: 0 40px 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
  }
`;
