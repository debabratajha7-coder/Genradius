"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatINR } from "@/lib/format";

type OrderView = {
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  trackingUrl?: string;
  awb?: string;
};

export function CheckoutSuccess() {
  const params = useSearchParams();
  const orderId = params.get("order_id") || params.get("order") || "";
  const [order, setOrder] = useState<OrderView | null>(null);
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setError("Missing order id");
      return;
    }
    let alive = true;
    let n = 0;
    const tick = async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order not found");
        if (!alive) return;
        setOrder(data);
        setTries(n);
        const done =
          data.paymentStatus === "paid" ||
          data.paymentMethod === "cod" ||
          data.status === "confirmed" ||
          data.status === "processing" ||
          data.status === "shipped" ||
          data.status === "delivered" ||
          data.paymentStatus === "failed" ||
          data.status === "cancelled";
        if (!done && n < 20) {
          n += 1;
          setTimeout(tick, 2000);
        }
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Could not load order");
      }
    };
    void tick();
    return () => {
      alive = false;
    };
  }, [orderId]);

  const prepaidPending =
    order?.paymentMethod === "prepaid" && order.paymentStatus === "pending";
  const prepaidPaid =
    order?.paymentMethod === "prepaid" && order.paymentStatus === "paid";
  const failed =
    order?.paymentStatus === "failed" || order?.status === "cancelled";
  const cod =
    order?.paymentMethod === "cod" &&
    order.status !== "cancelled" &&
    order.paymentStatus !== "failed";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--moss)] uppercase">
        Genradius
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-heavy)] text-4xl leading-[0.95] tracking-tight uppercase sm:text-5xl">
        {failed
          ? "Payment didn’t go through"
          : prepaidPending
            ? "Confirming payment…"
            : cod
              ? "Order confirmed"
              : prepaidPaid
                ? "Payment received"
                : "Thanks"}
      </h1>
      {error ? (
        <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>
      ) : null}
      {order ? (
        <div className="mt-4 space-y-2 text-sm text-[var(--moss)]">
          <p>
            Order <strong className="text-[var(--ink)]">{order.orderNumber}</strong>
          </p>
          <p>Total {formatINR(order.total)}</p>
          {cod ? (
            <p className="font-semibold text-[var(--ink)]">
              Pay on delivery — Own Your Radius.
            </p>
          ) : null}
          {prepaidPaid ? (
            <p className="font-semibold text-[var(--ink)]">
              We’re packing your drop.
            </p>
          ) : null}
          {prepaidPending ? (
            <p>Checking with the bank… ({tries + 1})</p>
          ) : null}
          {order.trackingUrl ? (
            <p>
              <a href={order.trackingUrl} className="underline" target="_blank" rel="noreferrer">
                Track {order.awb || "shipment"}
              </a>
            </p>
          ) : null}
        </div>
      ) : (
        !error && <p className="mt-4 text-sm text-[var(--moss)]">Loading order…</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-accent px-6 py-3 text-sm">
          Keep shopping
        </Link>
        <Link
          href={`/track-order${orderId ? `?order=${encodeURIComponent(orderId)}` : ""}`}
          className="rounded-2xl border border-[var(--ink)]/12 bg-white px-6 py-3 text-sm font-extrabold uppercase"
        >
          Track order
        </Link>
      </div>
    </div>
  );
}
