"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ProductLean, ReelLean } from "@/types/catalog";
import { formatINR, discountPercent } from "@/lib/format";
import { slugify } from "@/lib/slug";
import { ComingSoonPopup } from "@/components/ui/ComingSoonPopup";
import { SectionHeading } from "@/components/ui/SectionHeading";

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

function ReelFrame({
  children,
  href,
  external,
  caption,
  meta,
  badge = "Reel",
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  caption: string;
  meta: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group snap-start relative w-[min(62vw,220px)] shrink-0 sm:w-[240px]"
    >
      <article className="relative aspect-[9/16] overflow-hidden rounded-[20px] bg-[var(--ink)] text-white shadow-[0_20px_50px_rgba(23,22,15,0.25)] transition duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_34px_70px_rgba(23,22,15,0.35)] sm:rounded-[24px]">
        {children}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(23,22,15,0.9)] via-[rgba(23,22,15,0.15)] to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-extrabold tracking-[0.18em] uppercase backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--pop)]" />
          {badge}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
          <p className="line-clamp-2 text-[13px] font-semibold leading-snug sm:text-sm">
            {caption}
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.16em] text-[var(--pop)] uppercase">
            {meta}
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </p>
        </div>
      </article>
    </Link>
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
  const hasReels = reels.length > 0;
  // Pad thin reel rows with product frames so the strip always feels full.
  const productFallback = products.slice(0, Math.max(0, 8 - reels.length));
  const empty = !hasReels && !productFallback.length;

  return (
    <section className="relative my-4 overflow-hidden py-10 sm:my-8 sm:py-20">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 bg-[var(--surface)]" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-80" aria-hidden />
      <div
        className="orb orb--pop -top-32 left-[8%] h-[24rem] w-[24rem] -z-10 opacity-70"
        aria-hidden
      />
      <div
        className="orb orb--sand -right-24 bottom-[-10%] h-[28rem] w-[28rem] -z-10 opacity-60 [animation-delay:-7s]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] px-3 sm:px-6">
        <SectionHeading
          index="Watch & buy"
          title={
            <>
              Seen on <em>the feed</em>
            </>
          }
          subtitle={
            empty
              ? "Reels and looks for this stage are on the way."
              : hasReels
                ? "Real fits from the Genradius circle. Tap a reel to shop the look."
                : "Tap a frame to open the product."
          }
          className="mb-0 lg:mb-0"
          actions={
            !empty ? (
              <div className="hidden gap-2 lg:flex">
                <button
                  type="button"
                  onClick={() =>
                    scroller.current?.scrollBy({
                      left: -520,
                      behavior: "smooth",
                    })
                  }
                  className="icon-chip h-11 w-11 text-base"
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    scroller.current?.scrollBy({
                      left: 520,
                      behavior: "smooth",
                    })
                  }
                  className="icon-chip h-11 w-11 text-base"
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
            ) : null
          }
        />

        {empty ? (
          <div className="mt-6">
            <ComingSoonPopup label="Watch and Buy" />
          </div>
        ) : (
          <div
            ref={scroller}
            className="snap-x-mandatory -mx-3 mt-6 flex items-stretch gap-3 overflow-x-auto px-3 pb-6 pt-2 scrollbar-none sm:-mx-6 sm:mt-10 sm:gap-5 sm:px-6"
            style={{ scrollbarWidth: "none" }}
          >
            {hasReels &&
              reels.map((r) => {
                const productPath = r.productSlug
                  ? `/product/${slugify(r.productSlug) || r.productSlug.trim()}`
                  : "";
                const href = productPath || r.instagramUrl;
                const external = !r.productSlug;
                const hasVideo = Boolean(r.videoUrl);
                return (
                  <ReelFrame
                    key={r._id}
                    href={href}
                    external={external}
                    caption={r.title}
                    meta={
                      r.productSlug
                        ? "Shop the look"
                        : hasVideo
                          ? "Open on Instagram"
                          : "Watch on Instagram"
                    }
                  >
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
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="240px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--moss)] to-[var(--ink)] p-4 text-center">
                        <span className="font-[family-name:var(--font-heavy)] text-2xl uppercase text-white/70">
                          IG Reel
                        </span>
                      </div>
                    )}
                    {!hasVideo ? (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[var(--ink)] backdrop-blur transition group-hover:bg-[var(--pop)]">
                          ▶
                        </span>
                      </span>
                    ) : null}
                  </ReelFrame>
                );
              })}
            {productFallback.map((p) => {
              const off = discountPercent(p.price, p.compareAtPrice);
              return (
                <ReelFrame
                  key={p._id}
                  href={`/product/${p.slug}`}
                  caption={p.title}
                  badge="Shop"
                  meta={`${formatINR(p.price)}${off > 0 ? ` · -${off}%` : ""}`}
                >
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="240px"
                  />
                </ReelFrame>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
