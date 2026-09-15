import { connectDB, useMemoryCatalog } from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";
import {
  DEFAULT_HERO_SLIDES,
  type HeroSlideLean,
} from "@/lib/hero-defaults";

const MEMORY = globalThis as unknown as {
  __genradiusHero?: HeroSlideLean[];
};

function memorySlides(): HeroSlideLean[] {
  if (!MEMORY.__genradiusHero) {
    MEMORY.__genradiusHero = DEFAULT_HERO_SLIDES.map((s, i) => ({
      ...s,
      _id: `mem-hero-${i}`,
    }));
  }
  return MEMORY.__genradiusHero;
}

function mapDoc(r: {
  _id: { toString(): string } | string;
  image: string;
  eyebrow?: string | null;
  title: string;
  highlight?: string | null;
  href?: string | null;
  ctaLabel?: string | null;
  active?: boolean | null;
  order?: number | null;
}): HeroSlideLean {
  return {
    _id: String(r._id),
    image: r.image,
    eyebrow: r.eyebrow || "",
    title: r.title,
    highlight: r.highlight || "",
    href: r.href || "/shop",
    ctaLabel: r.ctaLabel || "Shop now",
    active: r.active !== false,
    order: r.order ?? 0,
  };
}

/** Active slides for the storefront hero. Falls back to defaults. */
export async function getHeroSlides(): Promise<HeroSlideLean[]> {
  if (useMemoryCatalog()) {
    return memorySlides()
      .filter((s) => s.active)
      .sort((a, b) => a.order - b.order);
  }

  try {
    await connectDB();
    const count = await HeroSlide.countDocuments();
    if (count === 0) {
      await HeroSlide.insertMany(DEFAULT_HERO_SLIDES);
    }
    const rows = await HeroSlide.find({ active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    if (!rows.length) {
      return DEFAULT_HERO_SLIDES.map((s, i) => ({
        ...s,
        _id: `default-${i}`,
      }));
    }
    return rows.map(mapDoc);
  } catch {
    return DEFAULT_HERO_SLIDES.map((s, i) => ({
      ...s,
      _id: `default-${i}`,
    }));
  }
}

/** All slides for admin (including inactive). */
export async function getAllHeroSlidesAdmin(): Promise<HeroSlideLean[]> {
  if (useMemoryCatalog()) {
    return [...memorySlides()].sort((a, b) => a.order - b.order);
  }

  await connectDB();
  const count = await HeroSlide.countDocuments();
  if (count === 0) {
    await HeroSlide.insertMany(DEFAULT_HERO_SLIDES);
  }
  const rows = await HeroSlide.find().sort({ order: 1, createdAt: 1 }).lean();
  return rows.map(mapDoc);
}

export async function createHeroSlide(input: {
  image: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  href?: string;
  ctaLabel?: string;
  order?: number;
}): Promise<HeroSlideLean> {
  if (useMemoryCatalog()) {
    const store = memorySlides();
    const slide: HeroSlideLean = {
      _id: `mem-hero-${Date.now()}`,
      image: input.image,
      eyebrow: input.eyebrow || "DROP",
      title: input.title,
      highlight: input.highlight || "",
      href: input.href || "/shop",
      ctaLabel: input.ctaLabel || "Shop now",
      active: true,
      order: input.order ?? store.length,
    };
    store.push(slide);
    return slide;
  }

  await connectDB();
  const doc = await HeroSlide.create({
    image: input.image,
    eyebrow: input.eyebrow || "DROP",
    title: input.title,
    highlight: input.highlight || "",
    href: input.href || "/shop",
    ctaLabel: input.ctaLabel || "Shop now",
    order: input.order ?? 0,
    active: true,
  });
  return mapDoc(doc);
}

export async function updateHeroSlide(
  id: string,
  patch: Partial<{
    image: string;
    eyebrow: string;
    title: string;
    highlight: string;
    href: string;
    ctaLabel: string;
    active: boolean;
    order: number;
  }>,
): Promise<HeroSlideLean | null> {
  if (useMemoryCatalog()) {
    const store = memorySlides();
    const idx = store.findIndex((s) => s._id === id);
    if (idx < 0) return null;
    store[idx] = { ...store[idx], ...patch };
    return store[idx];
  }

  await connectDB();
  const doc = await HeroSlide.findByIdAndUpdate(id, { $set: patch }, { new: true });
  return doc ? mapDoc(doc) : null;
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  if (useMemoryCatalog()) {
    const store = memorySlides();
    const next = store.filter((s) => s._id !== id);
    if (next.length === store.length) return false;
    MEMORY.__genradiusHero = next;
    return true;
  }

  await connectDB();
  const res = await HeroSlide.findByIdAndDelete(id);
  return Boolean(res);
}
