import { ShopListingClient } from "@/components/shop/ShopFilterSortBar";
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
  const title = cat?.name ?? "Shop";
  return {
    title,
    description: `Shop ${title} at Genradius — men's streetwear that owns its radius.`,
    alternates: { canonical: `/shop/${encodeURIComponent(category)}` },
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
    <ShopListingClient
      title={cat.name}
      products={products}
      categories={categories}
      activeSlug={slug}
      breadcrumb={
        <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase">
          <Link href="/shop" className="transition hover:text-[var(--ink)]">
            Shop
          </Link>
          <span className="mx-2 text-[var(--pop-ink)]/40">/</span>
          <span className="text-[var(--ink)]">{cat.name}</span>
        </p>
      }
    />
  );
}
