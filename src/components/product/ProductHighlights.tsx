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
    <section className="mt-8">
      <h2 className="section-title">Key highlights</h2>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {highlights.map((h, i) => (
          <article
            key={`${h.title}-${i}`}
            className="w-[min(70vw,220px)] shrink-0 overflow-hidden rounded-md border-2 border-[var(--ink)] bg-white shadow-[3px_3px_0_0_var(--ink)]"
          >
            <div className="relative aspect-square bg-[var(--surface)]">
              {h.image ? (
                <Image
                  src={h.image}
                  alt={h.title}
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              ) : null}
            </div>
            <p className="border-t-2 border-[var(--ink)] px-3 py-2.5 text-sm font-semibold">
              {h.title}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
