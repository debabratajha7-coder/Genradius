import { HeroCarousel } from "@/components/home/HeroCarousel";
import { UspMarquee } from "@/components/home/UspMarquee";
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
import { getHomeMedia } from "@/lib/home-media";
import { getCheckoutSettings } from "@/lib/site-settings";

export default async function HomePage() {
  const [
    categories,
    bestsellers,
    centreStage,
    newArrivals,
    watch,
    reels,
    heroSlides,
    homeMedia,
    settings,
  ] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 12 }),
    getProducts({ collection: "premium", limit: 10 }),
    getProducts({ collection: "radius-range", limit: 10 }),
    getProducts({ collection: "watch-buy", limit: 10 }),
    getActiveReels(12),
    getHeroSlides(),
    getHomeMedia(),
    getCheckoutSettings().catch(() => null),
  ]);

  const freeShippingThreshold = settings?.freeShippingThreshold ?? 1000;
  const codEnabled = settings?.codEnabled ?? true;

  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <UspMarquee
        freeShippingThreshold={freeShippingThreshold}
        codEnabled={codEnabled}
      />

      <Reveal>
        <TopCategories categories={categories} />
      </Reveal>

      <ProductCarousel
        index="02 — Bestsellers"
        title="Our Bestsellers"
        heading={
          <>
            What the circle <em>keeps buying</em>
          </>
        }
        subtitle="Proven fits, restocked on repeat. If you're new here, start with these."
        products={bestsellers}
        ctaLabel="See all bestsellers"
        ctaHref="/shop"
      />

      <Reveal>
        <WatchAndBuy
          products={watch.length ? watch : bestsellers}
          reels={reels}
        />
      </Reveal>

      <ProductCarousel
        index="03 — Premium"
        title="Centre Stage Collection"
        heading={
          <>
            Centre <em>stage</em>
          </>
        }
        subtitle="Heavier fabrics, cleaner graphics. The pieces you build a look around."
        products={centreStage}
        ctaLabel="Explore premium"
        ctaHref="/shop?collection=premium"
      />

      <Reveal>
        <CollectionStrip tiles={homeMedia.collections} />
      </Reveal>

      <ProductCarousel
        index="05 — Just landed"
        title="New Arrivals"
        heading={
          <>
            Fresh off the <em>press</em>
          </>
        }
        subtitle="The latest drop from the Radius Range. Sizes go fast."
        products={newArrivals}
        ctaLabel="See new arrivals"
        ctaHref="/shop?collection=radius-range"
      />

      <RadiusBand media={homeMedia} />

      <Reveal>
        <TrustRow
          freeShippingThreshold={freeShippingThreshold}
          codEnabled={codEnabled}
        />
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
