import { getAllBookmarks } from "@/lib/bookmarks";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function AdminBookmarksPage() {
  const bookmarks = await getAllBookmarks();
  const font = "var(--font-geist-sans)";

  return (
    <div>
      <style>{PAGE_STYLES}</style>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1
            className="text-xl"
            style={{ color: "#1a1a1a", fontFamily: font, fontWeight: 500 }}
          >
            Bookmarks
          </h1>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "#f3f4f6", color: "#6b7280", fontFamily: font }}
          >
            {bookmarks.length}
          </span>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bm-empty">
          <p style={{ fontFamily: font, color: "#666", fontSize: "14px" }}>
            No bookmarks yet. Use the bookmarklet or iOS Shortcut to save
            articles.
          </p>
        </div>
      ) : (
        <div className="bm-list">
          {bookmarks.map((bm) => (
            <div key={bm.id} className="bm-item">
              <div className="bm-item-left">
                {bm.og_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bm.og_image}
                    alt=""
                    className="bm-thumb"
                  />
                ) : (
                  <div className="bm-thumb-placeholder">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                )}

                <div className="bm-item-info">
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bm-item-title"
                    style={{ fontFamily: font }}
                  >
                    {bm.title || bm.url}
                  </a>
                  <div className="bm-item-meta" style={{ fontFamily: font }}>
                    <span className="bm-item-domain">{getDomain(bm.url)}</span>
                    {bm.author && (
                      <>
                        <span className="bm-item-sep">·</span>
                        <span>{bm.author}</span>
                      </>
                    )}
                    <span className="bm-item-sep">·</span>
                    <span>{formatDate(bm.created_at)}</span>
                    {bm.notes && (
                      <>
                        <span className="bm-item-sep">·</span>
                        <span className="bm-item-has-notes">has notes</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bm-item-actions">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background:
                      bm.status === "published" ? "#dcfce7" : "#f3f4f6",
                    color:
                      bm.status === "published" ? "#166534" : "#6b7280",
                    fontFamily: font,
                  }}
                >
                  {bm.status}
                </span>
                <Link
                  href={`/admin/bookmarks/${bm.id}/edit`}
                  className="text-sm hover:opacity-70"
                  style={{ color: "#670000", fontFamily: font }}
                >
                  Edit
                </Link>
                <DeleteButton id={bm.id} action="bookmark" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const PAGE_STYLES = `
  .bm-empty {
    padding: 32px 0;
    text-align: center;
  }

  .bm-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    overflow: hidden;
    background: #e5e5e5;
  }

  .bm-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: #fff;
  }

  .bm-item-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1;
  }

  .bm-thumb {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
    background: #f3f4f6;
  }

  .bm-thumb-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    flex-shrink: 0;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
  }

  .bm-item-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .bm-item-title {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.15s;
  }

  .bm-item-title:hover {
    opacity: 0.7;
  }

  .bm-item-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #9ca3af;
    white-space: nowrap;
    overflow: hidden;
  }

  .bm-item-domain {
    color: #6b7280;
  }

  .bm-item-sep {
    color: #d1d5db;
  }

  .bm-item-has-notes {
    color: #2563eb;
  }

  .bm-item-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }
`;
