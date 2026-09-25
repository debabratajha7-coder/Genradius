import { AdminGate } from "@/components/admin/AdminGate";
import { SettingsManager } from "@/components/admin/SettingsManager";

export default function AdminSettingsPage() {
  return (
    <AdminGate permission="orders">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Checkout settings
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        Fees, COD toggle, and Shiprocket pickup name. Secrets stay in env.
      </p>
      <div className="mt-6 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]">
        <SettingsManager />
      </div>
    </AdminGate>
  );
}
