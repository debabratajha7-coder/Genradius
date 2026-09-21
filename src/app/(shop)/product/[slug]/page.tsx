import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { ProductJsonLd } from "@/components/seo/JsonLd";
import { getProductBySlug, getProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }

  const url = `/product/${encodeURIComponent(product.slug)}`;
  const image = product.images?.[0];
  const description =
    product.description?.slice(0, 160) ||
    `${product.title} — Genradius men's streetwear`;

  return {
    title: product.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url: `${getSiteUrl()}${url}`,
      title: product.title,
      description,
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: image ? [image] : undefined,
    },
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
      <ProductJsonLd product={product} />
      <ProductPurchase product={product} />
      <ProductCarousel title="You might also flex" products={related} />
    </>
  );
}
