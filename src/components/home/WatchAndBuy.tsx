"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ProductLean, ReelLean } from "@/types/catalog";
import { formatINR, discountPercent } from "@/lib/format";
import { slugify } from "@/lib/slug";
import { ComingSoonPopup } from "@/components/ui/ComingSoonPopup";

function LoopingReelVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const play = () => {
      void el.play().catch(() => {});
    };
    play();
    el.addEventListener("canplay", play);
    return () => el.removeEventListener("canplay", play);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster || undefined}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-label={title}
    />
  );
}

export function WatchAndBuy({
  products,
  reels = [],
}: {
  products: ProductLean[];
  reels?: ReelLean[];
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const productFallback = products.slice(0, 8);
  const hasReels = reels.length > 0;
  const empty = !hasReels && !productFallback.length;

  return (
    <section className="relative my-4 overflow-hidden py-10 sm:my-6 sm:py-16">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 15% 20%, #e8f6ff 0%, transparent 45%), radial-gradient(ellipse at 85% 80%, #b9e0f7 0%, transparent 50%), linear-gradient(180deg, #d4eefc 0%, #a8d8f0 55%, #9ecfee 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-white/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-10 bottom-0 h-48 w-48 rounded-full bg-[#7eb8d9]/35 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="section-heading section-heading--solo mb-2 sm:mb-3">
          <h2 className="section-title">Watch and Buy</h2>
        </div>
        <p className="mb-8 text-left text-sm font-medium text-[var(--moss)] lg:text-center">
          {empty
            ? "Reels and looks for this stage are on the way."
            : hasReels
              ? "Instagram drops from the Genradius circle."
              : "Tap a frame — same size cards, deeper stage."}
        </p>

        {empty ? (
          <ComingSoonPopup label="Watch and Buy" />
        ) : (
        <div className="relative rounded-2xl border-2 border-[var(--ink)] bg-white/35 p-3 shadow-[6px_6px_0_0_rgba(42,41,30,0.15)] backdrop-blur-sm sm:p-6 sm:shadow-[8px_8px_0_0_rgba(42,41,30,0.15)]">
          <div
            className="pointer-events-none absolute inset-x-6 bottom-3 h-8 rounded-[100%] bg-[var(--ink)]/10 blur-md"
            aria-hidden
          />

          <button
            type="button"
            onClick={() =>
              scroller.current?.scrollBy({ left: -280, behavior: "smooth" })
            }
            className="absolute top-1/2 left-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] text-lg shadow-[3px_3px_0_0_var(--ink)] sm:left-3 sm:flex"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() =>
              scroller.current?.scrollBy({ left: 280, behavior: "smooth" })
            }
            className="absolute top-1/2 right-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] text-lg shadow-[3px_3px_0_0_var(--ink)] sm:right-3 sm:flex"
            aria-label="Scroll right"
          >
            ›
          </button>

          <div
            ref={scroller}
            className="snap-x-mandatory flex items-stretch gap-3 overflow-x-auto px-1 pb-4 pt-2 scrollbar-none sm:gap-5 sm:px-10"
            style={{ scrollbarWidth: "none" }}
          >
            {hasReels
              ? reels.map((r) => {
                  const productPath = r.productSlug
                    ? `/product/${slugify(r.productSlug) || r.productSlug.trim()}`
                    : "";
                  const href = productPath || r.instagramUrl;
                  const external = !r.productSlug;
                  const hasVideo = Boolean(r.videoUrl);
                  return (
                    <Link
                      key={r._id}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="snap-start group relative w-[min(58vw,200px)] shrink-0 sm:w-[220px]"
                    >
                      <span
                        className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl bg-[#6ba8c9]/50 transition group-hover:translate-x-3 group-hover:translate-y-3"
                        aria-hidden
                      />
                      <span
                        className="absolute inset-0 translate-x-1 translate-y-1 rounded-xl border-2 border-[var(--ink)]/20 bg-[#8fc4e0]/40"
                        aria-hidden
                      />
                      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-[var(--ink)] bg-[var(--background)] shadow-[4px_4px_0_0_var(--ink)] transition group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0_0_var(--ink)]">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#b9e0f7]">
                          {hasVideo ? (
                            <LoopingReelVideo
                              src={r.videoUrl}
                              poster={r.thumbnailUrl || undefined}
                              title={r.title}
                            />
                          ) : r.thumbnailUrl ? (
                            <Image
                              src={r.thumbnailUrl}
                              alt={r.title}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-105"
                              sizes="220px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#c5e8f7] to-[#7eb8d9] p-4 text-center">
                              <span className="font-[family-name:var(--font-logo)] text-sm uppercase text-[var(--ink)]">
                                IG Reel
                              </span>
                            </div>
                          )}
                          {!hasVideo && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--sand)] shadow-[3px_3px_0_0_var(--ink)]">
                                ▶
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="border-t-2 border-[var(--ink)] p-3">
                          <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug">
                            {r.title}
                          </p>
                          <p className="mt-1 text-[10px] font-bold tracking-wider text-[var(--moss)] uppercase">
                            {r.productSlug
                              ? "Shop the look"
                              : hasVideo
                                ? "Open on Instagram"
                                : "Watch on Instagram"}
                          </p>
                        </div>
                      </article>
                    </Link>
                  );
                })
              : productFallback.map((p) => {
                  const off = discountPercent(p.price, p.compareAtPrice);
                  return (
                    <Link
                      key={p._id}
                      href={`/product/${p.slug}`}
                      className="snap-start group relative w-[min(58vw,200px)] shrink-0 sm:w-[220px]"
                    >
                      <span
                        className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl bg-[#6ba8c9]/50"
                        aria-hidden
                      />
                      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-[var(--ink)] bg-[var(--background)] shadow-[4px_4px_0_0_var(--ink)]">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="220px"
                          />
                          {off > 0 && (
                            <span className="absolute top-2 left-2 rounded-md border-2 border-[var(--ink)] bg-[#c5e8f7] px-2 py-0.5 text-[10px] font-bold shadow-[2px_2px_0_0_var(--ink)]">
                              {off}% off
                            </span>
                          )}
                        </div>
                        <div className="border-t-2 border-[var(--ink)] p-3">
                          <p className="line-clamp-2 text-sm font-semibold">
                            {p.title}
                          </p>
                          <div className="mt-2 flex gap-2 text-sm">
                            <span className="font-extrabold">
                              {formatINR(p.price)}
                            </span>
                            <span className="text-[var(--muted)] line-through">
                              {formatINR(p.compareAtPrice)}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
