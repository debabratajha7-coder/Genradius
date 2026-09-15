import { ProductCard } from "@/components/product/ProductCard";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
} from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  return {
    title: cat?.name ?? "Shop",
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const [products, categories] = await Promise.all([
    getProducts({ category: slug }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-6 sm:py-10">
      <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase sm:text-xs">
        <Link href="/shop" className="hover:text-black">
          Shop
        </Link>{" "}
        / {cat.name}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-[1.85rem] leading-none tracking-wide uppercase sm:text-5xl">
        {cat.name}
      </h1>
      <p className="mt-1.5 text-xs text-[var(--muted)] sm:mt-2 sm:text-sm">
        {products.length} styles
      </p>

      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-3 mt-4 border-y border-[var(--border)] bg-[var(--background)]/95 px-3 py-2.5 backdrop-blur-md sm:static sm:mx-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/shop/${c.slug}`}
              className={`shrink-0 rounded-md border-2 px-3.5 py-2 text-[11px] font-bold tracking-wider uppercase ${
                c.slug === slug
                  ? "border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)]"
                  : "border-[var(--ink)] bg-[var(--background)] text-[var(--muted)] shadow-[2px_2px_0_0_var(--ink)]"
              }`}
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
          Nothing in this lane yet — try another category.
        </p>
      )}
    </div>
  );
}
