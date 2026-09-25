"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ProductLean } from "@/types/catalog";
import { discountPercent, formatINR } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductLean;
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const off = discountPercent(product.price, product.compareAtPrice);
  const img =
    hover && product.images[1] ? product.images[1] : product.images[0];
  const defaultSize = product.sizes[1] ?? product.sizes[0] ?? "M";
  const lowStock = Object.values(product.stockBySize || {}).some(
    (n) => typeof n === "number" && n > 0 && n <= 3,
  );

  function quickAdd() {
    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      price: product.price,
      size: defaultSize,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.5, ease }}
      className="group flex h-full w-full flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative overflow-hidden rounded-[18px] bg-[var(--surface)] sm:rounded-[22px]">
        <Link
          href={`/product/${product.slug}`}
          className="relative block aspect-[3/4]"
          aria-label={product.title}
        >
          <Image
            src={img}
            alt={product.title}
            fill
            priority={priority}
            className="object-cover transition duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
            sizes="(max-width:768px) 50vw, 300px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute top-2.5 left-2.5 flex flex-col items-start gap-1 sm:top-3 sm:left-3">
          {off > 0 ? (
            <span className="rounded-full bg-[var(--pop)] px-2 py-1 text-[9px] font-extrabold tracking-[0.12em] text-[var(--pop-ink)] uppercase sm:text-[10px]">
              -{off}%
            </span>
          ) : null}
          {product.badges.slice(0, 1).map((b) => (
            <span
              key={b}
              className="rounded-full bg-white/90 px-2 py-1 text-[9px] font-extrabold tracking-[0.12em] text-[var(--ink)] uppercase backdrop-blur sm:text-[10px]"
            >
              {b}
            </span>
          ))}
          {lowStock ? (
            <span className="rounded-full bg-[var(--ink)] px-2 py-1 text-[9px] font-extrabold tracking-[0.12em] text-white uppercase sm:text-[10px]">
              Few left
            </span>
          ) : null}
        </div>

        {/* Rating */}
        {product.reviewCount > 0 ? (
          <div className="pointer-events-none absolute top-2.5 right-2.5 hidden items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm sm:top-3 sm:right-3 lg:flex">
            <span className="text-[var(--pop)]">★</span>
            {product.rating.toFixed(1)}
          </div>
        ) : null}

        {/* Quick add — slides up on hover (desktop), always visible on touch */}
        <div className="absolute inset-x-2 bottom-2 z-10 translate-y-0 opacity-100 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-x-3 sm:bottom-3 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <button
            type="button"
            onClick={quickAdd}
            className={`flex w-full items-center justify-between rounded-full px-3.5 py-2.5 text-[10px] font-extrabold tracking-[0.16em] uppercase backdrop-blur-md transition sm:px-4 sm:py-3 sm:text-[11px] ${
              added
                ? "bg-[var(--pop)] text-[var(--pop-ink)]"
                : "bg-white/92 text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--pop)]"
            }`}
            aria-label={`Quick add ${product.title} size ${defaultSize}`}
          >
            <span>{added ? "Added to bag" : "Quick add"}</span>
            <span className="opacity-60">{added ? "✓" : defaultSize}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3 sm:pt-3.5">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-1 text-[13px] font-semibold tracking-tight text-[var(--ink)] transition hover:text-[var(--moss)] sm:text-sm"
        >
          {product.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-bold tracking-tight tabular-nums sm:text-[15px]">
            {formatINR(product.price)}
          </span>
          {product.compareAtPrice > product.price ? (
            <span className="text-[11px] text-[var(--muted)] line-through sm:text-xs">
              {formatINR(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        {product.socialProof ? (
          <p className="mt-1 text-[10px] font-semibold text-[var(--olive)] sm:text-[11px]">
            {product.socialProof}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}
