"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductLean } from "@/types/catalog";
import { discountPercent, formatINR } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";

function bestPrice(price: number): number {
  return Math.max(199, price - 150);
}

export function ProductCard({
  product,
  compact,
}: {
  product: ProductLean;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [hover, setHover] = useState(false);
  const off = discountPercent(product.price, product.compareAtPrice);
  const img =
    hover && product.images[1] ? product.images[1] : product.images[0];
  const colors = Math.min(9, 2 + (product.images.length % 7));

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-md border-2 border-[var(--ink)] bg-[var(--background)] shadow-[4px_4px_0_0_var(--ink)] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--ink)]">
      <Link
        href={`/product/${product.slug}`}
        className={`relative overflow-hidden bg-[var(--surface)] ${
          compact ? "aspect-[3/4]" : "aspect-[3/4]"
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image
          src={img}
          alt={product.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:768px) 50vw, 280px"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badges.slice(0, 2).map((b) => (
            <span
              key={b}
              className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold tracking-wide text-black uppercase shadow-sm"
            >
              {b}
            </span>
          ))}
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">
          <span className="text-[#be9c7d]">★</span>
          <span>{product.rating.toFixed(1)}</span>
          <span className="opacity-50">|</span>
          <span className="opacity-80">{product.reviewCount}</span>
        </div>
        <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11px] text-white">
          <span className="flex -space-x-1">
            {["#2a291e", "#be9c7d", "#878c64"].slice(0, Math.min(3, colors)).map((c) => (
              <span
                key={c}
                className="inline-block h-3 w-3 rounded-full border border-white/80"
                style={{ background: c }}
              />
            ))}
          </span>
          <span>{colors}</span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-3 pt-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-extrabold">{formatINR(product.price)}</span>
          {product.compareAtPrice > product.price && (
            <>
              <span className="text-sm text-[var(--muted)] line-through">
                {formatINR(product.compareAtPrice)}
              </span>
              <span className="text-xs font-bold text-[var(--accent)]">
                {off}% OFF
              </span>
            </>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
          <span aria-hidden>🏷</span>
          Best price {formatINR(bestPrice(product.price))}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1.5 line-clamp-1 text-sm text-[var(--muted)] hover:text-black"
        >
          {product.title}
        </Link>
      </div>

      <div className="mt-3 border-t-2 border-[var(--ink)]">
        <button
          type="button"
          className="w-full bg-[var(--background)] py-3 text-xs font-extrabold tracking-[0.14em] text-[var(--ink)] uppercase transition hover:bg-[var(--sand)]"
          onClick={() =>
            addItem({
              productId: product._id,
              slug: product.slug,
              title: product.title,
              image: product.images[0],
              price: product.price,
              size: product.sizes[1] ?? product.sizes[0] ?? "M",
            })
          }
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
