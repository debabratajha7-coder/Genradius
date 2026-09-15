import Image from "next/image";
import Link from "next/link";
import type { CategoryLean } from "@/types/catalog";

export function TopCategories({ categories }: { categories: CategoryLean[] }) {
  const tiles = categories.slice(0, 4);

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 flex justify-center sm:mb-8">
        <Link
          href="/shop"
          className="btn-accent w-full max-w-xs px-6 py-3 text-center text-xs sm:w-auto sm:px-10 sm:py-3.5 sm:text-sm"
        >
          Explore all products
        </Link>
      </div>

      <h2 className="section-title mb-4 sm:mb-8">Top Categories</h2>

      {/* Phone: compact 2×2 squares */}
      <div className="grid grid-cols-2 gap-2.5 lg:hidden">
        {tiles.map((cat) => (
          <Link
            key={cat._id}
            href={`/shop/${cat.slug}`}
            className="group overflow-hidden rounded-md border-2 border-[var(--ink)] bg-white shadow-[2px_2px_0_0_var(--ink)]"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition duration-500 group-active:scale-105"
                sizes="45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 px-2 py-2 text-[11px] font-extrabold tracking-[0.08em] text-white uppercase">
                {cat.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden grid-cols-4 gap-6 lg:grid">
        {tiles.map((cat) => (
          <Link
            key={cat._id}
            href={`/shop/${cat.slug}`}
            className="group text-center"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="25vw"
              />
            </div>
            <p className="mt-3 text-sm font-extrabold tracking-wide uppercase">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
