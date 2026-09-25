"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { formatINR } from "@/lib/format";

function TrackInner() {
  const params = useSearchParams();
  const [order, setOrder] = useState(params.get("order") || "");
  const [phone, setPhone] = useState("");
  const [data, setData] = useState<{
    orderNumber: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    total: number;
    awb?: string;
    trackingUrl?: string;
    courier?: string;
    items?: { title: string; qty: number; price: number; size: string }[];
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cancelNote, setCancelNote] = useState("");

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError("");
    setCancelNote("");
    try {
      const res = await fetch(
        `/api/track?order=${encodeURIComponent(order)}&phone=${encodeURIComponent(phone)}`,
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Not found");
      setData(json);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Not found");
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!data) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(data.orderNumber)}/cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Cancel failed");
      setCancelNote(json.refundNote || "Cancelled");
      await lookup();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setBusy(false);
    }
  }

  const canCancel =
    data &&
    ["pending_payment", "confirmed", "processing", "pending", "paid"].includes(
      data.status,
    );

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-[family-name:var(--font-heavy)] text-4xl leading-[0.95] tracking-tight uppercase sm:text-5xl">
        Track order
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        Guest or member — use your order number + phone.
      </p>
      <form onSubmit={lookup} className="mt-6 space-y-3">
        <input
          className="w-full rounded-2xl border border-[var(--ink)]/12 px-3 py-3 text-sm"
          placeholder="Order number (GR…)"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          required
        />
        <input
          className="w-full rounded-2xl border border-[var(--ink)]/12 px-3 py-3 text-sm"
          placeholder="Phone used at checkout"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" disabled={busy} className="btn-accent w-full py-3 text-sm">
          {busy ? "…" : "Track"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {cancelNote ? (
        <p className="mt-3 text-sm font-semibold text-[var(--moss)]">{cancelNote}</p>
      ) : null}
      {data ? (
        <div className="mt-8 rounded-2xl border border-[var(--ink)]/12 bg-white p-5">
          <p className="text-xs font-extrabold uppercase text-[var(--moss)]">
            {data.orderNumber}
          </p>
          <p className="mt-1 text-lg font-extrabold uppercase">{data.status}</p>
          <p className="text-sm text-[var(--moss)]">
            {data.paymentMethod} · {data.paymentStatus} · {formatINR(data.total)}
          </p>
          {data.courier ? (
            <p className="mt-2 text-sm">Courier: {data.courier}</p>
          ) : null}
          {data.trackingUrl ? (
            <a
              href={data.trackingUrl}
              className="mt-2 inline-block text-sm font-bold underline"
              target="_blank"
              rel="noreferrer"
            >
              Track AWB {data.awb || ""}
            </a>
          ) : null}
          <ul className="mt-4 space-y-1 text-sm">
            {data.items?.map((i, idx) => (
              <li key={idx}>
                {i.title} · {i.size} × {i.qty}
              </li>
            ))}
          </ul>
          {canCancel ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void cancel()}
              className="mt-5 w-full rounded-2xl border border-[var(--ink)]/12 py-2.5 text-xs font-extrabold uppercase"
            >
              Cancel order
            </button>
          ) : null}
        </div>
      ) : null}
      <Link href="/shop" className="mt-8 inline-block text-sm font-bold underline">
        Back to shop
      </Link>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading…</div>}>
      <TrackInner />
    </Suspense>
  );
}
