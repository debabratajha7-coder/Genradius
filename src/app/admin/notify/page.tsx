import { AdminGate } from "@/components/admin/AdminGate";
import { NotifyManager } from "@/components/admin/NotifyManager";

export default function AdminNotifyPage() {
  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Email drops
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--moss)]">
        Notify footer subscribers and members who shared an email — new drops,
        restocks, lookbooks with attachments via Resend.
      </p>
      <div className="mt-6">
        <NotifyManager />
      </div>
    </AdminGate>
  );
}
