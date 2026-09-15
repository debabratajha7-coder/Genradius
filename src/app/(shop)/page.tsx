import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { WatchAndBuy } from "@/components/home/WatchAndBuy";
import { TopCategories } from "@/components/home/TopCategories";
import { RadiusBand } from "@/components/home/RadiusBand";
import { CollectionStrip } from "@/components/home/CollectionStrip";
import { TrustRow } from "@/components/home/TrustRow";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { FeaturedOn } from "@/components/home/FeaturedOn";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { getCategories, getProducts } from "@/lib/products";
import { getActiveReels } from "@/lib/reels";

export default async function HomePage() {
  const [categories, bestsellers, centreStage, newArrivals, watch, reels] =
    await Promise.all([
      getCategories(),
      getProducts({ featured: true, limit: 10 }),
      getProducts({ collection: "premium", limit: 8 }),
      getProducts({ collection: "radius-range", limit: 8 }),
      getProducts({ limit: 8 }),
      getActiveReels(12),
    ]);

  return (
    <>
      <HeroCarousel />
      <ProductCarousel
        title="Our Bestsellers"
        products={bestsellers}
        ctaLabel="See more bestsellers"
        ctaHref="/shop"
      />
      <WatchAndBuy products={watch} reels={reels} />
      <ProductCarousel
        title="Centre Stage Collection"
        products={centreStage}
        ctaLabel="Explore all products"
        ctaHref="/shop"
      />
      <TopCategories categories={categories} />
      <RadiusBand />
      <ProductCarousel
        title="New Arrivals"
        products={newArrivals}
        ctaLabel="See all new arrivals"
        ctaHref="/shop?collection=radius-range"
      />
      <CollectionStrip />
      <TrustRow />
      <BlogTeaser />
      <FeaturedOn />
      <RecentlyViewed />
    </>
  );
}
