import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { getProductBySlug, getProducts } from "@/lib/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.title ?? "Product",
    description: product?.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (
    await getProducts({
      category: product.categorySlugs[0],
      limit: 8,
    })
  ).filter((p) => p.slug !== product.slug);

  return (
    <>
      <ProductPurchase product={product} />
      <ProductCarousel title="You might also flex" products={related} />
    </>
  );
}
