/** Homepage sections driven by product flags / collection tags */
export const HOMEPAGE_PLACEMENTS = [
  {
    id: "bestsellers",
    label: "Our Bestsellers",
    hint: "Homepage bestsellers grid",
    collectionTag: null as string | null,
    setsFeatured: true,
  },
  {
    id: "centre-stage",
    label: "Centre Stage Collection",
    hint: "Premium spotlight row",
    collectionTag: "premium",
    setsFeatured: false,
  },
  {
    id: "new-arrivals",
    label: "New Arrivals",
    hint: "Latest drops section",
    collectionTag: "radius-range",
    setsFeatured: false,
  },
  {
    id: "watch-buy",
    label: "Watch & Buy",
    hint: "Video / shop rail",
    collectionTag: "watch-buy",
    setsFeatured: false,
  },
] as const;

export type PlacementId = (typeof HOMEPAGE_PLACEMENTS)[number]["id"];

const PLACEMENT_TAGS = HOMEPAGE_PLACEMENTS.map((p) => p.collectionTag).filter(
  Boolean,
) as string[];

export function placementsFromProduct(product: {
  featured?: boolean;
  collectionTags?: string[];
}): PlacementId[] {
  const tags = product.collectionTags ?? [];
  const out: PlacementId[] = [];
  if (product.featured) out.push("bestsellers");
  if (tags.includes("premium")) out.push("centre-stage");
  if (tags.includes("radius-range")) out.push("new-arrivals");
  if (tags.includes("watch-buy")) out.push("watch-buy");
  return out;
}

export function applyPlacements(
  selected: PlacementId[],
  existingTags: string[],
): { featured: boolean; collectionTags: string[] } {
  const featured = selected.includes("bestsellers");
  const withoutPlacement = existingTags.filter(
    (t) => !PLACEMENT_TAGS.includes(t),
  );
  const fromPlacements = HOMEPAGE_PLACEMENTS.filter((p) =>
    selected.includes(p.id),
  )
    .map((p) => p.collectionTag)
    .filter(Boolean) as string[];

  return {
    featured,
    collectionTags: [...new Set([...withoutPlacement, ...fromPlacements])],
  };
}
