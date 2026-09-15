"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/Reveal";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=80",
    eyebrow: "ATELIER",
    title: "OWN YOUR",
    highlight: "RADIUS",
    href: "/shop?collection=premium",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80",
    eyebrow: "DROP",
    title: "RADIUS RANGE",
    highlight: "LIVE",
    href: "/shop?collection=radius-range",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80",
    eyebrow: "MEMBERS",
    title: "BUY 2 GET",
    highlight: "MORE",
    href: "/shop/sale",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 6200);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative isolate w-full overflow-hidden bg-[var(--ink)]">
      <div className="relative min-h-[78vh] w-full sm:min-h-[85vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease }}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority
              className={`object-cover ${reduce ? "" : "animate-kenburns"}`}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 sm:px-14 sm:pb-20 md:px-20 md:pb-24">
          <FadeIn delay={0.1}>
            <motion.span
              key={`eye-${index}`}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-4 inline-block w-fit -rotate-2 border border-[var(--ink)] bg-[var(--sand)] px-3 py-1 text-[11px] font-extrabold tracking-[0.2em] text-[var(--ink)] uppercase shadow-[3px_3px_0_0_var(--ink)]"
            >
              {slide.eyebrow}
            </motion.span>
          </FadeIn>

          <motion.p
            key={`t-${index}`}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-[0.04em] text-white uppercase sm:text-7xl md:text-8xl"
          >
            {slide.title}
          </motion.p>
          <motion.p
            key={`h-${index}`}
            initial={reduce ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease }}
            className="font-[family-name:var(--font-logo)] text-5xl tracking-wide text-transparent uppercase sm:text-7xl md:text-8xl"
            style={{
              backgroundImage: "linear-gradient(180deg, #be9c7d, #cbcfd0)",
              WebkitBackgroundClip: "text",
            }}
          >
            {slide.highlight}
          </motion.p>

          <motion.div
            key={`cta-${index}`}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link href={slide.href} className="btn-accent px-9 py-3.5 text-sm">
              Shop now
            </Link>
            <Link
              href="/shop"
              className="border border-white/40 px-6 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase backdrop-blur-sm transition hover:bg-white hover:text-[var(--ink)]"
            >
              Explore all
            </Link>
          </motion.div>
          <p className="mt-5 text-[10px] tracking-wide text-white/55">
            Demo catalog live — replace photos from Admin when ready.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
          }
          className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border-2 border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] transition hover:translate-x-0.5 hover:translate-y-[calc(-50%+2px)] sm:left-6"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
          className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border-2 border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] transition hover:-translate-x-0.5 hover:translate-y-[calc(-50%+2px)] sm:right-6"
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full border border-white/40 transition-all duration-500 ${
                i === index ? "w-8 bg-[var(--sand)]" : "w-1.5 bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
