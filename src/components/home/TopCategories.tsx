import Image from "next/image";
import Link from "next/link";
import type { CategoryLean } from "@/types/catalog";

export function TopCategories({ categories }: { categories: CategoryLean[] }) {
  const tiles = categories.slice(0, 4);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="mb-8 flex justify-center">
        <Link href="/shop" className="btn-accent px-10 py-3.5 text-sm">
          Explore all products
        </Link>
      </div>
      <h2 className="section-title mb-8">Top Categories</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {tiles.map((cat) => (
          <Link key={cat._id} href={`/shop/${cat.slug}`} className="group text-center">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:768px) 50vw, 25vw"
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
