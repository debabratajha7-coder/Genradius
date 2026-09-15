"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { prepareImageForUpload } from "@/lib/compress-image";
import { ImageCropEditor } from "./ImageCropEditor";

export function ImageUploader({
  images,
  onChange,
  label = "Product images",
  folder = "genradius/products",
  max,
  replaceOnUpload = false,
  /** Default crop aspect — e.g. 16/9 for hero, 3/4 for products */
  cropAspect,
  enableCrop = true,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  folder?: string;
  max?: number;
  replaceOnUpload?: boolean;
  cropAspect?: number;
  enableCrop?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState("");
  const [queue, setQueue] = useState<File[]>([]);
  const [editing, setEditing] = useState<File | null>(null);

  const uploadPrepared = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setBusy(true);
      setError("");
      const uploaded: string[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const original = files[i];
          setProgress(`Preparing ${i + 1}/${files.length}: ${original.name}`);
          const file = await prepareImageForUpload(original);
          setProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`);

          const form = new FormData();
          form.append("file", file);
          form.append("folder", folder);
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: form,
          });

          const raw = await res.text();
          let data: { url?: string; error?: string } = {};
          try {
            data = raw ? (JSON.parse(raw) as typeof data) : {};
          } catch {
            if (/request entity too large/i.test(raw) || res.status === 413) {
              throw new Error(
                "Image is too large for the server. Try a smaller JPG (under ~8MB).",
              );
            }
            throw new Error(
              raw?.slice(0, 120) || `Upload failed (${res.status})`,
            );
          }

          if (!res.ok) {
            throw new Error(data.error || `Upload failed (${res.status})`);
          }
          if (!data.url) {
            throw new Error("Upload succeeded but no image URL returned");
          }
          uploaded.push(data.url);
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

  const startQueue = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (!files.length) {
        setError("Drop image files only (JPG, PNG, WEBP, etc.)");
        return;
      }
      setError("");

      if (!enableCrop) {
        void uploadPrepared(files);
        return;
      }

      setQueue(files.slice(1));
      setEditing(files[0]);
    },
    [enableCrop, uploadPrepared],
  );

  function advanceQueue(nextFiles: File[]) {
    if (nextFiles.length) {
      setEditing(nextFiles[0]);
      setQueue(nextFiles.slice(1));
    } else {
      setEditing(null);
      setQueue([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onCropConfirm(file: File) {
    setEditing(null);
    const remaining = queue;
    setQueue([]);
    await uploadPrepared([file]);
    if (remaining.length) {
      setEditing(remaining[0]);
      setQueue(remaining.slice(1));
    }
  }

  function onCropCancel() {
    // Skip current image, continue with rest of queue
    advanceQueue(queue);
  }

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
    if (busy || editing) return;
    if (e.dataTransfer.files?.length) {
      startQueue(e.dataTransfer.files);
    }
  }

  const queueTotal = editing ? 1 + queue.length : 0;
  const queueIndex = editing ? 1 : 0;

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
        onClick={() => !busy && !editing && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-center transition ${
          dragging
            ? "border-[var(--ink)] bg-[#c5e8f7] shadow-[4px_4px_0_0_var(--ink)]"
            : "border-[var(--ink)] bg-[var(--accent-soft)]/40 shadow-[3px_3px_0_0_var(--ink)] hover:bg-[var(--sand)]/50"
        } ${busy || editing ? "pointer-events-none opacity-60" : ""}`}
      >
        <p className="font-[family-name:var(--font-display)] text-sm font-extrabold tracking-wide uppercase">
          {dragging ? "Drop images here" : "Drag & drop images"}
        </p>
        <p className="text-xs text-[var(--moss)]">
          Preview → crop &amp; zoom → upload to Cloudinary
        </p>
        <span className="mt-1 rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase shadow-[2px_2px_0_0_var(--ink)]">
          Choose files
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={!(max === 1 || replaceOnUpload)}
          disabled={busy || Boolean(editing)}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) startQueue(e.target.files);
          }}
        />
      </div>

      <p className="text-xs text-[var(--moss)]">
        Or paste an image URL below (skips crop editor).
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
            onChange(
              replaceOnUpload || max === 1 ? [v] : [...images, v].slice(0, max),
            );
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />
      {busy && (
        <p className="text-xs font-semibold">{progress || "Uploading…"}</p>
      )}
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}

      {editing && (
        <ImageCropEditor
          file={editing}
          queueLabel={
            queueTotal > 1
              ? `Image ${queueIndex} of ${queueTotal}`
              : editing.name
          }
          defaultAspect={cropAspect}
          onCancel={onCropCancel}
          onConfirm={(file) => void onCropConfirm(file)}
        />
      )}
    </div>
  );
}
