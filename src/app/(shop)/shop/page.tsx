import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getProducts } from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop All",
};

type Props = {
  searchParams: Promise<{ collection?: string; q?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const { collection, q } = await searchParams;
  const [allProducts, categories] = await Promise.all([
    getProducts(collection ? { collection } : undefined),
    getCategories(),
  ]);

  const products = q
    ? allProducts.filter((p) =>
        p.title.toLowerCase().includes(q.toLowerCase()),
      )
    : allProducts;

  const title = collection
    ? collection
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : q
      ? `Search: ${q}`
      : "Shop All";

  const chip = (active: boolean) =>
    active
      ? "border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)]"
      : "border-[var(--ink)] bg-[var(--background)] text-[var(--muted)] shadow-[2px_2px_0_0_var(--ink)] hover:bg-[var(--accent-soft)]";

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-6 sm:py-10">
      <h1 className="font-[family-name:var(--font-display)] text-[1.85rem] leading-none tracking-wide uppercase sm:text-5xl">
        {title}
      </h1>
      <p className="mt-1.5 text-xs text-[var(--muted)] sm:mt-2 sm:text-sm">
        {products.length} styles
      </p>

      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-3 mt-4 border-y border-[var(--border)] bg-[var(--background)]/95 px-3 py-2.5 backdrop-blur-md sm:static sm:mx-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none sm:flex-wrap">
          <Link
            href="/shop"
            className={`shrink-0 rounded-md border-2 px-3.5 py-2 text-[11px] font-bold tracking-wider uppercase ${chip(!collection && !q)}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/shop/${c.slug}`}
              className={`shrink-0 rounded-md border-2 px-3.5 py-2 text-[11px] font-bold tracking-wider uppercase ${chip(false)}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="app-product-grid mt-4 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-20 text-center text-[var(--muted)]">
          No styles found — try another filter.
        </p>
      )}
    </div>
  );
}
