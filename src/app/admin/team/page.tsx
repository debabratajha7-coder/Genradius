import { AdminGate } from "@/components/admin/AdminGate";
import { TeamManager } from "@/components/admin/TeamManager";
import { adminHasPermission, getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminTeamPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!adminHasPermission(session, "team")) redirect("/admin");

  return (
    <AdminGate permission="team">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Admin team
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--moss)]">
        Create staff accounts, set what each person can manage, and require
        phone OTP on every login after password.
      </p>
      <div className="mt-6">
        <TeamManager />
      </div>
    </AdminGate>
  );
}
