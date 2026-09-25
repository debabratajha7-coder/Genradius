import Image from "next/image";
import Link from "next/link";
import type { CollectionTileLean } from "@/lib/home-media-defaults";
import { DEFAULT_COLLECTIONS } from "@/lib/home-media-defaults";
import { SectionHeading } from "@/components/ui/SectionHeading";

function Tile({
  tile,
  index,
  large = false,
  wide = false,
}: {
  tile: CollectionTileLean;
  index: number;
  large?: boolean;
  wide?: boolean;
}) {
  const shape = large
    ? "aspect-[4/5] lg:aspect-auto lg:h-full"
    : wide
      ? "aspect-[4/5] lg:aspect-[2.1/1]"
      : "aspect-[4/5]";
  return (
    <Link
      href={tile.href}
      className={`group relative block overflow-hidden rounded-[20px] bg-gradient-to-br ${tile.bg} sm:rounded-[26px] ${shape}`}
    >
      {tile.image ? (
        <Image
          src={tile.image}
          alt={tile.label}
          fill
          className="object-cover transition duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          sizes={large ? "(max-width:1023px) 100vw, 50vw" : "(max-width:1023px) 50vw, 25vw"}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(23,22,15,0.85)] via-[rgba(23,22,15,0.15)] to-transparent" />

      <span className="absolute top-3.5 left-4 font-[family-name:var(--font-display)] text-[10px] font-extrabold tracking-[0.22em] text-white/70 uppercase">
        {String(index + 1).padStart(2, "0")} — Drop
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
        <p
          className={`font-[family-name:var(--font-heavy)] leading-[0.9] tracking-wide text-white uppercase ${
            large ? "text-4xl sm:text-6xl" : "text-2xl sm:text-4xl"
          }`}
        >
          {tile.label}
        </p>
        <span className="icon-chip h-10 w-10 shrink-0 border-white/30 bg-white/10 text-white transition duration-500 group-hover:bg-[var(--pop)] group-hover:text-[var(--pop-ink)] sm:h-12 sm:w-12">
          →
        </span>
      </div>
    </Link>
  );
}

export function CollectionStrip({
  tiles = DEFAULT_COLLECTIONS,
}: {
  tiles?: CollectionTileLean[];
}) {
  const drops = (tiles.length ? tiles : DEFAULT_COLLECTIONS).slice(0, 4);
  const [lead, ...rest] = drops;

  return (
    <section className="relative mx-auto max-w-[1400px] px-3 py-8 sm:px-6 sm:py-16">
      <SectionHeading
        index="04 — Collections"
        title={
          <>
            Circle <em>assemble</em>
          </>
        }
        subtitle="Four edits built to be worn together. Mix the lane, keep the attitude."
        href="/shop"
        linkLabel="All drops"
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {lead ? (
          <div className="col-span-2 lg:row-span-2">
            <Tile tile={lead} index={0} large />
          </div>
        ) : null}
        {rest.map((d, i) => (
          <div key={d.key} className={i === 2 ? "col-span-2" : ""}>
            <Tile tile={d} index={i + 1} wide={i === 2} />
          </div>
        ))}
      </div>
    </section>
  );
}
