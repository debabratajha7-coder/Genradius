"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProductLean } from "@/types/catalog";
import { discountPercent, formatINR } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { trackRecentlyViewed } from "@/components/home/RecentlyViewed";

function bestPrice(price: number): number {
  return Math.max(199, price - 150);
}

export function ProductPurchase({ product }: { product: ProductLean }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0] ?? "M");
  const [active, setActive] = useState(0);
  const off = discountPercent(product.price, product.compareAtPrice);

  useEffect(() => {
    trackRecentlyViewed(product);
  }, [product]);

  const add = () =>
    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      price: product.price,
      size,
    });

  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 px-3 py-5 sm:gap-10 sm:px-6 sm:py-10 lg:grid-cols-2">
      <div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--surface)] sm:rounded-2xl">
          <Image
            src={product.images[active] ?? product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
            priority
          />
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 sm:h-20 sm:w-16 ${
                  i === active
                    ? "border-[var(--accent)]"
                    : "border-[var(--border)]"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pb-28 lg:pb-0">
        <div className="flex flex-wrap gap-2">
          {product.badges.map((b) => (
            <span
              key={b}
              className="rounded-md bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-bold tracking-wider text-[var(--accent)] uppercase"
            >
              {b}
            </span>
          ))}
        </div>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-wide uppercase sm:mt-4 sm:text-4xl lg:text-5xl">
          {product.title}
        </h1>
        <p className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)] sm:mt-3 sm:text-sm">
          <span className="text-[var(--sand)]">★</span>
          <span className="font-semibold text-black">
            {product.rating.toFixed(1)}
          </span>
          <span>|</span>
          <span>{product.reviewCount} reviews</span>
        </p>
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-extrabold">
            {formatINR(product.price)}
          </span>
          {product.compareAtPrice > product.price && (
            <>
              <span className="text-[var(--muted)] line-through">
                {formatINR(product.compareAtPrice)}
              </span>
              <span className="text-sm font-bold text-[var(--accent)]">
                {off}% OFF
              </span>
            </>
          )}
        </div>
        <p className="mt-2 text-sm font-semibold text-[var(--accent)]">
          Best price {formatINR(bestPrice(product.price))}
        </p>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--muted)] sm:mt-6">
          {product.description}
        </p>

        <fieldset className="mt-6 sm:mt-8">
          <legend className="mb-3 text-xs font-extrabold tracking-[0.16em] text-[var(--muted)] uppercase">
            Select size
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`min-h-11 min-w-12 rounded-md border-2 px-3 py-2 text-sm font-bold shadow-[2px_2px_0_0_var(--ink)] ${
                  size === s
                    ? "border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)]"
                    : "border-[var(--ink)] bg-[var(--background)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          className="btn-accent mt-6 hidden w-full max-w-md py-4 text-sm lg:mt-8 lg:inline-flex"
          onClick={add}
        >
          Add to cart
        </button>
      </div>

      <div className="fixed inset-x-0 z-[44] border-t-2 border-[var(--ink)] bg-[var(--background)]/95 px-3 py-2.5 backdrop-blur-xl lg:hidden bottom-[calc(var(--app-tabbar-h)+env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">{product.title}</p>
            <p className="text-sm font-extrabold">{formatINR(product.price)}</p>
          </div>
          <button
            type="button"
            className="btn-accent shrink-0 px-5 py-3 text-xs"
            onClick={add}
          >
            Add · {size}
          </button>
        </div>
      </div>
    </div>
  );
}
