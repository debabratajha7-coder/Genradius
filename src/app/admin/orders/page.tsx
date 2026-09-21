import { AdminGate } from "@/components/admin/AdminGate";
import { listOrders } from "@/lib/orders";
import { formatINR } from "@/lib/format";

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  try {
    orders = await listOrders();
  } catch {
    orders = [];
  }

  return (
    <AdminGate permission="orders">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Orders
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        Paid orders are sent to Shiprocket. Pending means PhonePe hasn’t confirmed yet.
      </p>
      <div className="mt-6 overflow-x-auto rounded-md border-2 border-[var(--ink)] bg-white shadow-[4px_4px_0_0_var(--ink)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b-2 border-[var(--ink)] text-[10px] font-extrabold tracking-wider uppercase">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Ship to</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-[var(--ink)]/10">
                <td className="px-3 py-2 font-mono text-xs">{o.merchantOrderId}</td>
                <td className="px-3 py-2">
                  <p className="font-semibold">{o.name}</p>
                  <p className="text-xs text-[var(--moss)]">{o.phone}</p>
                </td>
                <td className="px-3 py-2 text-xs">
                  {o.city} {o.pincode}
                  {o.courier ? ` · ${o.courier}` : ""}
                </td>
                <td className="px-3 py-2 font-bold">{formatINR(o.total)}</td>
                <td className="px-3 py-2 text-xs font-extrabold uppercase">
                  {o.status}
                  {o.shiprocketOrderId ? ` · SR ${o.shiprocketOrderId}` : ""}
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-sm text-[var(--moss)]">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminGate>
  );
}
