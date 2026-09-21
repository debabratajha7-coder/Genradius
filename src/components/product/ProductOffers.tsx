"use client";

import { formatINR } from "@/lib/format";

export function ProductOffers({
  title,
  detail,
  price,
}: {
  title?: string;
  detail?: string;
  price?: number | null;
}) {
  if (!title && !detail && price == null) return null;

  return (
    <div className="mt-5 rounded-md border-2 border-[var(--ink)] bg-[var(--background)] shadow-[3px_3px_0_0_var(--ink)]">
      <div className="border-b-2 border-[var(--ink)] bg-[var(--sand)] px-3 py-2">
        <p className="text-[10px] font-extrabold tracking-[0.18em] text-[var(--ink)] uppercase">
          Offers
        </p>
      </div>
      <div className="flex gap-3 px-3 py-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--accent-soft)] text-sm font-extrabold"
          aria-hidden
        >
          %
        </span>
        <div className="min-w-0">
          {title ? (
            <p className="text-xs font-extrabold tracking-wide uppercase text-[var(--moss)]">
              {title}
            </p>
          ) : null}
          <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">
            {detail ||
              (price != null ? `Get at ${formatINR(price)}` : null)}
          </p>
          {detail && price != null ? (
            <p className="mt-1 text-xs font-bold text-[var(--moss)]">
              Deal at {formatINR(price)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
