"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DeleteAccountPanel } from "@/components/auth/DeleteAccountPanel";
import { useCart } from "@/components/cart/CartProvider";
import { FadeIn } from "@/components/motion/Reveal";
import { formatINR } from "@/lib/format";
import { SITE } from "@/lib/site";

const LINKS = [
  {
    id: "orders",
    label: "Orders",
    hint: "Track & reorder",
    href: "#orders",
  },
  {
    id: "bag",
    label: "Bag",
    hint: "Saved items",
    href: "#bag",
  },
  {
    id: "addresses",
    label: "Addresses",
    hint: "Delivery spots",
    href: "/account/addresses",
  },
  {
    id: "wishlist",
    label: "Wishlist",
    hint: "Saved drops",
    href: "#wishlist",
  },
  {
    id: "help",
    label: "Help",
    hint: "FAQs & support",
    href: "#help",
  },
  {
    id: "shop",
    label: "Shop",
    hint: "Browse catalog",
    href: "/shop",
  },
] as const;

const WISHLIST_KEY = "genradius-wishlist-v1";

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const { items, count, subtotal, openCart } = useCart();
  const router = useRouter();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!loading && user && user.profileComplete === false) {
      router.replace("/login?setup=1");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const wishlist = loadJson<unknown[]>(WISHLIST_KEY, []);
    setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
  }, []);

  if (loading || !user || user.profileComplete === false) {
    return (
      <div className="px-4 py-20 text-center text-sm text-[var(--moss)]">
        Loading account…
      </div>
    );
  }

  const tile =
    "flex flex-col gap-1 rounded-md border-2 border-[var(--ink)] bg-[var(--background)] p-4 text-left shadow-[3px_3px_0_0_var(--ink)] transition hover:bg-[var(--accent-soft)] active:translate-x-px active:translate-y-px active:shadow-[2px_2px_0_0_var(--ink)]";

  return (
    <FadeIn className="mx-auto max-w-2xl px-3 py-5 sm:px-4 sm:py-14">
      {/* Profile */}
      <div className="rounded-md border-2 border-[var(--ink)] bg-white p-6 shadow-[6px_6px_0_0_var(--ink)] sm:p-8">
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--moss)] uppercase">
          Your radius
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
          Account
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] px-3 py-1.5 text-xs font-extrabold tracking-wider uppercase shadow-[2px_2px_0_0_var(--ink)]">
            Member
          </span>
          <p className="text-sm">
            Signed in as{" "}
            <span className="font-bold">
              {user.name
                ? user.name
                : user.email ||
                  user.phoneMasked ||
                  user.phone ||
                  "Genradius member"}
            </span>
          </p>
        </div>
        {(user.email || user.phone) && (
          <p className="mt-2 text-xs text-[var(--moss)]">
            {[user.email, user.phoneMasked || user.phone]
              .filter(Boolean)
              .join(" · ")}
            {user.provider ? ` · via ${user.provider}` : ""}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {LINKS.map((item) => {
            if (item.id === "bag") {
              return (
                <button
                  key={item.id}
                  type="button"
                  className={tile}
                  onClick={() => openCart()}
                >
                  <span className="text-xs font-extrabold tracking-[0.14em] uppercase">
                    {item.label}
                    {count > 0 ? ` (${count})` : ""}
                  </span>
                  <span className="text-[11px] text-[var(--moss)]">
                    {count > 0 ? formatINR(subtotal) : item.hint}
                  </span>
                </button>
              );
            }
            if (item.href.startsWith("#")) {
              return (
                <a key={item.id} href={item.href} className={tile}>
                  <span className="text-xs font-extrabold tracking-[0.14em] uppercase">
                    {item.label}
                    {item.id === "wishlist" && wishlistCount > 0
                      ? ` (${wishlistCount})`
                      : ""}
                  </span>
                  <span className="text-[11px] text-[var(--moss)]">
                    {item.hint}
                  </span>
                </a>
              );
            }
            return (
              <Link key={item.id} href={item.href} className={tile}>
                <span className="text-xs font-extrabold tracking-[0.14em] uppercase">
                  {item.label}
                </span>
                <span className="text-[11px] text-[var(--moss)]">
                  {item.hint}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Orders */}
      <section
        id="orders"
        className="mt-6 scroll-mt-24 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)] sm:p-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-wide uppercase">
            Orders
          </h2>
          <span className="text-[10px] font-bold tracking-wider text-[var(--moss)] uppercase">
            0 active
          </span>
        </div>
        <div className="mt-4 rounded-md border border-dashed border-[var(--ink)]/35 bg-[var(--accent-soft)]/50 px-4 py-8 text-center">
          <p className="text-sm font-semibold">No orders yet</p>
          <p className="mt-1 text-xs text-[var(--moss)]">
            When you checkout, tracking and invoices will show up here.
          </p>
          <Link href="/shop" className="btn-accent mt-5 inline-flex px-6 py-2.5 text-xs">
            Start shopping
          </Link>
        </div>
        {items.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 rounded-md border-2 border-[var(--ink)] bg-[var(--sand)]/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              You have <span className="font-bold">{count}</span> item
              {count === 1 ? "" : "s"} in your bag (
              {formatINR(subtotal)}).
            </p>
            <button
              type="button"
              className="btn-accent shrink-0 px-5 py-2.5 text-xs"
              onClick={() => openCart()}
            >
              Open bag
            </button>
          </div>
        )}
      </section>

      {/* Addresses — managed at /account/addresses (server-backed) */}
      <section
        id="addresses"
        className="mt-6 scroll-mt-24 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)] sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-wide uppercase">
            Addresses
          </h2>
          <Link
            href="/account/addresses"
            className="text-[11px] font-extrabold tracking-wider uppercase underline"
          >
            Manage
          </Link>
        </div>
        <p className="mt-3 text-sm text-[var(--moss)]">
          Save delivery spots for faster checkout. Default address prefills the
          bag when you check out.
        </p>
        <Link
          href="/account/addresses"
          className="btn-accent mt-4 inline-flex px-5 py-2.5 text-xs"
        >
          Open addresses
        </Link>
      </section>

      {/* Wishlist */}
      <section
        id="wishlist"
        className="mt-6 scroll-mt-24 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)] sm:p-6"
      >
        <h2 className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-wide uppercase">
          Wishlist
        </h2>
        <p className="mt-3 text-sm text-[var(--moss)]">
          {wishlistCount > 0
            ? `${wishlistCount} saved piece${wishlistCount === 1 ? "" : "s"}.`
            : "Nothing saved yet — heart products from the shop to build your list."}
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-xs font-extrabold tracking-wider uppercase underline"
        >
          Browse drops
        </Link>
      </section>

      {/* Help */}
      <section
        id="help"
        className="mt-6 scroll-mt-24 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)] sm:p-6"
      >
        <h2 className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-wide uppercase">
          Help & support
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link href="/shop" className="font-semibold underline">
              Shipping & delivery
            </Link>
          </li>
          <li>
            <Link href="/shop" className="font-semibold underline">
              Returns & exchanges
            </Link>
          </li>
          <li>
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold underline"
            >
              Email {SITE.email}
            </a>
          </li>
        </ul>
      </section>

      {/* Profile + logout */}
      <section className="mt-6 rounded-md border-2 border-[var(--ink)] bg-[var(--sand)]/35 p-5 shadow-[4px_4px_0_0_var(--ink)] sm:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-wide uppercase">
          Profile
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          {user.name && (
            <div className="flex justify-between gap-4 border-b border-[var(--ink)]/15 pb-2">
              <dt className="text-[var(--moss)]">Name</dt>
              <dd className="font-bold">{user.name}</dd>
            </div>
          )}
          {user.email && (
            <div className="flex justify-between gap-4 border-b border-[var(--ink)]/15 pb-2">
              <dt className="text-[var(--moss)]">Email</dt>
              <dd className="font-bold">{user.email}</dd>
            </div>
          )}
          {user.phone && (
            <div className="flex justify-between gap-4 border-b border-[var(--ink)]/15 pb-2">
              <dt className="text-[var(--moss)]">Phone</dt>
              <dd className="font-bold">{user.phone}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-b border-[var(--ink)]/15 pb-2">
            <dt className="text-[var(--moss)]">Member ID</dt>
            <dd className="font-mono text-xs font-bold">
              {user.id.slice(-8).toUpperCase()}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--moss)]">Login</dt>
            <dd className="font-bold capitalize">
              {user.provider === "google"
                ? "Google"
                : user.provider === "email"
                  ? "Email"
                  : "Phone OTP"}
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="btn-accent flex-1 px-5 py-3 text-center text-sm"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            className="flex-1 rounded-md border-2 border-[var(--ink)] bg-white px-5 py-3 text-sm font-extrabold tracking-wider uppercase shadow-[3px_3px_0_0_var(--ink)]"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            Log out
          </button>
        </div>
      </section>

      <DeleteAccountPanel />
    </FadeIn>
  );
}
