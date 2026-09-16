"use client";

import { useEffect, useRef, useState } from "react";

export function VideoUploader({
  url,
  onChange,
  label = "Video",
  folder = "genradius/reels",
}: {
  url: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [localUrl, setLocalUrl] = useState(url);

  useEffect(() => {
    setLocalUrl(url);
  }, [url]);

  function commit(next: string) {
    setLocalUrl(next);
    onChange(next);
  }

  async function onFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Pick an MP4 / MOV / WebM video");
      return;
    }
    if (file.size > 80 * 1024 * 1024) {
      setError("Video must be under 80MB");
      return;
    }

    setBusy(true);
    setError("");
    setProgress(`Uploading ${file.name}…`);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      commit(data.url);
      setProgress("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setProgress("");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-extrabold tracking-wider uppercase">{label}</p>
      {localUrl ? (
        <div className="overflow-hidden rounded-md border-2 border-[var(--ink)] bg-black">
          <video
            src={localUrl}
            className="aspect-[3/4] max-h-56 w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            controls
          />
          <div className="flex flex-wrap gap-2 border-t-2 border-[var(--ink)] bg-white p-2">
            <button
              type="button"
              className="text-xs font-extrabold uppercase underline"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              Replace
            </button>
            <button
              type="button"
              className="text-xs font-extrabold text-red-700 uppercase underline"
              onClick={() => commit("")}
              disabled={busy}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-[var(--ink)] bg-[var(--background)] px-4 py-8 text-center"
        >
          <span className="text-xs font-extrabold uppercase">
            {busy ? "Uploading…" : "Drop / pick looping video"}
          </span>
          <span className="text-[10px] text-[var(--moss)]">
            MP4 recommended · muted autoplay on storefront
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      {progress && <p className="text-xs text-[var(--moss)]">{progress}</p>}
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <label className="block space-y-1 text-xs font-extrabold uppercase">
        Or paste video URL
        <input
          className="w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]"
          value={localUrl}
          onChange={(e) => commit(e.target.value.trim())}
          placeholder="https://…/reel.mp4"
        />
      </label>
    </div>
  );
}
