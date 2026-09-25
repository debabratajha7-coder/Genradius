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
    href: "/account/addresses",
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
    <header className="sticky top-0 z-[55] border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-2xl pt-[env(safe-area-inset-top)]">
      {/* Mobile app bar — menu | logo | bag (no search) */}
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 lg:hidden">
        <button
          type="button"
          className="icon-chip h-10 w-10"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="relative block h-3 w-4">
            <span className="absolute top-0 left-0 block h-[1.5px] w-4 bg-current" />
            <span className="absolute top-[5.5px] left-0 block h-[1.5px] w-4 bg-current" />
            <span className="absolute top-[11px] left-0 block h-[1.5px] w-2.5 bg-current" />
          </span>
        </button>

        <div className="flex min-w-0 flex-1 justify-center">
          <BrandLogo />
        </div>

        <button
          type="button"
          onClick={openCart}
          className="icon-chip relative h-10 w-10"
          aria-label="Bag"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8a3 3 0 016 0" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[var(--pop)] px-1 text-[9px] font-extrabold text-[var(--pop-ink)]">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Desktop bar */}
      <div className="mx-auto hidden h-[68px] max-w-[1400px] items-center gap-3 px-6 lg:flex">
        <div className="min-w-0">
          <BrandLogo />
        </div>

        <nav className="ml-8 hidden flex-1 items-center justify-center gap-1 lg:flex">
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
                className={`group relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-extrabold tracking-[0.14em] uppercase transition-colors duration-300 ${
                  item.label === "Sale"
                    ? "text-[var(--ink)]"
                    : "text-[var(--ink)]/80 hover:text-[var(--ink)]"
                } ${openMenu === item.label ? "bg-[var(--ink)] text-white" : "hover:bg-[var(--ink)]/[0.06]"}`}
              >
                {item.label === "Sale" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--pop)] shadow-[0_0_10px_var(--pop)]" />
                ) : null}
                {item.label}
                {item.children.length ? (
                  <span
                    className={`text-[9px] transition-transform duration-300 ${
                      openMenu === item.label ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  >
                    ▾
                  </span>
                ) : null}
              </Link>
              <AnimatePresence>
                {item.children.length > 0 && openMenu === item.label && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.3, ease }}
                    className="absolute top-[calc(100%+8px)] left-0 z-40 min-w-[240px] overflow-hidden rounded-[18px] border border-[var(--border)] bg-white/95 p-2 shadow-[var(--shadow-lift)] backdrop-blur-xl"
                  >
                    <p className="px-3 pt-2 pb-1 text-[9px] font-extrabold tracking-[0.22em] text-[var(--muted)] uppercase">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="group/i flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-[var(--pop)]"
                      >
                        {child.label}
                        <span className="translate-x-0 opacity-0 transition duration-300 group-hover/i:translate-x-0.5 group-hover/i:opacity-100">
                          →
                        </span>
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
          className="ml-auto hidden min-w-0 max-w-[260px] flex-1 items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition focus-within:border-[var(--ink)]/50 focus-within:bg-white lg:flex"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 text-[var(--muted)]"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the drop"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--muted)]"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-2">
          <Link
            href={user ? "/account" : "/login"}
            className="icon-chip h-11 w-11"
            aria-label={user ? "Account" : "Login"}
          >
            <svg
              width="19"
              height="19"
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
            className="btn-ink relative h-11 gap-2 pr-4 pl-4 text-[11px]"
            aria-label="Bag"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
            >
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8a3 3 0 016 0" />
            </svg>
            Bag
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--pop)] px-1.5 text-[10px] font-extrabold text-[var(--pop-ink)]">
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
              className="absolute top-0 left-0 flex h-[100dvh] w-[min(88vw,340px)] flex-col bg-[var(--ink-deep)] text-white shadow-[20px_0_60px_rgba(0,0,0,0.45)]"
              initial={reduce ? false : { x: "-105%" }}
              animate={{ x: 0 }}
              exit={{ x: "-105%" }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
              <div className="orb orb--pop -top-20 -right-20 h-64 w-64 opacity-40" aria-hidden />

              <div className="relative flex shrink-0 items-center justify-between px-4 py-3.5 pt-[max(0.85rem,env(safe-area-inset-top))]">
                <BrandLogo tone="light" href={null} />
                <button
                  type="button"
                  className="icon-chip h-10 w-10 border-white/20 bg-white/10 text-white"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="scrollbar-none relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
                <p className="mt-2 text-xs text-white/60">
                  {user
                    ? `Hi, ${user.name || user.phone || user.email || "there"}`
                    : "Sign in to sync orders & wishlist"}
                </p>

                <nav className="mt-5">
                  <p className="eyebrow eyebrow--bare text-white/45">Shop</p>
                  {NAV.map((item, i) => (
                    <div key={item.label} className="border-b border-white/10">
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className="flex flex-1 items-baseline gap-3 py-3.5 font-[family-name:var(--font-heavy)] text-2xl tracking-wide uppercase"
                          onClick={closeMenu}
                        >
                          <span className="font-[family-name:var(--font-display)] text-[10px] font-extrabold tracking-[0.2em] text-[var(--pop)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {item.label}
                        </Link>
                        {item.children.length > 0 && (
                          <button
                            type="button"
                            className="icon-chip h-9 w-9 border-white/15 bg-transparent text-white"
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
                        {item.children.length > 0 &&
                          expanded === item.label && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease }}
                              className="overflow-hidden pb-2 pl-7"
                            >
                              {item.children.map((c) => (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    className="block py-2 text-sm font-semibold text-white/70 hover:text-[var(--pop)]"
                                    onClick={closeMenu}
                                  >
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>

                <p className="eyebrow eyebrow--bare mt-7 text-white/45">You</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {ACCOUNT_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={user ? link.href : "/login"}
                      onClick={closeMenu}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 transition active:scale-[0.98]"
                    >
                      <span className="block text-[12px] font-extrabold tracking-wide uppercase">
                        {link.label}
                      </span>
                      <span className="block text-[10px] text-white/50">
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
                    className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-left transition active:scale-[0.98]"
                  >
                    <span className="block text-[12px] font-extrabold tracking-wide uppercase">
                      Bag
                    </span>
                    <span className="block text-[10px] text-white/50">
                      {count > 0 ? `${count} items` : "Empty"}
                    </span>
                  </button>
                  <Link
                    href="/track-order"
                    onClick={closeMenu}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 transition active:scale-[0.98]"
                  >
                    <span className="block text-[12px] font-extrabold tracking-wide uppercase">
                      Track
                    </span>
                    <span className="block text-[10px] text-white/50">
                      Order + phone
                    </span>
                  </Link>
                </div>
              </div>

              <div className="relative grid shrink-0 grid-cols-2 gap-2 border-t border-white/10 px-4 py-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
                {user ? (
                  <button
                    type="button"
                    className="btn-light py-3 text-[10px]"
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
                    className="btn-light py-3 text-[10px]"
                    onClick={closeMenu}
                  >
                    Log in
                  </Link>
                )}
                <Link
                  href="/shop"
                  className="btn-accent py-3 text-[10px]"
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
