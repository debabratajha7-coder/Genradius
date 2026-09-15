import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminGate } from "@/components/admin/AdminGate";
import { ProductForm } from "@/components/admin/ProductForm";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Product from "@/models/Product";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  if (useMemoryCatalog()) notFound();

  await connectDB();
  const p = await Product.findById(id).lean();
  if (!p) notFound();

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
        <ProductForm
          productId={id}
          initial={{
            title: p.title,
            slug: p.slug,
            description: p.description,
            images: p.images ?? [],
            price: String(p.price),
            compareAtPrice: String(p.compareAtPrice),
            badges: (p.badges ?? []).join(", "),
            categorySlugs: (p.categorySlugs ?? []).join(", "),
            collectionTags: (p.collectionTags ?? []).join(", "),
            sizes: (p.sizes ?? []).join(", "),
            featured: Boolean(p.featured),
            active: p.active !== false,
          }}
        />
      </div>
    </AdminGate>
  );
}
