import Image from "next/image";
import Link from "next/link";
import type { CategoryLean } from "@/types/catalog";

export function CategoryTiles({ categories }: { categories: CategoryLean[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h2 className="mb-6 font-[family-name:var(--font-display)] text-3xl tracking-wide uppercase sm:text-4xl">
        Pick your lane
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/shop/${cat.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-white/5"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 50vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute bottom-3 left-3 right-3 font-[family-name:var(--font-display)] text-lg tracking-wide uppercase">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
