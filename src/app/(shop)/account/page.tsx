"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
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
    href: "#addresses",
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

type SavedAddress = {
  id: string;
  label: string;
  line1: string;
  city: string;
  pincode: string;
};

const ADDRESS_KEY = "genradius-addresses-v1";
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
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    line1: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!loading && user && user.profileComplete === false) {
      router.replace("/login?setup=1");
    }
  }, [loading, user, router]);

  useEffect(() => {
    setAddresses(loadJson<SavedAddress[]>(ADDRESS_KEY, []));
    const wishlist = loadJson<unknown[]>(WISHLIST_KEY, []);
    setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
  }, []);

  function saveAddresses(next: SavedAddress[]) {
    setAddresses(next);
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(next));
  }

  function addAddress(e: FormEvent) {
    e.preventDefault();
    if (!form.line1.trim() || !form.city.trim() || !form.pincode.trim()) return;
    const next: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: form.label.trim() || "Home",
      line1: form.line1.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
    };
    saveAddresses([...addresses, next]);
    setForm({ label: "Home", line1: "", city: "", pincode: "" });
    setShowAddressForm(false);
  }

  function removeAddress(id: string) {
    saveAddresses(addresses.filter((a) => a.id !== id));
  }

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
                    {item.id === "addresses" && addresses.length > 0
                      ? ` (${addresses.length})`
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

      {/* Addresses */}
      <section
        id="addresses"
        className="mt-6 scroll-mt-24 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)] sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-wide uppercase">
            Addresses
          </h2>
          <button
            type="button"
            className="text-[11px] font-extrabold tracking-wider uppercase underline"
            onClick={() => setShowAddressForm((v) => !v)}
          >
            {showAddressForm ? "Cancel" : "Add address"}
          </button>
        </div>

        {showAddressForm && (
          <form onSubmit={addAddress} className="mt-4 space-y-3">
            <input
              className="w-full rounded-md border-2 border-[var(--ink)] px-3 py-2.5 text-sm shadow-[2px_2px_0_0_var(--ink)] outline-none"
              placeholder="Label (Home / Work)"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            />
            <input
              required
              className="w-full rounded-md border-2 border-[var(--ink)] px-3 py-2.5 text-sm shadow-[2px_2px_0_0_var(--ink)] outline-none"
              placeholder="Address line"
              value={form.line1}
              onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                className="rounded-md border-2 border-[var(--ink)] px-3 py-2.5 text-sm shadow-[2px_2px_0_0_var(--ink)] outline-none"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
              <input
                required
                inputMode="numeric"
                className="rounded-md border-2 border-[var(--ink)] px-3 py-2.5 text-sm shadow-[2px_2px_0_0_var(--ink)] outline-none"
                placeholder="PIN"
                value={form.pincode}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pincode: e.target.value }))
                }
              />
            </div>
            <button type="submit" className="btn-accent w-full py-2.5 text-xs sm:w-auto sm:px-6">
              Save address
            </button>
          </form>
        )}

        {addresses.length === 0 && !showAddressForm ? (
          <p className="mt-4 text-sm text-[var(--moss)]">
            No saved addresses. Add one for faster checkout.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3"
              >
                <div>
                  <p className="text-xs font-extrabold tracking-wider uppercase">
                    {a.label}
                  </p>
                  <p className="mt-1 text-sm">
                    {a.line1}
                    <br />
                    {a.city} — {a.pincode}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-[10px] font-bold tracking-wider text-[var(--moss)] uppercase underline"
                  onClick={() => removeAddress(a.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
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
