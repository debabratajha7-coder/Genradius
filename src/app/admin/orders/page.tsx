import { AdminGate } from "@/components/admin/AdminGate";
import { OrdersManager } from "@/components/admin/OrdersManager";

export default function AdminOrdersPage() {
  return (
    <AdminGate permission="orders">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Orders
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        Prepaid must be paid before Shiprocket. COD confirms immediately. Retry
        fulfillment if Shiprocket failed after payment.
      </p>
      <div className="mt-6">
        <OrdersManager />
      </div>
    </AdminGate>
  );
}
