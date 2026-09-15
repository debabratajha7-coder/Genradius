"use client";

import { useEffect, useState } from "react";
import type { ProductLean } from "@/types/catalog";
import { ProductCarousel } from "./ProductCarousel";

const KEY = "genradius-recent-v1";

export function trackRecentlyViewed(product: ProductLean) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const prev = raw ? (JSON.parse(raw) as ProductLean[]) : [];
    const next = [product, ...prev.filter((p) => p._id !== product._id)].slice(
      0,
      8,
    );
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function RecentlyViewed() {
  const [products, setProducts] = useState<ProductLean[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProducts(JSON.parse(raw) as ProductLean[]);
    } catch {
      /* ignore */
    }
  }, []);

  if (!products.length) return null;

  return <ProductCarousel title="Recently Viewed" products={products} />;
}
