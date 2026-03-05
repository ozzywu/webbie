"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getCoverUrlByIsbn } from "@/lib/open-library";

export interface GalleryBook {
  id: string;
  title: string;
  author: string;
  slug: string;
  date: string;
  isbn: string | null;
  cover_image: string | null;
  excerpt: string | null;
  content: string;
}

interface BookGalleryProps {
  books: GalleryBook[];
  theme: {
    primary: string;
    secondary: string;
    emptyText: string;
    bg: string;
  };
  onBookSelect: (book: GalleryBook) => void;
}

const SEARCH_CACHE = new Map<string, string | null>();

function useBookCover(book: GalleryBook) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (book.cover_image) {
      setCoverUrl(book.cover_image);
      setLoading(false);
      return;
    }

    if (book.isbn) {
      setCoverUrl(getCoverUrlByIsbn(book.isbn));
      setLoading(false);
      return;
    }

    const cacheKey = `${book.title}::${book.author}`;
    if (SEARCH_CACHE.has(cacheKey)) {
      setCoverUrl(SEARCH_CACHE.get(cacheKey) ?? null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function resolve() {
      try {
        const q = encodeURIComponent(`${book.title} ${book.author}`);
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${q}&limit=1&fields=cover_i`,
        );
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        const coverId = data?.docs?.[0]?.cover_i;
        const url = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
          : null;
        SEARCH_CACHE.set(cacheKey, url);
        if (!cancelled) {
          setCoverUrl(url);
          setLoading(false);
        }
      } catch {
        SEARCH_CACHE.set(cacheKey, null);
        if (!cancelled) {
          setLoading(false);
          setError(true);
        }
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [book.cover_image, book.isbn, book.title, book.author]);

  return { coverUrl, loading, error };
}

function BookCoverCard({
  book,
  theme,
  onClick,
  index,
}: {
  book: GalleryBook;
  theme: BookGalleryProps["theme"];
  onClick: () => void;
  index: number;
}) {
  const { coverUrl, loading } = useBookCover(book);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleImgError = useCallback(() => setImgError(true), []);
  const handleImgLoad = useCallback(() => setImgLoaded(true), []);

  const showPlaceholder = !coverUrl || imgError;
  const animDelay = `${index * 40}ms`;

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      className="book-cover-card"
      style={
        {
          "--anim-delay": animDelay,
          "--theme-primary": theme.primary,
          "--theme-secondary": theme.secondary,
        } as React.CSSProperties
      }
    >
      <div className="book-cover-aspect">
        {loading ? (
          <div className="book-cover-skeleton" />
        ) : showPlaceholder ? (
          <div className="book-cover-placeholder">
            <span className="book-cover-placeholder-title">{book.title}</span>
            <span className="book-cover-placeholder-author">{book.author}</span>
          </div>
        ) : (
          <>
            {!imgLoaded && <div className="book-cover-skeleton" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={`${book.title} by ${book.author}`}
              className="book-cover-img"
              style={{ opacity: imgLoaded ? 1 : 0 }}
              onError={handleImgError}
              onLoad={handleImgLoad}
            />
          </>
        )}
      </div>
      <div className="book-cover-meta">
        <span className="book-cover-title" style={{ color: theme.primary }}>
          {book.title}
        </span>
        <span className="book-cover-author" style={{ color: theme.secondary }}>
          {book.author}
        </span>
      </div>
    </button>
  );
}

export default function BookGallery({
  books,
  theme,
  onBookSelect,
}: BookGalleryProps) {
  if (books.length === 0) {
    return (
      <p className="text-[16px] py-3 px-[10px]" style={{ color: theme.emptyText }}>
        No books yet.
      </p>
    );
  }

  return (
    <>
      <style>{GALLERY_STYLES}</style>
      <div className="book-gallery-grid">
        {books.map((book, i) => (
          <BookCoverCard
            key={book.id}
            book={book}
            theme={theme}
            onClick={() => onBookSelect(book)}
            index={i}
          />
        ))}
      </div>
    </>
  );
}

const GALLERY_STYLES = `
  .book-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 20px 16px;
    padding: 10px 0;
  }

  @media (min-width: 640px) {
    .book-gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
  }

  .book-cover-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    animation: bookFadeIn 0.4s ease both;
    animation-delay: var(--anim-delay);
  }

  @keyframes bookFadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .book-cover-card:hover .book-cover-img,
  .book-cover-card:hover .book-cover-placeholder {
    transform: scale(1.03);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .book-cover-aspect {
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: 4px;
    overflow: hidden;
    background: transparent;
  }

  .book-cover-skeleton {
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: linear-gradient(110deg, rgba(128,128,128,0.08) 30%, rgba(128,128,128,0.15) 50%, rgba(128,128,128,0.08) 70%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .book-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .book-cover-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 12px 10px;
    border-radius: 4px;
    background: linear-gradient(145deg, rgba(103,0,0,0.08), rgba(103,0,0,0.03));
    border: 1px solid rgba(128, 128, 128, 0.12);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .book-cover-placeholder-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--theme-primary);
    text-align: center;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-cover-placeholder-author {
    font-size: 10px;
    font-weight: 400;
    color: var(--theme-secondary);
    text-align: center;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-cover-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 2px;
  }

  .book-cover-title {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-cover-author {
    font-size: 12px;
    font-weight: 400;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
