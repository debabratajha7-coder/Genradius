"use client";

import type { ProductReview } from "@/types/catalog";

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  const full = Math.round(rating);
  return (
    <span className={`tracking-tight ${className}`} aria-label={`${rating} stars`}>
      <span className="text-[var(--ink)]">
        {"★".repeat(Math.min(5, Math.max(0, full)))}
      </span>
      <span className="text-[var(--ink)]/15">
        {"★".repeat(Math.max(0, 5 - full))}
      </span>
    </span>
  );
}

export function ProductReviews({
  rating,
  reviewCount,
  reviews,
}: {
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
}) {
  const list = reviews ?? [];
  if (reviewCount <= 0 && list.length === 0) return null;

  const buckets = [5, 4, 3, 2, 1].map((star) => {
    const count = list.filter((r) => Math.round(r.rating) === star).length;
    const pct = list.length ? Math.round((count / list.length) * 100) : 0;
    return { star, pct };
  });

  return (
    <section className="mt-12">
      <span className="section-index">Reviews</span>
      <h2 className="section-title">
        From the <em>circle</em>
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-[220px_1fr]">
        <div className="bg-grid-dark flex flex-col justify-between rounded-[22px] bg-[var(--ink-deep)] p-6 text-white">
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
            Average rating
          </p>
          <div>
            <p className="font-[family-name:var(--font-heavy)] text-6xl leading-none">
              {rating.toFixed(1)}
            </p>
            <p className="mt-2 text-lg">
              <Stars rating={rating} className="[&>span:first-child]:text-[var(--pop)] [&>span:last-child]:text-white/20" />
            </p>
            <p className="mt-2 text-xs text-white/60">
              Based on {reviewCount || list.length} reviews
            </p>
          </div>
        </div>
        <div className="panel space-y-3 p-5 sm:p-6">
          {buckets.map((b) => (
            <div key={b.star} className="flex items-center gap-3 text-xs">
              <span className="w-8 font-bold tabular-nums">{b.star} ★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--ink)]/8">
                <div
                  className="h-full rounded-full bg-[var(--ink)] transition-[width] duration-700"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-[var(--muted)] tabular-nums">
                {b.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {list.map((r, i) => (
            <li key={`${r.name}-${i}`} className="panel p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-sm font-black text-[var(--pop)]">
                  {(r.name[0] || "G").toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Stars rating={r.rating} className="text-sm" />
                    {r.date ? (
                      <span className="text-[10px] font-bold text-[var(--muted)]">
                        {r.date}
                      </span>
                    ) : null}
                    {r.verified ? (
                      <span className="rounded-full bg-[var(--pop)] px-2 py-0.5 text-[9px] font-black tracking-wide text-[var(--pop-ink)] uppercase">
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm font-bold">{r.name}</p>
                  {r.body ? (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--moss)]">
                      {r.body}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
