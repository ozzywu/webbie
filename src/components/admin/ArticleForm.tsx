"use client";

import { useActionState, useState, useRef, useCallback } from "react";
import { saveArticleAction, uploadImageAction } from "@/app/admin/actions";
import type { Article } from "@/lib/articles";
import { ImagePositioner } from "./ImagePositioner";
import Link from "next/link";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ArticleForm({ article }: { article?: Article }) {
  const [state, formAction, isPending] = useActionState(
    saveArticleAction,
    null
  );
  const [slug, setSlug] = useState(article?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!article);
  const [coverImage, setCoverImage] = useState(article?.cover_image || "");
  const [coverImagePosition, setCoverImagePosition] = useState(
    article?.cover_image_position || "50% 50%"
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadImageAction(fd);
      if (result.url) {
        setCoverImage(result.url);
      } else if (result.error) {
        alert("Upload failed: " + result.error);
      }
    } finally {
      setUploading(false);
    }
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (autoSlug) {
      setSlug(generateSlug(e.target.value));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value);
    setAutoSlug(false);
  }

  const inputClass =
    "w-full px-3 py-2 border rounded text-sm outline-none focus:border-gray-400 transition-colors";
  const inputStyle = {
    borderColor: "rgba(0, 0, 0, 0.15)",
    color: "#1a1a1a",
    fontFamily: "var(--font-geist-sans)",
    background: "#fff",
  };
  const labelStyle = {
    color: "#374151",
    fontFamily: "var(--font-geist-sans)",
  };

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {article && <input type="hidden" name="id" value={article.id} />}

      {state?.error && (
        <div
          className="p-3 rounded text-sm"
          style={{
            background: "#fef2f2",
            color: "#dc2626",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={labelStyle}>
            Title
          </label>
          <input
            name="title"
            type="text"
            required
            defaultValue={article?.title}
            onChange={handleTitleChange}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={labelStyle}>
            Slug
          </label>
          <input
            name="slug"
            type="text"
            required
            value={slug}
            onChange={handleSlugChange}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={labelStyle}>
            Date
          </label>
          <input
            name="date"
            type="date"
            required
            defaultValue={
              article?.date || new Date().toISOString().split("T")[0]
            }
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={labelStyle}>
            Status
          </label>
          <select
            name="status"
            defaultValue={article?.status || "draft"}
            className={inputClass}
            style={inputStyle}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={labelStyle}>
          Cover Image
        </label>
        <input type="hidden" name="cover_image" value={coverImage} />
        <input
          type="hidden"
          name="cover_image_position"
          value={coverImagePosition}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {coverImage ? (
          <ImagePositioner
            src={coverImage}
            value={coverImagePosition}
            onChange={setCoverImagePosition}
            onReplace={() => fileInputRef.current?.click()}
            onRemove={() => {
              setCoverImage("");
              setCoverImagePosition("50% 50%");
            }}
          />
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
            style={{
              borderColor: dragOver ? "#670000" : "rgba(0,0,0,0.15)",
              background: dragOver ? "rgba(103,0,0,0.03)" : "transparent",
            }}
          >
            {uploading ? (
              <span
                className="text-sm"
                style={{ color: "#666", fontFamily: "var(--font-geist-sans)" }}
              >
                Uploading...
              </span>
            ) : (
              <>
                <span
                  className="text-sm"
                  style={{ color: "#666", fontFamily: "var(--font-geist-sans)" }}
                >
                  Drop an image here or click to browse
                </span>
                <span
                  className="text-xs"
                  style={{ color: "#999", fontFamily: "var(--font-geist-sans)" }}
                >
                  JPG, PNG, WebP — max 10MB
                </span>
              </>
            )}
          </div>
        )}

        {/* Fallback: paste URL directly */}
        <input
          type="text"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="Or paste an image URL..."
          className={`${inputClass} mt-1`}
          style={{ ...inputStyle, fontSize: "12px" }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={labelStyle}>
          Excerpt
        </label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={article?.excerpt || ""}
          placeholder="Brief description for the article list..."
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={labelStyle}>
          Content (Markdown)
        </label>
        <textarea
          name="content"
          rows={20}
          required
          defaultValue={article?.content || ""}
          placeholder="Write your article in markdown..."
          className={`${inputClass} resize-y`}
          style={{
            ...inputStyle,
            fontFamily: "var(--font-space-mono), monospace",
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 rounded text-sm transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{
            background: "#670000",
            color: "#fff",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          {isPending
            ? "Saving..."
            : article
              ? "Update Article"
              : "Create Article"}
        </button>
        <Link
          href="/admin/articles"
          className="px-5 py-2 rounded text-sm border hover:opacity-70 transition-opacity"
          style={{
            borderColor: "#d1d5db",
            color: "#374151",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
