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
        isSm ? "w-[4.25rem]" : "w-full max-w-[160px] justify-self-center"
      }`}
    >
      <div
        className={`relative w-full overflow-visible ${
          isSm ? "h-[5.25rem]" : "h-[200px] xl:h-[220px]"
        }`}
      >
        <div
          className={`absolute right-0 bottom-0 left-0 border border-[#a8cfe6]/70 ${
            isSm
              ? "top-[0.85rem] rounded-t-[1.35rem] rounded-b-md"
              : "top-[1.75rem] rounded-t-[2rem] rounded-b-xl"
          }`}
          style={{
            background:
              "linear-gradient(180deg, #c5e8f7 0%, #dff0f8 40%, #ffffff 100%)",
            boxShadow: "0 4px 12px rgba(42, 41, 30, 0.08)",
          }}
        />

        {/* Full logo/image shrunk to fit — not cropped */}
        <div className="absolute inset-x-[6%] top-0 bottom-[4%] z-10 flex items-end justify-center">
          <div
            className={`relative w-full drop-shadow-[0_6px_12px_rgba(42,41,30,0.16)] ${
              isSm ? "h-full" : "h-full"
            }`}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-contain object-bottom transition duration-500 group-hover:scale-[1.04] group-active:scale-[0.98]"
              sizes={isSm ? "68px" : "160px"}
            />
          </div>
        </div>
      </div>

      <p
        className={`mt-1.5 line-clamp-2 text-center font-extrabold tracking-[0.06em] text-[var(--ink)] uppercase ${
          isSm ? "text-[8px] leading-tight" : "text-[10px] leading-snug xl:text-xs"
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
    <section className="mx-auto max-w-[1400px] px-3 py-4 sm:px-6 sm:py-8">
      <div className="section-heading">
        <h2 className="section-title">Top Categories</h2>
        <Link
          href="/shop"
          className="shrink-0 pb-1 text-[10px] font-extrabold tracking-wider text-[var(--moss)] uppercase underline-offset-2 hover:underline sm:text-xs"
        >
          Explore all
        </Link>
      </div>

      <div
        className="flex gap-2.5 overflow-x-auto overflow-y-visible pb-1 pt-0.5 scrollbar-none lg:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {tiles.map((cat) => (
          <CategoryPopCard key={cat._id} cat={cat} size="sm" />
        ))}
      </div>

      <div className="hidden grid-cols-4 items-end gap-5 overflow-visible pt-1 lg:grid xl:gap-8">
        {desktopTiles.map((cat) => (
          <CategoryPopCard key={cat._id} cat={cat} size="md" />
        ))}
      </div>
    </section>
  );
}
