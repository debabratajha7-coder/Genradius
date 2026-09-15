"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";

export function ImageUploader({
  images,
  onChange,
  label = "Product images",
  folder = "genradius/products",
  max,
  replaceOnUpload = false,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  folder?: string;
  /** Cap how many images are kept */
  max?: number;
  /** New uploads replace existing instead of appending */
  replaceOnUpload?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState("");

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (!files.length) {
        setError("Drop image files only (JPG, PNG, WEBP, etc.)");
        return;
      }

      setBusy(true);
      setError("");
      const uploaded: string[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`);
          const form = new FormData();
          form.append("file", file);
          form.append("folder", folder);
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: form,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");
          uploaded.push(data.url as string);
        }
        onChange(
          replaceOnUpload || max === 1
            ? uploaded.slice(-(max ?? 1))
            : max
              ? [...images, ...uploaded].slice(0, max)
              : [...images, ...uploaded],
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setBusy(false);
        setProgress("");
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [folder, images, onChange, max, replaceOnUpload],
  );

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (busy) return;
    if (e.dataTransfer.files?.length) {
      void uploadFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-extrabold tracking-wider uppercase">
        {label}
      </label>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url) => (
            <div
              key={url}
              className="relative h-20 w-16 overflow-hidden rounded-md border-2 border-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute top-0 right-0 bg-[var(--ink)] px-1 text-[10px] text-white"
                onClick={() => onChange(images.filter((u) => u !== url))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-center transition ${
          dragging
            ? "border-[var(--ink)] bg-[#c5e8f7] shadow-[4px_4px_0_0_var(--ink)]"
            : "border-[var(--ink)] bg-[var(--accent-soft)]/40 shadow-[3px_3px_0_0_var(--ink)] hover:bg-[var(--sand)]/50"
        } ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        <p className="font-[family-name:var(--font-display)] text-sm font-extrabold tracking-wide uppercase">
          {dragging ? "Drop images here" : "Drag & drop images"}
        </p>
        <p className="text-xs text-[var(--moss)]">
          or click to browse — multiple files OK
        </p>
        <span className="mt-1 rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase shadow-[2px_2px_0_0_var(--ink)]">
          Choose files
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
          }}
        />
      </div>

      <p className="text-xs text-[var(--moss)]">
        Uploads go to Cloudinary when credentials are set. You can also paste a
        URL below.
      </p>
      <input
        type="url"
        placeholder="Or paste image URL and press Enter"
        className="w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]"
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const v = (e.target as HTMLInputElement).value.trim();
          if (v) {
            onChange([...images, v]);
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />
      {busy && (
        <p className="text-xs font-semibold">{progress || "Uploading…"}</p>
      )}
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}
