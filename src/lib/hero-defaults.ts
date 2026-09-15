export type HeroSlideLean = {
  _id: string;
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  href: string;
  ctaLabel: string;
  active: boolean;
  order: number;
};

export const DEFAULT_HERO_SLIDES: Omit<HeroSlideLean, "_id">[] = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=80",
    eyebrow: "ATELIER",
    title: "OWN YOUR",
    highlight: "RADIUS",
    href: "/shop?collection=premium",
    ctaLabel: "Shop now",
    active: true,
    order: 0,
  },
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80",
    eyebrow: "DROP",
    title: "RADIUS RANGE",
    highlight: "LIVE",
    href: "/shop?collection=radius-range",
    ctaLabel: "Shop now",
    active: true,
    order: 1,
  },
  {
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80",
    eyebrow: "MEMBERS",
    title: "BUY 2 GET",
    highlight: "MORE",
    href: "/shop/sale",
    ctaLabel: "Shop now",
    active: true,
    order: 2,
  },
];
