/**
 * Demo catalog — swap images via Admin → Products when Cloudinary is ready.
 * Placeholders use placehold.co so SKUs look intentional before real photos.
 */

import type { CategoryLean, ProductLean, PromoLean } from "@/types/catalog";

const sizes = ["S", "M", "L", "XL", "XXL"] as const;

function stock(): Record<string, number> {
  return { S: 8, M: 20, L: 24, XL: 14, XXL: 6 };
}

function ph(label: string, bg = "2a291e", fg = "be9c7d") {
  const text = encodeURIComponent(label);
  return `https://placehold.co/900x1200/${bg}/${fg}/png?text=${text}&font=montserrat`;
}

function phWide(label: string, bg = "535539", fg = "cbcfd0") {
  const text = encodeURIComponent(label);
  return `https://placehold.co/800x1000/${bg}/${fg}/png?text=${text}&font=montserrat`;
}

export const SEED_PROMOS: Omit<PromoLean, "_id">[] = [
  { text: "atelier drop — members ship first", active: true, order: 1 },
  { text: "radius range — limited cuts, no restock", active: true, order: 2 },
  { text: "buy 2 premium tees @ ₹1399", active: true, order: 3 },
  { text: "prepaid orders move on priority", active: true, order: 4 },
];

export const SEED_CATEGORIES: Omit<CategoryLean, "_id">[] = [
  {
    name: "Oversized Tees",
    slug: "oversized-tees",
    image: phWide("OVERSIZED", "443f20", "be9c7d"),
    order: 1,
  },
  {
    name: "Polos",
    slug: "polos",
    image: phWide("POLOS", "878c64", "2a291e"),
    order: 2,
  },
  {
    name: "Shirts",
    slug: "shirts",
    image: phWide("SHIRTS", "be9c7d", "2a291e"),
    order: 3,
  },
  {
    name: "Cargos",
    slug: "cargos",
    image: phWide("CARGOS", "535539", "cbcfd0"),
    order: 4,
  },
  {
    name: "Joggers",
    slug: "joggers",
    image: phWide("JOGGERS", "88986b", "2a291e"),
    order: 5,
  },
  {
    name: "Sale",
    slug: "sale",
    image: phWide("SALE", "2a291e", "be9c7d"),
    order: 6,
  },
];

type SeedProduct = Omit<ProductLean, "_id">;

function demo(
  partial: Omit<SeedProduct, "sizes" | "stockBySize" | "images"> & {
    images?: string[];
    code: string;
  },
): SeedProduct {
  const { code, images, ...rest } = partial;
  return {
    ...rest,
    images: images ?? [ph(code), ph(`${code}+ALT`, "535539", "cbcfd0")],
    badges: ["DEMO PHOTO", ...(rest.badges ?? [])],
    sizes: [...sizes],
    stockBySize: stock(),
    bestPrice: rest.bestPrice ?? null,
    offerTitle: rest.offerTitle ?? "",
    offerDetail: rest.offerDetail ?? "",
    offerPrice: rest.offerPrice ?? null,
    socialProof: rest.socialProof ?? "",
    sizeGuideImage: rest.sizeGuideImage ?? "",
    highlights: rest.highlights ?? [],
    specs: rest.specs ?? [],
    careFit: rest.careFit ?? "",
    reviews: rest.reviews ?? [],
  };
}

export const SEED_PRODUCTS: SeedProduct[] = [
  demo({
    code: "ORBIT+BEIGE",
    title: "Orbit Beige Oversized Graphic Tee",
    slug: "orbit-beige-oversized-graphic-tee",
    description:
      "240gsm heavyweight cotton. Soft hand-feel, structured oversized drop. Replace this demo photo in Admin when ready.",
    price: 549,
    compareAtPrice: 1199,
    badges: ["BEST SELLER", "BUY 3 @1199"],
    rating: 4.8,
    reviewCount: 412,
    categorySlugs: ["oversized-tees", "sale"],
    featured: true,
    collectionTags: ["bestsellers", "orbit"],
  }),
  demo({
    code: "RADIUS+NAVY",
    title: "Radius Navy Typography Tee",
    slug: "radius-navy-typography-tee",
    description:
      "Front mark + loud back type. Built for long wear — demo imagery until your shoot lands.",
    price: 549,
    compareAtPrice: 1199,
    badges: ["BEST SELLER"],
    rating: 4.7,
    reviewCount: 301,
    categorySlugs: ["oversized-tees"],
    featured: true,
    collectionTags: ["bestsellers", "orbit"],
  }),
  demo({
    code: "HUSTLE+ORANGE",
    title: "Hustle Orange Back Print Tee",
    slug: "hustle-orange-back-print-tee",
    description:
      "High-voltage orange with a statement back print. Demo SKU — upload real photos anytime.",
    price: 599,
    compareAtPrice: 1299,
    badges: ["JUST DROPPED"],
    rating: 4.6,
    reviewCount: 156,
    categorySlugs: ["oversized-tees"],
    featured: true,
    collectionTags: ["bestsellers", "radius-range"],
  }),
  demo({
    code: "PULSE+BLACK",
    title: "Pulse Black Pocket Graphic Tee",
    slug: "pulse-black-pocket-graphic-tee",
    description:
      "Matte black oversized with pocket hit. Placeholder art — swap via Cloudinary upload.",
    price: 599,
    compareAtPrice: 1299,
    badges: ["BEST SELLER"],
    rating: 4.7,
    reviewCount: 228,
    categorySlugs: ["oversized-tees"],
    featured: true,
    collectionTags: ["bestsellers"],
  }),
  demo({
    code: "THREADLINE",
    title: "Threadline Ivory Puff Print Tee",
    slug: "threadline-ivory-puff-print-tee",
    description:
      "Raised puff print on ivory heavyweight. Premium cut — awaiting final product photography.",
    price: 749,
    compareAtPrice: 1599,
    badges: ["PREMIUM", "BUY 2 @1399"],
    rating: 4.9,
    reviewCount: 94,
    categorySlugs: ["oversized-tees"],
    featured: true,
    collectionTags: ["radius-range", "premium"],
  }),
  demo({
    code: "ATELIER+POLO",
    title: "Atelier Stripe Collar Polo",
    slug: "atelier-stripe-collar-polo",
    description:
      "Tipped collar, clean drape. Elevated everyday polo — demo image.",
    price: 899,
    compareAtPrice: 1799,
    badges: ["PREMIUM"],
    rating: 4.6,
    reviewCount: 71,
    categorySlugs: ["polos"],
    featured: true,
    collectionTags: ["premium"],
  }),
  demo({
    code: "ORBIT+OLIVE+POLO",
    title: "Orbit Olive Half-Sleeve Polo",
    slug: "orbit-olive-half-sleeve-polo",
    description:
      "Olive texture that reads expensive in person. Replace placeholder before launch.",
    price: 999,
    compareAtPrice: 1899,
    badges: ["PREMIUM"],
    rating: 4.8,
    reviewCount: 58,
    categorySlugs: ["polos"],
    featured: true,
    collectionTags: ["premium", "orbit"],
  }),
  demo({
    code: "LUNAR+SHIRT",
    title: "Lunar Circle Oversized Shirt",
    slug: "lunar-circle-oversized-shirt",
    description:
      "Resort drape, all-over energy. Demo product for layout — upload your shoot next.",
    price: 1199,
    compareAtPrice: 2299,
    badges: ["JUST DROPPED"],
    rating: 4.5,
    reviewCount: 44,
    categorySlugs: ["shirts"],
    featured: true,
    collectionTags: ["radius-range"],
  }),
  demo({
    code: "GRIDLOCK",
    title: "Gridlock Sand Check Shirt",
    slug: "gridlock-sand-check-shirt",
    description:
      "Relaxed check for heatwave days. Placeholder photography until assets arrive.",
    price: 999,
    compareAtPrice: 1999,
    badges: ["SALE"],
    rating: 4.4,
    reviewCount: 62,
    categorySlugs: ["shirts", "sale"],
    featured: false,
    collectionTags: ["sale"],
  }),
  demo({
    code: "TRAIL+CARGO",
    title: "Trail Utility Cargo",
    slug: "trail-utility-cargo",
    description:
      "Multi-pocket street cut. Demo listing — swap images in Admin → Products.",
    price: 1499,
    compareAtPrice: 2799,
    badges: ["BEST SELLER"],
    rating: 4.7,
    reviewCount: 189,
    categorySlugs: ["cargos"],
    featured: true,
    collectionTags: ["bestsellers", "bottoms"],
  }),
  demo({
    code: "NIGHT+CARGO",
    title: "Night Shift Black Cargo",
    slug: "night-shift-black-cargo",
    description:
      "Matte black cargos for after-dark. Premium demo SKU with replaceable art.",
    price: 1599,
    compareAtPrice: 2999,
    badges: ["PREMIUM"],
    rating: 4.8,
    reviewCount: 112,
    categorySlugs: ["cargos"],
    featured: true,
    collectionTags: ["premium", "bottoms"],
  }),
  demo({
    code: "DRIFT+JOGGER",
    title: "Drift Contrast Jogger",
    slug: "drift-contrast-jogger",
    description:
      "Relaxed jogger with contrast stripe. Temporary visual — upload yours anytime.",
    price: 1099,
    compareAtPrice: 2199,
    badges: ["JUST DROPPED"],
    rating: 4.5,
    reviewCount: 83,
    categorySlugs: ["joggers"],
    featured: true,
    collectionTags: ["bottoms", "bestsellers"],
  }),
  demo({
    code: "VOLTAGE",
    title: "Voltage Crimson Puff Tee",
    slug: "voltage-crimson-puff-tee",
    description:
      "Limited puff exclusive. Demo until campaign photography is ready.",
    price: 799,
    compareAtPrice: 1699,
    badges: ["LIMITED", "BUY 2 @1399"],
    rating: 4.9,
    reviewCount: 37,
    categorySlugs: ["oversized-tees"],
    featured: true,
    collectionTags: ["radius-range", "premium"],
  }),
  demo({
    code: "ACID+WASH",
    title: "Acid Wash Spiderline Tee",
    slug: "acid-wash-spiderline-tee",
    description:
      "Washed texture, graphic attitude. Placeholder — replace in admin panel.",
    price: 699,
    compareAtPrice: 1499,
    badges: ["JUST DROPPED"],
    rating: 4.6,
    reviewCount: 67,
    categorySlugs: ["oversized-tees", "sale"],
    featured: true,
    collectionTags: ["radius-range", "sale"],
  }),
  demo({
    code: "WAFFLE+OLIVE",
    title: "Waffle Pocket Olive Tee",
    slug: "waffle-pocket-olive-tee",
    description:
      "Textured waffle knit with chest pocket. Quiet flex — demo photo.",
    price: 649,
    compareAtPrice: 1399,
    badges: ["PREMIUM"],
    rating: 4.5,
    reviewCount: 79,
    categorySlugs: ["oversized-tees"],
    featured: false,
    collectionTags: ["orbit", "premium"],
  }),
  demo({
    code: "SIGNAL+POLO",
    title: "Signal Full-Sleeve Polo",
    slug: "signal-full-sleeve-polo",
    description:
      "Full sleeve for cooler evenings. Elevated demo — ready for your images.",
    price: 1199,
    compareAtPrice: 2299,
    badges: ["PREMIUM"],
    rating: 4.7,
    reviewCount: 41,
    categorySlugs: ["polos"],
    featured: true,
    collectionTags: ["premium"],
  }),
  demo({
    code: "MONOLITH",
    title: "Monolith Heavyweight Tee",
    slug: "monolith-heavyweight-tee",
    description:
      "280gsm monolith cotton. The quiet luxury tee — upload studio shots when ready.",
    price: 899,
    compareAtPrice: 1899,
    badges: ["ATELIER", "PREMIUM"],
    rating: 4.9,
    reviewCount: 23,
    categorySlugs: ["oversized-tees"],
    featured: true,
    collectionTags: ["premium", "bestsellers"],
  }),
  demo({
    code: "HORIZON+CARGO",
    title: "Horizon Wide Cargo",
    slug: "horizon-wide-cargo",
    description:
      "Wide-leg utility with refined hardware. Demo listing for premium layout.",
    price: 1799,
    compareAtPrice: 3299,
    badges: ["PREMIUM", "JUST DROPPED"],
    rating: 4.8,
    reviewCount: 19,
    categorySlugs: ["cargos"],
    featured: true,
    collectionTags: ["premium", "bottoms", "radius-range"],
  }),
];

export function memoryPromos(): PromoLean[] {
  return SEED_PROMOS.map((p, i) => ({ ...p, _id: `promo-${i + 1}` }));
}

export function memoryCategories(): CategoryLean[] {
  return SEED_CATEGORIES.map((c, i) => ({ ...c, _id: `cat-${i + 1}` }));
}

export function memoryProducts(): ProductLean[] {
  return SEED_PRODUCTS.map((p, i) => ({ ...p, _id: `prod-${i + 1}` }));
}
