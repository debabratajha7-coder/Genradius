import {
  HOMEPAGE_PLACEMENTS,
  placementsFromProduct,
  type PlacementId,
} from "@/lib/storefront-placements";
import type {
  ProductHighlight,
  ProductReview,
  ProductSpec,
} from "@/types/catalog";

export type ProductFormValues = {
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: string;
  compareAtPrice: string;
  bestPrice: string;
  badges: string;
  categorySlug: string;
  extraCollectionTags: string;
  sizes: string;
  featured: boolean;
  active: boolean;
  placements: PlacementId[];
  rating: string;
  reviewCount: string;
  offerTitle: string;
  offerDetail: string;
  offerPrice: string;
  socialProof: string;
  sizeGuideImage: string;
  careFit: string;
  highlights: ProductHighlight[];
  specs: ProductSpec[];
  reviews: ProductReview[];
};

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  title: "",
  slug: "",
  description: "",
  images: [],
  price: "",
  compareAtPrice: "",
  bestPrice: "",
  badges: "",
  categorySlug: "",
  extraCollectionTags: "",
  sizes: "S,M,L,XL,XXL",
  featured: false,
  active: true,
  placements: [],
  rating: "4.5",
  reviewCount: "0",
  offerTitle: "",
  offerDetail: "",
  offerPrice: "",
  socialProof: "",
  sizeGuideImage: "",
  careFit: "",
  highlights: [],
  specs: [],
  reviews: [],
};

export function productToFormValues(
  p: {
    title: string;
    slug: string;
    description: string;
    images: string[];
    price: number;
    compareAtPrice: number;
    bestPrice?: number | null;
    badges?: string[];
    categorySlugs?: string[];
    collectionTags?: string[];
    sizes?: string[];
    featured?: boolean;
    active?: boolean;
    rating?: number;
    reviewCount?: number;
    offerTitle?: string | null;
    offerDetail?: string | null;
    offerPrice?: number | null;
    socialProof?: string | null;
    sizeGuideImage?: string | null;
    careFit?: string | null;
    highlights?: ProductHighlight[] | null;
    specs?: ProductSpec[] | null;
    reviews?: ProductReview[] | null;
  },
  categories: { slug: string }[],
): ProductFormValues {
  const placementIds = placementsFromProduct(p);
  const placementTagSet = new Set(
    HOMEPAGE_PLACEMENTS.map((x) => x.collectionTag).filter(Boolean),
  );
  const extra = (p.collectionTags ?? []).filter((t) => !placementTagSet.has(t));

  return {
    title: p.title,
    slug: p.slug,
    description: p.description,
    images: p.images ?? [],
    price: String(p.price),
    compareAtPrice: String(p.compareAtPrice),
    bestPrice: p.bestPrice != null ? String(p.bestPrice) : "",
    badges: (p.badges ?? []).join(", "),
    categorySlug: p.categorySlugs?.[0] ?? categories[0]?.slug ?? "",
    extraCollectionTags: extra.join(", "),
    sizes: (p.sizes ?? []).join(", "),
    featured: Boolean(p.featured),
    active: p.active !== false,
    placements: placementIds,
    rating: String(p.rating ?? 4.5),
    reviewCount: String(p.reviewCount ?? 0),
    offerTitle: p.offerTitle ?? "",
    offerDetail: p.offerDetail ?? "",
    offerPrice: p.offerPrice != null ? String(p.offerPrice) : "",
    socialProof: p.socialProof ?? "",
    sizeGuideImage: p.sizeGuideImage ?? "",
    careFit: p.careFit ?? "",
    highlights: (p.highlights ?? []).map((h) => ({
      title: h.title || "",
      image: h.image || "",
    })),
    specs: (p.specs ?? []).map((s) => ({
      label: s.label || "",
      value: s.value || "",
    })),
    reviews: (p.reviews ?? []).map((r) => ({
      name: r.name || "",
      rating: Number(r.rating) || 5,
      date: r.date || "",
      body: r.body || "",
      verified: r.verified !== false,
    })),
  };
}

/** Normalize list payloads from admin form / API body. */
export function normalizeHighlights(raw: unknown): ProductHighlight[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((h) => {
      const row = h as Partial<ProductHighlight>;
      return {
        title: String(row.title || "").trim(),
        image: String(row.image || "").trim(),
      };
    })
    .filter((h) => h.title);
}

export function normalizeSpecs(raw: unknown): ProductSpec[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => {
      const row = s as Partial<ProductSpec>;
      return {
        label: String(row.label || "").trim(),
        value: String(row.value || "").trim(),
      };
    })
    .filter((s) => s.label && s.value);
}

export function normalizeReviews(raw: unknown): ProductReview[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => {
      const row = r as Partial<ProductReview>;
      return {
        name: String(row.name || "").trim(),
        rating: Math.min(5, Math.max(1, Number(row.rating) || 5)),
        date: String(row.date || "").trim(),
        body: String(row.body || "").trim(),
        verified: row.verified !== false,
      };
    })
    .filter((r) => r.name);
}
