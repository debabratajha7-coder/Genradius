"use client";

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
    <section className="relative isolate w-full bg-[var(--background)]">
      {/* Fixed frame — every slide fills the same box so height never jumps */}
      <div className="relative mx-3 mt-2 aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--ink)] sm:mx-4 sm:aspect-[16/9] lg:mx-0 lg:mt-0 lg:aspect-[2/1] lg:rounded-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.image + slide._id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt=""
              className="h-full w-full select-none object-cover object-center"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[55%] bg-gradient-to-t from-black/75 via-black/35 to-transparent sm:h-1/3" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-1 px-3 pb-3 pt-8 sm:gap-1.5 sm:px-10 sm:pb-10 sm:pt-16 md:px-14 md:pb-12 lg:px-20 lg:pb-14">
          {slide.eyebrow ? (
            <FadeIn delay={0.1}>
              <motion.span
                key={`eye-${slide._id}-${index}`}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                className="inline-block w-fit rounded bg-[var(--sand)] px-1.5 py-0.5 text-[8px] leading-none font-extrabold tracking-[0.12em] text-[var(--ink)] uppercase sm:mb-0.5 sm:rounded-md sm:px-2 sm:text-[10px]"
              >
                {slide.eyebrow}
              </motion.span>
            </FadeIn>
          ) : null}

          <motion.p
            key={`t-${slide._id}-${index}`}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.04, ease }}
            className="max-w-[18ch] font-[family-name:var(--font-display)] text-[13px] leading-[1.05] font-extrabold tracking-[0.02em] text-white uppercase sm:max-w-[14ch] sm:text-2xl md:text-3xl lg:text-4xl"
          >
            {slide.title}
          </motion.p>
          {slide.highlight ? (
            <motion.p
              key={`h-${slide._id}-${index}`}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease }}
              className="max-w-[18ch] font-[family-name:var(--font-logo)] text-[13px] leading-[1.05] tracking-wide text-transparent uppercase sm:max-w-[14ch] sm:text-2xl md:text-3xl lg:text-4xl"
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
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease }}
            className="mt-1.5 flex items-center gap-3 sm:mt-3 sm:gap-4"
          >
            <Link
              href={slide.href || "/shop"}
              className="hero-cta pointer-events-auto inline-flex items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] px-3 py-1.5 text-[9px] font-extrabold tracking-[0.14em] text-[var(--ink)] uppercase shadow-[2px_2px_0_0_var(--ink)] sm:px-6 sm:py-2.5 sm:text-xs sm:shadow-[3px_3px_0_0_var(--ink)]"
            >
              {slide.ctaLabel || "Shop now"}
            </Link>
            <Link
              href="/shop"
              className="pointer-events-auto hidden text-[10px] font-bold tracking-[0.16em] text-white/80 uppercase underline-offset-2 hover:text-white hover:underline sm:inline-block"
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
              className="absolute top-1/2 left-2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-white/70 bg-transparent text-white backdrop-blur-[2px] transition hover:bg-white/15 sm:left-6 sm:flex"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % list.length)}
              className="absolute top-1/2 right-2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-white/70 bg-transparent text-white backdrop-blur-[2px] transition hover:bg-white/15 sm:right-6 sm:flex"
              aria-label="Next slide"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6">
              {list.map((s, i) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full border border-white/40 transition-all duration-500 ${
                    i === index
                      ? "w-8 bg-[var(--sand)]"
                      : "w-1.5 bg-white/40"
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
