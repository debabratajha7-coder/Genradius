import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { WatchAndBuy } from "@/components/home/WatchAndBuy";
import { TopCategories } from "@/components/home/TopCategories";
import { RadiusBand } from "@/components/home/RadiusBand";
import { CollectionStrip } from "@/components/home/CollectionStrip";
import { TrustRow } from "@/components/home/TrustRow";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { FeaturedOn } from "@/components/home/FeaturedOn";
import { Reveal } from "@/components/motion/Reveal";
import { getCategories, getProducts } from "@/lib/products";
import { getActiveReels } from "@/lib/reels";
import { getHeroSlides } from "@/lib/hero";

export default async function HomePage() {
  const [
    categories,
    bestsellers,
    centreStage,
    newArrivals,
    watch,
    reels,
    heroSlides,
  ] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 12 }),
    getProducts({ collection: "premium", limit: 10 }),
    getProducts({ collection: "radius-range", limit: 10 }),
    getProducts({ limit: 10 }),
    getActiveReels(12),
    getHeroSlides(),
  ]);

  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <Reveal>
        <TopCategories categories={categories} />
      </Reveal>
      <ProductCarousel
        title="Our Bestsellers"
        products={bestsellers}
        ctaLabel="See more bestsellers"
        ctaHref="/shop"
      />
      <Reveal>
        <WatchAndBuy products={watch} reels={reels} />
      </Reveal>
      <ProductCarousel
        title="Centre Stage Collection"
        products={centreStage}
        ctaLabel="Explore all products"
        ctaHref="/shop"
      />
      <ProductCarousel
        title="New Arrivals"
        products={newArrivals}
        ctaLabel="See all new arrivals"
        ctaHref="/shop?collection=radius-range"
      />
      <Reveal>
        <CollectionStrip />
      </Reveal>
      <Reveal y={48}>
        <RadiusBand />
      </Reveal>
      <Reveal>
        <TrustRow />
      </Reveal>
      <Reveal>
        <BlogTeaser />
      </Reveal>
      <Reveal>
        <FeaturedOn />
      </Reveal>
    </>
  );
}
