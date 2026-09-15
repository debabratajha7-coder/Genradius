"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUploader } from "./ImageUploader";

export type ProductFormValues = {
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: string;
  compareAtPrice: string;
  badges: string;
  categorySlugs: string;
  collectionTags: string;
  sizes: string;
  featured: boolean;
  active: boolean;
};

const EMPTY: ProductFormValues = {
  title: "",
  slug: "",
  description: "",
  images: [],
  price: "",
  compareAtPrice: "",
  badges: "",
  categorySlugs: "oversized-tees",
  collectionTags: "",
  sizes: "S,M,L,XL,XXL",
  featured: false,
  active: true,
};

export function ProductForm({
  initial,
  productId,
}: {
  initial?: Partial<ProductFormValues>;
  productId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>({ ...EMPTY, ...initial });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        images: form.images,
        price: Number(form.price),
        compareAtPrice: Number(form.compareAtPrice || form.price),
        badges: form.badges,
        categorySlugs: form.categorySlugs,
        collectionTags: form.collectionTags,
        sizes: form.sizes,
        featured: form.featured,
        active: form.active,
      };

      const res = await fetch(
        productId ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Title
          <input
            required
            className={field}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Slug (optional)
          <input
            className={field}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto from title"
          />
        </label>
      </div>

      <label className="block space-y-1 text-xs font-extrabold uppercase">
        Description
        <textarea
          required
          rows={4}
          className={field}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </label>

      <ImageUploader
        images={form.images}
        onChange={(images) => set("images", images)}
        cropAspect={3 / 4}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Price (₹)
          <input
            required
            type="number"
            className={field}
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Compare at (₹)
          <input
            type="number"
            className={field}
            value={form.compareAtPrice}
            onChange={(e) => set("compareAtPrice", e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Badges (comma)
          <input
            className={field}
            value={form.badges}
            onChange={(e) => set("badges", e.target.value)}
            placeholder="BEST SELLER, BUY 2 @1399"
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Sizes (comma)
          <input
            className={field}
            value={form.sizes}
            onChange={(e) => set("sizes", e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Categories (slugs)
          <input
            className={field}
            value={form.categorySlugs}
            onChange={(e) => set("categorySlugs", e.target.value)}
            placeholder="oversized-tees,sale"
          />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Collections (tags)
          <input
            className={field}
            value={form.collectionTags}
            onChange={(e) => set("collectionTags", e.target.value)}
            placeholder="bestsellers,radius-range"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured / bestseller
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => set("active", e.target.checked)}
          />
          Active on storefront
        </label>
      </div>

      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" disabled={busy} className="btn-accent px-8 py-3 text-sm">
        {busy ? "Saving…" : productId ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
