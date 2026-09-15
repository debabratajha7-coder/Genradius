import { AdminGate } from "@/components/admin/AdminGate";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Category from "@/models/Category";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  let categories: Array<{
    _id: string;
    name: string;
    slug: string;
    image: string;
    order: number;
  }> = [];

  if (!useMemoryCatalog()) {
    await connectDB();
    const rows = await Category.find().sort({ order: 1 }).lean();
    categories = rows.map((c) => ({
      _id: String(c._id),
      name: c.name,
      slug: c.slug,
      image: c.image,
      order: c.order,
    }));
  }

  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Categories
      </h1>
      <div className="mt-6">
        <CategoriesManager initial={categories} />
      </div>
    </AdminGate>
  );
}
