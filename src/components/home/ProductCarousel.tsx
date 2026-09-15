"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ProductLean } from "@/types/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

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
      left: dir * 320,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 sm:py-14">
      <Reveal>
        <h2 className="section-title mb-6 sm:mb-10">{title}</h2>
      </Reveal>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute top-[38%] left-0 z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-sm border-2 border-[var(--ink)] bg-white text-lg shadow-[3px_3px_0_0_var(--ink)] transition hover:bg-[var(--sand)] sm:left-2 sm:flex sm:translate-x-0"
          aria-label="Scroll left"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute top-[38%] right-0 z-10 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-sm border-2 border-[var(--ink)] bg-white text-lg shadow-[3px_3px_0_0_var(--ink)] transition hover:bg-[var(--sand)] sm:right-2 sm:flex sm:translate-x-0"
          aria-label="Scroll right"
        >
          ›
        </button>
        <div
          ref={scroller}
          className="snap-x-mandatory flex gap-3 overflow-x-auto px-1 pb-3 scrollbar-none sm:gap-5"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              className="snap-start w-[min(72vw,250px)] shrink-0 sm:w-[270px]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
      {ctaLabel && ctaHref && (
        <Reveal delay={0.1}>
          <div className="mt-8 flex justify-center sm:mt-10">
            <Link
              href={ctaHref}
              className="btn-accent w-full max-w-xs px-8 py-3.5 text-center text-sm sm:w-auto sm:max-w-none sm:px-11"
            >
              {ctaLabel}
            </Link>
          </div>
        </Reveal>
      )}
    </section>
  );
}
