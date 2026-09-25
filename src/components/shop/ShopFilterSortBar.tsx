"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CategoryLean, ProductLean } from "@/types/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { ComingSoonPopup } from "@/components/ui/ComingSoonPopup";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORTS: ReadonlyArray<readonly [SortKey, string, string]> = [
  ["featured", "Featured", "Featured"],
  ["price-asc", "Price: low to high", "Price ↑"],
  ["price-desc", "Price: high to low", "Price ↓"],
  ["newest", "Newest", "Newest"],
];

function Chip({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-9 items-center rounded-full border px-4 text-[11px] font-bold tracking-[0.14em] uppercase transition-[background,color,border-color,transform] duration-300 active:scale-95 ${
        active
          ? "border-[var(--ink)] bg-[var(--ink)] text-white"
          : "border-[var(--ink)]/15 bg-white/60 text-[var(--ink)] hover:border-[var(--ink)]/50 hover:bg-white"
      }`}
    >
      {children}
    </Link>
  );
}

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

  const sortLabel = SORTS.find(([k]) => k === sort)?.[2] ?? "Featured";
  const activeName =
    categories.find((c) => c.slug === activeSlug)?.name ?? "All products";

  return (
    <div className="relative">
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-[340px] opacity-40 fade-mask-y" />

      <div className="relative mx-auto max-w-[1400px] px-3 py-6 pb-24 sm:px-6 sm:py-12 lg:pb-14">
        {breadcrumb}

        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <span className="section-index">
              Shop — {sorted.length} {sorted.length === 1 ? "item" : "items"}
            </span>
            <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 6.2vw, 5rem)" }}>
              {title}
            </h1>
          </div>

          {/* Desktop sort */}
          <label className="hidden items-center gap-3 lg:inline-flex">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase">
              Sort
            </span>
            <span className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 appearance-none rounded-full border border-[var(--ink)]/15 bg-white/70 pr-9 pl-4 text-[11px] font-bold tracking-[0.14em] text-[var(--ink)] uppercase outline-none transition hover:border-[var(--ink)]/50 focus-visible:ring-2 focus-visible:ring-[var(--pop)]"
              >
                {SORTS.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[10px]"
              >
                ▾
              </span>
            </span>
          </label>
        </div>

        {/* Desktop / tablet chips */}
        <div className="mt-7 hidden flex-wrap gap-2 sm:flex">
          <Chip href="/shop" active={!activeSlug}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c._id}
              href={`/shop/${c.slug}`}
              active={c.slug === activeSlug}
            >
              {c.name}
            </Chip>
          ))}
        </div>

        {/* Phone chips (scrollable) */}
        <div className="scrollbar-none -mx-3 mt-4 flex gap-2 overflow-x-auto px-3 sm:hidden">
          <Chip href="/shop" active={!activeSlug}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c._id}
              href={`/shop/${c.slug}`}
              active={c.slug === activeSlug}
            >
              <span className="whitespace-nowrap">{c.name}</span>
            </Chip>
          ))}
        </div>

        <div className="app-product-grid mt-5 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {sorted.map((p, i) => (
            <ProductCard key={p._id} product={p} priority={i < 4} />
          ))}
        </div>

        {sorted.length === 0 && (
          <>
            <ComingSoonPopup label={title} />
            <ComingSoonPopup variant="modal" label={title} />
          </>
        )}
      </div>

      {/* Phone sticky Filters | Sort */}
      <div
        className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-3 lg:hidden"
        style={{
          bottom:
            "calc(var(--app-tabbar-h) + env(safe-area-inset-bottom, 0px) + 0.6rem)",
        }}
      >
        <div className="pointer-events-auto grid w-full max-w-sm grid-cols-2 overflow-hidden rounded-full border border-white/10 bg-[var(--ink-deep)]/95 text-white shadow-[0_14px_34px_rgba(23,22,15,0.35)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setSheet("filters")}
            className="flex flex-col items-center py-2.5 text-[11px] font-bold tracking-[0.16em] uppercase active:bg-white/10"
          >
            Filter
            <span className="text-[9px] font-medium tracking-normal text-white/55 normal-case">
              {activeName}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSheet("sort")}
            className="flex flex-col items-center border-l border-white/10 py-2.5 text-[11px] font-bold tracking-[0.16em] uppercase active:bg-white/10"
          >
            Sort
            <span className="text-[9px] font-medium tracking-normal text-white/55 normal-case">
              {sortLabel}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sheet && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[var(--ink-deep)]/60 backdrop-blur-[2px]"
              aria-label="Close"
              onClick={() => setSheet(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="absolute inset-x-0 bottom-0 max-h-[72dvh] overflow-y-auto rounded-t-[28px] bg-[var(--background)] p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--ink)]/15" />
              <div className="mb-4 flex items-center justify-between">
                <p className="section-index !mb-0">
                  {sheet === "filters" ? "Filter by category" : "Sort by"}
                </p>
                <button
                  type="button"
                  className="icon-chip h-8 w-8 text-sm"
                  aria-label="Close"
                  onClick={() => setSheet(null)}
                >
                  ×
                </button>
              </div>

              {sheet === "filters" ? (
                <div className="flex flex-col gap-2">
                  {[{ href: "/shop", label: "All products", active: !activeSlug }]
                    .concat(
                      categories.map((c) => ({
                        href: `/shop/${c.slug}`,
                        label: c.name,
                        active: c.slug === activeSlug,
                      })),
                    )
                    .map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSheet(null)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
                          item.active
                            ? "bg-[var(--ink)] text-white"
                            : "bg-white text-[var(--ink)]"
                        }`}
                      >
                        {item.label}
                        {item.active ? (
                          <span className="h-2 w-2 rounded-full bg-[var(--pop)]" />
                        ) : null}
                      </Link>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {SORTS.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSort(key);
                        setSheet(null);
                      }}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-bold transition ${
                        sort === key
                          ? "bg-[var(--ink)] text-white"
                          : "bg-white text-[var(--ink)]"
                      }`}
                    >
                      {label}
                      {sort === key ? (
                        <span className="h-2 w-2 rounded-full bg-[var(--pop)]" />
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
