"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { CategoryLean, ProductLean } from "@/types/catalog";
import { ProductCard } from "@/components/product/ProductCard";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export function ShopListingClient({
  title,
  products,
  categories,
  activeSlug,
  breadcrumb,
}: {
  title: string;
  products: ProductLean[];
  categories: CategoryLean[];
  activeSlug?: string | null;
  breadcrumb?: ReactNode;
}) {
  const [sort, setSort] = useState<SortKey>("featured");
  const [sheet, setSheet] = useState<"filters" | "sort" | null>(null);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "newest")
      list.sort((a, b) => (a.slug < b.slug ? 1 : -1));
    return list;
  }, [products, sort]);

  const sortLabel =
    sort === "price-asc"
      ? "Price ↑"
      : sort === "price-desc"
        ? "Price ↓"
        : sort === "newest"
          ? "Newest"
          : "Featured";

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 pb-24 sm:px-6 sm:py-10 lg:pb-10">
      {breadcrumb}
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-xl leading-none tracking-wide uppercase sm:text-5xl">
          {title}
        </h1>
        <p className="shrink-0 text-xs text-[var(--muted)] sm:text-sm">
          {sorted.length} items
        </p>
      </div>

      {/* Desktop / tablet chips */}
      <div className="mt-6 hidden flex-wrap gap-2 sm:flex">
        <Link
          href="/shop"
          className={`rounded-md border-2 px-3.5 py-2 text-[11px] font-bold tracking-wider uppercase ${
            !activeSlug
              ? "border-[var(--ink)] bg-[var(--sand)] shadow-[2px_2px_0_0_var(--ink)]"
              : "border-[var(--ink)] bg-[var(--background)] text-[var(--muted)] shadow-[2px_2px_0_0_var(--ink)]"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c._id}
            href={`/shop/${c.slug}`}
            className={`rounded-md border-2 px-3.5 py-2 text-[11px] font-bold tracking-wider uppercase ${
              c.slug === activeSlug
                ? "border-[var(--ink)] bg-[var(--sand)] shadow-[2px_2px_0_0_var(--ink)]"
                : "border-[var(--ink)] bg-[var(--background)] text-[var(--muted)] shadow-[2px_2px_0_0_var(--ink)]"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="app-product-grid mt-4 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {sorted.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="py-20 text-center text-[var(--muted)]">
          No styles found — try another filter.
        </p>
      )}

      {/* Phone sticky Filters | Sort */}
      <div
        className="fixed inset-x-0 z-40 border-t-2 border-[var(--ink)] bg-white lg:hidden"
        style={{
          bottom:
            "calc(var(--app-tabbar-h) + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
          <button
            type="button"
            onClick={() => setSheet("filters")}
            className="flex flex-col items-center gap-0.5 py-3 text-[11px] font-extrabold tracking-wider uppercase"
          >
            Filters
          </button>
          <button
            type="button"
            onClick={() => setSheet("sort")}
            className="flex flex-col items-center gap-0.5 py-3 text-[11px] font-extrabold tracking-wider uppercase"
          >
            Sort by
            <span className="text-[9px] font-semibold tracking-normal text-[var(--muted)] normal-case">
              {sortLabel}
            </span>
          </button>
        </div>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--ink)]/50"
            aria-label="Close"
            onClick={() => setSheet(null)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-2 border-[var(--ink)] bg-[var(--background)] p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-extrabold tracking-wider uppercase">
                {sheet === "filters" ? "Filters" : "Sort by"}
              </p>
              <button
                type="button"
                className="text-xs font-bold uppercase underline"
                onClick={() => setSheet(null)}
              >
                Close
              </button>
            </div>

            {sheet === "filters" ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/shop"
                  onClick={() => setSheet(null)}
                  className={`rounded-md border-2 border-[var(--ink)] px-4 py-3 text-sm font-bold ${
                    !activeSlug ? "bg-[var(--sand)]" : "bg-white"
                  }`}
                >
                  All products
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    href={`/shop/${c.slug}`}
                    onClick={() => setSheet(null)}
                    className={`rounded-md border-2 border-[var(--ink)] px-4 py-3 text-sm font-bold ${
                      c.slug === activeSlug ? "bg-[var(--sand)]" : "bg-white"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {(
                  [
                    ["featured", "Featured"],
                    ["price-asc", "Price: low to high"],
                    ["price-desc", "Price: high to low"],
                    ["newest", "Newest"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSort(key);
                      setSheet(null);
                    }}
                    className={`rounded-md border-2 border-[var(--ink)] px-4 py-3 text-left text-sm font-bold ${
                      sort === key ? "bg-[var(--sand)]" : "bg-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
