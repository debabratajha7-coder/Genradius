"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

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
    links: [{ href: "/admin/customers", label: "Customers" }],
  },
  {
    title: "More",
    links: [{ href: "/admin/orders", label: "Orders" }],
  },
];

function linkActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
              Storefront · catalog · customers
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
          {GROUPS.map((group) => (
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
