"use client";

import { useEffect, useCallback, useState } from "react";
import type { GalleryBook } from "./BookGallery";

interface BookModalProps {
  book: GalleryBook | null;
  onClose: () => void;
  theme: {
    primary: string;
    secondary: string;
    bg: string;
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getPreviewText(book: GalleryBook): string | null {
  if (book.excerpt) return book.excerpt;
  if (!book.content) return null;
  const text = stripHtml(book.content);
  if (text.length <= 280) return text;
  return text.slice(0, 280).replace(/\s\S*$/, "") + "…";
}

export default function BookModal({ book, onClose, theme }: BookModalProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setClosing(false);
  }, [book]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 250);
  }, [onClose]);

  useEffect(() => {
    if (!book) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [book, handleClose]);

  if (!book) return null;

  const preview = getPreviewText(book);

  return (
    <>
      <style>{MODAL_STYLES}</style>
      <div
        className={`bm-backdrop ${closing ? "bm-backdrop-closing" : ""}`}
        onClick={handleClose}
      >
        <div
          className={`bm-panel ${closing ? "bm-panel-closing" : ""}`}
          style={{ "--bm-bg": theme.bg } as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="bm-close" onClick={handleClose}>
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

          <div className="bm-content">
            {book.cover_image && (
              <div className="bm-cover-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={book.cover_image}
                  alt=""
                  className="bm-cover-img"
                />
              </div>
            )}

            <div className="bm-details">
              <div className="bm-header">
                <h2 className="bm-title" style={{ color: theme.primary }}>
                  {book.title}
                </h2>
                <p className="bm-author" style={{ color: theme.secondary }}>
                  {book.author}
                </p>
                <span className="bm-date" style={{ color: theme.secondary }}>
                  {formatDate(book.date)}
                </span>
              </div>

              {preview && (
                <p className="bm-preview" style={{ color: theme.primary }}>
                  {preview}
                </p>
              )}

              <a
                href={`/athenaeum/book/${book.slug}`}
                className="bm-read-link"
                style={{
                  color: theme.primary,
                  borderColor: theme.secondary,
                }}
              >
                Read full notes →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const MODAL_STYLES = `
  .bm-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: bmBackdropIn 0.25s ease forwards;
  }

  .bm-backdrop-closing {
    animation: bmBackdropOut 0.25s ease forwards;
  }

  @keyframes bmBackdropIn {
    from { background: rgba(0, 0, 0, 0); backdrop-filter: blur(0); }
    to   { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(6px); }
  }

  @keyframes bmBackdropOut {
    from { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(6px); }
    to   { background: rgba(0, 0, 0, 0); backdrop-filter: blur(0); }
  }

  .bm-panel {
    position: relative;
    width: 100%;
    max-width: 520px;
    max-height: 85vh;
    overflow-y: auto;
    border-radius: 16px;
    background: var(--bm-bg);
    animation: bmPanelIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .bm-panel-closing {
    animation: bmPanelOut 0.25s ease forwards;
  }

  @keyframes bmPanelIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes bmPanelOut {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
  }

  .bm-close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: rgba(128, 128, 128, 0.15);
    backdrop-filter: blur(8px);
    cursor: pointer;
    color: rgba(128, 128, 128, 0.8);
    transition: background 0.15s, color 0.15s;
  }

  .bm-close:hover {
    background: rgba(128, 128, 128, 0.25);
    color: rgba(128, 128, 128, 1);
  }

  .bm-content {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .bm-cover-wrap {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 32px 32px 0;
  }

  .bm-cover-img {
    width: 160px;
    height: auto;
    max-height: 260px;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .bm-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 32px 32px;
  }

  .bm-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .bm-title {
    font-size: 22px;
    font-weight: 500;
    line-height: 1.3;
    margin: 0;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
  }

  .bm-author {
    font-size: 15px;
    font-weight: 400;
    font-style: italic;
    margin: 0;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
  }

  .bm-date {
    font-size: 13px;
    font-weight: 400;
    opacity: 0.6;
    margin-top: 2px;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
  }

  .bm-preview {
    font-size: 15px;
    line-height: 1.6;
    font-weight: 400;
    margin: 0;
    opacity: 0.85;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
  }

  .bm-read-link {
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    padding: 8px 0;
    opacity: 0.7;
    transition: opacity 0.15s;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
  }

  .bm-read-link:hover {
    opacity: 1;
  }
`;
