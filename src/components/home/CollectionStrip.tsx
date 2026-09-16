import Image from "next/image";
import Link from "next/link";
import type { CollectionTileLean } from "@/lib/home-media-defaults";
import { DEFAULT_COLLECTIONS } from "@/lib/home-media-defaults";

function TileFace({
  tile,
  aspect,
  labelClass,
}: {
  tile: CollectionTileLean;
  aspect: string;
  labelClass: string;
}) {
  return (
    <div
      className={`relative flex ${aspect} items-end overflow-hidden bg-gradient-to-br ${tile.bg} p-2.5 transition group-hover:brightness-110 sm:p-4`}
    >
      {tile.image ? (
        <Image
          src={tile.image}
          alt={tile.label}
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 50vw, 25vw"
        />
      ) : null}
      <span
        className={`relative z-10 rounded-md bg-white/95 font-extrabold tracking-wide uppercase shadow-sm ${labelClass}`}
      >
        {tile.label}
      </span>
    </div>
  );
}

export function CollectionStrip({
  tiles = DEFAULT_COLLECTIONS,
}: {
  tiles?: CollectionTileLean[];
}) {
  const drops = tiles.length ? tiles : DEFAULT_COLLECTIONS;

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-7 sm:px-6 sm:py-12">
      <div className="section-heading section-heading--solo">
        <h2 className="section-title">Circle Assemble!</h2>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:hidden">
        {drops.map((d) => (
          <Link
            key={d.key}
            href={d.href}
            className="group relative overflow-hidden rounded-2xl"
          >
            <TileFace
              tile={d}
              aspect="aspect-[5/4]"
              labelClass="px-2 py-1 text-[10px]"
            />
          </Link>
        ))}
      </div>

      <div className="mt-5 flex justify-center lg:hidden">
        <Link
          href="/shop"
          className="btn-accent w-full max-w-xs px-6 py-3 text-center text-xs"
        >
          See all drops
        </Link>
      </div>

      <div className="hidden grid-cols-4 gap-5 lg:grid">
        {drops.map((d) => (
          <Link
            key={d.key}
            href={d.href}
            className="shadow-[4px_4px_0_#2a291e] group relative overflow-hidden rounded-2xl"
          >
            <TileFace
              tile={d}
              aspect="aspect-[3/4]"
              labelClass="rounded-lg px-3 py-2 text-sm"
            />
          </Link>
        ))}
      </div>
      <div className="mt-8 hidden justify-center lg:flex">
        <Link href="/shop" className="btn-accent px-10 py-3.5 text-sm">
          See all drops
        </Link>
      </div>
    </section>
  );
}
