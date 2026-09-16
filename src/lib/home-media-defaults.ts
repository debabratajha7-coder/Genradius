export type CollectionTileLean = {
  key: string;
  label: string;
  href: string;
  image: string;
  /** Tailwind gradient stops when no image */
  bg: string;
};

export type HomeMediaLean = {
  aboutPhoneBanner: string;
  aboutVideoPoster: string;
  aboutVideoUrl: string;
  aboutCollage: [string, string, string];
  collections: CollectionTileLean[];
};

export const DEFAULT_COLLECTIONS: CollectionTileLean[] = [
  {
    key: "orbit",
    label: "ORBIT",
    href: "/shop?collection=orbit",
    image: "",
    bg: "from-[#be9c7d] to-[#878c64]",
  },
  {
    key: "premium",
    label: "PREMIUM",
    href: "/shop?collection=premium",
    image: "",
    bg: "from-[#535539] to-[#2a291e]",
  },
  {
    key: "sale",
    label: "SALE",
    href: "/shop/sale",
    image: "",
    bg: "from-[#88986b] to-[#443f20]",
  },
  {
    key: "cargos",
    label: "CARGOS",
    href: "/shop/cargos",
    image: "",
    bg: "from-[#cbcfd0] to-[#535539]",
  },
];

export const DEFAULT_HOME_MEDIA: HomeMediaLean = {
  aboutPhoneBanner:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
  aboutVideoPoster:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
  aboutVideoUrl: "",
  aboutCollage: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
  ],
  collections: DEFAULT_COLLECTIONS,
};
