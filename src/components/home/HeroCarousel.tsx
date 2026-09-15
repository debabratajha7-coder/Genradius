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
    <section className="relative isolate w-full bg-[var(--background)] lg:overflow-hidden lg:bg-[var(--ink)]">
      <div className="mx-3 mt-2 overflow-hidden rounded-2xl bg-[var(--ink)] sm:mx-4 lg:mx-0 lg:mt-0 lg:rounded-none">
        <div className="relative aspect-[5/6] w-full max-h-[520px] min-h-[38dvh] sm:aspect-[16/10] sm:max-h-none sm:min-h-[48vh] lg:aspect-auto lg:min-h-[70vh]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent lg:bg-gradient-to-r lg:from-black/55 lg:via-black/20 lg:to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 sm:px-10 sm:pb-12 md:px-14 md:pb-14 lg:px-20 lg:pb-16">
            {slide.eyebrow ? (
              <FadeIn delay={0.1}>
                <motion.span
                  key={`eye-${slide._id}-${index}`}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="mb-1.5 inline-block w-fit rounded-md bg-[var(--sand)] px-2 py-0.5 text-[9px] font-extrabold tracking-[0.14em] text-[var(--ink)] uppercase sm:mb-2 sm:text-[10px]"
                >
                  {slide.eyebrow}
                </motion.span>
              </FadeIn>
            ) : null}

            <motion.p
              key={`t-${slide._id}-${index}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.06, ease }}
              className="max-w-[14ch] font-[family-name:var(--font-display)] text-lg leading-[1.1] font-extrabold tracking-[0.03em] text-white uppercase sm:text-2xl md:text-3xl lg:text-4xl"
            >
              {slide.title}
            </motion.p>
            {slide.highlight ? (
              <motion.p
                key={`h-${slide._id}-${index}`}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease }}
                className="max-w-[14ch] font-[family-name:var(--font-logo)] text-lg leading-[1.1] tracking-wide text-transparent uppercase sm:text-2xl md:text-3xl lg:text-4xl"
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
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease }}
              className="mt-3 flex w-full max-w-sm flex-col gap-2 sm:mt-4 sm:max-w-none sm:flex-row sm:items-center sm:gap-3"
            >
              <Link
                href={slide.href || "/shop"}
                className="btn-accent w-fit rounded-md px-4 py-2 text-[10px] sm:px-6 sm:py-2.5 sm:text-xs"
              >
                {slide.ctaLabel || "Shop now"}
              </Link>
              <Link
                href="/shop"
                className="hidden text-[10px] font-bold tracking-[0.16em] text-white/80 uppercase underline-offset-2 hover:text-white hover:underline sm:inline-block"
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

              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
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
      </div>
    </section>
  );
}
