"use client";

import { useActionState, useState, useRef, useCallback } from "react";
import { saveCityLogAction, uploadImageAction } from "@/app/admin/actions";
import { destinations } from "@/lib/destinations";
import type { CityLog } from "@/lib/city-logs";
import Link from "next/link";

export function CityLogForm({ cityLog }: { cityLog?: CityLog }) {
  const [state, formAction, isPending] = useActionState(
    saveCityLogAction,
    null
  );
  const [images, setImages] = useState<string[]>(cityLog?.images || []);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get list of destination city names for the dropdown
  const cityNames = destinations.map((d) => d.city).sort();

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) return;

      setUploading(true);
      try {
        const newUrls: string[] = [];
        for (const file of imageFiles) {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("bucket", "city-log-images");
          const result = await uploadImageAction(fd);
          if (result.url) {
            newUrls.push(result.url);
          } else if (result.error) {
            alert("Upload failed: " + result.error);
          }
        }
        setImages((prev) => [...prev, ...newUrls]);
      } finally {
        setUploading(false);
      }
    },
    []
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
      {cityLog && <input type="hidden" name="id" value={cityLog.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

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
            City
          </label>
          <select
            name="city"
            required
            defaultValue={cityLog?.city || ""}
            className={inputClass}
            style={inputStyle}
          >
            <option value="" disabled>
              Select a city...
            </option>
            {cityNames.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={labelStyle}>
            Native Name
          </label>
          <input
            name="native_name"
            type="text"
            required
            defaultValue={cityLog?.native_name || ""}
            placeholder="e.g. København"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={labelStyle}>
            Flag Emoji
          </label>
          <input
            name="flag_emoji"
            type="text"
            defaultValue={cityLog?.flag_emoji || ""}
            placeholder="e.g. 🇩🇰"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={labelStyle}>
            One-liner
          </label>
          <input
            name="one_liner"
            type="text"
            defaultValue={cityLog?.one_liner || ""}
            placeholder="Short description of the city..."
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={labelStyle}>
          Jots
        </label>
        <textarea
          name="jots"
          rows={3}
          defaultValue={cityLog?.jots || ""}
          placeholder="Living Room, Cafe Social, hikko sandwich, fitness X..."
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={labelStyle}>
          Photos
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-2">
            {images.map((url, i) => (
              <div key={i} className="relative group aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover rounded border"
                  style={{ borderColor: "rgba(0,0,0,0.15)" }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="w-full h-24 border-2 border-dashed rounded flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
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
                style={{
                  color: "#666",
                  fontFamily: "var(--font-geist-sans)",
                }}
              >
                Drop photos here or click to browse
              </span>
              <span
                className="text-xs"
                style={{
                  color: "#999",
                  fontFamily: "var(--font-geist-sans)",
                }}
              >
                Multiple files supported — JPG, PNG, WebP — max 10MB each
              </span>
            </>
          )}
        </div>
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
            : cityLog
              ? "Update City Log"
              : "Create City Log"}
        </button>
        <Link
          href="/admin/city-logs"
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
