"use client";

import { useState } from "react";
import { formatINR } from "@/lib/format";

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
    <div className="mt-5 rounded-md border-2 border-[var(--ink)] bg-white p-3 shadow-[3px_3px_0_0_var(--ink)]">
      <p className="text-[10px] font-extrabold tracking-[0.16em] text-[var(--muted)] uppercase">
        Delivery details
      </p>
      <div className="mt-2 flex gap-2">
        <input
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter pincode"
          className="min-w-0 flex-1 rounded-md border-2 border-[var(--ink)] bg-[var(--background)] px-3 py-2.5 text-sm shadow-[2px_2px_0_0_var(--ink)]"
          aria-label="Delivery pincode"
        />
        <button
          type="button"
          disabled={busy || pin.length !== 6}
          onClick={check}
          className="btn-accent shrink-0 px-4 py-2 text-xs disabled:opacity-50"
        >
          {busy ? "…" : "Check"}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-xs font-semibold text-red-700">{error}</p>
      ) : null}
      {result ? (
        <p className="mt-2 text-sm text-[var(--moss)]">
          {result.fallback
            ? `Ships via Standard — estimate ${formatINR(result.amount)} (confirm at checkout).`
            : `${result.courier || "Courier"} · ${
                result.etd ? `ETA ${result.etd} · ` : ""
              }${formatINR(result.amount)}`}
        </p>
      ) : (
        <p className="mt-2 text-xs text-[var(--muted)]">
          Enter pincode to estimate delivery.
        </p>
      )}
    </div>
  );
}
