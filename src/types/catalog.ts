export type CategoryLean = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  order: number;
};

export type ProductHighlight = {
  title: string;
  image: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductReview = {
  name: string;
  rating: number;
  date: string;
  body: string;
  verified: boolean;
};

export type ProductLean = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  compareAtPrice: number;
  badges: string[];
  rating: number;
  reviewCount: number;
  categorySlugs: string[];
  sizes: string[];
  stockBySize: Record<string, number>;
  featured: boolean;
  collectionTags: string[];
  active?: boolean;
  bestPrice?: number | null;
  offerTitle?: string;
  offerDetail?: string;
  offerPrice?: number | null;
  socialProof?: string;
  sizeGuideImage?: string;
  highlights?: ProductHighlight[];
  specs?: ProductSpec[];
  careFit?: string;
  reviews?: ProductReview[];
};

export type PromoLean = {
  _id: string;
  text: string;
  active: boolean;
  order: number;
};

export type ReelLean = {
  _id: string;
  title: string;
  instagramUrl: string;
  embedUrl: string;
  shortcode: string;
  thumbnailUrl: string;
  videoUrl: string;
  productSlug: string;
  active: boolean;
  order: number;
};
