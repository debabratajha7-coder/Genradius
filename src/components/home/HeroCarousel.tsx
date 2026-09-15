"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1800&q=80",
    eyebrow: "SALE",
    title: "BUY 2 GET 1",
    highlight: "FREE",
    href: "/shop/sale",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1800&q=80",
    eyebrow: "DROP",
    title: "RADIUS RANGE",
    highlight: "LIVE",
    href: "/shop?collection=radius-range",
  },
  {
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1800&q=80",
    eyebrow: "PREMIUM",
    title: "OWN YOUR",
    highlight: "RADIUS",
    href: "/shop?collection=premium",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative isolate w-full overflow-hidden bg-black">
      <div className="relative aspect-[16/9] min-h-[320px] w-full sm:min-h-[420px] md:aspect-[21/9] md:min-h-[480px]">
        {SLIDES.map((s, i) => (
          <Image
            key={s.image}
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            sizes="100vw"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14 md:px-20">
          <span className="mb-2 inline-block w-fit -rotate-2 bg-[var(--sand)] px-3 py-1 text-xs font-extrabold tracking-widest text-[var(--ink)] uppercase">
            {slide.eyebrow}
          </span>
          <p className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-wide text-white uppercase sm:text-6xl md:text-7xl">
            {slide.title}
          </p>
          <p
            className="font-[family-name:var(--font-logo)] text-5xl tracking-wide text-transparent uppercase sm:text-7xl md:text-8xl"
            style={{
              backgroundImage: "linear-gradient(180deg, #be9c7d, #cbcfd0)",
              WebkitBackgroundClip: "text",
            }}
          >
            {slide.highlight}
          </p>
          <Link
            href={slide.href}
            className="btn-accent mt-6 w-fit px-8 py-3 text-sm"
          >
            Shop now
          </Link>
          <p className="mt-4 text-[10px] text-white/70">
            * Offers apply on select styles. T&amp;C apply.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
          }
          className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] sm:left-6"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
          className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] sm:right-6"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-sm border border-[var(--ink)] ${
              i === index ? "bg-[var(--sand)]" : "bg-[var(--silver)]"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
