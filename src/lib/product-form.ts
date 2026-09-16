import {
  HOMEPAGE_PLACEMENTS,
  placementsFromProduct,
  type PlacementId,
} from "@/lib/storefront-placements";

export type ProductFormValues = {
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: string;
  compareAtPrice: string;
  badges: string;
  categorySlug: string;
  extraCollectionTags: string;
  sizes: string;
  featured: boolean;
  active: boolean;
  placements: PlacementId[];
};

export function productToFormValues(
  p: {
    title: string;
    slug: string;
    description: string;
    images: string[];
    price: number;
    compareAtPrice: number;
    badges?: string[];
    categorySlugs?: string[];
    collectionTags?: string[];
    sizes?: string[];
    featured?: boolean;
    active?: boolean;
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
    badges: (p.badges ?? []).join(", "),
    categorySlug: p.categorySlugs?.[0] ?? categories[0]?.slug ?? "",
    extraCollectionTags: extra.join(", "),
    sizes: (p.sizes ?? []).join(", "),
    featured: Boolean(p.featured),
    active: p.active !== false,
    placements: placementIds,
  };
}
