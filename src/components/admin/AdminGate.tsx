import { redirect } from "next/navigation";
import {
  adminHasPermission,
  getAdminSession,
} from "@/lib/admin-auth";
import { PERMISSION_BY_PATH } from "@/lib/admin-permissions";
import { AdminShell } from "@/components/admin/AdminShell";

export async function AdminGate({
  children,
  permission,
}: {
  children: React.ReactNode;
  /** Optional explicit permission; otherwise inferred from... not available here */
  permission?: string;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  if (
    permission &&
    !adminHasPermission(
      session,
      permission as Parameters<typeof adminHasPermission>[1],
    )
  ) {
    redirect("/admin");
  }

  return (
    <AdminShell
      admin={{
        name: session.name,
        email: session.email,
        role: session.role,
        permissions: session.permissions,
      }}
    >
      {children}
    </AdminShell>
  );
}

/** Helper for pages that know their path permission */
export function permissionForAdminPath(pathname: string) {
  return PERMISSION_BY_PATH[pathname];
}
