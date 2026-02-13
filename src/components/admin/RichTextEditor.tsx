"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExt from "@tiptap/extension-image";
import { useState, useCallback, useRef, useMemo } from "react";
import { marked } from "marked";

// ─── Types ──────────────────────────────────────────────────────────

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  onImageUpload?: (file: File) => Promise<string | null>;
  /** Remove wrapper border/shadow so the editor blends into a parent card */
  borderless?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────

function isHtml(str: string): boolean {
  return /<(p|h[1-6]|ul|ol|blockquote|pre|div|img|hr|br)\b/i.test(str);
}

function prepareContent(raw: string): string {
  if (!raw || !raw.trim()) return "";
  if (isHtml(raw)) return raw;
  return marked.parse(raw, { async: false }) as string;
}

// ─── Icons (matching Substack's toolbar) ────────────────────────────

function IconUndo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function IconRedo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" />
    </svg>
  );
}

function IconDivider() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="8" y2="6" opacity="0.3" />
      <line x1="16" y1="6" x2="21" y2="6" opacity="0.3" />
      <line x1="3" y1="18" x2="8" y2="18" opacity="0.3" />
      <line x1="16" y1="18" x2="21" y2="18" opacity="0.3" />
    </svg>
  );
}

function IconBulletList() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconOrderedList() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <text
        x="2"
        y="8.5"
        fontSize="9"
        fill="currentColor"
        stroke="none"
        fontFamily="system-ui, sans-serif"
        fontWeight="500"
      >
        1
      </text>
      <text
        x="2"
        y="14.5"
        fontSize="9"
        fill="currentColor"
        stroke="none"
        fontFamily="system-ui, sans-serif"
        fontWeight="500"
      >
        2
      </text>
      <text
        x="2"
        y="20.5"
        fontSize="9"
        fill="currentColor"
        stroke="none"
        fontFamily="system-ui, sans-serif"
        fontWeight="500"
      >
        3
      </text>
    </svg>
  );
}

function IconCode() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Component ──────────────────────────────────────────────────────

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "Start writing...",
  required,
  onImageUpload,
  borderless,
}: RichTextEditorProps) {
  const initialContent = useMemo(
    () => prepareContent(defaultValue),
    [defaultValue],
  );
  const [html, setHtml] = useState(initialContent);
  const [linkInputVisible, setLinkInputVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      ImageExt.configure({ inline: false }),
    ],
    content: initialContent,
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "ss-editor-content",
      },
      handleDrop(view, event, _slice, moved) {
        if (!moved && event.dataTransfer?.files?.length && onImageUpload) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            onImageUpload(file).then((url) => {
              if (url) {
                const { state } = view;
                const pos = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });
                if (pos) {
                  const node = state.schema.nodes.image.create({ src: url });
                  const tr = state.tr.insert(pos.pos, node);
                  view.dispatch(tr);
                }
              }
            });
            return true;
          }
        }
        return false;
      },
      handlePaste(_view, event) {
        const files = event.clipboardData?.files;
        if (files?.length && onImageUpload) {
          const file = files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            onImageUpload(file).then((url) => {
              if (url) {
                editor?.chain().focus().setImage({ src: url }).run();
              }
            });
            return true;
          }
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  // ─── Handlers ───────────────────────────────────────────────────

  const handleLinkSubmit = useCallback(() => {
    if (!editor) return;
    if (linkUrl.trim()) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl.trim() })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkInputVisible(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const openLinkInput = useCallback(() => {
    if (!editor) return;
    const existing = editor.getAttributes("link").href || "";
    setLinkUrl(existing);
    setLinkInputVisible(true);
  }, [editor]);

  const handleImageSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !onImageUpload || !editor) return;
      const url = await onImageUpload(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      e.target.value = "";
    },
    [editor, onImageUpload],
  );

  const setStyle = useCallback(
    (type: "paragraph" | "h1" | "h2" | "h3") => {
      if (!editor) return;
      if (type === "paragraph") {
        editor.chain().focus().setParagraph().run();
      } else {
        const level = parseInt(type[1]) as 1 | 2 | 3;
        editor.chain().focus().toggleHeading({ level }).run();
      }
      setStyleDropdownOpen(false);
    },
    [editor],
  );

  // ─── Early return ───────────────────────────────────────────────

  if (!editor) return null;

  const currentStyle = editor.isActive("heading", { level: 1 })
    ? "Heading 1"
    : editor.isActive("heading", { level: 2 })
      ? "Heading 2"
      : editor.isActive("heading", { level: 3 })
        ? "Heading 3"
        : "Body";

  const isEmpty = !html?.replace(/<[^>]*>/g, "").trim();

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <div className={`ss-wrapper${borderless ? " ss-borderless" : ""}`}>
      <style>{STYLES}</style>

      {/* Hidden form input */}
      <input type="hidden" name={name} value={html} />
      {required && isEmpty && (
        <input
          type="text"
          required
          value=""
          onChange={() => {}}
          style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
          tabIndex={-1}
          aria-hidden
        />
      )}

      {/* ─── Toolbar ─────────────────────────────────────────── */}
      <div className="ss-toolbar">
        {/* Undo / Redo */}
        <button
          type="button"
          className="ss-btn"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <IconUndo />
        </button>
        <button
          type="button"
          className="ss-btn"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <IconRedo />
        </button>

        <div className="ss-sep" />

        {/* Style dropdown */}
        <div className="ss-style-wrap" ref={styleRef}>
          <button
            type="button"
            className="ss-btn ss-style-btn"
            onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}
            title="Text style"
          >
            <span className="ss-style-label">{currentStyle}</span>
            <IconChevron />
          </button>
          {styleDropdownOpen && (
            <>
              <div
                className="ss-dropdown-backdrop"
                onClick={() => setStyleDropdownOpen(false)}
              />
              <div className="ss-dropdown">
                <button
                  type="button"
                  className={`ss-dropdown-item ${currentStyle === "Body" ? "active" : ""}`}
                  onClick={() => setStyle("paragraph")}
                >
                  <span className="ss-dd-body">Body</span>
                </button>
                <button
                  type="button"
                  className={`ss-dropdown-item ${currentStyle === "Heading 1" ? "active" : ""}`}
                  onClick={() => setStyle("h1")}
                >
                  <span className="ss-dd-h1">Heading 1</span>
                </button>
                <button
                  type="button"
                  className={`ss-dropdown-item ${currentStyle === "Heading 2" ? "active" : ""}`}
                  onClick={() => setStyle("h2")}
                >
                  <span className="ss-dd-h2">Heading 2</span>
                </button>
                <button
                  type="button"
                  className={`ss-dropdown-item ${currentStyle === "Heading 3" ? "active" : ""}`}
                  onClick={() => setStyle("h3")}
                >
                  <span className="ss-dd-h3">Heading 3</span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="ss-sep" />

        {/* Bold, Italic, Strikethrough, Code */}
        <button
          type="button"
          className={`ss-btn ss-text-btn ${editor.isActive("bold") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (⌘B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={`ss-btn ss-text-btn ${editor.isActive("italic") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (⌘I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={`ss-btn ss-text-btn ${editor.isActive("strike") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <button
          type="button"
          className={`ss-btn ${editor.isActive("codeBlock") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code"
        >
          <IconCode />
        </button>

        <div className="ss-sep" />

        {/* Link, Image, Quote, Divider */}
        <button
          type="button"
          className={`ss-btn ${editor.isActive("link") ? "active" : ""}`}
          onClick={openLinkInput}
          title="Add link"
        >
          <IconLink />
        </button>
        {onImageUpload && (
          <button
            type="button"
            className="ss-btn"
            onClick={() => imgInputRef.current?.click()}
            title="Add image"
          >
            <IconImage />
          </button>
        )}
        <button
          type="button"
          className={`ss-btn ${editor.isActive("blockquote") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <IconQuote />
        </button>
        <button
          type="button"
          className="ss-btn"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <IconDivider />
        </button>

        <div className="ss-sep" />

        {/* Lists */}
        <button
          type="button"
          className={`ss-btn ${editor.isActive("bulletList") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <IconBulletList />
        </button>
        <button
          type="button"
          className={`ss-btn ${editor.isActive("orderedList") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <IconOrderedList />
        </button>
      </div>

      {/* ─── Link Input Bar ──────────────────────────────────── */}
      {linkInputVisible && (
        <div className="ss-link-bar">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleLinkSubmit();
              }
              if (e.key === "Escape") {
                setLinkInputVisible(false);
                setLinkUrl("");
                editor.chain().focus().run();
              }
            }}
            placeholder="Paste or type a link..."
            className="ss-link-input"
            autoFocus
          />
          <button
            type="button"
            onClick={handleLinkSubmit}
            className="ss-link-action ss-link-apply"
          >
            Apply
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();
                setLinkInputVisible(false);
                setLinkUrl("");
              }}
              className="ss-link-action ss-link-remove"
            >
              Remove
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setLinkInputVisible(false);
              setLinkUrl("");
              editor.chain().focus().run();
            }}
            className="ss-link-action ss-link-cancel"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Hidden file input */}
      {onImageUpload && (
        <input
          ref={imgInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
      )}

      {/* ─── Bubble Menu ─────────────────────────────────────── */}
      <BubbleMenu
        editor={editor}
        options={{ placement: "top" }}
        className="ss-bubble"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`ss-bub-btn ${editor.isActive("bold") ? "active" : ""}`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`ss-bub-btn ${editor.isActive("italic") ? "active" : ""}`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`ss-bub-btn ${editor.isActive("underline") ? "active" : ""}`}
        >
          <span style={{ textDecoration: "underline" }}>U</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`ss-bub-btn ${editor.isActive("strike") ? "active" : ""}`}
        >
          <s>S</s>
        </button>
        <div className="ss-bub-sep" />
        <button
          type="button"
          onClick={openLinkInput}
          className={`ss-bub-btn ${editor.isActive("link") ? "active" : ""}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      </BubbleMenu>

      {/* ─── Editor Content ──────────────────────────────────── */}
      <EditorContent editor={editor} />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────

const STYLES = `
  /* ── Wrapper ──────────────────────────────── */
  .ss-wrapper {
    position: relative;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);
  }
  .ss-wrapper.ss-borderless {
    border-radius: 0;
    box-shadow: none;
  }
  .ss-wrapper.ss-borderless .ss-toolbar {
    border-radius: 0;
    border-top: 1px solid rgba(0,0,0,0.06);
  }

  /* ── Toolbar ──────────────────────────────── */
  .ss-toolbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    background: #fff;
    border-radius: 8px 8px 0 0;
    flex-wrap: wrap;
    user-select: none;
  }

  .ss-sep {
    width: 1px;
    height: 22px;
    background: rgba(0,0,0,0.09);
    margin: 0 5px;
    flex-shrink: 0;
  }

  /* Toolbar button — base */
  .ss-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    transition: background 0.1s, color 0.1s;
  }
  .ss-btn:hover {
    background: #f3f4f6;
    color: #111;
  }
  .ss-btn.active {
    background: #f3f4f6;
    color: #111;
  }
  .ss-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }
  .ss-btn:disabled:hover {
    background: transparent;
    color: #6b7280;
  }

  /* Text-style buttons (B, I, S) */
  .ss-text-btn {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 15px;
    letter-spacing: -0.02em;
  }

  /* ── Style Dropdown ──────────────────────── */
  .ss-style-wrap {
    position: relative;
  }
  .ss-style-btn {
    width: auto !important;
    padding: 0 8px !important;
    gap: 4px;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
  }
  .ss-style-label {
    white-space: nowrap;
  }

  .ss-dropdown-backdrop {
    position: fixed;
    inset: 0;
    z-index: 49;
  }
  .ss-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06);
    padding: 4px;
    z-index: 50;
    min-width: 160px;
  }
  .ss-dropdown-item {
    display: block;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 5px;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
  }
  .ss-dropdown-item:hover {
    background: #f3f4f6;
  }
  .ss-dropdown-item.active {
    background: #f0f0ee;
  }
  .ss-dd-body { font-size: 14px; color: #374151; }
  .ss-dd-h1   { font-size: 22px; font-weight: 700; color: #111; }
  .ss-dd-h2   { font-size: 18px; font-weight: 600; color: #111; }
  .ss-dd-h3   { font-size: 15px; font-weight: 600; color: #333; }

  /* ── Link Bar ────────────────────────────── */
  .ss-link-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    background: #fafafa;
  }
  .ss-link-input {
    flex: 1;
    padding: 5px 10px;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 5px;
    font-size: 13px;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
    outline: none;
    background: #fff;
    color: #1a1a1a;
  }
  .ss-link-input:focus {
    border-color: rgba(0,0,0,0.3);
    box-shadow: 0 0 0 2px rgba(0,0,0,0.04);
  }
  .ss-link-action {
    padding: 5px 12px;
    border: none;
    border-radius: 5px;
    font-size: 12px;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
    cursor: pointer;
    transition: opacity 0.15s;
    font-weight: 500;
  }
  .ss-link-action:hover { opacity: 0.85; }
  .ss-link-apply  { background: #2563eb; color: #fff; }
  .ss-link-remove { background: #ef4444; color: #fff; }
  .ss-link-cancel { background: #f3f4f6; color: #6b7280; }

  /* ── Bubble Menu ─────────────────────────── */
  .ss-bubble {
    display: flex;
    align-items: center;
    gap: 1px;
    padding: 3px 4px;
    background: #1f2937;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.22);
  }
  .ss-bub-sep {
    width: 1px;
    height: 18px;
    background: rgba(255,255,255,0.12);
    margin: 0 2px;
  }
  .ss-bub-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 5px;
    cursor: pointer;
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    font-family: Georgia, "Times New Roman", serif;
    transition: all 0.1s;
  }
  .ss-bub-btn:hover {
    color: #fff;
    background: rgba(255,255,255,0.1);
  }
  .ss-bub-btn.active {
    color: #fff;
    background: rgba(255,255,255,0.18);
  }

  /* ── Editor Content Area ─────────────────── */
  .ss-wrapper .tiptap {
    outline: none;
    min-height: 500px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 32px 40px;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.75;
    color: #1a1a1a;
  }

  .ss-wrapper .tiptap > * + * {
    margin-top: 0.5em;
  }

  /* Placeholder */
  .ss-wrapper .tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #c0c0c0;
    pointer-events: none;
    height: 0;
  }

  /* Headings */
  .ss-wrapper .tiptap h1 {
    font-size: 28px;
    font-weight: 700;
    color: #111;
    line-height: 1.25;
    margin-top: 1.5em;
    margin-bottom: 0.3em;
    letter-spacing: -0.02em;
  }
  .ss-wrapper .tiptap h2 {
    font-size: 23px;
    font-weight: 600;
    color: #111;
    line-height: 1.3;
    margin-top: 1.4em;
    margin-bottom: 0.25em;
    letter-spacing: -0.01em;
  }
  .ss-wrapper .tiptap h3 {
    font-size: 19px;
    font-weight: 600;
    color: #222;
    line-height: 1.4;
    margin-top: 1.2em;
    margin-bottom: 0.2em;
  }

  /* Paragraphs */
  .ss-wrapper .tiptap p {
    margin-bottom: 0.05em;
  }

  /* Blockquote */
  .ss-wrapper .tiptap blockquote {
    border-left: 3px solid #e5e5e5;
    padding-left: 18px;
    margin: 1em 0;
    color: #555;
    font-style: italic;
  }
  .ss-wrapper .tiptap blockquote p {
    margin-bottom: 0.2em;
  }

  /* Lists */
  .ss-wrapper .tiptap ul {
    list-style-type: disc;
    padding-left: 1.4em;
    margin: 0.4em 0;
  }
  .ss-wrapper .tiptap ol {
    list-style-type: decimal;
    padding-left: 1.4em;
    margin: 0.4em 0;
  }
  .ss-wrapper .tiptap li {
    margin-bottom: 0.15em;
  }
  .ss-wrapper .tiptap li p {
    margin-bottom: 0.1em;
  }

  /* Links */
  .ss-wrapper .tiptap a {
    color: #2563eb;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: rgba(37, 99, 235, 0.3);
    cursor: pointer;
  }
  .ss-wrapper .tiptap a:hover {
    text-decoration-color: rgba(37, 99, 235, 0.7);
  }

  /* Inline code */
  .ss-wrapper .tiptap code {
    background: #f3f4f6;
    padding: 2px 5px;
    border-radius: 3px;
    font-family: var(--font-space-mono), ui-monospace, monospace;
    font-size: 0.88em;
    color: #374151;
  }

  /* Code block */
  .ss-wrapper .tiptap pre {
    background: #1f2937;
    color: #e5e7eb;
    padding: 16px 20px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1.2em 0;
    font-family: var(--font-space-mono), ui-monospace, monospace;
    font-size: 14px;
    line-height: 1.6;
  }
  .ss-wrapper .tiptap pre code {
    background: none;
    padding: 0;
    color: inherit;
    border-radius: 0;
    font-size: inherit;
  }

  /* Horizontal rule */
  .ss-wrapper .tiptap hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 2em 0;
  }

  /* Images */
  .ss-wrapper .tiptap img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1em 0;
    display: block;
  }

  /* Strong */
  .ss-wrapper .tiptap strong {
    font-weight: 650;
    color: #111;
  }

  /* Selection */
  .ss-wrapper .tiptap ::selection {
    background: rgba(37, 99, 235, 0.12);
  }

  /* Scrollbar */
  .ss-wrapper .tiptap::-webkit-scrollbar {
    width: 6px;
  }
  .ss-wrapper .tiptap::-webkit-scrollbar-track {
    background: transparent;
  }
  .ss-wrapper .tiptap::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1);
    border-radius: 3px;
  }
  .ss-wrapper .tiptap::-webkit-scrollbar-thumb:hover {
    background: rgba(0,0,0,0.18);
  }
`;
