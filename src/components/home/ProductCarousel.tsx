"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import type { ProductLean } from "@/types/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ComingSoonPopup } from "@/components/ui/ComingSoonPopup";

export function ProductCarousel({
  title,
  heading,
  index,
  subtitle,
  products,
  ctaLabel,
  ctaHref,
  phoneLimit = 6,
}: {
  /** Plain title (used for empty-state label + fallback) */
  title: string;
  /** Rich heading — may contain <em> for outline word */
  heading?: ReactNode;
  index?: string;
  subtitle?: ReactNode;
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
      left: dir * 640,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-8 sm:px-6 sm:py-16">
      <Reveal>
        <SectionHeading
          index={index}
          title={heading ?? title}
          subtitle={subtitle}
          href={!empty ? ctaHref : undefined}
          linkLabel={ctaLabel}
          actions={
            !empty ? (
              <div className="hidden gap-2 lg:flex">
                <button
                  type="button"
                  onClick={() => scroll(-1)}
                  className="icon-chip h-11 w-11 text-base"
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => scroll(1)}
                  className="icon-chip h-11 w-11 text-base"
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
            ) : null
          }
        />
      </Reveal>

      {empty ? <ComingSoonPopup label={title} /> : null}

      {/* Phone: 2-col commerce grid */}
      {!empty ? (
        <RevealStagger className="app-product-grid grid grid-cols-2 gap-x-2.5 gap-y-5 lg:hidden">
          {phoneProducts.map((p) => (
            <RevealItem key={p._id}>
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealStagger>
      ) : null}

      {/* Desktop: horizontal carousel */}
      {!empty ? (
        <div className="relative hidden lg:block">
          <RevealStagger>
            <div
              ref={scroller}
              className="snap-x-mandatory -mx-2 flex gap-5 overflow-x-auto px-2 pb-4 pt-2 scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {products.map((p) => (
                <RevealItem
                  key={p._id}
                  className="snap-start w-[272px] shrink-0 xl:w-[300px]"
                >
                  <ProductCard product={p} />
                </RevealItem>
              ))}
            </div>
          </RevealStagger>
        </div>
      ) : null}

      {!empty && ctaLabel && ctaHref ? (
        <div className="mt-7 flex justify-center lg:hidden">
          <Link href={ctaHref} className="btn-ghost w-full px-8 py-3 text-[11px]">
            {ctaLabel}
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
