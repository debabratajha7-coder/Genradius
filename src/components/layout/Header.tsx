"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { BrandLogo } from "@/components/layout/BrandLogo";

const NAV = [
  {
    label: "Radius Range",
    href: "/shop?collection=radius-range",
    children: [
      { label: "Orbit Tees", href: "/shop?collection=orbit" },
      { label: "Premium", href: "/shop?collection=premium" },
      { label: "Sale", href: "/shop/sale" },
    ],
  },
  {
    label: "Top Wear",
    href: "/shop/oversized-tees",
    children: [
      { label: "Oversized Tees", href: "/shop/oversized-tees" },
      { label: "Polos", href: "/shop/polos" },
      { label: "Shirts", href: "/shop/shirts" },
    ],
  },
  {
    label: "Bottom Wear",
    href: "/shop/cargos",
    children: [
      { label: "Cargos", href: "/shop/cargos" },
      { label: "Joggers", href: "/shop/joggers" },
    ],
  },
  { label: "Sale", href: "/shop/sale", children: [] },
  { label: "All Products", href: "/shop", children: [] },
];

export function Header() {
  const { openCart, count } = useCart();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:h-[72px] sm:px-6">
        <button
          type="button"
          className="shrink-0 text-xs font-bold tracking-widest uppercase lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
        >
          Menu
        </button>

        <BrandLogo />

        <nav className="ml-4 hidden flex-1 items-center justify-center gap-5 xl:gap-7 lg:flex">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() =>
                setOpenMenu(item.children.length ? item.label : null)
              }
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-[var(--ink)] transition hover:text-[var(--olive)]"
              >
                {item.label}
              </Link>
              {item.children.length > 0 && openMenu === item.label && (
                <div className="absolute top-full left-0 z-40 min-w-[200px] rounded-xl border border-[var(--border)] bg-white py-2 shadow-[var(--shadow-card)]">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-xs font-semibold tracking-wide text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-black"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <form
          onSubmit={onSearch}
          className="ml-auto hidden min-w-0 max-w-xs flex-1 items-center rounded-md border-2 border-[var(--ink)] bg-[var(--background)] px-3 py-1.5 shadow-[3px_3px_0_0_var(--ink)] md:flex lg:max-w-sm"
        >
          <span className="mr-2 text-[var(--ink)]" aria-hidden>
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Oversized Tees"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </form>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="hidden text-[var(--muted)] sm:block"
            aria-label="Account"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={openCart}
            className="relative"
            aria-label="Bag"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8a3 3 0 016 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-sm border border-[var(--ink)] bg-[var(--sand)] px-1 text-[10px] font-bold text-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)]">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-white px-4 py-4 lg:hidden">
          <form onSubmit={onSearch} className="mb-4 flex rounded-md border-2 border-[var(--ink)] px-3 py-2 shadow-[3px_3px_0_0_var(--ink)]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full text-sm outline-none"
            />
          </form>
          <ul className="space-y-3">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block text-sm font-extrabold tracking-widest uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
