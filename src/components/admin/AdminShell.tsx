"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/reels", label: "Reels" },
  { href: "/admin/categories", label: "Categories" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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
              Catalog · media · reels
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md border-2 border-[var(--ink)] px-3 py-1.5 text-xs font-extrabold uppercase shadow-[2px_2px_0_0_var(--ink)] ${
                  pathname === l.href
                    ? "bg-[var(--olive)]"
                    : "bg-[var(--background)] hover:bg-[var(--accent-soft)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-md border-2 border-[var(--ink)] bg-[var(--silver)] px-3 py-1.5 text-xs font-extrabold uppercase shadow-[2px_2px_0_0_var(--ink)]"
            >
              Store
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border-2 border-[var(--ink)] bg-[var(--background)] px-3 py-1.5 text-xs font-extrabold uppercase shadow-[2px_2px_0_0_var(--ink)]"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
