"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/components/auth/AuthProvider";

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

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const { openCart, count } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setMobileOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/85 shadow-[0_8px_30px_rgba(42,41,30,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
        <button
          type="button"
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] shadow-[2px_2px_0_0_var(--ink)] lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-3.5 w-5">
            <motion.span
              className="absolute left-0 block h-0.5 w-5 bg-[var(--ink)]"
              animate={
                mobileOpen ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }
              }
              transition={{ duration: 0.28, ease }}
            />
            <motion.span
              className="absolute top-[6px] left-0 block h-0.5 w-5 bg-[var(--ink)]"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 block h-0.5 w-5 bg-[var(--ink)]"
              animate={
                mobileOpen ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }
              }
              transition={{ duration: 0.28, ease }}
            />
          </span>
        </button>

        <div className="min-w-0 flex-1 lg:flex-none">
          <BrandLogo />
        </div>

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
              <AnimatePresence>
                {item.children.length > 0 && openMenu === item.label && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.25, ease }}
                    className="absolute top-full left-0 z-40 min-w-[200px] rounded-xl border border-[var(--border)] bg-white py-2 shadow-[var(--shadow-card)]"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-xs font-semibold tracking-wide text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-black"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
            placeholder="Search tees, cargos…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3 lg:ml-0">
          <Link
            href={user ? "/account" : "/login"}
            className="flex h-11 w-11 items-center justify-center text-[var(--ink)]"
            aria-label={user ? "Account" : "Login"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-11 w-11 items-center justify-center"
            aria-label="Bag"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8a3 3 0 016 0" />
            </svg>
            {count > 0 && (
              <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-sm border border-[var(--ink)] bg-[var(--sand)] px-1 text-[10px] font-bold text-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)]">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[var(--ink)]/45 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 z-50 flex h-[100dvh] w-[min(100%,22rem)] flex-col border-r-2 border-[var(--ink)] bg-[var(--background)] shadow-[8px_0_0_0_var(--ink)] lg:hidden"
              initial={reduce ? false : { x: "-105%" }}
              animate={{ x: 0 }}
              exit={{ x: "-105%" }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
                <p className="font-[family-name:var(--font-logo)] text-sm uppercase">
                  Menu
                </p>
                <button
                  type="button"
                  className="text-xs font-extrabold tracking-widest uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  Close
                </button>
              </div>

              <form onSubmit={onSearch} className="border-b border-[var(--border)] px-4 py-3">
                <div className="flex items-center rounded-md border-2 border-[var(--ink)] px-3 py-2.5 shadow-[2px_2px_0_0_var(--ink)]">
                  <span className="mr-2" aria-hidden>
                    ⌕
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    className="w-full bg-transparent text-base outline-none"
                  />
                </div>
              </form>

              <nav className="flex-1 overflow-y-auto px-2 py-3">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={reduce ? false : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease }}
                    className="border-b border-[var(--border)]/70"
                  >
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className="flex-1 px-3 py-3.5 text-sm font-extrabold tracking-[0.14em] uppercase"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                      {item.children.length > 0 && (
                        <button
                          type="button"
                          className="px-3 py-3.5 text-lg"
                          aria-label={`Expand ${item.label}`}
                          onClick={() =>
                            setExpanded((v) =>
                              v === item.label ? null : item.label,
                            )
                          }
                        >
                          {expanded === item.label ? "−" : "+"}
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {item.children.length > 0 && expanded === item.label && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease }}
                          className="overflow-hidden bg-[var(--accent-soft)]/40"
                        >
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                className="block px-5 py-2.5 text-sm text-[var(--moss)]"
                                onClick={() => setMobileOpen(false)}
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </nav>

              <div className="space-y-2 border-t border-[var(--border)] px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Link
                  href={user ? "/account" : "/login"}
                  className="btn-accent flex w-full py-3.5 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {user ? "My account" : "Log in"}
                </Link>
                <button
                  type="button"
                  className="w-full rounded-md border-2 border-[var(--ink)] bg-white py-3 text-xs font-extrabold tracking-wider uppercase shadow-[2px_2px_0_0_var(--ink)]"
                  onClick={() => {
                    setMobileOpen(false);
                    openCart();
                  }}
                >
                  Open bag ({count})
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
