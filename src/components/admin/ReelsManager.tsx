"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUploader } from "./ImageUploader";

type ReelRow = {
  _id: string;
  title: string;
  instagramUrl: string;
  thumbnailUrl?: string;
  productSlug?: string;
  active?: boolean;
  order?: number;
};

export function ReelsManager({ initial }: { initial: ReelRow[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setTitle("");
      setInstagramUrl("");
      setProductSlug("");
      setThumbs([]);
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
    router.refresh();
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
        <ImageUploader images={thumbs} onChange={setThumbs} />
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="btn-accent px-6 py-3 text-sm">
          {busy ? "Saving…" : "Save reel"}
        </button>
      </form>

      <ul className="space-y-3">
        {initial.map((r) => (
          <li
            key={r._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[3px_3px_0_0_var(--ink)]"
          >
            <div className="flex items-center gap-3">
              {r.thumbnailUrl ? (
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
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDelete(r._id)}
              className="text-xs font-extrabold text-red-700 uppercase underline"
            >
              Delete
            </button>
          </li>
        ))}
        {initial.length === 0 && (
          <li className="text-sm text-[var(--moss)]">No reels yet.</li>
        )}
      </ul>
    </div>
  );
}
