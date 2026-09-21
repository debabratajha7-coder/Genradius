import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Product from "@/models/Product";
import Reel from "@/models/Reel";
import Category from "@/models/Category";
import User from "@/models/User";
import Promo from "@/models/Promo";
import HeroSlide from "@/models/HeroSlide";

export default async function AdminDashboard() {
  let counts = {
    products: 0,
    reels: 0,
    categories: 0,
    customers: 0,
    promos: 0,
    hero: 0,
  };
  let mongoReady = !useMemoryCatalog();

  if (mongoReady) {
    try {
      await connectDB();
      const [products, reels, categories, customers, promos, hero] =
        await Promise.all([
          Product.countDocuments(),
          Reel.countDocuments(),
          Category.countDocuments(),
          User.countDocuments(),
          Promo.countDocuments(),
          HeroSlide.countDocuments(),
        ]);
      counts = { products, reels, categories, customers, promos, hero };
    } catch {
      mongoReady = false;
    }
  }

  const groups = [
    {
      title: "Storefront",
      cards: [
        { label: "Hero slides", value: counts.hero, href: "/admin/hero" },
        { label: "About & Circles", value: "Edit", href: "/admin/home" },
        { label: "Promos", value: counts.promos, href: "/admin/promos" },
      ],
    },
    {
      title: "Catalog",
      cards: [
        { label: "Products", value: counts.products, href: "/admin/products" },
        { label: "Top Categories", value: counts.categories, href: "/admin/categories" },
        { label: "Reels", value: counts.reels, href: "/admin/reels" },
      ],
    },
    {
      title: "Customers",
      cards: [
        {
          label: "Customers",
          value: counts.customers,
          href: "/admin/customers",
        },
        { label: "Email drops", value: "Send", href: "/admin/notify" },
        { label: "Admin team", value: "Users", href: "/admin/team" },
        { label: "Orders", value: "Soon", href: "/admin/orders" },
      ],
    },
  ];

  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        {mongoReady
          ? "Mongo connected — manage storefront, catalog, and customers."
          : "Mongo not ready. Set MONGODB_URI and USE_MEMORY_CATALOG=false, then seed."}
      </p>

      <div className="mt-8 space-y-8">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-3 text-[10px] font-extrabold tracking-[0.16em] text-[var(--moss)] uppercase">
              {g.title}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.cards.map((c) => (
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
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/hero" className="btn-accent px-6 py-3 text-sm">
          Edit hero panel
        </Link>
        <Link href="/admin/categories" className="btn-accent px-6 py-3 text-sm">
          Edit category logos
        </Link>
        <Link href="/admin/products/new" className="btn-accent px-6 py-3 text-sm">
          Add product
        </Link>
        <Link
          href="/admin/customers"
          className="rounded-md border-2 border-[var(--ink)] bg-[var(--silver)] px-6 py-3 text-sm font-extrabold uppercase shadow-[4px_4px_0_0_var(--ink)]"
        >
          View customers
        </Link>
      </div>
    </AdminGate>
  );
}
