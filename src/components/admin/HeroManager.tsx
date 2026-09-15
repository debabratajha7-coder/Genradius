"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUploader } from "./ImageUploader";
import type { HeroSlideLean } from "@/lib/hero-defaults";

const field =
  "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

export function HeroManager({ initial }: { initial: HeroSlideLean[] }) {
  const router = useRouter();
  const [slides, setSlides] = useState(initial);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [newImage, setNewImage] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newEyebrow, setNewEyebrow] = useState("");
  const [newHref, setNewHref] = useState("/shop");
  const [newCtaLabel, setNewCtaLabel] = useState("Shop now");
  const [creating, setCreating] = useState(false);

  async function patchSlide(id: string, body: Partial<HeroSlideLean>) {
    setBusyId(id);
    setError("");
    setStatus("");
    try {
      const res = await fetch(`/api/admin/hero/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setSlides((prev) =>
        prev
          .map((s) => (s._id === id ? (data.slide as HeroSlideLean) : s))
          .sort((a, b) => a.order - b.order),
      );
      setStatus("Saved — storefront will show this on refresh.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function onImageReplace(id: string, urls: string[]) {
    const url = urls[urls.length - 1];
    if (!url) return;
    await patchSlide(id, { image: url });
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!newImage[0]) {
      setError("Drop a background image first");
      return;
    }
    if (!newTitle.trim()) {
      setError("Headline is required");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: newImage[0],
          title: newTitle.trim(),
          highlight: newHighlight.trim(),
          eyebrow: newEyebrow.trim(),
          href: newHref.trim() || "/shop",
          ctaLabel: newCtaLabel.trim() || "Shop now",
          order: slides.length,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add slide");
      setSlides((prev) =>
        [...prev, data.slide as HeroSlideLean].sort((a, b) => a.order - b.order),
      );
      setNewImage([]);
      setNewTitle("");
      setNewHighlight("");
      setNewEyebrow("");
      setNewHref("/shop");
      setNewCtaLabel("Shop now");
      setStatus("Slide added — live on the homepage hero.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Remove this hero slide?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setSlides((prev) => prev.filter((s) => s._id !== id));
      setStatus("Slide removed.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function move(id: string, dir: -1 | 1) {
    const sorted = [...slides].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s._id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swap];
    await Promise.all([
      patchSlide(a._id, { order: b.order }),
      patchSlide(b._id, { order: a.order }),
    ]);
  }

  return (
    <div className="space-y-8">
      {(error || status) && (
        <p
          className={`text-sm font-semibold ${
            error ? "text-red-700" : "text-[var(--olive)]"
          }`}
        >
          {error || status}
        </p>
      )}

      <form
        onSubmit={onCreate}
        className="space-y-4 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]"
      >
        <h2 className="text-sm font-extrabold tracking-wider uppercase">
          Add hero slide
        </h2>
        <p className="text-xs text-[var(--moss)]">
          Upload the full image as-is — the storefront shows the whole photo
          (panel height follows the image). No crop, no zoom.
        </p>

        <div className="space-y-4">
          <ImageUploader
            label="Background image"
            folder="genradius/hero"
            images={newImage}
            onChange={setNewImage}
            max={1}
            replaceOnUpload
            enableCrop={false}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1 text-xs font-extrabold uppercase">
              Top label
              <input
                className={field}
                value={newEyebrow}
                onChange={(e) => setNewEyebrow(e.target.value)}
                placeholder="e.g. JUST DROPPED"
              />
            </label>
            <label className="block space-y-1 text-xs font-extrabold uppercase">
              Button text
              <input
                className={field}
                value={newCtaLabel}
                onChange={(e) => setNewCtaLabel(e.target.value)}
                placeholder="Shop now"
              />
            </label>
            <label className="block space-y-1 text-xs font-extrabold uppercase">
              Headline
              <input
                required
                className={field}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Main line on the panel"
              />
            </label>
            <label className="block space-y-1 text-xs font-extrabold uppercase">
              Accent line
              <input
                className={field}
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Gradient accent under headline"
              />
            </label>
            <label className="block space-y-1 text-xs font-extrabold uppercase sm:col-span-2">
              Button link
              <input
                className={field}
                value={newHref}
                onChange={(e) => setNewHref(e.target.value)}
                placeholder="/shop"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="btn-accent px-6 py-3 text-sm"
          >
            {creating ? "Saving…" : "Add slide"}
          </button>
        </div>
      </form>

      <ul className="space-y-5">
        {slides.map((slide, i) => (
          <li
            key={slide._id}
            className="rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[4px_4px_0_0_var(--ink)] sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-xs font-extrabold tracking-wider uppercase text-[var(--moss)]">
                Slide {i + 1}
                {busyId === slide._id ? " · saving…" : ""}
                {!slide.active ? " · hidden" : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-md border-2 border-[var(--ink)] px-2 py-1 text-[10px] font-extrabold uppercase shadow-[2px_2px_0_0_var(--ink)]"
                  onClick={() => void move(slide._id, -1)}
                  disabled={i === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="rounded-md border-2 border-[var(--ink)] px-2 py-1 text-[10px] font-extrabold uppercase shadow-[2px_2px_0_0_var(--ink)]"
                  onClick={() => void move(slide._id, 1)}
                  disabled={i === slides.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="rounded-md border-2 border-[var(--ink)] px-2 py-1 text-[10px] font-extrabold uppercase shadow-[2px_2px_0_0_var(--ink)]"
                  onClick={() =>
                    void patchSlide(slide._id, { active: !slide.active })
                  }
                >
                  {slide.active ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  className="rounded-md border-2 border-red-800 bg-red-50 px-2 py-1 text-[10px] font-extrabold uppercase text-red-800 shadow-[2px_2px_0_0_var(--ink)]"
                  onClick={() => void onDelete(slide._id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-5 lg:grid-cols-1">
              <ImageUploader
                label="Replace background (drag & drop)"
                folder="genradius/hero"
                images={[slide.image]}
                onChange={(urls) => void onImageReplace(slide._id, urls)}
                max={1}
                replaceOnUpload
                enableCrop={false}
              />
              <SlideFields
                slide={slide}
                disabled={busyId === slide._id}
                onSave={(patch) => void patchSlide(slide._id, patch)}
              />
            </div>
          </li>
        ))}
      </ul>

      {slides.length === 0 && (
        <p className="text-sm text-[var(--moss)]">
          No slides yet — add one above. You control every line on the panel.
        </p>
      )}
    </div>
  );
}

function SlideFields({
  slide,
  disabled,
  onSave,
}: {
  slide: HeroSlideLean;
  disabled?: boolean;
  onSave: (patch: Partial<HeroSlideLean>) => void;
}) {
  const [eyebrow, setEyebrow] = useState(slide.eyebrow);
  const [title, setTitle] = useState(slide.title);
  const [highlight, setHighlight] = useState(slide.highlight);
  const [href, setHref] = useState(slide.href);
  const [ctaLabel, setCtaLabel] = useState(slide.ctaLabel);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Top label
          <input
            className={field}
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Button text
          <input
            className={field}
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Headline
          <input
            className={field}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Accent line
          <input
            className={field}
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase sm:col-span-2">
          Button link
          <input
            className={field}
            value={href}
            onChange={(e) => setHref(e.target.value)}
          />
        </label>
      </div>
      <button
        type="button"
        disabled={disabled}
        className="btn-accent px-5 py-2.5 text-xs"
        onClick={() => onSave({ eyebrow, title, highlight, href, ctaLabel })}
      >
        Save text
      </button>
    </div>
  );
}
