import type { CategoryLean } from "@/types/catalog";
import type { ProductLean } from "@/types/catalog";
import type { PromoLean } from "@/types/catalog";

const sizes = ["S", "M", "L", "XL", "XXL"] as const;

function stock(): Record<string, number> {
  return { S: 12, M: 28, L: 34, XL: 18, XXL: 9 };
}

/** Sample Genradius catalog — original products, Unsplash placeholders */
export const SEED_PROMOS: Omit<PromoLean, "_id">[] = [
  { text: "premium graphics — buy 2 @1399", active: true, order: 1 },
  { text: "new: orbit tees — buy 2 & get ₹200 off", active: true, order: 2 },
  { text: "just dropped: radius range", active: true, order: 3 },
  { text: "prepaid orders ship on priority", active: true, order: 4 },
];

export const SEED_CATEGORIES: Omit<CategoryLean, "_id">[] = [
  {
    name: "Oversized Tees",
    slug: "oversized-tees",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    order: 1,
  },
  {
    name: "Polos",
    slug: "polos",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
    order: 2,
  },
  {
    name: "Shirts",
    slug: "shirts",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    order: 3,
  },
  {
    name: "Cargos",
    slug: "cargos",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    order: 4,
  },
  {
    name: "Joggers",
    slug: "joggers",
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
    order: 5,
  },
  {
    name: "Sale",
    slug: "sale",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    order: 6,
  },
];

type SeedProduct = Omit<ProductLean, "_id">;

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    title: "Orbit Beige Oversized Graphic Tee",
    slug: "orbit-beige-oversized-graphic-tee",
    description:
      "Soft heavyweight cotton with a back graphic that owns the room. Oversized drop — your everyday flex.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80",
    ],
    price: 549,
    compareAtPrice: 1199,
    badges: ["BEST SELLER", "BUY 3 @1199"],
    rating: 4.5,
    reviewCount: 325,
    categorySlugs: ["oversized-tees", "sale"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["bestsellers", "orbit"],
  },
  {
    title: "Radius Navy Typography Tee",
    slug: "radius-navy-typography-tee",
    description:
      "Clean brand type up front, loud energy on the back. Built for campus days and late nights.",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80",
    ],
    price: 549,
    compareAtPrice: 1199,
    badges: ["BEST SELLER", "BUY 3 @1199"],
    rating: 4.5,
    reviewCount: 317,
    categorySlugs: ["oversized-tees"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["bestsellers", "orbit"],
  },
  {
    title: "Hustle Orange Back Print Tee",
    slug: "hustle-orange-back-print-tee",
    description:
      "High-voltage orange with a statement back print. Turn around and the drip does the talking.",
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&q=80",
    ],
    price: 549,
    compareAtPrice: 1199,
    badges: ["JUST DROPPED"],
    rating: 4.6,
    reviewCount: 129,
    categorySlugs: ["oversized-tees"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["bestsellers", "radius-range"],
  },
  {
    title: "Pulse Black Pocket Graphic Tee",
    slug: "pulse-black-pocket-graphic-tee",
    description:
      "Pocket hit + oversized cut. Black that goes with everything loud.",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=80",
    ],
    price: 599,
    compareAtPrice: 1299,
    badges: ["BEST SELLER"],
    rating: 4.6,
    reviewCount: 212,
    categorySlugs: ["oversized-tees"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["bestsellers"],
  },
  {
    title: "Threadline White Puff Print Tee",
    slug: "threadline-white-puff-print-tee",
    description:
      "Raised puff print you can feel. Soft white base, zero boring.",
    images: [
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=900&q=80",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=900&q=80",
    ],
    price: 649,
    compareAtPrice: 1399,
    badges: ["PREMIUM", "BUY 2 @1399"],
    rating: 4.7,
    reviewCount: 88,
    categorySlugs: ["oversized-tees"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["radius-range", "premium"],
  },
  {
    title: "Core Stripe Collar Black Polo",
    slug: "core-stripe-collar-black-polo",
    description:
      "Regular fit polo with tipped collar. Smart enough for class, chill enough for the weekend.",
    images: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=900&q=80",
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=900&q=80",
    ],
    price: 799,
    compareAtPrice: 1599,
    badges: ["PREMIUM"],
    rating: 4.4,
    reviewCount: 64,
    categorySlugs: ["polos"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: false,
    collectionTags: ["premium"],
  },
  {
    title: "Orbit Olive Half-Sleeve Polo",
    slug: "orbit-olive-half-sleeve-polo",
    description:
      "Olive oversized polo — texture that reads premium from across the courtyard.",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&q=80",
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=900&q=80",
    ],
    price: 899,
    compareAtPrice: 1699,
    badges: ["PREMIUM"],
    rating: 4.8,
    reviewCount: 41,
    categorySlugs: ["polos"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["premium", "orbit"],
  },
  {
    title: "Lunar Circle All-Over Print Shirt",
    slug: "lunar-circle-all-over-print-shirt",
    description:
      "Oversized resort energy. All-over print for the ones who don’t do plain.",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80",
    ],
    price: 999,
    compareAtPrice: 1999,
    badges: ["JUST DROPPED"],
    rating: 4.5,
    reviewCount: 37,
    categorySlugs: ["shirts"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["radius-range"],
  },
  {
    title: "Gridlock Beige Check Shirt",
    slug: "gridlock-beige-check-shirt",
    description:
      "Relaxed check shirt for heatwave days. Layer it or wear it loud alone.",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=900&q=80",
    ],
    price: 899,
    compareAtPrice: 1799,
    badges: [],
    rating: 4.3,
    reviewCount: 52,
    categorySlugs: ["shirts", "sale"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: false,
    collectionTags: ["sale"],
  },
  {
    title: "Trail Utility Cargo Pants",
    slug: "trail-utility-cargo-pants",
    description:
      "Multi-pocket cargos with a street cut. Function first, flex always.",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=80",
    ],
    price: 1299,
    compareAtPrice: 2499,
    badges: ["BEST SELLER"],
    rating: 4.6,
    reviewCount: 178,
    categorySlugs: ["cargos"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["bestsellers", "bottoms"],
  },
  {
    title: "Night Shift Black Cargo",
    slug: "night-shift-black-cargo",
    description:
      "Matte black cargos for after-dark plans. Room to move, nowhere to hide.",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80",
      "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=900&q=80",
    ],
    price: 1399,
    compareAtPrice: 2599,
    badges: ["PREMIUM"],
    rating: 4.7,
    reviewCount: 96,
    categorySlugs: ["cargos"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: false,
    collectionTags: ["premium", "bottoms"],
  },
  {
    title: "Drift Grey Contrast Jogger",
    slug: "drift-grey-contrast-jogger",
    description:
      "Relaxed nylon jogger with contrast stripe. Lounge mode, street approved.",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=900&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=80",
    ],
    price: 999,
    compareAtPrice: 1999,
    badges: [],
    rating: 4.4,
    reviewCount: 73,
    categorySlugs: ["joggers"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["bottoms", "bestsellers"],
  },
  {
    title: "Voltage Red Puff Exclusive Tee",
    slug: "voltage-red-puff-exclusive-tee",
    description:
      "Exclusive drop. Puff print that pops — limited run, unlimited attitude.",
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80",
    ],
    price: 699,
    compareAtPrice: 1499,
    badges: ["LIMITED", "BUY 2 @1399"],
    rating: 4.8,
    reviewCount: 29,
    categorySlugs: ["oversized-tees"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: true,
    collectionTags: ["radius-range", "premium"],
  },
  {
    title: "Acid Wash Spiderline Tee",
    slug: "acid-wash-spiderline-tee",
    description:
      "Washed, worn-in texture with a graphic that refuses to blend in.",
    images: [
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=900&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=900&q=80",
    ],
    price: 649,
    compareAtPrice: 1399,
    badges: ["JUST DROPPED"],
    rating: 4.5,
    reviewCount: 54,
    categorySlugs: ["oversized-tees", "sale"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: false,
    collectionTags: ["radius-range", "sale"],
  },
  {
    title: "Waffle Pocket Olive Tee",
    slug: "waffle-pocket-olive-tee",
    description:
      "Textured waffle knit with chest pocket. Quiet flex for everyday orbit.",
    images: [
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=900&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80",
    ],
    price: 599,
    compareAtPrice: 1299,
    badges: [],
    rating: 4.3,
    reviewCount: 61,
    categorySlugs: ["oversized-tees"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: false,
    collectionTags: ["orbit"],
  },
  {
    title: "Signal Blue Full-Sleeve Polo",
    slug: "signal-blue-full-sleeve-polo",
    description:
      "Full sleeve polo for cooler evenings. Signal blue that cuts through the noise.",
    images: [
      "https://images.unsplash.com/photo-1618354691551-44de113f0164?w=900&q=80",
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=80",
    ],
    price: 999,
    compareAtPrice: 1899,
    badges: ["PREMIUM"],
    rating: 4.6,
    reviewCount: 33,
    categorySlugs: ["polos"],
    sizes: [...sizes],
    stockBySize: stock(),
    featured: false,
    collectionTags: ["premium"],
  },
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
