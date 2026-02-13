"use client";

import { useActionState, useState, useRef, useCallback } from "react";
import { saveNoteAction, uploadImageAction } from "@/app/admin/actions";
import type { Note } from "@/lib/notes";
import { ImagePositioner } from "./ImagePositioner";
import { RichTextEditor } from "./RichTextEditor";
import Link from "next/link";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function NoteForm({ note }: { note?: Note }) {
  const [state, formAction, isPending] = useActionState(saveNoteAction, null);
  const [slug, setSlug] = useState(note?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!note);
  const [coverImage, setCoverImage] = useState(note?.cover_image || "");
  const [coverImagePosition, setCoverImagePosition] = useState(
    note?.cover_image_position || "50% 50%",
  );
  const [uploading, setUploading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
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

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  const handleContentImageUpload = useCallback(
    async (file: File): Promise<string | null> => {
      if (!file.type.startsWith("image/")) return null;
      try {
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadImageAction(fd);
        return result.url || null;
      } catch {
        return null;
      }
    },
    [],
  );

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (autoSlug) {
      setSlug(generateSlug(e.target.value));
    }
  }

  const font = "var(--font-geist-sans), system-ui, sans-serif";

  return (
    <form action={formAction} className="flex flex-col gap-0">
      <style>{FORM_STYLES}</style>

      {/* Hidden fields */}
      {note && <input type="hidden" name="id" value={note.id} />}
      <input
        type="hidden"
        name="date"
        value={note?.date || new Date().toISOString().split("T")[0]}
      />
      <input type="hidden" name="slug" value={slug} />
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
        style={{ display: "none" }}
      />

      {/* Error banner */}
      {state?.error && (
        <div className="ss-form-error" style={{ fontFamily: font }}>
          {state.error}
        </div>
      )}

      {/* ─── Top Action Bar ────────────────────────────────── */}
      <div className="ss-form-topbar">
        <Link
          href="/admin/notes"
          className="ss-form-back"
          style={{ fontFamily: font }}
        >
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
          {note ? "Back" : "Notes"}
        </Link>

        <div className="ss-form-actions">
          <select
            name="status"
            defaultValue={note?.status || "draft"}
            className="ss-form-status"
            style={{ fontFamily: font }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            disabled={isPending}
            className="ss-form-save"
            style={{ fontFamily: font }}
          >
            {isPending ? "Saving..." : note ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* ─── Editor Card ───────────────────────────────────── */}
      <div className="ss-form-card">
        {/* Cover image area */}
        {coverImage ? (
          <div className="ss-form-cover-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt=""
              className="ss-form-cover-img"
              style={{ objectPosition: coverImagePosition }}
            />
            <div className="ss-form-cover-overlay">
              <button
                type="button"
                onClick={() => setImageModalOpen(true)}
                className="ss-form-cover-action"
                style={{ fontFamily: font }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setCoverImage("");
                  setCoverImagePosition("50% 50%");
                }}
                className="ss-form-cover-action ss-form-cover-remove"
                style={{ fontFamily: font }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setImageModalOpen(true);
              setTimeout(() => fileInputRef.current?.click(), 100);
            }}
            className="ss-form-add-cover"
            style={{ fontFamily: font }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Add cover image
          </button>
        )}

        {/* Title */}
        <input
          name="title"
          type="text"
          required
          defaultValue={note?.title}
          onChange={handleTitleChange}
          placeholder="Title"
          className="ss-form-title"
          style={{ fontFamily: font }}
        />

        {/* Excerpt / subtitle */}
        <textarea
          name="excerpt"
          rows={1}
          defaultValue={note?.excerpt || ""}
          placeholder="Add a subtitle..."
          className="ss-form-subtitle"
          style={{ fontFamily: font }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
        />

        {/* Content editor */}
        <RichTextEditor
          name="content"
          defaultValue={note?.content || ""}
          placeholder="Start writing..."
          required
          onImageUpload={handleContentImageUpload}
          borderless
        />
      </div>

      {/* ─── Settings footer (slug) ────────────────────────── */}
      <div className="ss-form-footer">
        <div className="ss-form-slug-row">
          <label className="ss-form-slug-label" style={{ fontFamily: font }}>
            URL slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setAutoSlug(false);
            }}
            className="ss-form-slug-input"
            style={{ fontFamily: font }}
          />
        </div>
      </div>

      {/* ─── Image Modal ───────────────────────────────────── */}
      {imageModalOpen && (
        <div
          className="ss-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setImageModalOpen(false);
          }}
        >
          <div className="ss-modal-content">
            <div className="ss-modal-header">
              <span className="ss-modal-title" style={{ fontFamily: font }}>
                Cover image
              </span>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="ss-modal-close"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="ss-modal-body">
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
                  className="ss-modal-upload"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleUpload(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontFamily: font }}
                >
                  {uploading ? (
                    <span className="ss-modal-upload-text">Uploading...</span>
                  ) : (
                    <>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "#9ca3af" }}
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="ss-modal-upload-text">
                        Drop an image or click to browse
                      </span>
                      <span className="ss-modal-upload-hint">
                        JPG, PNG, WebP — max 10MB
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {coverImage && (
              <div className="ss-modal-footer">
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="ss-modal-done"
                  style={{ fontFamily: font }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

// ─── Styles (reuses same class names as ArticleForm) ──────────────

const FORM_STYLES = `
  .ss-form-error { padding: 10px 16px; border-radius: 8px; font-size: 14px; background: #fef2f2; color: #dc2626; margin-bottom: 12px; }
  .ss-form-topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; margin-bottom: 8px; }
  .ss-form-back { display: inline-flex; align-items: center; gap: 4px; font-size: 14px; color: #6b7280; text-decoration: none; transition: color 0.15s; }
  .ss-form-back:hover { color: #111; }
  .ss-form-actions { display: flex; align-items: center; gap: 8px; }
  .ss-form-status { padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; color: #374151; background: #fff; cursor: pointer; outline: none; }
  .ss-form-status:focus { border-color: #d1d5db; }
  .ss-form-save { padding: 7px 20px; border: none; border-radius: 20px; font-size: 14px; font-weight: 500; color: #fff; background: #111; cursor: pointer; transition: opacity 0.15s; }
  .ss-form-save:hover { opacity: 0.85; }
  .ss-form-save:disabled { opacity: 0.4; cursor: default; }
  .ss-form-card { background: #fff; border-radius: 10px; box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04); overflow: hidden; }
  .ss-form-add-cover { display: flex; align-items: center; gap: 8px; padding: 14px 40px; font-size: 14px; color: #9ca3af; background: transparent; border: none; cursor: pointer; transition: color 0.15s; width: 100%; }
  .ss-form-add-cover:hover { color: #6b7280; }
  .ss-form-cover-preview { position: relative; width: 100%; aspect-ratio: 680/315; overflow: hidden; cursor: pointer; }
  .ss-form-cover-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ss-form-cover-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; opacity: 0; }
  .ss-form-cover-preview:hover .ss-form-cover-overlay { background: rgba(0,0,0,0.4); opacity: 1; }
  .ss-form-cover-action { padding: 6px 16px; border: none; border-radius: 20px; font-size: 13px; font-weight: 500; color: #fff; background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); cursor: pointer; transition: background 0.15s; }
  .ss-form-cover-action:hover { background: rgba(255,255,255,0.35); }
  .ss-form-cover-remove:hover { background: rgba(239,68,68,0.7); }
  .ss-form-title { display: block; width: 100%; padding: 8px 40px 0; border: none; outline: none; font-size: 32px; font-weight: 700; color: #111; background: transparent; letter-spacing: -0.02em; line-height: 1.2; }
  .ss-form-title::placeholder { color: #d1d5db; }
  .ss-form-subtitle { display: block; width: 100%; padding: 6px 40px 16px; border: none; outline: none; font-size: 17px; color: #9ca3af; background: transparent; resize: none; line-height: 1.5; overflow: hidden; }
  .ss-form-subtitle::placeholder { color: #d1d5db; }
  .ss-form-footer { margin-top: 12px; padding: 12px 0; }
  .ss-form-slug-row { display: flex; align-items: center; gap: 8px; }
  .ss-form-slug-label { font-size: 12px; color: #9ca3af; white-space: nowrap; }
  .ss-form-slug-input { flex: 1; padding: 4px 8px; border: 1px solid #e5e7eb; border-radius: 5px; font-size: 12px; color: #6b7280; outline: none; background: #fff; }
  .ss-form-slug-input:focus { border-color: #d1d5db; }
  .ss-modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(2px); }
  .ss-modal-content { background: #fff; border-radius: 12px; width: 100%; max-width: 680px; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
  .ss-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f3f4f6; }
  .ss-modal-title { font-size: 15px; font-weight: 600; color: #111; }
  .ss-modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: transparent; border-radius: 6px; cursor: pointer; color: #6b7280; transition: background 0.15s; }
  .ss-modal-close:hover { background: #f3f4f6; color: #111; }
  .ss-modal-body { padding: 20px; overflow-y: auto; }
  .ss-modal-upload { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 48px 24px; border: 2px dashed #e5e7eb; border-radius: 10px; cursor: pointer; transition: border-color 0.15s; }
  .ss-modal-upload:hover { border-color: #d1d5db; }
  .ss-modal-upload-text { font-size: 14px; color: #6b7280; }
  .ss-modal-upload-hint { font-size: 12px; color: #9ca3af; }
  .ss-modal-footer { display: flex; justify-content: flex-end; padding: 12px 20px; border-top: 1px solid #f3f4f6; }
  .ss-modal-done { padding: 7px 24px; border: none; border-radius: 20px; font-size: 14px; font-weight: 500; color: #fff; background: #111; cursor: pointer; transition: opacity 0.15s; }
  .ss-modal-done:hover { opacity: 0.85; }
`;
