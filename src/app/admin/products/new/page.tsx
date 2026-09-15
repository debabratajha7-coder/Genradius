import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <AdminGate>
      <Link
        href="/admin/products"
        className="text-xs font-extrabold tracking-wider uppercase text-[var(--moss)]"
      >
        ← Products
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        New product
      </h1>
      <div className="mt-6 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]">
        {categories.length === 0 ? (
          <p className="text-sm text-[var(--moss)]">
            Add a category first under{" "}
            <Link href="/admin/categories" className="font-bold underline">
              Top Categories
            </Link>
            .
          </p>
        ) : (
          <ProductForm categories={categories} />
        )}
      </div>
    </AdminGate>
  );
}
