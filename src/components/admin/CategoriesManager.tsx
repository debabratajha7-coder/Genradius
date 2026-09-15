"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUploader } from "./ImageUploader";

type Cat = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  order: number;
};

const field =
  "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

function TinyLogoPreview({ image, name }: { image?: string; name: string }) {
  return (
    <div className="flex w-[4.25rem] shrink-0 flex-col items-center">
      <div className="relative h-[5.25rem] w-full">
        <div
          className="absolute inset-x-0 top-[0.85rem] bottom-0 rounded-t-[1.35rem] rounded-b-md border border-[#a8cfe6]/70"
          style={{
            background:
              "linear-gradient(180deg, #c5e8f7 0%, #dff0f8 40%, #ffffff 100%)",
          }}
        />
        <div className="absolute inset-x-[6%] top-0 bottom-[4%] z-10">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-full w-full object-contain object-bottom"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[8px] text-[var(--moss)]">
              Logo
            </div>
          )}
        </div>
      </div>
      <p className="mt-1 line-clamp-2 text-center text-[8px] font-extrabold tracking-wide text-[var(--ink)] uppercase">
        {name || "Category"}
      </p>
    </div>
  );
}

function CategoryEditor({
  cat,
  onSaved,
  onDeleted,
}: {
  cat: Cat;
  onSaved: (c: Cat) => void;
  onDeleted: (id: string) => void;
}) {
  const [name, setName] = useState(cat.name);
  const [slug, setSlug] = useState(cat.slug);
  const [order, setOrder] = useState(String(cat.order));
  const [images, setImages] = useState<string[]>(cat.image ? [cat.image] : []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function save() {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cat._id,
          name,
          slug,
          order: Number(order) || 0,
          image: images[0] || cat.image,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onSaved(data.category as Cat);
      setStatus("Saved — homepage Top Categories updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete “${cat.name}”?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${cat._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      onDeleted(cat._id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setBusy(false);
    }
  }

  return (
    <li className="rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[4px_4px_0_0_var(--ink)] sm:p-5">
      <div className="flex flex-wrap items-start gap-5">
        <TinyLogoPreview image={images[0] || cat.image} name={name} />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block space-y-1 text-xs font-extrabold uppercase">
              Name
              <input
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-xs font-extrabold uppercase">
              Slug
              <input
                className={field}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-xs font-extrabold uppercase">
              Order
              <input
                className={field}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </label>
          </div>
          <ImageUploader
            label="Category logo (full image, not cropped on phone)"
            folder="genradius/categories"
            images={images}
            onChange={setImages}
            max={1}
            replaceOnUpload
            enableCrop={false}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void save()}
              className="btn-accent px-5 py-2.5 text-xs"
            >
              {busy ? "Saving…" : "Save logo & details"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void remove()}
              className="rounded-md border-2 border-red-800 bg-red-50 px-3 py-2 text-[10px] font-extrabold uppercase text-red-800 shadow-[2px_2px_0_0_var(--ink)]"
            >
              Delete
            </button>
          </div>
          {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
          {status && (
            <p className="text-xs font-semibold text-[var(--olive)]">{status}</p>
          )}
        </div>
      </div>
    </li>
  );
}

export function CategoriesManager({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState("0");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!images[0]) {
      setError("Upload a category logo first");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          order: Number(order) || 0,
          image: images[0],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const created: Cat = {
        _id: String(data._id),
        name: data.name,
        slug: data.slug,
        image: data.image,
        order: data.order,
      };
      setRows((prev) =>
        [...prev, created].sort((a, b) => a.order - b.order),
      );
      setName("");
      setSlug("");
      setOrder("0");
      setImages([]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-[var(--moss)]">
        These drive the homepage <strong>Top Categories</strong> pop-out logos.
        Upload cutout-style PNGs when you can — the phone shows the{" "}
        <em>whole</em> image shrunk (not cropped).
      </p>

      <form
        onSubmit={onCreate}
        className="space-y-4 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]"
      >
        <h2 className="text-sm font-extrabold uppercase">Add category logo</h2>
        <div className="flex flex-wrap items-start gap-5">
          <TinyLogoPreview image={images[0]} name={name} />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                required
                className={field}
                placeholder="Name (e.g. Oversized Tees)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className={field}
                placeholder="Slug (optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <input
                className={field}
                placeholder="Order"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>
            <ImageUploader
              label="Logo image"
              folder="genradius/categories"
              images={images}
              onChange={setImages}
              max={1}
              replaceOnUpload
              enableCrop={false}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={creating}
          className="btn-accent px-6 py-3 text-sm"
        >
          {creating ? "Saving…" : "Add category"}
        </button>
      </form>

      <ul className="space-y-4">
        {rows.map((c) => (
          <CategoryEditor
            key={c._id}
            cat={c}
            onSaved={(updated) => {
              setRows((prev) =>
                prev
                  .map((r) => (r._id === updated._id ? updated : r))
                  .sort((a, b) => a.order - b.order),
              );
              router.refresh();
            }}
            onDeleted={(id) => {
              setRows((prev) => prev.filter((r) => r._id !== id));
              router.refresh();
            }}
          />
        ))}
      </ul>

      {rows.length === 0 && (
        <p className="text-sm text-[var(--moss)]">
          No categories yet — add logos above. Bestsellers live under{" "}
          <a href="/admin/products" className="font-bold underline">
            Products
          </a>{" "}
          (toggle Featured).
        </p>
      )}
    </div>
  );
}
