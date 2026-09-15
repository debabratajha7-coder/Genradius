"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import type { ProductLean } from "@/types/catalog";
import { discountPercent, formatINR } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";

function bestPrice(price: number): number {
  return Math.max(199, price - 150);
}

export function ProductCard({ product }: { product: ProductLean }) {
  const { addItem } = useCart();
  const [hover, setHover] = useState(false);
  const off = discountPercent(product.price, product.compareAtPrice);
  const img =
    hover && product.images[1] ? product.images[1] : product.images[0];
  const colors = Math.min(9, 2 + (product.images.length % 7));

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group card-luxe flex h-full w-full flex-col overflow-hidden"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-[var(--surface)]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image
          src={img}
          alt={product.title}
          fill
          className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          sizes="(max-width:768px) 50vw, 280px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-full" />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.badges.slice(0, 2).map((b) => (
            <span
              key={b}
              className="rounded-sm bg-white/95 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[var(--ink)] uppercase shadow-sm backdrop-blur"
            >
              {b}
            </span>
          ))}
        </div>
        <div className="absolute bottom-2.5 left-2.5 hidden items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm lg:flex">
          <span className="text-[var(--sand)]">★</span>
          <span>{product.rating.toFixed(1)}</span>
          <span className="opacity-50">|</span>
          <span className="opacity-80">{product.reviewCount}</span>
        </div>
        <div className="absolute right-2.5 bottom-2.5 hidden items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[11px] text-white backdrop-blur-sm lg:flex">
          <span className="flex -space-x-1">
            {["#2a291e", "#be9c7d", "#878c64"]
              .slice(0, Math.min(3, colors))
              .map((c) => (
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

      <div className="flex flex-1 flex-col px-2.5 pt-2.5 sm:px-3.5 sm:pt-3.5">
        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
          <span className="text-sm font-extrabold tracking-tight sm:text-base">
            {formatINR(product.price)}
          </span>
          {product.compareAtPrice > product.price && (
            <>
              <span className="text-xs text-[var(--muted)] line-through sm:text-sm">
                {formatINR(product.compareAtPrice)}
              </span>
              <span className="text-[10px] font-bold text-[var(--olive)] sm:text-xs">
                {off}% OFF
              </span>
            </>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[var(--olive)] sm:text-xs">
          Best price {formatINR(bestPrice(product.price))}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 line-clamp-2 text-xs leading-snug text-[var(--muted)] transition hover:text-[var(--ink)] sm:mt-1.5 sm:line-clamp-1 sm:text-sm"
        >
          {product.title}
        </Link>
      </div>

      <div className="mt-2 border-t border-[var(--border)] sm:mt-3">
        <button
          type="button"
          className="w-full py-3 text-[10px] font-extrabold tracking-[0.14em] text-[var(--ink)] uppercase transition active:bg-[var(--sand)] sm:py-3.5 sm:text-xs sm:tracking-[0.16em] sm:hover:bg-[var(--sand)]"
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
    </motion.article>
  );
}
