import Image from "next/image";
import Link from "next/link";
import type { CategoryLean } from "@/types/catalog";

function CategoryPopCard({
  cat,
  size = "md",
}: {
  cat: CategoryLean;
  size?: "sm" | "md";
}) {
  const isSm = size === "sm";

  return (
    <Link
      href={`/shop/${cat.slug}`}
      className={`group flex shrink-0 flex-col items-center ${
        isSm ? "w-[5.75rem]" : "w-full max-w-[220px] justify-self-center"
      }`}
    >
      {/*
        Tall frame: tombstone sits in lower portion; subject image
        starts above the curved edge so heads “pop out”.
      */}
      <div
        className={`relative w-full overflow-visible ${
          isSm ? "h-[7rem]" : "h-[280px] xl:h-[320px]"
        }`}
      >
        {/* Soft sky → white tombstone */}
        <div
          className={`absolute right-0 bottom-0 left-0 border border-[#a8cfe6]/70 ${
            isSm
              ? "top-[1.35rem] rounded-t-[1.85rem] rounded-b-md"
              : "top-[2.75rem] rounded-t-[2.75rem] rounded-b-2xl"
          }`}
          style={{
            background:
              "linear-gradient(180deg, #c5e8f7 0%, #dff0f8 40%, #ffffff 100%)",
            boxShadow: "0 6px 16px rgba(42, 41, 30, 0.1)",
          }}
        />

        {/* Subject — overflows tombstone top */}
        <div
          className={`absolute right-[4%] bottom-0 left-[4%] z-10 ${
            isSm ? "top-0" : "top-0"
          }`}
        >
          <div className="relative h-full w-full drop-shadow-[0_8px_16px_rgba(42,41,30,0.18)]">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover object-[center_12%] transition duration-500 group-hover:scale-[1.05] group-active:scale-[0.98]"
              sizes={isSm ? "92px" : "220px"}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-white via-white/70 to-transparent" />
          </div>
        </div>
      </div>

      <p
        className={`mt-2.5 line-clamp-2 text-center font-extrabold tracking-[0.07em] text-[var(--ink)] uppercase ${
          isSm ? "text-[9px] leading-tight" : "text-xs leading-snug xl:text-sm"
        }`}
      >
        {cat.name}
      </p>
    </Link>
  );
}

export function TopCategories({ categories }: { categories: CategoryLean[] }) {
  const tiles = categories.slice(0, 6);
  const desktopTiles = categories.slice(0, 4);

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-5 sm:px-6 sm:py-10">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-8">
        <h2 className="section-title mb-0">Top Categories</h2>
        <Link
          href="/shop"
          className="shrink-0 text-[10px] font-extrabold tracking-wider text-[var(--moss)] uppercase underline-offset-2 hover:underline sm:text-xs"
        >
          Explore all
        </Link>
      </div>

      <div
        className="flex gap-3 overflow-x-auto overflow-y-visible pb-2 pt-1 scrollbar-none lg:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {tiles.map((cat) => (
          <CategoryPopCard key={cat._id} cat={cat} size="sm" />
        ))}
      </div>

      <div className="hidden grid-cols-4 items-end gap-6 overflow-visible pt-2 lg:grid xl:gap-10">
        {desktopTiles.map((cat) => (
          <CategoryPopCard key={cat._id} cat={cat} size="md" />
        ))}
      </div>
    </section>
  );
}
