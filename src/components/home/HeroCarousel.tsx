"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { HeroSlideLean } from "@/lib/hero-defaults";

const ease = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 6800;

function SplitWords({
  text,
  className,
  delay = 0,
  reduce,
}: {
  text: string;
  className: string;
  delay?: number;
  reduce: boolean | null;
}) {
  const words = text.trim().split(/\s+/);
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden pb-[0.06em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={reduce ? false : { y: "110%", rotate: 3 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.07,
              ease,
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </span>
  );
}

export function HeroCarousel({ slides }: { slides: HeroSlideLean[] }) {
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [isPhone, setIsPhone] = useState(false);
  const reduce = useReducedMotion();
  const list = slides.length > 0 ? slides : [];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const go = useCallback(
    (next: number) => {
      if (!list.length) return;
      setIndex(((next % list.length) + list.length) % list.length);
      setCycle((c) => c + 1);
    },
    [list.length],
  );

  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
      setCycle((c) => c + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [list.length, cycle]);

  useEffect(() => {
    if (index >= list.length) setIndex(0);
  }, [list.length, index]);

  if (!list.length) return null;

  const slide = list[index] ?? list[0];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="relative isolate w-full bg-[var(--ink-deep)] text-white">
      <div className="relative mx-2.5 mt-2 aspect-[4/5] overflow-hidden rounded-[22px] bg-[var(--ink-deep)] sm:mx-4 sm:aspect-[16/10] lg:mx-0 lg:mt-0 lg:aspect-auto lg:h-[min(88vh,860px)] lg:rounded-none">
        {/* Phone: object-contain so the full image shrinks into the frame (no crop). sm+: cover + Ken Burns */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={slide.image + slide._id}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            <motion.img
              src={slide.image}
              alt=""
              draggable={false}
              className="max-h-full max-w-full select-none object-contain object-center sm:h-full sm:w-full sm:max-h-none sm:max-w-none sm:object-cover"
              initial={reduce || isPhone ? false : { scale: 1.14 }}
              animate={{ scale: 1 }}
              transition={
                reduce || isPhone
                  ? { duration: 0 }
                  : {
                      duration: AUTOPLAY_MS / 1000 + 1.5,
                      ease: "linear",
                    }
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Readability + mood layers */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(23,22,15,0.92)] via-[rgba(23,22,15,0.35)] to-[rgba(23,22,15,0.05)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[rgba(23,22,15,0.7)] via-transparent to-transparent" />
        <div className="bg-grid-dark fade-mask-y pointer-events-none absolute inset-0 z-[1] opacity-70" />

        {/* Ghost wordmark */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 top-4 z-[1] select-none font-[family-name:var(--font-heavy)] text-[26vw] leading-none tracking-tight text-outline-light opacity-[0.16] sm:top-2 sm:text-[18vw] lg:right-6 lg:text-[15vw]"
        >
          RADIUS
        </div>

        {/* Top meta */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4 text-[10px] font-extrabold tracking-[0.24em] uppercase text-white/70 sm:px-8 sm:pt-6 lg:px-14">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--pop)] shadow-[0_0_14px_var(--pop)]" />
            New season · Live
          </span>
          <span className="hidden sm:inline">Own your radius</span>
        </div>

        {/* Copy */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-3 px-4 pb-6 sm:gap-4 sm:px-8 sm:pb-10 lg:px-14 lg:pb-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`copy-${slide._id}-${index}`}
              className="flex flex-col items-start gap-3 sm:gap-4"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            >
              {slide.eyebrow ? (
                <motion.span
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-extrabold tracking-[0.22em] uppercase backdrop-blur-md sm:text-[10px]"
                >
                  <span className="h-1 w-1 rounded-full bg-[var(--pop)]" />
                  {slide.eyebrow}
                </motion.span>
              ) : null}

              <h1 className="font-[family-name:var(--font-heavy)] text-[clamp(2.6rem,12vw,4.2rem)] leading-[0.9] tracking-[0.005em] uppercase sm:text-[clamp(3.4rem,8.5vw,7.4rem)]">
                <SplitWords
                  text={slide.title}
                  className="block text-white"
                  delay={0.05}
                  reduce={reduce}
                />
                {slide.highlight ? (
                  <SplitWords
                    text={slide.highlight}
                    className="block text-[var(--pop)]"
                    delay={0.18}
                    reduce={reduce}
                  />
                ) : null}
              </h1>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease }}
                className="mt-1 flex flex-wrap items-center gap-2.5 sm:mt-2 sm:gap-3"
              >
                <Link
                  href={slide.href || "/shop"}
                  className="btn-accent hero-cta px-5 py-3 text-[10px] sm:px-7 sm:py-3.5 sm:text-xs"
                >
                  {slide.ctaLabel || "Shop now"}
                  <span className="btn-arrow" aria-hidden>
                    →
                  </span>
                </Link>
                <Link
                  href="/shop"
                  className="btn-light hero-cta px-5 py-3 text-[10px] sm:px-6 sm:py-3.5 sm:text-xs"
                >
                  Explore all
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        {list.length > 1 ? (
          <div className="absolute right-4 bottom-6 z-20 hidden flex-col items-end gap-4 sm:right-8 sm:bottom-10 sm:flex lg:right-14 lg:bottom-16">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                className="icon-chip h-11 w-11 border-white/25 bg-white/10 text-white hover:bg-white hover:text-[var(--ink)]"
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="icon-chip h-11 w-11 border-white/25 bg-white/10 text-white hover:bg-white hover:text-[var(--ink)]"
                aria-label="Next slide"
              >
                →
              </button>
            </div>
            <div className="flex items-center gap-3 font-[family-name:var(--font-display)] text-xs font-extrabold tracking-[0.2em] text-white/80">
              <span className="text-[var(--pop)]">{pad(index + 1)}</span>
              <span className="relative h-px w-24 overflow-hidden bg-white/25">
                <span
                  key={`${index}-${cycle}`}
                  className="absolute inset-0 origin-left bg-[var(--pop)]"
                  style={{
                    animation: reduce
                      ? "none"
                      : `progress ${AUTOPLAY_MS}ms linear forwards`,
                  }}
                />
              </span>
              <span>{pad(list.length)}</span>
            </div>
          </div>
        ) : null}

        {list.length > 1 ? (
          <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:hidden">
            {list.map((s, i) => (
              <button
                key={s._id}
                type="button"
                onClick={() => go(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-7 bg-[var(--pop)]" : "w-1.5 bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
