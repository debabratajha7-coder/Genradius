"use client";

import Image from "next/image";
import type { ProductHighlight } from "@/types/catalog";

export function ProductHighlights({
  highlights,
}: {
  highlights?: ProductHighlight[];
}) {
  if (!highlights?.length) return null;

  return (
    <section className="mt-10">
      <span className="section-index">Why it hits</span>
      <h2 className="section-title">
        Key <em>highlights</em>
      </h2>
      <div className="scrollbar-none mt-5 flex gap-3 overflow-x-auto pb-2">
        {highlights.map((h, i) => (
          <article
            key={`${h.title}-${i}`}
            className="card-luxe w-[min(70vw,240px)] shrink-0 overflow-hidden"
          >
            <div className="relative aspect-square bg-[var(--surface)]">
              {h.image ? (
                <Image
                  src={h.image}
                  alt={h.title}
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              ) : null}
              <span className="absolute top-3 left-3 rounded-full bg-[var(--ink-deep)]/80 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-white tabular-nums backdrop-blur">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="px-4 py-3 text-sm font-semibold">{h.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
