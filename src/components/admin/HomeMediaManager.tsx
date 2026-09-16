"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { VideoUploader } from "./VideoUploader";
import type {
  CollectionTileLean,
  HomeMediaLean,
} from "@/lib/home-media-defaults";

const field =
  "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

export function HomeMediaManager({ initial }: { initial: HomeMediaLean }) {
  const router = useRouter();
  const [media, setMedia] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function save(patch: Partial<HomeMediaLean>) {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const next = { ...media, ...patch };
      const res = await fetch("/api/admin/home-media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMedia(data as HomeMediaLean);
      setStatus("Saved — live on the homepage after refresh.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  function setCollage(index: 0 | 1 | 2, urls: string[]) {
    const url = urls[urls.length - 1] || "";
    const aboutCollage: [string, string, string] = [...media.aboutCollage];
    aboutCollage[index] = url || media.aboutCollage[index];
    setMedia((m) => ({ ...m, aboutCollage }));
  }

  function updateCollection(key: string, patch: Partial<CollectionTileLean>) {
    setMedia((m) => ({
      ...m,
      collections: m.collections.map((c) =>
        c.key === key ? { ...c, ...patch } : c,
      ),
    }));
  }

  return (
    <div className="space-y-8">
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      {status && <p className="text-sm font-semibold text-[var(--olive)]">{status}</p>}

      <section className="space-y-4 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]">
        <h2 className="text-sm font-extrabold tracking-wider uppercase">
          About — The Radius
        </h2>
        <ImageUploader
          label="Phone banner image"
          folder="genradius/home"
          images={media.aboutPhoneBanner ? [media.aboutPhoneBanner] : []}
          onChange={(urls) =>
            setMedia((m) => ({
              ...m,
              aboutPhoneBanner: urls[urls.length - 1] || "",
            }))
          }
          max={1}
          replaceOnUpload
          cropAspect={16 / 9}
        />
        <ImageUploader
          label="Desktop video poster (fallback image)"
          folder="genradius/home"
          images={media.aboutVideoPoster ? [media.aboutVideoPoster] : []}
          onChange={(urls) =>
            setMedia((m) => ({
              ...m,
              aboutVideoPoster: urls[urls.length - 1] || "",
            }))
          }
          max={1}
          replaceOnUpload
          cropAspect={4 / 5}
        />
        <VideoUploader
          label="Desktop about video (loops muted)"
          folder="genradius/home"
          url={media.aboutVideoUrl}
          onChange={(url) => setMedia((m) => ({ ...m, aboutVideoUrl: url }))}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {([0, 1, 2] as const).map((i) => (
            <ImageUploader
              key={i}
              label={`Collage photo ${i + 1}`}
              folder="genradius/home"
              images={media.aboutCollage[i] ? [media.aboutCollage[i]] : []}
              onChange={(urls) => setCollage(i, urls)}
              max={1}
              replaceOnUpload
              cropAspect={3 / 4}
            />
          ))}
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            save({
              aboutPhoneBanner: media.aboutPhoneBanner,
              aboutVideoPoster: media.aboutVideoPoster,
              aboutVideoUrl: media.aboutVideoUrl,
              aboutCollage: media.aboutCollage,
            })
          }
          className="btn-accent px-6 py-3 text-sm"
        >
          {busy ? "Saving…" : "Save about media"}
        </button>
      </section>

      <section className="space-y-4 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]">
        <h2 className="text-sm font-extrabold tracking-wider uppercase">
          Circle Assemble tiles
        </h2>
        <div className="space-y-6">
          {media.collections.map((c) => (
            <div
              key={c.key}
              className="rounded-md border-2 border-[var(--ink)] bg-[var(--background)] p-4"
            >
              <p className="mb-3 text-xs font-extrabold tracking-wider uppercase">
                {c.label}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1 text-xs font-extrabold uppercase">
                  Label
                  <input
                    className={field}
                    value={c.label}
                    onChange={(e) =>
                      updateCollection(c.key, { label: e.target.value })
                    }
                  />
                </label>
                <label className="block space-y-1 text-xs font-extrabold uppercase">
                  Link
                  <input
                    className={field}
                    value={c.href}
                    onChange={(e) =>
                      updateCollection(c.key, { href: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="mt-3">
                <ImageUploader
                  label="Tile image"
                  folder="genradius/home"
                  images={c.image ? [c.image] : []}
                  onChange={(urls) =>
                    updateCollection(c.key, {
                      image: urls[urls.length - 1] || "",
                    })
                  }
                  max={1}
                  replaceOnUpload
                  cropAspect={3 / 4}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => save({ collections: media.collections })}
          className="btn-accent px-6 py-3 text-sm"
        >
          {busy ? "Saving…" : "Save collection tiles"}
        </button>
      </section>
    </div>
  );
}
