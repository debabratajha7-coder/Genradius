import { AdminGate } from "@/components/admin/AdminGate";
import { CustomersManager } from "@/components/admin/CustomersManager";

export default function AdminCustomersPage() {
  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Customers
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        Storefront accounts — phone, email, and Google signups.
      </p>
      <div className="mt-6">
        <CustomersManager />
      </div>
    </AdminGate>
  );
}
