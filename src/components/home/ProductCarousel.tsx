"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ProductLean } from "@/types/catalog";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductCarousel({
  title,
  products,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  products: ProductLean[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({
      left: dir * 300,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h2 className="section-title mb-8">{title}</h2>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute top-1/3 left-0 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] text-lg shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-[calc(-50%+1px)] hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--ink)] sm:left-2 sm:translate-x-0 sm:hover:translate-x-px"
          aria-label="Scroll left"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute top-1/3 right-0 z-10 flex h-9 w-9 translate-x-1/2 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] text-lg shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-[calc(50%-1px)] hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--ink)] sm:right-2 sm:translate-x-0 sm:hover:translate-x-px"
          aria-label="Scroll right"
        >
          ›
        </button>
        <div
          ref={scroller}
          className="flex gap-4 overflow-x-auto px-1 pb-2 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p) => (
            <div key={p._id} className="w-[240px] shrink-0 sm:w-[260px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
      {ctaLabel && ctaHref && (
        <div className="mt-8 flex justify-center">
          <Link href={ctaHref} className="btn-accent px-10 py-3.5 text-sm">
            {ctaLabel}
          </Link>
        </div>
      )}
    </section>
  );
}
