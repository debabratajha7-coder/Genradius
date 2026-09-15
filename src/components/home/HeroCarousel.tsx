"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/Reveal";
import type { HeroSlideLean } from "@/lib/hero-defaults";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroCarousel({ slides }: { slides: HeroSlideLean[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const list = slides.length > 0 ? slides : [];

  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 6200);
    return () => clearInterval(id);
  }, [list.length]);

  useEffect(() => {
    if (index >= list.length) setIndex(0);
  }, [list.length, index]);

  if (!list.length) return null;

  const slide = list[index] ?? list[0];

  return (
    <section className="relative isolate w-full overflow-hidden bg-[var(--ink)]">
      <div className="relative min-h-[58dvh] w-full sm:min-h-[75vh] lg:min-h-[85vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image + slide._id}
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

        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-14 sm:px-14 sm:pb-20 md:px-20 md:pb-24">
          <FadeIn delay={0.1}>
            <motion.span
              key={`eye-${slide._id}-${index}`}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-3 inline-block w-fit -rotate-2 border border-[var(--ink)] bg-[var(--sand)] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.2em] text-[var(--ink)] uppercase shadow-[3px_3px_0_0_var(--ink)] sm:mb-4 sm:px-3 sm:text-[11px]"
            >
              {slide.eyebrow}
            </motion.span>
          </FadeIn>

          <motion.p
            key={`t-${slide._id}-${index}`}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="font-[family-name:var(--font-display)] text-[2.15rem] leading-[0.95] font-extrabold tracking-[0.04em] text-white uppercase sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {slide.title}
          </motion.p>
          {slide.highlight ? (
            <motion.p
              key={`h-${slide._id}-${index}`}
              initial={reduce ? false : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.16, ease }}
              className="font-[family-name:var(--font-logo)] text-[2.15rem] leading-[0.95] tracking-wide text-transparent uppercase sm:text-6xl md:text-7xl lg:text-8xl"
              style={{
                backgroundImage: "linear-gradient(180deg, #be9c7d, #cbcfd0)",
                WebkitBackgroundClip: "text",
              }}
            >
              {slide.highlight}
            </motion.p>
          ) : null}

          <motion.div
            key={`cta-${slide._id}-${index}`}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
            className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <Link
              href={slide.href || "/shop"}
              className="btn-accent w-full px-8 py-3.5 text-sm sm:w-auto sm:px-9"
            >
              {slide.ctaLabel || "Shop now"}
            </Link>
            <Link
              href="/shop"
              className="border border-white/40 px-6 py-3 text-center text-xs font-bold tracking-[0.18em] text-white uppercase backdrop-blur-sm transition hover:bg-white hover:text-[var(--ink)] sm:text-left"
            >
              Explore all
            </Link>
          </motion.div>
        </div>

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setIndex((i) => (i - 1 + list.length) % list.length)
              }
              className="absolute top-1/2 left-2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border-2 border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] transition hover:translate-x-0.5 hover:translate-y-[calc(-50%+2px)] sm:left-6 sm:flex"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % list.length)}
              className="absolute top-1/2 right-2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border-2 border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] transition hover:-translate-x-0.5 hover:translate-y-[calc(-50%+2px)] sm:right-6 sm:flex"
              aria-label="Next slide"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
              {list.map((s, i) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full border border-white/40 transition-all duration-500 ${
                    i === index ? "w-8 bg-[var(--sand)]" : "w-1.5 bg-white/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
