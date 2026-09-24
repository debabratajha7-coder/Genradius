"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { INDIAN_STATES } from "@/lib/india-states";
import { formatINR } from "@/lib/format";

const field =
  "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-3 text-sm shadow-[2px_2px_0_0_var(--ink)] outline-none";

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);
  const [courier, setCourier] = useState("");
  const [etd, setEtd] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!/^\d{6}$/.test(pincode) || !items.length) {
      setShipping(null);
      setCourier("");
      setEtd("");
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            pincode,
            items: items.map((i) => ({
              productId: i.productId,
              slug: i.slug,
              size: i.size,
              qty: i.qty,
            })),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No shipping quote");
        setShipping(Number(data.amount) || 0);
        setCourier(data.courier || "");
        setEtd(data.etd || "");
        setQuoteNote("Free shipping on all orders.");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setShipping(null);
        setQuoteNote(err instanceof Error ? err.message : "Shipping unavailable");
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [pincode, items]);

  async function pay() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          city,
          state,
          pincode,
          items: items.map((i) => ({
            productId: i.productId,
            slug: i.slug,
            size: i.size,
            qty: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
          Bag is empty
        </h1>
        <Link href="/shop" className="btn-accent mt-6 inline-flex px-8 py-3 text-sm">
          Shop the drop
        </Link>
      </div>
    );
  }

  const total = subtotal + (shipping ?? 0);

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void pay();
        }}
      >
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--moss)] uppercase">
          Checkout
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
          Delivery details
        </h1>
        <p className="text-sm text-[var(--moss)]">
          We’ll take payment securely, then book Shiprocket delivery to this address.
        </p>

        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Full name
          <input required className={field} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Phone
            <input
              required
              inputMode="tel"
              className={field}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
            />
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Email
            <input
              required
              type="email"
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Address
          <textarea
            required
            rows={3}
            className={field}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House, street, landmark"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            City
            <input required className={field} value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            State
            <select
              required
              className={field}
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Pincode
            <input
              required
              inputMode="numeric"
              maxLength={6}
              className={field}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
        </div>
        {quoteNote && <p className="text-xs text-[var(--moss)]">{quoteNote}</p>}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={busy || shipping == null} className="btn-accent w-full py-3.5 text-sm">
          {busy
            ? "Processing…"
            : shipping == null
              ? "Enter pincode for shipping"
              : `Pay ${formatINR(total)}`}
        </button>
      </form>

      <aside className="h-fit rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]">
        <h2 className="text-sm font-extrabold tracking-wider uppercase">Your bag</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={`${item.productId}-${item.size}`} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded border border-[var(--ink)]">
                <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-[var(--moss)]">
                  {item.size} · Qty {item.qty}
                </p>
              </div>
              <p className="text-sm font-bold">{formatINR(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-[var(--ink)]/15 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--moss)]">Subtotal</dt>
            <dd className="font-bold">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--moss)]">
              Shipping{courier ? ` · ${courier}` : ""}
            </dt>
            <dd className="font-bold">
              {shipping == null
                ? "—"
                : shipping === 0
                  ? "Free"
                  : formatINR(shipping)}
            </dd>
          </div>
          {etd && (
            <p className="text-xs text-[var(--moss)]">Estimated delivery {etd}</p>
          )}
          <div className="flex justify-between text-base">
            <dt className="font-extrabold uppercase">Total</dt>
            <dd className="font-extrabold">
              {shipping == null ? "—" : formatINR(total)}
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
