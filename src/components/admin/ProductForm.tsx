"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUploader } from "./ImageUploader";
import {
  HOMEPAGE_PLACEMENTS,
  applyPlacements,
  placementsFromProduct,
  type PlacementId,
} from "@/lib/storefront-placements";

export type ProductFormValues = {
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: string;
  compareAtPrice: string;
  badges: string;
  categorySlug: string;
  extraCollectionTags: string;
  sizes: string;
  featured: boolean;
  active: boolean;
  placements: PlacementId[];
};

const EMPTY: ProductFormValues = {
  title: "",
  slug: "",
  description: "",
  images: [],
  price: "",
  compareAtPrice: "",
  badges: "",
  categorySlug: "",
  extraCollectionTags: "",
  sizes: "S,M,L,XL,XXL",
  featured: false,
  active: true,
  placements: [],
};

export function productToFormValues(
  p: {
    title: string;
    slug: string;
    description: string;
    images: string[];
    price: number;
    compareAtPrice: number;
    badges?: string[];
    categorySlugs?: string[];
    collectionTags?: string[];
    sizes?: string[];
    featured?: boolean;
    active?: boolean;
  },
  categories: { slug: string }[],
): ProductFormValues {
  const placementIds = placementsFromProduct(p);
  const placementTagSet = new Set(
    HOMEPAGE_PLACEMENTS.map((x) => x.collectionTag).filter(Boolean),
  );
  const extra = (p.collectionTags ?? []).filter((t) => !placementTagSet.has(t));

  return {
    title: p.title,
    slug: p.slug,
    description: p.description,
    images: p.images ?? [],
    price: String(p.price),
    compareAtPrice: String(p.compareAtPrice),
    badges: (p.badges ?? []).join(", "),
    categorySlug:
      p.categorySlugs?.[0] ?? categories[0]?.slug ?? "",
    extraCollectionTags: extra.join(", "),
    sizes: (p.sizes ?? []).join(", "),
    featured: Boolean(p.featured),
    active: p.active !== false,
    placements: placementIds,
  };
}

export function ProductForm({
  initial,
  productId,
  categories,
}: {
  initial?: Partial<ProductFormValues>;
  productId?: string;
  categories: { _id: string; name: string; slug: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>({
    ...EMPTY,
    categorySlug: categories[0]?.slug ?? "",
    ...initial,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function togglePlacement(id: PlacementId) {
    setForm((f) => ({
      ...f,
      placements: f.placements.includes(id)
        ? f.placements.filter((x) => x !== id)
        : [...f.placements, id],
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.categorySlug) {
      setError("Pick a product category");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const extraTags = form.extraCollectionTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const { featured, collectionTags } = applyPlacements(
        form.placements,
        extraTags,
      );

      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        images: form.images,
        price: Number(form.price),
        compareAtPrice: Number(form.compareAtPrice || form.price),
        badges: form.badges,
        categorySlugs: [form.categorySlug],
        collectionTags,
        sizes: form.sizes,
        featured,
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
        Category
        <select
          required
          className={field}
          value={form.categorySlug}
          onChange={(e) => set("categorySlug", e.target.value)}
        >
          <option value="" disabled>
            Select type…
          </option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="text-[11px] font-normal normal-case text-[var(--moss)]">
          Same list as Top Categories — add more under{" "}
          <a href="/admin/categories" className="underline">
            Top Categories
          </a>
          .
        </span>
      </label>

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

      <fieldset className="space-y-3 rounded-md border-2 border-[var(--ink)] bg-[var(--accent-soft)]/30 p-4 shadow-[2px_2px_0_0_var(--ink)]">
        <legend className="px-1 text-xs font-extrabold tracking-wider uppercase">
          Show on storefront
        </legend>
        <p className="text-[11px] text-[var(--moss)]">
          Check where this product appears on the homepage and shop filters.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {HOMEPAGE_PLACEMENTS.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer gap-3 rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2.5 shadow-[2px_2px_0_0_var(--ink)]"
            >
              <input
                type="checkbox"
                className="mt-0.5"
                checked={form.placements.includes(p.id)}
                onChange={() => togglePlacement(p.id)}
              />
              <span>
                <span className="block text-xs font-extrabold uppercase">
                  {p.label}
                </span>
                <span className="text-[10px] text-[var(--moss)]">{p.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Extra shop collections (optional)
          <input
            className={field}
            value={form.extraCollectionTags}
            onChange={(e) => set("extraCollectionTags", e.target.value)}
            placeholder="orbit, sale"
          />
        </label>
      </fieldset>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => set("active", e.target.checked)}
        />
        Active on storefront (shop &amp; product pages)
      </label>

      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" disabled={busy} className="btn-accent px-8 py-3 text-sm">
        {busy ? "Saving…" : productId ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
