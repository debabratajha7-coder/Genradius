import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Product from "@/models/Product";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  let products: Array<{
    _id: string;
    title: string;
    slug: string;
    price: number;
    active?: boolean;
    featured?: boolean;
    images: string[];
  }> = [];

  if (!useMemoryCatalog()) {
    await connectDB();
    const rows = await Product.find().sort({ createdAt: -1 }).lean();
    products = rows.map((p) => ({
      _id: String(p._id),
      title: p.title,
      slug: p.slug,
      price: p.price,
      active: p.active,
      featured: p.featured,
      images: p.images ?? [],
    }));
  }

  return (
    <AdminGate>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
          Products
        </h1>
        <Link href="/admin/products/new" className="btn-accent px-5 py-2.5 text-sm">
          New product
        </Link>
      </div>
      <p className="mt-2 text-sm text-[var(--moss)]">
        Bestsellers on the homepage = products marked <strong>Featured</strong>.
        Edit any product to toggle Featured and upload photos.
      </p>

      <div className="mt-6 overflow-x-auto rounded-md border-2 border-[var(--ink)] bg-white shadow-[4px_4px_0_0_var(--ink)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b-2 border-[var(--ink)] bg-[var(--accent-soft)] text-xs uppercase">
            <tr>
              <th className="px-3 py-3">Item</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Flags</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-[var(--border)]">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0]}
                        alt=""
                        className="h-12 w-10 rounded border border-[var(--ink)] object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-xs text-[var(--moss)]">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">₹{p.price}</td>
                <td className="px-3 py-3 text-xs font-bold uppercase">
                  {p.featured ? "Featured · " : ""}
                  {p.active === false ? "Hidden" : "Active"}
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${p._id}`}
                      className="text-xs font-extrabold uppercase underline"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={p._id} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-[var(--moss)]">
                  No products yet — create one or run npm run seed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminGate>
  );
}
