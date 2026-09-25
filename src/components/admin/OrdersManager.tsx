"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/format";

type OrderRow = {
  _id: string;
  orderNumber: string;
  merchantOrderId: string;
  name: string;
  phone: string;
  city: string;
  pincode: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  courier: string;
  awb: string;
  shiprocketOrderId: string;
};

export function OrdersManager() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function retry(orderNumber: string) {
    setMsg("");
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, retryShiprocket: true }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Retry failed");
    else setMsg(`Shiprocket: ${data.skipped ? "skipped" : "ok"}`);
    await load();
  }

  return (
    <div>
      {msg ? <p className="mb-3 text-sm font-semibold">{msg}</p> : null}
      <div className="overflow-x-auto rounded-md border-2 border-[var(--ink)] bg-white shadow-[4px_4px_0_0_var(--ink)]">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b-2 border-[var(--ink)] text-[10px] font-extrabold tracking-wider uppercase">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Pay</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Fulfillment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-[var(--ink)]/10">
                <td className="px-3 py-2 font-mono text-xs">
                  {o.orderNumber || o.merchantOrderId}
                </td>
                <td className="px-3 py-2">
                  <p className="font-semibold">{o.name}</p>
                  <p className="text-xs text-[var(--moss)]">
                    {o.phone} · {o.city} {o.pincode}
                  </p>
                </td>
                <td className="px-3 py-2 text-xs uppercase">
                  {o.paymentMethod}
                  <br />
                  {o.paymentStatus}
                </td>
                <td className="px-3 py-2 font-bold">{formatINR(o.total)}</td>
                <td className="px-3 py-2 text-xs font-extrabold uppercase">
                  {o.status}
                </td>
                <td className="px-3 py-2 text-xs">
                  {o.shiprocketOrderId ? `SR ${o.shiprocketOrderId}` : "—"}
                  {o.awb ? ` · AWB ${o.awb}` : ""}
                  <button
                    type="button"
                    className="mt-1 block text-[10px] font-extrabold uppercase underline"
                    onClick={() =>
                      void retry(o.orderNumber || o.merchantOrderId)
                    }
                  >
                    Retry Shiprocket
                  </button>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-sm text-[var(--moss)]">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
