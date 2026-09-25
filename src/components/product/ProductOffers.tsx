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
    <div className="bg-grid-dark mt-6 flex gap-4 overflow-hidden rounded-[18px] bg-[var(--ink-deep)] p-4 text-white">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--pop)] text-sm font-black text-[var(--pop-ink)]"
        aria-hidden
      >
        %
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--pop)] uppercase">
          Offer {title ? `· ${title}` : ""}
        </p>
        <p className="mt-1 text-sm font-semibold leading-snug">
          {detail || (price != null ? `Get it at ${formatINR(price)}` : null)}
        </p>
        {detail && price != null ? (
          <p className="mt-1 text-xs font-bold text-white/70">
            Deal price {formatINR(price)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
