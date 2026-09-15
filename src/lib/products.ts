import { connectDB, useMemoryCatalog } from "@/lib/db";
import {
  memoryCategories,
  memoryProducts,
  memoryPromos,
} from "@/data/catalog";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Promo from "@/models/Promo";
import type { CategoryLean, ProductLean, PromoLean } from "@/types/catalog";

function mapStock(
  stock: Map<string, number> | Record<string, number> | undefined,
): Record<string, number> {
  if (!stock) return {};
  if (stock instanceof Map) return Object.fromEntries(stock.entries());
  return stock;
}

function toProductLean(doc: Record<string, unknown>): ProductLean {
  return {
    _id: String(doc._id),
    title: doc.title as string,
    slug: doc.slug as string,
    description: doc.description as string,
    images: doc.images as string[],
    price: doc.price as number,
    compareAtPrice: doc.compareAtPrice as number,
    badges: (doc.badges as string[]) ?? [],
    rating: (doc.rating as number) ?? 4.5,
    reviewCount: (doc.reviewCount as number) ?? 0,
    categorySlugs: (doc.categorySlugs as string[]) ?? [],
    sizes: (doc.sizes as string[]) ?? [],
    stockBySize: mapStock(
      doc.stockBySize as Map<string, number> | Record<string, number>,
    ),
    featured: Boolean(doc.featured),
    collectionTags: (doc.collectionTags as string[]) ?? [],
  };
}

function filterMemoryProducts(opts?: {
  category?: string;
  collection?: string;
  featured?: boolean;
  limit?: number;
}): ProductLean[] {
  let list = memoryProducts();
  if (opts?.category) {
    list = list.filter((p) => p.categorySlugs.includes(opts.category!));
  }
  if (opts?.collection) {
    list = list.filter((p) => p.collectionTags.includes(opts.collection!));
  }
  if (opts?.featured) {
    list = list.filter((p) => p.featured);
  }
  if (opts?.limit) list = list.slice(0, opts.limit);
  return list;
}

export async function getPromos(): Promise<PromoLean[]> {
  if (useMemoryCatalog()) return memoryPromos().filter((p) => p.active);

  try {
    await connectDB();
    const rows = await Promo.find({ active: true }).sort({ order: 1 }).lean();
    if (!rows.length) return memoryPromos().filter((p) => p.active);
    return rows.map((r) => ({
      _id: String(r._id),
      text: r.text,
      active: r.active,
      order: r.order,
    }));
  } catch {
    return memoryPromos().filter((p) => p.active);
  }
}

export async function getCategories(): Promise<CategoryLean[]> {
  if (useMemoryCatalog()) {
    return memoryCategories().sort((a, b) => a.order - b.order);
  }

  try {
    await connectDB();
    const rows = await Category.find().sort({ order: 1 }).lean();
    if (!rows.length) {
      return memoryCategories().sort((a, b) => a.order - b.order);
    }
    return rows.map((r) => ({
      _id: String(r._id),
      name: r.name,
      slug: r.slug,
      image: r.image,
      order: r.order,
    }));
  } catch {
    return memoryCategories().sort((a, b) => a.order - b.order);
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryLean | null> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(opts?: {
  category?: string;
  collection?: string;
  featured?: boolean;
  limit?: number;
}): Promise<ProductLean[]> {
  if (useMemoryCatalog()) return filterMemoryProducts(opts);

  try {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (opts?.category) filter.categorySlugs = opts.category;
    if (opts?.collection) filter.collectionTags = opts.collection;
    if (opts?.featured) filter.featured = true;

    let query = Product.find({
      ...filter,
      $or: [{ active: true }, { active: { $exists: false } }],
    }).sort({ featured: -1, createdAt: -1 });
    if (opts?.limit) query = query.limit(opts.limit);
    const rows = await query.lean();
    return rows.map((r) =>
      toProductLean(r as unknown as Record<string, unknown>),
    );
  } catch {
    if (useMemoryCatalog()) return filterMemoryProducts(opts);
    return [];
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductLean | null> {
  if (useMemoryCatalog()) {
    return memoryProducts().find((p) => p.slug === slug) ?? null;
  }

  try {
    await connectDB();
    const row = await Product.findOne({
      slug,
      $or: [{ active: true }, { active: { $exists: false } }],
    }).lean();
    if (!row) return null;
    return toProductLean(row as unknown as Record<string, unknown>);
  } catch {
    if (useMemoryCatalog()) {
      return memoryProducts().find((p) => p.slug === slug) ?? null;
    }
    return null;
  }
}

export { discountPercent, formatINR } from "@/lib/format";
