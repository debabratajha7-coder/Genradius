import { connectDB, useMemoryCatalog } from "@/lib/db";
import {
  ALL_ADMIN_PERMISSIONS,
  normalizePermissions,
  type AdminPermissionId,
} from "@/lib/admin-permissions";
import { hashPassword, normalizeEmail, verifyPassword } from "@/lib/password";
import { normalizePhone } from "@/lib/phone";
import AdminUser from "@/models/AdminUser";

export type AdminUserLean = {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: "owner" | "staff";
  permissions: AdminPermissionId[];
  active: boolean;
  lastLoginAt?: string;
  createdAt?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __genradiusAdminUsers: Map<string, AdminUserLean & { passwordHash: string }> | undefined;
}

function memStore() {
  if (!global.__genradiusAdminUsers) {
    global.__genradiusAdminUsers = new Map();
  }
  return global.__genradiusAdminUsers;
}

function toLean(doc: {
  _id: { toString(): string } | string;
  email: string;
  name?: string | null;
  phone: string;
  role?: string | null;
  permissions?: string[] | null;
  active?: boolean | null;
  lastLoginAt?: Date | null;
  createdAt?: Date | null;
}): AdminUserLean {
  const role = doc.role === "owner" ? "owner" : "staff";
  const permissions =
    role === "owner"
      ? [...ALL_ADMIN_PERMISSIONS]
      : normalizePermissions(doc.permissions);
  return {
    _id: String(doc._id),
    email: doc.email,
    name: doc.name || "",
    phone: doc.phone,
    role,
    permissions,
    active: doc.active !== false,
    lastLoginAt: doc.lastLoginAt
      ? new Date(doc.lastLoginAt).toISOString()
      : undefined,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : undefined,
  };
}

/** True when ADMIN_EMAIL / PASSWORD / PHONE are all set and phone is valid E.164. */
export function bootstrapAdminConfigured(): boolean {
  return Boolean(
    normalizeEmail(process.env.ADMIN_EMAIL || "") &&
      process.env.ADMIN_PASSWORD &&
      normalizePhone(process.env.ADMIN_PHONE || ""),
  );
}

/**
 * Ensure env bootstrap owner exists and stays in sync with ADMIN_* env.
 * Creates the first owner when missing; updates password/phone for that email.
 */
export async function ensureBootstrapAdmin(): Promise<void> {
  const email = normalizeEmail(process.env.ADMIN_EMAIL || "");
  const password = process.env.ADMIN_PASSWORD || "";
  const phone = normalizePhone(process.env.ADMIN_PHONE || "");
  if (!email || !password || !phone) return;

  const passwordHash = await hashPassword(password);

  if (useMemoryCatalog()) {
    const store = memStore();
    const existing = store.get(email);
    if (existing) {
      store.set(email, {
        ...existing,
        phone,
        passwordHash,
        role: "owner",
        permissions: [...ALL_ADMIN_PERMISSIONS],
        active: true,
      });
      return;
    }
    if ([...store.values()].some((u) => u.role === "owner")) return;
    store.set(email, {
      _id: `admin-owner`,
      email,
      name: "Owner",
      phone,
      role: "owner",
      permissions: [...ALL_ADMIN_PERMISSIONS],
      active: true,
      passwordHash,
    });
    return;
  }

  await connectDB();
  const existing = await AdminUser.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.phone = phone;
    existing.role = "owner";
    existing.permissions = [...ALL_ADMIN_PERMISSIONS];
    existing.active = true;
    if (!existing.name) existing.name = "Owner";
    await existing.save();
    return;
  }

  const count = await AdminUser.countDocuments();
  if (count > 0) return;

  await AdminUser.create({
    email,
    passwordHash,
    name: "Owner",
    phone,
    role: "owner",
    permissions: [...ALL_ADMIN_PERMISSIONS],
    active: true,
  });
}

export async function findAdminByEmail(
  rawEmail: string,
): Promise<(AdminUserLean & { passwordHash: string }) | null> {
  await ensureBootstrapAdmin();
  const email = normalizeEmail(rawEmail);
  if (!email) return null;

  if (useMemoryCatalog()) {
    const row = memStore().get(email);
    return row && row.active ? row : null;
  }

  await connectDB();
  const doc = await AdminUser.findOne({ email, active: true });
  if (!doc) return null;
  return {
    ...toLean(doc),
    passwordHash: doc.passwordHash,
  };
}

export async function findAdminById(
  id: string,
): Promise<(AdminUserLean & { passwordHash?: string }) | null> {
  if (useMemoryCatalog()) {
    const row = [...memStore().values()].find((u) => u._id === id);
    return row && row.active ? row : null;
  }
  await connectDB();
  const doc = await AdminUser.findById(id);
  if (!doc || !doc.active) return null;
  return { ...toLean(doc), passwordHash: doc.passwordHash };
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminUserLean | null> {
  const user = await findAdminByEmail(email);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  const { passwordHash: _, ...lean } = user;
  return lean;
}

export async function listAdminUsers(): Promise<AdminUserLean[]> {
  await ensureBootstrapAdmin();
  if (useMemoryCatalog()) {
    return [...memStore().values()].map(({ passwordHash: _, ...u }) => u);
  }
  await connectDB();
  const rows = await AdminUser.find().sort({ createdAt: 1 }).lean();
  return rows.map((r) => toLean(r));
}

export async function createAdminUser(input: {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "owner" | "staff";
  permissions: AdminPermissionId[];
}): Promise<
  { ok: true; user: AdminUserLean } | { ok: false; error: string; status: number }
> {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  if (!email) return { ok: false, error: "Valid email required", status: 400 };
  if (!phone) return { ok: false, error: "Valid phone required", status: 400 };
  if (input.password.length < 6) {
    return { ok: false, error: "Password min 6 characters", status: 400 };
  }

  const passwordHash = await hashPassword(input.password);
  const role = input.role === "owner" ? "owner" : "staff";
  const permissions =
    role === "owner"
      ? [...ALL_ADMIN_PERMISSIONS]
      : normalizePermissions(input.permissions);

  if (useMemoryCatalog()) {
    const store = memStore();
    if (store.has(email)) {
      return { ok: false, error: "Email already in use", status: 409 };
    }
    const user: AdminUserLean & { passwordHash: string } = {
      _id: `admin-${Date.now()}`,
      email,
      name: input.name.trim(),
      phone,
      role,
      permissions,
      active: true,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    store.set(email, user);
    const { passwordHash: _, ...lean } = user;
    return { ok: true, user: lean };
  }

  await connectDB();
  const exists = await AdminUser.findOne({ email });
  if (exists) {
    return { ok: false, error: "Email already in use", status: 409 };
  }

  try {
    const doc = await AdminUser.create({
      email,
      passwordHash,
      name: input.name.trim(),
      phone,
      role,
      permissions,
      active: true,
    });
    return { ok: true, user: toLean(doc) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Create failed",
      status: 500,
    };
  }
}

export async function updateAdminUser(
  id: string,
  patch: {
    name?: string;
    phone?: string;
    role?: "owner" | "staff";
    permissions?: AdminPermissionId[];
    active?: boolean;
    password?: string;
  },
): Promise<
  { ok: true; user: AdminUserLean } | { ok: false; error: string; status: number }
> {
  if (useMemoryCatalog()) {
    const store = memStore();
    const entry = [...store.entries()].find(([, u]) => u._id === id);
    if (!entry) return { ok: false, error: "Not found", status: 404 };
    const [key, user] = entry;
    if (patch.name != null) user.name = patch.name.trim();
    if (patch.phone != null) {
      const phone = normalizePhone(patch.phone);
      if (!phone) return { ok: false, error: "Invalid phone", status: 400 };
      user.phone = phone;
    }
    if (patch.role != null) user.role = patch.role;
    if (patch.permissions != null) {
      user.permissions =
        user.role === "owner"
          ? [...ALL_ADMIN_PERMISSIONS]
          : normalizePermissions(patch.permissions);
    }
    if (user.role === "owner") user.permissions = [...ALL_ADMIN_PERMISSIONS];
    if (patch.active != null) user.active = patch.active;
    if (patch.password) {
      if (patch.password.length < 6) {
        return { ok: false, error: "Password min 6 characters", status: 400 };
      }
      user.passwordHash = await hashPassword(patch.password);
    }
    store.set(key, user);
    const { passwordHash: _, ...lean } = user;
    return { ok: true, user: lean };
  }

  await connectDB();
  const doc = await AdminUser.findById(id);
  if (!doc) return { ok: false, error: "Not found", status: 404 };

  if (patch.name != null) doc.name = patch.name.trim();
  if (patch.phone != null) {
    const phone = normalizePhone(patch.phone);
    if (!phone) return { ok: false, error: "Invalid phone", status: 400 };
    doc.phone = phone;
  }
  if (patch.active != null) doc.active = patch.active;
  if (patch.role != null) doc.role = patch.role;
  if (patch.password) {
    if (patch.password.length < 6) {
      return { ok: false, error: "Password min 6 characters", status: 400 };
    }
    doc.passwordHash = await hashPassword(patch.password);
  }
  if (doc.role === "owner") {
    doc.permissions = [...ALL_ADMIN_PERMISSIONS];
  } else if (patch.permissions) {
    doc.permissions = normalizePermissions(patch.permissions);
  }
  await doc.save();
  return { ok: true, user: toLean(doc) };
}

export async function deleteAdminUser(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  if (useMemoryCatalog()) {
    const store = memStore();
    const entry = [...store.entries()].find(([, u]) => u._id === id);
    if (!entry) return { ok: false, error: "Not found", status: 404 };
    if (entry[1].role === "owner") {
      const owners = [...store.values()].filter((u) => u.role === "owner");
      if (owners.length <= 1) {
        return { ok: false, error: "Cannot delete the last owner", status: 400 };
      }
    }
    store.delete(entry[0]);
    return { ok: true };
  }

  await connectDB();
  const doc = await AdminUser.findById(id);
  if (!doc) return { ok: false, error: "Not found", status: 404 };
  if (doc.role === "owner") {
    const owners = await AdminUser.countDocuments({ role: "owner", active: true });
    if (owners <= 1) {
      return { ok: false, error: "Cannot delete the last owner", status: 400 };
    }
  }
  await AdminUser.findByIdAndDelete(id);
  return { ok: true };
}

export async function touchAdminLogin(id: string) {
  if (useMemoryCatalog()) {
    const row = [...memStore().values()].find((u) => u._id === id);
    if (row) row.lastLoginAt = new Date().toISOString();
    return;
  }
  await connectDB();
  await AdminUser.findByIdAndUpdate(id, { lastLoginAt: new Date() });
}
