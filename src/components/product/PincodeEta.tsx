"use client";

import { useState } from "react";

export function PincodeEta({
  productId,
  slug,
}: {
  productId: string;
  slug: string;
}) {
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    amount: number;
    courier?: string;
    etd?: string;
    fallback?: boolean;
  } | null>(null);

  async function check() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pincode: pin,
          items: [{ productId, slug, size: "M", qty: 1 }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not estimate delivery");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not estimate delivery");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel mt-7 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase">
          Delivery to your pincode
        </p>
        <span className="text-[10px] font-bold tracking-[0.16em] text-[var(--olive)] uppercase">
          Pan-India
        </span>
      </div>
      <form
        className="mt-3 flex items-center gap-1 rounded-full border border-[var(--ink)]/12 bg-[var(--background)] p-1 pl-4 transition focus-within:border-[var(--ink)]/50"
        onSubmit={(e) => {
          e.preventDefault();
          if (!busy && pin.length === 6) void check();
        }}
      >
        <input
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="6-digit pincode"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold tabular-nums outline-none placeholder:font-medium placeholder:text-[var(--muted)]"
          aria-label="Delivery pincode"
        />
        <button
          type="submit"
          disabled={busy || pin.length !== 6}
          className="btn-ink h-10 shrink-0 px-5 text-[11px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Checking…" : "Check"}
        </button>
      </form>
      <div className="mt-3 text-xs">
        {error ? (
          <p className="font-semibold text-red-700">{error}</p>
        ) : result ? (
          <p className="inline-flex flex-wrap items-center gap-2 font-semibold text-[var(--ink)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--pop)]" />
            {result.courier || "Standard"}
            {result.etd ? ` · ETA ${result.etd}` : ""}
            <span className="text-[var(--muted)]">
              · {result.amount > 0 ? `Shipping ₹${result.amount}` : "Free shipping"}
            </span>
          </p>
        ) : (
          <p className="text-[var(--muted)]">
            Dispatch in 24–48h. Metros usually land in 3–6 days.
          </p>
        )}
      </div>
    </div>
  );
}
