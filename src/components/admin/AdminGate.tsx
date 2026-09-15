import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";

export async function AdminGate({ children }: { children: React.ReactNode }) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
