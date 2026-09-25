"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  PERMISSION_BY_PATH,
  type AdminPermissionId,
} from "@/lib/admin-permissions";

const GROUPS: {
  title: string;
  links: { href: string; label: string }[];
}[] = [
  {
    title: "Overview",
    links: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    title: "Storefront",
    links: [
      { href: "/admin/hero", label: "Hero" },
      { href: "/admin/home", label: "About & Circles" },
      { href: "/admin/promos", label: "Promos" },
    ],
  },
  {
    title: "Catalog",
    links: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/categories", label: "Top Categories" },
      { href: "/admin/reels", label: "Reels" },
    ],
  },
  {
    title: "Customers",
    links: [
      { href: "/admin/customers", label: "Customers" },
      { href: "/admin/notify", label: "Email drops" },
    ],
  },
  {
    title: "Team",
    links: [{ href: "/admin/team", label: "Admin users" }],
  },
  {
    title: "More",
    links: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/settings", label: "Checkout settings" },
    ],
  },
];

function linkActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  admin,
}: {
  children: ReactNode;
  admin: {
    name: string;
    email: string;
    role: "owner" | "staff";
    permissions: AdminPermissionId[];
  };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const can = (permission: AdminPermissionId) =>
    admin.role === "owner" || admin.permissions.includes(permission);

  const groups = GROUPS.map((g) => ({
    ...g,
    links: g.links.filter((l) => {
      const perm = PERMISSION_BY_PATH[l.href];
      return !perm || can(perm);
    }),
  })).filter((g) => g.links.length > 0);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--ink)]">
      <header className="border-b-2 border-[var(--ink)] bg-[var(--sand)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="font-[family-name:var(--font-logo)] text-lg uppercase">
              Genradius Admin
            </p>
            <p className="text-xs font-medium text-[var(--moss)]">
              {admin.name || admin.email}
              {admin.role === "owner" ? " · Owner" : " · Staff"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-md border-2 border-[var(--ink)] bg-[var(--silver)] px-3 py-1.5 text-xs font-extrabold uppercase shadow-[2px_2px_0_0_var(--ink)]"
            >
              View store
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border-2 border-[var(--ink)] bg-[var(--background)] px-3 py-1.5 text-xs font-extrabold uppercase shadow-[2px_2px_0_0_var(--ink)]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[200px_1fr]">
        <nav className="space-y-5 lg:sticky lg:top-4 lg:self-start">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-[10px] font-extrabold tracking-[0.16em] text-[var(--moss)] uppercase">
                {group.title}
              </p>
              <div className="flex flex-wrap gap-2 lg:flex-col">
                {group.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`rounded-md border-2 border-[var(--ink)] px-3 py-1.5 text-xs font-extrabold uppercase shadow-[2px_2px_0_0_var(--ink)] ${
                      linkActive(pathname, l.href)
                        ? "bg-[var(--olive)]"
                        : "bg-white hover:bg-[var(--accent-soft)]"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
