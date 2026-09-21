export const ADMIN_PERMISSIONS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "hero", label: "Hero slides" },
  { id: "home", label: "About & Circles" },
  { id: "promos", label: "Promos" },
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "reels", label: "Reels" },
  { id: "customers", label: "Customers" },
  { id: "notify", label: "Email drops" },
  { id: "orders", label: "Orders" },
  { id: "team", label: "Manage admin team" },
] as const;

export type AdminPermissionId = (typeof ADMIN_PERMISSIONS)[number]["id"];

export const ALL_ADMIN_PERMISSIONS: AdminPermissionId[] =
  ADMIN_PERMISSIONS.map((p) => p.id);

export const PERMISSION_BY_PATH: Record<string, AdminPermissionId> = {
  "/admin": "dashboard",
  "/admin/hero": "hero",
  "/admin/home": "home",
  "/admin/promos": "promos",
  "/admin/products": "products",
  "/admin/categories": "categories",
  "/admin/reels": "reels",
  "/admin/customers": "customers",
  "/admin/notify": "notify",
  "/admin/orders": "orders",
  "/admin/team": "team",
};

export function normalizePermissions(
  input: unknown,
): AdminPermissionId[] {
  const allowed = new Set<string>(ALL_ADMIN_PERMISSIONS);
  if (!Array.isArray(input)) return [];
  return [
    ...new Set(
      input
        .map((p) => String(p))
        .filter((p): p is AdminPermissionId => allowed.has(p)),
    ),
  ];
}
