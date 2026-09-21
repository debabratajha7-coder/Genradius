import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminGate } from "@/components/admin/AdminGate";
import { ProductForm } from "@/components/admin/ProductForm";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import { productToFormValues } from "@/lib/product-form";
import { getCategories } from "@/lib/products";
import Product from "@/models/Product";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  if (useMemoryCatalog()) notFound();

  await connectDB();
  const [p, categories] = await Promise.all([
    Product.findById(id).lean(),
    getCategories(),
  ]);
  if (!p) notFound();

  const initial = productToFormValues(
    {
      title: p.title,
      slug: p.slug,
      description: p.description,
      images: p.images ?? [],
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      bestPrice: p.bestPrice,
      badges: p.badges,
      categorySlugs: p.categorySlugs,
      collectionTags: p.collectionTags,
      sizes: p.sizes,
      featured: p.featured,
      active: p.active,
      rating: p.rating,
      reviewCount: p.reviewCount,
      offerTitle: p.offerTitle,
      offerDetail: p.offerDetail,
      offerPrice: p.offerPrice,
      socialProof: p.socialProof,
      sizeGuideImage: p.sizeGuideImage,
      careFit: p.careFit,
      highlights: p.highlights,
      specs: p.specs,
      reviews: p.reviews,
    },
    categories,
  );

  return (
    <AdminGate>
      <Link
        href="/admin/products"
        className="text-xs font-extrabold tracking-wider uppercase text-[var(--moss)]"
      >
        ← Products
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Edit product
      </h1>
      <div className="mt-6 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]">
        <ProductForm productId={id} categories={categories} initial={initial} />
      </div>
    </AdminGate>
  );
}
