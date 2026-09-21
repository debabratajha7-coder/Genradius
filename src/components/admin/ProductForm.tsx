"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUploader } from "./ImageUploader";
import {
  HOMEPAGE_PLACEMENTS,
  applyPlacements,
  type PlacementId,
} from "@/lib/storefront-placements";
import {
  EMPTY_PRODUCT_FORM,
  type ProductFormValues,
} from "@/lib/product-form";

export type { ProductFormValues } from "@/lib/product-form";

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
    ...EMPTY_PRODUCT_FORM,
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
        bestPrice: form.bestPrice === "" ? null : Number(form.bestPrice),
        badges: form.badges,
        categorySlugs: [form.categorySlug],
        collectionTags,
        sizes: form.sizes,
        featured,
        active: form.active,
        rating: Number(form.rating) || 4.5,
        reviewCount:
          form.reviewCount === ""
            ? form.reviews.length
            : Number(form.reviewCount),
        offerTitle: form.offerTitle,
        offerDetail: form.offerDetail,
        offerPrice: form.offerPrice === "" ? null : Number(form.offerPrice),
        socialProof: form.socialProof,
        sizeGuideImage: form.sizeGuideImage,
        careFit: form.careFit,
        highlights: form.highlights,
        specs: form.specs,
        reviews: form.reviews,
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

      <label className="block space-y-1 text-xs font-extrabold uppercase">
        Care / fit / manufacture
        <textarea
          rows={3}
          className={field}
          value={form.careFit}
          onChange={(e) => set("careFit", e.target.value)}
          placeholder="Shown in the product accordion on the PDP"
        />
      </label>

      <ImageUploader
        images={form.images}
        onChange={(images) => set("images", images)}
        cropAspect={3 / 4}
      />

      <div className="grid gap-4 md:grid-cols-3">
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
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Best price (₹)
          <input
            type="number"
            className={field}
            value={form.bestPrice}
            onChange={(e) => set("bestPrice", e.target.value)}
            placeholder="optional"
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

      <fieldset className="space-y-3 rounded-md border-2 border-[var(--ink)] bg-[var(--sand)]/40 p-4 shadow-[2px_2px_0_0_var(--ink)]">
        <legend className="px-1 text-xs font-extrabold tracking-wider uppercase">
          Offer box
        </legend>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Title
            <input
              className={field}
              value={form.offerTitle}
              onChange={(e) => set("offerTitle", e.target.value)}
              placeholder="Best Offer"
            />
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase md:col-span-2">
            Detail
            <input
              className={field}
              value={form.offerDetail}
              onChange={(e) => set("offerDetail", e.target.value)}
              placeholder="Get at ₹399 if buying 3 for ₹1199"
            />
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Offer price (₹)
            <input
              type="number"
              className={field}
              value={form.offerPrice}
              onChange={(e) => set("offerPrice", e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase md:col-span-2">
            Social proof
            <input
              className={field}
              value={form.socialProof}
              onChange={(e) => set("socialProof", e.target.value)}
              placeholder="119 people bought this in last 7 days"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[2px_2px_0_0_var(--ink)]">
        <legend className="px-1 text-xs font-extrabold tracking-wider uppercase">
          Size guide image
        </legend>
        <ImageUploader
          label="Size chart"
          images={form.sizeGuideImage ? [form.sizeGuideImage] : []}
          onChange={(urls) => set("sizeGuideImage", urls[0] ?? "")}
          max={1}
          replaceOnUpload
          cropAspect={3 / 4}
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[2px_2px_0_0_var(--ink)]">
        <legend className="px-1 text-xs font-extrabold tracking-wider uppercase">
          Highlights
        </legend>
        {form.highlights.map((h, i) => (
          <div
            key={i}
            className="grid gap-3 rounded-md border border-[var(--border)] p-3 md:grid-cols-[1fr_auto]"
          >
            <div className="space-y-2">
              <input
                className={field}
                value={h.title}
                placeholder="Highlight title"
                onChange={(e) => {
                  const next = [...form.highlights];
                  next[i] = { ...next[i], title: e.target.value };
                  set("highlights", next);
                }}
              />
              <ImageUploader
                label={`Highlight ${i + 1} image`}
                images={h.image ? [h.image] : []}
                onChange={(urls) => {
                  const next = [...form.highlights];
                  next[i] = { ...next[i], image: urls[0] ?? "" };
                  set("highlights", next);
                }}
                max={1}
                replaceOnUpload
                cropAspect={1}
              />
            </div>
            <button
              type="button"
              className="h-fit rounded-md border-2 border-[var(--ink)] px-3 py-2 text-xs font-bold uppercase"
              onClick={() =>
                set(
                  "highlights",
                  form.highlights.filter((_, idx) => idx !== i),
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-accent px-4 py-2 text-xs"
          onClick={() =>
            set("highlights", [...form.highlights, { title: "", image: "" }])
          }
        >
          Add highlight
        </button>
      </fieldset>

      <fieldset className="space-y-3 rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[2px_2px_0_0_var(--ink)]">
        <legend className="px-1 text-xs font-extrabold tracking-wider uppercase">
          Specs
        </legend>
        {form.specs.map((s, i) => (
          <div key={i} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input
              className={field}
              value={s.label}
              placeholder="Label"
              onChange={(e) => {
                const next = [...form.specs];
                next[i] = { ...next[i], label: e.target.value };
                set("specs", next);
              }}
            />
            <input
              className={field}
              value={s.value}
              placeholder="Value"
              onChange={(e) => {
                const next = [...form.specs];
                next[i] = { ...next[i], value: e.target.value };
                set("specs", next);
              }}
            />
            <button
              type="button"
              className="rounded-md border-2 border-[var(--ink)] px-3 py-2 text-xs font-bold uppercase"
              onClick={() =>
                set(
                  "specs",
                  form.specs.filter((_, idx) => idx !== i),
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-accent px-4 py-2 text-xs"
          onClick={() =>
            set("specs", [...form.specs, { label: "", value: "" }])
          }
        >
          Add spec
        </button>
      </fieldset>

      <fieldset className="space-y-3 rounded-md border-2 border-[var(--ink)] bg-[var(--accent-soft)]/30 p-4 shadow-[2px_2px_0_0_var(--ink)]">
        <legend className="px-1 text-xs font-extrabold tracking-wider uppercase">
          Ratings & curated reviews
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Rating
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              className={field}
              value={form.rating}
              onChange={(e) => set("rating", e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Review count
            <input
              type="number"
              className={field}
              value={form.reviewCount}
              onChange={(e) => set("reviewCount", e.target.value)}
              placeholder="defaults to reviews list length"
            />
          </label>
        </div>
        {form.reviews.map((r, i) => (
          <div
            key={i}
            className="space-y-2 rounded-md border-2 border-[var(--ink)] bg-white p-3"
          >
            <div className="grid gap-2 md:grid-cols-3">
              <input
                className={field}
                value={r.name}
                placeholder="Name"
                onChange={(e) => {
                  const next = [...form.reviews];
                  next[i] = { ...next[i], name: e.target.value };
                  set("reviews", next);
                }}
              />
              <input
                type="number"
                min={1}
                max={5}
                className={field}
                value={r.rating}
                onChange={(e) => {
                  const next = [...form.reviews];
                  next[i] = { ...next[i], rating: Number(e.target.value) || 5 };
                  set("reviews", next);
                }}
              />
              <input
                className={field}
                value={r.date}
                placeholder="Date (e.g. 09/02/2024)"
                onChange={(e) => {
                  const next = [...form.reviews];
                  next[i] = { ...next[i], date: e.target.value };
                  set("reviews", next);
                }}
              />
            </div>
            <textarea
              rows={2}
              className={field}
              value={r.body}
              placeholder="Review text"
              onChange={(e) => {
                const next = [...form.reviews];
                next[i] = { ...next[i], body: e.target.value };
                set("reviews", next);
              }}
            />
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={r.verified}
                  onChange={(e) => {
                    const next = [...form.reviews];
                    next[i] = { ...next[i], verified: e.target.checked };
                    set("reviews", next);
                  }}
                />
                Verified
              </label>
              <button
                type="button"
                className="rounded-md border-2 border-[var(--ink)] px-3 py-1.5 text-xs font-bold uppercase"
                onClick={() =>
                  set(
                    "reviews",
                    form.reviews.filter((_, idx) => idx !== i),
                  )
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn-accent px-4 py-2 text-xs"
          onClick={() =>
            set("reviews", [
              ...form.reviews,
              {
                name: "",
                rating: 5,
                date: "",
                body: "",
                verified: true,
              },
            ])
          }
        >
          Add review
        </button>
      </fieldset>

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
