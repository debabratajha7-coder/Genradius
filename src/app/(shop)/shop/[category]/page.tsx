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
    <ShopListingClient
      title={cat.name}
      products={products}
      categories={categories}
      activeSlug={slug}
      breadcrumb={
        <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase sm:text-xs">
          <Link href="/shop" className="hover:text-black">
            Shop
          </Link>{" "}
          / {cat.name}
        </p>
      }
    />
  );
}
