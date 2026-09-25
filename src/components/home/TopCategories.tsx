import Image from "next/image";
import Link from "next/link";
import type { CategoryLean } from "@/types/catalog";
import { SectionHeading } from "@/components/ui/SectionHeading";

function CategoryTile({
  cat,
  index,
}: {
  cat: CategoryLean;
  index: number;
}) {
  return (
    <Link
      href={`/shop/${cat.slug}`}
      className="group relative flex shrink-0 flex-col overflow-hidden rounded-[18px] border border-[var(--border)] bg-white transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--ink)]/30 hover:shadow-[var(--shadow-lift)] sm:rounded-[22px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface)]">
        <div className="bg-dots absolute inset-0 opacity-60" aria-hidden />
        <Image
          src={cat.image}
          alt={cat.name}
          fill
          className="object-contain object-bottom p-3 transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] sm:p-5"
          sizes="(max-width:1023px) 40vw, 220px"
        />
        <span className="absolute top-2.5 left-3 font-[family-name:var(--font-display)] text-[10px] font-extrabold tracking-[0.2em] text-[var(--olive)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="icon-chip absolute right-2.5 bottom-2.5 h-8 w-8 text-sm opacity-0 transition duration-500 group-hover:opacity-100">
          →
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3.5">
        <p className="min-w-0 truncate font-[family-name:var(--font-heavy)] text-base leading-none tracking-wide text-[var(--ink)] uppercase sm:text-[17px]">
          {cat.name}
        </p>
        <span className="hidden shrink-0 text-[10px] font-bold tracking-[0.14em] text-[var(--muted)] uppercase xl:inline">
          Shop
        </span>
      </div>
    </Link>
  );
}

export function TopCategories({ categories }: { categories: CategoryLean[] }) {
  const tiles = categories.slice(0, 6);
  if (!tiles.length) return null;

  return (
    <section className="relative mx-auto max-w-[1400px] px-3 py-8 sm:px-6 sm:py-16">
      <SectionHeading
        index="01 — Categories"
        title={
          <>
            Pick your <em>lane</em>
          </>
        }
        subtitle="Six edits, zero filler. Start where your wardrobe is weakest."
        href="/shop"
        linkLabel="Shop everything"
      />

      <div
        className="-mx-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-3 pb-2 scrollbar-none lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0"
        style={{ scrollbarWidth: "none" }}
      >
        {tiles.map((cat, i) => (
          <div
            key={cat._id}
            className="w-[42vw] shrink-0 snap-start sm:w-[220px] lg:w-auto"
          >
            <CategoryTile cat={cat} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
