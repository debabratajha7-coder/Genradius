"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ImageUploader } from "./ImageUploader";
import { VideoUploader } from "./VideoUploader";

type ReelRow = {
  _id: string;
  title: string;
  instagramUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  productSlug?: string;
  active?: boolean;
  order?: number;
};

export function ReelsManager({ initial }: { initial: ReelRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [title, setTitle] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setRows(initial);
  }, [initial]);

  const field =
    "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          instagramUrl,
          productSlug,
          thumbnailUrl: thumbs[0] || "",
          videoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setTitle("");
      setInstagramUrl("");
      setProductSlug("");
      setThumbs([]);
      setVideoUrl("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this reel?")) return;
    await fetch(`/api/admin/reels/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((r) => r._id !== id));
    router.refresh();
  }

  async function onPatchVideo(id: string, nextVideo: string) {
    setError("");
    // Optimistic — VideoUploader already shows the file
    setRows((prev) =>
      prev.map((r) => (r._id === id ? { ...r, videoUrl: nextVideo } : r)),
    );
    try {
      const res = await fetch(`/api/admin/reels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: nextVideo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save video");
      const saved = String(data.videoUrl || nextVideo);
      setRows((prev) =>
        prev.map((r) => (r._id === id ? { ...r, videoUrl: saved } : r)),
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save video");
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onCreate}
        className="space-y-4 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]"
      >
        <h2 className="text-sm font-extrabold tracking-wider uppercase">
          Add reel
        </h2>
        <p className="text-xs text-[var(--moss)]">
          Upload an MP4 so it autoplays on Watch &amp; Buy. Instagram URL is the
          fallback link.
        </p>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Title
          <input
            required
            className={field}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Instagram reel URL
          <input
            required
            className={field}
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="https://www.instagram.com/reel/...."
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Linked product slug (optional)
          <input
            className={field}
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            placeholder="orbit-beige-oversized-graphic-tee"
          />
        </label>
        <VideoUploader
          label="Looping video (required for in-page playback)"
          folder="genradius/reels"
          url={videoUrl}
          onChange={setVideoUrl}
        />
        <ImageUploader
          images={thumbs}
          onChange={setThumbs}
          cropAspect={4 / 5}
          label="Poster / thumbnail (optional)"
          folder="genradius/reels"
          max={1}
          replaceOnUpload
        />
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="btn-accent px-6 py-3 text-sm">
          {busy ? "Saving…" : "Save reel"}
        </button>
      </form>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li
            key={r._id}
            className="space-y-3 rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[3px_3px_0_0_var(--ink)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {r.videoUrl ? (
                  <video
                    src={r.videoUrl}
                    muted
                    className="h-14 w-10 rounded border border-[var(--ink)] object-cover"
                  />
                ) : r.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.thumbnailUrl}
                    alt=""
                    className="h-14 w-10 rounded border border-[var(--ink)] object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-10 items-center justify-center rounded border-2 border-[var(--ink)] bg-[#c5e8f7] text-xs font-bold">
                    IG
                  </div>
                )}
                <div>
                  <p className="font-semibold">{r.title}</p>
                  <a
                    href={r.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[var(--moss)] underline"
                  >
                    {r.instagramUrl}
                  </a>
                  {r.productSlug && (
                    <p className="text-xs">Product: {r.productSlug}</p>
                  )}
                  {r.videoUrl ? (
                    <p className="text-xs font-semibold text-[var(--olive)]">
                      Video saved — looping on storefront
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-amber-800">
                      No video yet — upload below to autoplay on storefront
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDelete(r._id)}
                className="text-xs font-extrabold text-red-700 uppercase underline"
              >
                Delete
              </button>
            </div>
            <VideoUploader
              label="Looping video"
              folder="genradius/reels"
              url={r.videoUrl || ""}
              onChange={(url) => onPatchVideo(r._id, url)}
            />
          </li>
        ))}
        {rows.length === 0 && (
          <li className="text-sm text-[var(--moss)]">No reels yet.</li>
        )}
      </ul>
    </div>
  );
}
