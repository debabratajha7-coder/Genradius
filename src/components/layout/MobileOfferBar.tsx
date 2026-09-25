"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "genradius_offer_dismissed";

export function MobileOfferBar({ texts }: { texts: string[] }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const onShop = pathname.startsWith("/shop");
  const list = texts.filter(Boolean);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    setVisible(list.length > 0);
  }, [list.length]);

  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 4200);
    return () => clearInterval(id);
  }, [list.length]);

  if (!visible || !list.length || onShop) return null;

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-3 lg:hidden"
      style={{
        bottom:
          "calc(var(--app-tabbar-h) + env(safe-area-inset-bottom, 0px) + 0.5rem)",
      }}
    >
      <div className="pointer-events-auto flex max-w-md items-center gap-2 rounded-full border border-white/10 bg-[var(--ink-deep)]/95 py-1.5 pr-2 pl-1.5 text-white shadow-[0_12px_30px_rgba(23,22,15,0.35)] backdrop-blur-md">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--pop)] text-[10px] font-black text-[var(--pop-ink)]">
          %
        </span>
        <p className="min-w-0 flex-1 truncate text-[10px] font-bold tracking-[0.16em] uppercase">
          {list[index]}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss offer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
