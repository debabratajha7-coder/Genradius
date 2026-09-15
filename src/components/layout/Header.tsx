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

const ACCOUNT_LINKS = [
  {
    label: "Profile",
    href: "/account",
    hint: "Your details",
    icon: "◎",
  },
  {
    label: "Orders",
    href: "/account#orders",
    hint: "Track & reorder",
    icon: "▦",
  },
  {
    label: "Addresses",
    href: "/account#addresses",
    hint: "Delivery spots",
    icon: "⌖",
  },
  {
    label: "Wishlist",
    href: "/account#wishlist",
    hint: "Saved drops",
    icon: "♡",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const { openCart, count } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!mobileOpen) {
      document.body.dataset.menuOpen = "0";
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.menuOpen = "1";
    return () => {
      document.body.style.overflow = prev;
      document.body.dataset.menuOpen = "0";
    };
  }, [mobileOpen]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setMobileOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-[55] border-b border-[var(--border)] bg-[var(--background)]/92 shadow-[0_8px_30px_rgba(42,41,30,0.04)] backdrop-blur-xl pt-[env(safe-area-inset-top)]">
      {/* Mobile app bar — menu | logo | bag (no search) */}
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 lg:hidden">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-[var(--sand)] shadow-[2px_2px_0_0_var(--ink)]"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="relative block h-3 w-4">
            <span className="absolute top-0 left-0 block h-0.5 w-4 bg-[var(--ink)]" />
            <span className="absolute top-[5px] left-0 block h-0.5 w-4 bg-[var(--ink)]" />
            <span className="absolute top-[10px] left-0 block h-0.5 w-3 bg-[var(--ink)]" />
          </span>
        </button>

        <div className="flex min-w-0 flex-1 justify-center">
          <BrandLogo />
        </div>

        <button
          type="button"
          onClick={openCart}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ink)] bg-white shadow-[2px_2px_0_0_var(--ink)]"
          aria-label="Bag"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8a3 3 0 016 0" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-sm border border-[var(--ink)] bg-[var(--sand)] px-1 text-[9px] font-bold">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Desktop bar */}
      <div className="mx-auto hidden h-16 max-w-[1400px] items-center gap-3 px-6 lg:flex">
        <div className="min-w-0">
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
          className="ml-auto hidden min-w-0 max-w-xs flex-1 items-center rounded-md border-2 border-[var(--ink)] bg-[var(--background)] px-3 py-1.5 shadow-[3px_3px_0_0_var(--ink)] lg:flex lg:max-w-sm"
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

        <div className="ml-auto flex shrink-0 items-center gap-3 lg:ml-0">
          <Link
            href={user ? "/account" : "/login"}
            className="flex h-11 w-11 items-center justify-center text-[var(--ink)]"
            aria-label={user ? "Account" : "Login"}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
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
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
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
        {mobileOpen ? (
          <motion.div
            key="mobile-drawer"
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-[var(--ink)]/45"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease }}
              onClick={closeMenu}
            />
            <motion.aside
              className="absolute top-0 left-0 flex h-[100dvh] w-[min(86vw,320px)] flex-col border-r-2 border-[var(--ink)] bg-[var(--background)] shadow-[8px_0_30px_rgba(42,41,30,0.2)]"
              initial={reduce ? false : { x: "-105%" }}
              animate={{ x: 0 }}
              exit={{ x: "-105%" }}
              transition={{ duration: 0.28, ease }}
            >
              <div className="flex shrink-0 items-center justify-between border-b-2 border-[var(--ink)] px-4 py-3.5 pt-[max(0.85rem,env(safe-area-inset-top))]">
                <p className="font-[family-name:var(--font-logo)] text-sm uppercase">
                  Menu
                </p>
                <button
                  type="button"
                  className="rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] px-3 py-1.5 text-[10px] font-extrabold tracking-widest uppercase shadow-[2px_2px_0_0_var(--ink)]"
                  onClick={closeMenu}
                >
                  Close
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="border-b-2 border-[var(--ink)] bg-[var(--sand)] px-3 py-4">
                  <p className="px-1 text-xs text-[var(--moss)]">
                    {user
                      ? `Hi, ${user.name || user.phone || user.email || "there"}`
                      : "Sign in to sync orders & wishlist"}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {ACCOUNT_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={user ? link.href : "/login"}
                        onClick={closeMenu}
                        className="rounded-xl border-2 border-[var(--ink)] bg-white px-3 py-3 shadow-[2px_2px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                      >
                        <span className="text-base" aria-hidden>
                          {link.icon}
                        </span>
                        <span className="mt-1 block text-[12px] font-extrabold tracking-wide uppercase">
                          {link.label}
                        </span>
                        <span className="block text-[10px] text-[var(--moss)]">
                          {link.hint}
                        </span>
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        openCart();
                      }}
                      className="rounded-xl border-2 border-[var(--ink)] bg-white px-3 py-3 text-left shadow-[2px_2px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <span className="text-base" aria-hidden>
                        ▤
                      </span>
                      <span className="mt-1 block text-[12px] font-extrabold tracking-wide uppercase">
                        Bag
                      </span>
                      <span className="block text-[10px] text-[var(--moss)]">
                        {count > 0 ? `${count} items` : "Empty"}
                      </span>
                    </button>
                    <Link
                      href="/shop"
                      onClick={closeMenu}
                      className="rounded-xl border-2 border-[var(--ink)] bg-white px-3 py-3 shadow-[2px_2px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <span className="text-base" aria-hidden>
                        ▦
                      </span>
                      <span className="mt-1 block text-[12px] font-extrabold tracking-wide uppercase">
                        Shop all
                      </span>
                      <span className="block text-[10px] text-[var(--moss)]">
                        Full catalog
                      </span>
                    </Link>
                  </div>
                </div>

                <nav className="px-2 py-2">
                  <p className="px-3 pt-3 pb-1 text-[10px] font-extrabold tracking-[0.16em] text-[var(--moss)] uppercase">
                    Categories
                  </p>
                  {NAV.map((item) => (
                    <div
                      key={item.label}
                      className="border-b border-[var(--border)]/70"
                    >
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className="flex-1 px-3 py-3.5 text-[13px] font-extrabold tracking-[0.12em] uppercase"
                          onClick={closeMenu}
                        >
                          {item.label}
                        </Link>
                        {item.children.length > 0 && (
                          <button
                            type="button"
                            className="min-h-11 min-w-11 px-3 text-lg"
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
                      {item.children.length > 0 &&
                        expanded === item.label && (
                          <ul className="bg-[var(--accent-soft)]/50">
                            {item.children.map((c) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  className="block px-5 py-3 text-sm text-[var(--moss)]"
                                  onClick={closeMenu}
                                >
                                  {c.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  ))}

                  <Link
                    href="/account#help"
                    onClick={closeMenu}
                    className="mt-2 block px-3 py-3.5 text-[13px] font-extrabold tracking-[0.12em] uppercase"
                  >
                    Help &amp; support
                  </Link>
                </nav>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-2 border-t-2 border-[var(--ink)] px-3 py-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
                {user ? (
                  <button
                    type="button"
                    className="rounded-md border-2 border-[var(--ink)] bg-white py-3 text-center text-[10px] font-extrabold tracking-wider uppercase shadow-[2px_2px_0_0_var(--ink)]"
                    onClick={() => {
                      closeMenu();
                      void logout();
                    }}
                  >
                    Log out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="btn-accent py-3 text-center text-[10px]"
                    onClick={closeMenu}
                  >
                    Log in
                  </Link>
                )}
                <Link
                  href="/shop"
                  className={`py-3 text-center text-[10px] font-extrabold tracking-wider uppercase ${
                    user
                      ? "btn-accent"
                      : "rounded-md border-2 border-[var(--ink)] bg-white shadow-[2px_2px_0_0_var(--ink)]"
                  }`}
                  onClick={closeMenu}
                >
                  Shop all
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
