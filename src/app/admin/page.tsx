import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Product from "@/models/Product";
import Reel from "@/models/Reel";
import Category from "@/models/Category";

export default async function AdminDashboard() {
  let counts = { products: 0, reels: 0, categories: 0 };
  let mongoReady = !useMemoryCatalog();

  if (mongoReady) {
    try {
      await connectDB();
      const [products, reels, categories] = await Promise.all([
        Product.countDocuments(),
        Reel.countDocuments(),
        Category.countDocuments(),
      ]);
      counts = { products, reels, categories };
    } catch {
      mongoReady = false;
    }
  }

  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        {mongoReady
          ? "Mongo connected — manage catalog below."
          : "Mongo not ready. Set MONGODB_URI and USE_MEMORY_CATALOG=false, then seed."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Hero slides", value: "Edit", href: "/admin/hero" },
          { label: "Products", value: counts.products, href: "/admin/products" },
          { label: "Reels", value: counts.reels, href: "/admin/reels" },
          {
            label: "Categories",
            value: counts.categories,
            href: "/admin/categories",
          },
        ].map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]"
          >
            <p className="text-xs font-extrabold tracking-wider uppercase text-[var(--moss)]">
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-extrabold">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/hero" className="btn-accent px-6 py-3 text-sm">
          Edit hero images
        </Link>
        <Link href="/admin/products/new" className="btn-accent px-6 py-3 text-sm">
          Add product
        </Link>
        <Link
          href="/admin/reels"
          className="rounded-md border-2 border-[var(--ink)] bg-[var(--silver)] px-6 py-3 text-sm font-extrabold uppercase shadow-[4px_4px_0_0_var(--ink)]"
        >
          Paste Instagram reel
        </Link>
      </div>
    </AdminGate>
  );
}
