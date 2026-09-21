"use client";

import type { ProductReview } from "@/types/catalog";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="tracking-tight text-[var(--sand)]" aria-label={`${rating} stars`}>
      {"★".repeat(Math.min(5, Math.max(0, full)))}
      <span className="text-[var(--border)]">
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
    <section className="mt-10">
      <h2 className="section-title">Customer ratings & reviews</h2>
      <div className="mt-4 grid gap-6 rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[3px_3px_0_0_var(--ink)] sm:grid-cols-[160px_1fr] sm:p-6">
        <div className="text-center sm:border-r-2 sm:border-[var(--ink)] sm:pr-6">
          <p className="text-4xl font-extrabold text-[var(--ink)]">
            {rating.toFixed(1)}
          </p>
          <p className="mt-1 text-lg">
            <Stars rating={rating} />
          </p>
          <p className="mt-2 text-xs font-semibold text-[var(--moss)]">
            Based on {reviewCount || list.length} reviews
          </p>
        </div>
        <div className="space-y-2">
          {buckets.map((b) => (
            <div key={b.star} className="flex items-center gap-2 text-xs">
              <span className="w-10 font-bold">{b.star} ★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-sm border border-[var(--ink)] bg-[var(--surface)]">
                <div
                  className="h-full bg-[var(--sand)]"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-[var(--muted)]">{b.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {list.map((r, i) => (
            <li
              key={`${r.name}-${i}`}
              className="rounded-md border-2 border-[var(--ink)] bg-[var(--background)] p-4 shadow-[2px_2px_0_0_var(--ink)]"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--sand)] text-sm font-extrabold">
                  {(r.name[0] || "G").toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Stars rating={r.rating} />
                    {r.date ? (
                      <span className="text-[10px] font-bold text-[var(--muted)]">
                        {r.date}
                      </span>
                    ) : null}
                    {r.verified ? (
                      <span className="rounded-sm border border-[var(--ink)] bg-[var(--accent-soft)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm font-extrabold">{r.name}</p>
                  {r.body ? (
                    <p className="mt-1 text-sm text-[var(--moss)]">{r.body}</p>
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
