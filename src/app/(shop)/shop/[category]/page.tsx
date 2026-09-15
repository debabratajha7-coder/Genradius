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
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <p className="text-xs font-bold tracking-[0.2em] text-[var(--muted)] uppercase">
        <Link href="/shop" className="hover:text-black">
          Shop
        </Link>{" "}
        / {cat.name}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide uppercase sm:text-5xl">
        {cat.name}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {products.length} styles
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c._id}
            href={`/shop/${c.slug}`}
            className={`rounded-md border-2 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${
              c.slug === slug
                ? "border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)]"
                : "border-[var(--ink)] bg-[var(--background)] text-[var(--muted)] shadow-[2px_2px_0_0_var(--ink)] hover:bg-[var(--accent-soft)]"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
