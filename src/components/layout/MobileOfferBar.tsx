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
      <div className="pointer-events-auto flex max-w-md items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-[var(--sand)] px-3 py-2 shadow-[3px_3px_0_0_var(--ink)]">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] text-[var(--sand)]">
          %
        </span>
        <p className="min-w-0 flex-1 truncate text-[10px] font-extrabold tracking-wide text-[var(--ink)] uppercase">
          {list[index]}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 px-1 text-xs font-bold text-[var(--ink)]/70"
          aria-label="Dismiss offer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
