import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";

export default function AdminOrdersPage() {
  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Orders
      </h1>
      <div className="mt-6 rounded-md border-2 border-[var(--ink)] bg-white p-8 shadow-[4px_4px_0_0_var(--ink)]">
        <p className="text-sm font-semibold">Checkout not live yet</p>
        <p className="mt-2 max-w-md text-sm text-[var(--moss)]">
          Cart is still local on the phone. When server checkout ships, orders
          will land here for fulfillment.
        </p>
        <Link
          href="/admin/customers"
          className="btn-accent mt-6 inline-flex px-5 py-3 text-xs"
        >
          View customers
        </Link>
      </div>
    </AdminGate>
  );
}
