"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { INDIAN_STATES } from "@/lib/india-states";
import { formatINR } from "@/lib/format";

const field =
  "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-3 text-sm shadow-[2px_2px_0_0_var(--ink)] outline-none";

type Settings = {
  freeShippingThreshold: number;
  shippingFee: number;
  codFee: number;
  codEnabled: boolean;
  codOtpRequired: boolean;
};

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">(
    "prepaid",
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [codFee, setCodFee] = useState(0);
  const [courier, setCourier] = useState("");
  const [etd, setEtd] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [codOtp, setCodOtp] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetch("/api/settings")
      .then((r) => r.json())
      .then((s: Settings) => {
        setSettings(s);
        if (!s.codEnabled) setPaymentMethod("prepaid");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.user) return;
        if (data.user.name) setName(data.user.name);
        if (data.user.email) setEmail(data.user.email);
        if (data.user.phone) setPhone(data.user.phone.replace(/^\+91/, ""));
        const addrRes = await fetch("/api/account/addresses");
        if (!addrRes.ok) return;
        const { addresses } = await addrRes.json();
        const def =
          addresses?.find((a: { isDefault?: boolean }) => a.isDefault) ||
          addresses?.[0];
        if (!def) return;
        setName(def.fullName || "");
        setPhone(String(def.phone || "").replace(/^\+91/, ""));
        setAddress(def.line1 || "");
        setLine2(def.line2 || "");
        setCity(def.city || "");
        setState(def.state || "");
        setPincode(def.pincode || "");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!/^\d{6}$/.test(pincode) || !items.length) {
      setShippingFee(null);
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
            paymentMethod,
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
        setShippingFee(Number(data.shippingFee) || 0);
        setCodFee(Number(data.codFee) || 0);
        setCourier(data.courier || "");
        setEtd(data.etd || "");
        if (data.freeShipping) {
          setQuoteNote("Free shipping unlocked — Own Your Radius.");
        } else if (data.remainingForFree > 0) {
          setQuoteNote(
            `Add ${formatINR(data.remainingForFree)} more for free shipping.`,
          );
        } else {
          setQuoteNote("");
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setShippingFee(null);
        setQuoteNote(err instanceof Error ? err.message : "Shipping unavailable");
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [pincode, items, paymentMethod]);

  async function sendCodOtp() {
    setError("");
    setOtpHint("");
    const res = await fetch("/api/checkout/cod-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "OTP failed");
    setOtpHint(data.message || "OTP sent");
  }

  async function pay() {
    setBusy(true);
    setError("");
    try {
      if (paymentMethod === "cod" && settings?.codOtpRequired && !codOtp) {
        await sendCodOtp();
        setBusy(false);
        setError("Enter the OTP we sent, then place the order again.");
        return;
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          line2,
          city,
          state,
          pincode,
          paymentMethod,
          codOtp: paymentMethod === "cod" ? codOtp : undefined,
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
      clearCart();
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

  const total = subtotal + (shippingFee ?? 0) + codFee;

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
          Delivery & payment
        </h1>

        <fieldset className="space-y-2 rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[3px_3px_0_0_var(--ink)]">
          <legend className="px-1 text-xs font-extrabold uppercase">
            Pay how?
          </legend>
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
            <input
              type="radio"
              name="pay"
              checked={paymentMethod === "prepaid"}
              onChange={() => setPaymentMethod("prepaid")}
            />
            Pay online
          </label>
          {settings?.codEnabled ? (
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on delivery
              {settings.codFee > 0 ? (
                <span className="text-xs text-[var(--moss)]">
                  (+{formatINR(settings.codFee)} COD fee)
                </span>
              ) : null}
            </label>
          ) : null}
        </fieldset>

        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Full name
          <input required className={field} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Phone
            <input
              required
              className={field}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile"
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
          Address line 1
          <input required className={field} value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Address line 2 (optional)
          <input className={field} value={line2} onChange={(e) => setLine2(e.target.value)} />
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
              <option value="">Select…</option>
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

        {paymentMethod === "cod" && settings?.codOtpRequired ? (
          <div className="space-y-2 rounded-md border-2 border-[var(--ink)] bg-[var(--sand)]/40 p-3">
            <div className="flex flex-wrap gap-2">
              <input
                className={`${field} max-w-[10rem]`}
                value={codOtp}
                onChange={(e) => setCodOtp(e.target.value)}
                placeholder="COD OTP"
                inputMode="numeric"
              />
              <button
                type="button"
                className="rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-xs font-extrabold uppercase"
                onClick={() => void sendCodOtp().catch((e) => setError(e.message))}
              >
                Send OTP
              </button>
            </div>
            {otpHint ? <p className="text-xs text-[var(--moss)]">{otpHint}</p> : null}
          </div>
        ) : null}
        {paymentMethod === "cod" && settings && !settings.codOtpRequired ? (
          <p className="text-xs text-[var(--moss)]">
            COD without SMS verification (Twilio not configured).
          </p>
        ) : null}

        {quoteNote && <p className="text-xs text-[var(--moss)]">{quoteNote}</p>}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy || shippingFee == null}
          className="btn-accent w-full py-3.5 text-sm"
        >
          {busy
            ? "Processing…"
            : shippingFee == null
              ? "Enter pincode for shipping"
              : paymentMethod === "cod"
                ? `Place COD order · ${formatINR(total)}`
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
              {shippingFee == null
                ? "—"
                : shippingFee === 0
                  ? "Free"
                  : formatINR(shippingFee)}
            </dd>
          </div>
          {codFee > 0 ? (
            <div className="flex justify-between">
              <dt className="text-[var(--moss)]">COD fee</dt>
              <dd className="font-bold">{formatINR(codFee)}</dd>
            </div>
          ) : null}
          {etd && (
            <p className="text-xs text-[var(--moss)]">Estimated delivery {etd}</p>
          )}
          <div className="flex justify-between text-base">
            <dt className="font-extrabold uppercase">Total</dt>
            <dd className="font-extrabold">
              {shippingFee == null ? "—" : formatINR(total)}
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
