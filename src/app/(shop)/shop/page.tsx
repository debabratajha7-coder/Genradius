import { ShopListingClient } from "@/components/shop/ShopFilterSortBar";
import { getCategories, getProducts } from "@/lib/products";
import type { Metadata } from "next";

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

  return (
    <ShopListingClient
      title={title}
      products={products}
      categories={categories}
      activeSlug={null}
    />
  );
}
