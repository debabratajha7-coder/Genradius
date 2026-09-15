"use client";

import { useEffect, useState } from "react";

export function PromoTicker({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length);
    }, 3500);
    return () => clearInterval(id);
  }, [texts.length]);

  if (!texts.length) return null;

  const prev = () =>
    setIndex((i) => (i - 1 + texts.length) % texts.length);
  const next = () => setIndex((i) => (i + 1) % texts.length);

  return (
    <div className="relative z-40 bg-[var(--ticker)] text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center gap-4 px-10">
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-lg leading-none opacity-80 hover:opacity-100 sm:left-6"
          aria-label="Previous promo"
        >
          ‹
        </button>
        <p
          key={index}
          className="animate-ticker text-center text-[11px] font-semibold tracking-[0.16em] uppercase sm:text-xs"
        >
          {texts[index]}
        </p>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none opacity-80 hover:opacity-100 sm:right-6"
          aria-label="Next promo"
        >
          ›
        </button>
      </div>
    </div>
  );
}
