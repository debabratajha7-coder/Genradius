"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";

const TABS = [
  {
    id: "home",
    label: "Home",
    href: "/",
    match: (p: string) => p === "/",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
      </svg>
    ),
  },
  {
    id: "shop",
    label: "Shop",
    href: "/shop",
    match: (p: string) => p.startsWith("/shop") || p.startsWith("/product"),
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
        <path d="M4 7h16l-1.2 12.2A2 2 0 0 1 16.8 21H7.2a2 2 0 0 1-2-1.8L4 7z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
  {
    id: "bag",
    label: "Bag",
    href: "#bag",
    match: () => false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
        <path d="M6 8h12l-1 12H7L6 8z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "You",
    href: "/account",
    match: (p: string) => p.startsWith("/account") || p.startsWith("/login"),
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19c1.4-3.2 3.8-4.8 7-4.8s5.6 1.6 7 4.8" />
      </svg>
    ),
  },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();
  const { openCart, count } = useCart();
  const { user } = useAuth();

  return (
    <nav
      className="app-tabbar fixed inset-x-0 bottom-0 z-[45] border-t-2 border-[var(--ink)] bg-[var(--background)]/95 shadow-[0_-8px_30px_rgba(42,41,30,0.08)] backdrop-blur-xl md:hidden"
      aria-label="App navigation"
    >
      <div className="mx-auto grid h-[var(--app-tabbar-h)] max-w-lg grid-cols-4 px-1">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const accountHref = user ? "/account" : "/login";
          const href = tab.id === "account" ? accountHref : tab.href;

          if (tab.id === "bag") {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={openCart}
                className={`relative flex flex-col items-center justify-center gap-0.5 ${
                  active ? "text-[var(--ink)]" : "text-[var(--moss)]"
                }`}
              >
                <span className="relative">
                  {tab.icon(active)}
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-sm border border-[var(--ink)] bg-[var(--sand)] px-1 text-[9px] font-extrabold text-[var(--ink)]">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-extrabold tracking-wider uppercase">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={tab.id}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-0.5 ${
                active ? "text-[var(--ink)]" : "text-[var(--moss)]"
              }`}
            >
              {active && (
                <span
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-[var(--sand)]"
                  aria-hidden
                />
              )}
              {tab.icon(active)}
              <span className="text-[10px] font-extrabold tracking-wider uppercase">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
