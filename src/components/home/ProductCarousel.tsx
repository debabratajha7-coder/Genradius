"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ProductLean } from "@/types/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { ComingSoonPopup } from "@/components/ui/ComingSoonPopup";

export function ProductCarousel({
  title,
  products,
  ctaLabel,
  ctaHref,
  phoneLimit = 6,
}: {
  title: string;
  products: ProductLean[];
  ctaLabel?: string;
  ctaHref?: string;
  /** How many products to show in the phone 2-col grid */
  phoneLimit?: number;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const phoneProducts = products.slice(0, phoneLimit);
  const empty = products.length === 0;

  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({
      left: dir * 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-6 sm:px-6 sm:py-14">
      <Reveal>
        <div
          className={
            !empty && ctaLabel && ctaHref
              ? "section-heading section-heading--center"
              : "section-heading section-heading--solo"
          }
        >
          <h2 className="section-title">{title}</h2>
          {!empty && ctaLabel && ctaHref ? (
            <Link
              href={ctaHref}
              className="shrink-0 pb-1 text-[10px] font-extrabold tracking-wider text-[var(--moss)] uppercase underline-offset-2 hover:underline lg:hidden"
            >
              View all
            </Link>
          ) : null}
        </div>
      </Reveal>

      {empty ? <ComingSoonPopup label={title} /> : null}

      {/* Phone: 2-col commerce grid */}
      {!empty ? (
      <div className="app-product-grid grid grid-cols-2 gap-2.5 lg:hidden">
        {phoneProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      ) : null}

      {/* Desktop / tablet: horizontal carousel */}
      {!empty ? (
      <div className="relative hidden lg:block">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute top-[38%] left-0 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-sm border-2 border-[var(--ink)] bg-white text-lg shadow-[3px_3px_0_0_var(--ink)] transition hover:bg-[var(--sand)] sm:left-2 sm:translate-x-0"
          aria-label="Scroll left"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute top-[38%] right-0 z-10 flex h-10 w-10 translate-x-1/2 items-center justify-center rounded-sm border-2 border-[var(--ink)] bg-white text-lg shadow-[3px_3px_0_0_var(--ink)] transition hover:bg-[var(--sand)] sm:right-2 sm:translate-x-0"
          aria-label="Scroll right"
        >
          ›
        </button>
        <div
          ref={scroller}
          className="snap-x-mandatory flex gap-5 overflow-x-auto px-1 pb-3 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p) => (
            <div key={p._id} className="snap-start w-[270px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
      ) : null}

      {!empty && ctaLabel && ctaHref && (
        <Reveal delay={0.1}>
          <div className="mt-6 hidden justify-center sm:mt-10 lg:flex">
            <Link
              href={ctaHref}
              className="btn-accent px-11 py-3.5 text-center text-sm"
            >
              {ctaLabel}
            </Link>
          </div>
        </Reveal>
      )}
    </section>
  );
}
