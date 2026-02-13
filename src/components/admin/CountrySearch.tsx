"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { searchCountries, getCountryName, type Country } from "@/lib/countries";
import { CountryFlag } from "@/components/CountryFlag";

interface CountrySearchProps {
  value: string; // ISO code
  onChange: (code: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function CountrySearch({
  value,
  onChange,
  className,
  style,
}: CountrySearchProps) {
  const [query, setQuery] = useState(() => getCountryName(value) ?? "");
  const [results, setResults] = useState<Country[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync display when value changes externally
  useEffect(() => {
    if (value) {
      const name = getCountryName(value);
      if (name) setQuery(name);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    const matches = searchCountries(q, 8);
    setResults(matches);
    setOpen(matches.length > 0);
    setHighlightIndex(-1);
  }, []);

  function selectCountry(country: Country) {
    setQuery(country.name);
    onChange(country.code);
    setOpen(false);
    setResults([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < results.length) {
        selectCountry(results[highlightIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2">
        {value && (
          <span className="shrink-0" style={{ lineHeight: 0 }}>
            <CountryFlag code={value} className="w-7 h-5 rounded-[2px]" />
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (query.length > 0) handleSearch(query);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for a country..."
          className={className}
          style={style}
          autoComplete="off"
        />
      </div>

      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg overflow-hidden z-50"
          style={{
            background: "#fff",
            borderColor: "rgba(0,0,0,0.1)",
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          {results.map((country, i) => (
            <button
              key={country.code}
              type="button"
              onClick={() => selectCountry(country)}
              onMouseEnter={() => setHighlightIndex(i)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors"
              style={{
                background:
                  i === highlightIndex ? "rgba(103,0,0,0.05)" : "transparent",
                color: "#1a1a1a",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              <CountryFlag
                code={country.code}
                className="w-6 h-4 rounded-[1px] shrink-0"
              />
              <span>{country.name}</span>
              <span className="ml-auto text-xs" style={{ color: "#999" }}>
                {country.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
