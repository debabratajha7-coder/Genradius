"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatINR } from "@/lib/format";

function ReturnInner() {
  const params = useSearchParams();
  const orderId = params.get("order") || "";
  const { clearCart } = useCart();
  const [status, setStatus] = useState("Checking payment…");
  const [detail, setDetail] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setStatus("Missing order");
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/checkout/status?order=${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        setStatus(data.error || "Could not confirm payment");
        return;
      }
      if (data.status === "paid" || data.status === "shipped") {
        setOk(true);
        clearCart();
        setStatus("Payment received");
        setDetail(
          data.shiprocketOrderId
            ? `Shiprocket order ${data.shiprocketOrderId} is booked. Total ${formatINR(data.total)}.`
            : `Order ${data.merchantOrderId} is paid. Shipping will be booked once Shiprocket is connected.`,
        );
      } else if (data.status === "failed") {
        setStatus("Payment failed");
        setDetail("Nothing was charged. You can try checkout again.");
      } else {
        setStatus("Payment pending");
        setDetail("PhonePe hasn’t confirmed this yet. Refresh in a moment.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, clearCart]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-[family-name:var(--font-heavy)] text-4xl leading-[0.95] tracking-tight uppercase sm:text-5xl">
        {status}
      </h1>
      {detail && <p className="mt-3 text-sm text-[var(--moss)]">{detail}</p>}
      {orderId && (
        <p className="mt-2 font-mono text-xs text-[var(--moss)]">{orderId}</p>
      )}
      <Link
        href={ok ? "/shop" : "/checkout"}
        className="btn-accent mt-8 inline-flex px-8 py-3 text-sm"
      >
        {ok ? "Keep shopping" : "Back to checkout"}
      </Link>
    </div>
  );
}

export function CheckoutReturn() {
  return (
    <Suspense
      fallback={
        <p className="px-4 py-16 text-center text-sm text-[var(--moss)]">
          Checking payment…
        </p>
      }
    >
      <ReturnInner />
    </Suspense>
  );
}
