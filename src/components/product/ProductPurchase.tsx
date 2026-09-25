"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProductLean } from "@/types/catalog";
import { discountPercent, formatINR } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { trackRecentlyViewed } from "@/components/home/RecentlyViewed";
import { ProductOffers } from "@/components/product/ProductOffers";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { PincodeEta } from "@/components/product/PincodeEta";
import { ProductHighlights } from "@/components/product/ProductHighlights";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { ProductAccordions } from "@/components/product/ProductAccordions";
import { ProductTrustStrip } from "@/components/product/ProductTrustStrip";
import { ProductReviews } from "@/components/product/ProductReviews";

function resolveBestPrice(product: ProductLean): number {
  if (product.bestPrice != null && product.bestPrice > 0) {
    return product.bestPrice;
  }
  return Math.max(199, product.price - 150);
}

function stockFor(product: ProductLean, size: string): number | null {
  const map = product.stockBySize || {};
  const n = map[size];
  return typeof n === "number" ? n : null;
}

export function ProductPurchase({ product }: { product: ProductLean }) {
  const { addItem, openCart } = useCart();
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0] ?? "M");
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const off = discountPercent(product.price, product.compareAtPrice);
  const best = resolveBestPrice(product);
  const selectedStock = stockFor(product, size);
  const soldOut = selectedStock === 0;
  const lowStock = selectedStock != null && selectedStock > 0 && selectedStock <= 3;
  const categorySlug = product.categorySlugs?.[0];

  useEffect(() => {
    trackRecentlyViewed(product);
  }, [product]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const add = () => {
    if (soldOut) return;
    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      price: product.price,
      size,
    });
    setAdded(true);
  };

  const buyNow = () => {
    if (soldOut) return;
    add();
    openCart();
  };

  return (
    <div className="relative">
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-40 fade-mask-y" />

      <div className="relative mx-auto max-w-[1400px] px-3 py-5 sm:px-6 sm:py-10">
        {/* Breadcrumb */}
        <p className="mb-4 text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase sm:mb-6">
          <Link href="/shop" className="transition hover:text-[var(--ink)]">
            Shop
          </Link>
          {categorySlug ? (
            <>
              <span className="mx-2 opacity-40">/</span>
              <Link
                href={`/shop/${categorySlug}`}
                className="transition hover:text-[var(--ink)]"
              >
                {categorySlug.replace(/-/g, " ")}
              </Link>
            </>
          ) : null}
          <span className="mx-2 opacity-40">/</span>
          <span className="text-[var(--ink)]">{product.title}</span>
        </p>

        <div className="grid gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] bg-[var(--surface)] sm:rounded-[28px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={product.images[active] ?? product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 55vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute top-4 left-4 flex flex-wrap gap-2">
                {off > 0 ? (
                  <span className="rounded-full bg-[var(--pop)] px-3 py-1.5 text-[10px] font-black tracking-[0.14em] text-[var(--pop-ink)] uppercase">
                    -{off}%
                  </span>
                ) : null}
                {product.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-[var(--ink-deep)]/85 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-white uppercase backdrop-blur"
                  >
                    {b}
                  </span>
                ))}
              </div>

              {product.images.length > 1 ? (
                <div className="absolute right-4 bottom-4 rounded-full bg-[var(--ink-deep)]/70 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-white tabular-nums backdrop-blur">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(product.images.length).padStart(2, "0")}
                </div>
              ) : null}
            </div>

            {product.images.length > 1 && (
              <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl transition-[opacity,transform] duration-300 sm:h-24 sm:w-20 ${
                      i === active
                        ? "ring-2 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--background)]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy panel */}
          <div className="pb-28 lg:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              {categorySlug ? (
                <span className="eyebrow">{categorySlug.replace(/-/g, " ")}</span>
              ) : null}
            </div>

            <h1
              className="section-title mt-2"
              style={{ fontSize: "clamp(2rem, 4.6vw, 3.6rem)" }}
            >
              {product.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ink)]/10 bg-white/70 px-3 py-1.5 text-xs font-bold">
                <span className="text-[var(--pop-ink)]">★</span>
                {product.rating.toFixed(1)}
                <span className="font-medium text-[var(--muted)]">
                  · {product.reviewCount} reviews
                </span>
              </span>
              {product.socialProof ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1.5 text-[11px] font-bold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--pop)]" />
                  {product.socialProof}
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
              <span className="font-[family-name:var(--font-heavy)] text-4xl leading-none tracking-tight tabular-nums sm:text-5xl">
                <span className="mr-0.5 align-top font-[family-name:var(--font-body)] text-[0.55em] font-bold">
                  ₹
                </span>
                {formatINR(product.price).replace(/^₹\s?/, "")}
              </span>
              {product.compareAtPrice > product.price ? (
                <span className="pb-1 text-base text-[var(--muted)] line-through tabular-nums">
                  {formatINR(product.compareAtPrice)}
                </span>
              ) : null}
              <span className="mb-1 inline-flex items-center rounded-full bg-[var(--pop)] px-3 py-1 text-[11px] font-black tracking-wide text-[var(--pop-ink)]">
                Best price {formatINR(best)}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[var(--muted)]">
              Inclusive of all taxes · Free shipping on eligible orders
            </p>

            <ProductOffers
              title={product.offerTitle}
              detail={product.offerDetail}
              price={product.offerPrice}
            />

            {/* Size */}
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase">
                  Size <span className="ml-1 text-[var(--ink)]">— {size}</span>
                </p>
                {product.sizeGuideImage ? (
                  <SizeGuideModal imageUrl={product.sizeGuideImage} />
                ) : null}
              </div>
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Select size"
              >
                {product.sizes.map((s) => {
                  const st = stockFor(product, s);
                  const out = st === 0;
                  const selected = size === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSize(s)}
                      className={`relative inline-flex h-11 min-w-14 items-center justify-center rounded-full border px-4 text-sm font-bold transition-[background,color,border-color,transform] duration-300 active:scale-95 ${
                        selected
                          ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                          : out
                            ? "border-dashed border-[var(--ink)]/25 text-[var(--muted)]"
                            : "border-[var(--ink)]/15 bg-white/70 text-[var(--ink)] hover:border-[var(--ink)]/60"
                      }`}
                    >
                      <span className={out && !selected ? "line-through" : ""}>{s}</span>
                      {selected ? (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-[var(--background)] bg-[var(--pop)]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 min-h-[1.25rem] text-xs font-semibold">
                {soldOut ? (
                  <span className="text-red-700">
                    Size {size} is sold out — try another size.
                  </span>
                ) : lowStock ? (
                  <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    Only {selectedStock} left in {size}
                  </span>
                ) : (
                  <span className="text-[var(--muted)]">
                    True-to-size oversized fit. Between sizes? Go one down.
                  </span>
                )}
              </div>
            </div>

            {/* CTAs (desktop) */}
            <div className="mt-7 hidden gap-3 lg:flex">
              <button
                type="button"
                className={`btn-accent h-14 flex-1 text-sm ${
                  soldOut ? "pointer-events-none opacity-50" : ""
                }`}
                onClick={add}
                disabled={soldOut}
              >
                {added ? "Added to bag ✓" : soldOut ? "Sold out" : "Add to bag"}
              </button>
              <button
                type="button"
                className={`btn-ink h-14 flex-1 text-sm ${
                  soldOut ? "pointer-events-none opacity-50" : ""
                }`}
                onClick={buyNow}
                disabled={soldOut}
              >
                Buy now
                <span className="btn-arrow" aria-hidden>
                  →
                </span>
              </button>
            </div>

            <PincodeEta productId={product._id} slug={product.slug} />

            <ProductTrustStrip />
          </div>
        </div>

        <div className="mt-10 max-w-4xl lg:mt-16">
          <ProductHighlights highlights={product.highlights} />
          <ProductSpecs specs={product.specs} />
          <ProductAccordions
            description={product.description}
            careFit={product.careFit}
          />
          <ProductReviews
            rating={product.rating}
            reviewCount={product.reviewCount}
            reviews={product.reviews}
          />
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-[calc(var(--app-tabbar-h)+env(safe-area-inset-bottom))] z-[44] px-3 pb-2 lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3 rounded-full border border-white/10 bg-[var(--ink-deep)]/95 p-2 pl-4 text-white shadow-[0_14px_34px_rgba(23,22,15,0.35)] backdrop-blur-md">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-white/70">
              {product.title}
            </p>
            <p className="text-sm font-black tabular-nums">
              {formatINR(product.price)}
            </p>
          </div>
          <button
            type="button"
            className={`btn-accent h-11 shrink-0 px-5 text-xs ${
              soldOut ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={add}
            disabled={soldOut}
          >
            {added ? "Added ✓" : soldOut ? "Sold out" : `Add · ${size}`}
          </button>
        </div>
      </div>
    </div>
  );
}
