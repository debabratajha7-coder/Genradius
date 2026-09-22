import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ALL_ADMIN_PERMISSIONS,
  normalizePermissions,
  type AdminPermissionId,
} from "@/lib/admin-permissions";
import type { AdminUserLean } from "@/lib/admin-users";

const COOKIE = "genradius_admin";
const PENDING_COOKIE = "genradius_admin_pending";

function secretKey() {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("Set ADMIN_SECRET (or ADMIN_PASSWORD) in env");
  }
  return new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 64));
}

export type AdminSession = {
  adminId: string;
  email: string;
  name: string;
  role: "owner" | "staff";
  permissions: AdminPermissionId[];
};

export type AdminPendingSession = {
  adminId: string;
  email: string;
  phone: string;
};

export async function createAdminSession(user: AdminUserLean) {
  const permissions =
    user.role === "owner"
      ? [...ALL_ADMIN_PERMISSIONS]
      : normalizePermissions(user.permissions);

  const token = await new SignJWT({
    role: "admin",
    adminId: user._id,
    email: user.email,
    name: user.name,
    adminRole: user.role,
    permissions,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  const jar = await cookies();
  jar.delete(PENDING_COOKIE);
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function createAdminPendingSession(input: {
  adminId: string;
  email: string;
  phone: string;
}) {
  const token = await new SignJWT({
    role: "admin_pending",
    adminId: input.adminId,
    email: input.email,
    phone: input.phone,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secretKey());

  const jar = await cookies();
  jar.set(PENDING_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
  jar.delete(PENDING_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== "admin") return null;
    const adminId = String(payload.adminId || "");
    if (!adminId) {
      // Legacy single-password session — treat as full owner
      return {
        adminId: "legacy",
        email: "admin@local",
        name: "Admin",
        role: "owner",
        permissions: [...ALL_ADMIN_PERMISSIONS],
      };
    }
    const adminRole = payload.adminRole === "owner" ? "owner" : "staff";
    const permissions =
      adminRole === "owner"
        ? [...ALL_ADMIN_PERMISSIONS]
        : normalizePermissions(payload.permissions);
    return {
      adminId,
      email: String(payload.email || ""),
      name: String(payload.name || ""),
      role: adminRole,
      permissions,
    };
  } catch {
    return null;
  }
}

export async function getAdminPendingSession(): Promise<AdminPendingSession | null> {
  try {
    const jar = await cookies();
    const token = jar.get(PENDING_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== "admin_pending") return null;
    const adminId = String(payload.adminId || "");
    const email = String(payload.email || "");
    const phone = String(payload.phone || "");
    if (!adminId || !phone) return null;
    return { adminId, email, phone };
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return Boolean(await getAdminSession());
}

export function adminHasPermission(
  session: AdminSession,
  permission: AdminPermissionId,
): boolean {
  if (session.role === "owner") return true;
  return session.permissions.includes(permission);
}

/** @deprecated legacy env-only password — kept for bootstrap fallback */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export async function requireAdminApi(permission?: AdminPermissionId) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (permission && !adminHasPermission(session, permission)) {
    return NextResponse.json(
      { error: "You don’t have permission for this action" },
      { status: 403 },
    );
  }
  return null;
}

export async function requireAdminSession(permission?: AdminPermissionId) {
  const session = await getAdminSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null as AdminSession | null,
    };
  }
  if (permission && !adminHasPermission(session, permission)) {
    return {
      error: NextResponse.json(
        { error: "You don’t have permission for this action" },
        { status: 403 },
      ),
      session: null as AdminSession | null,
    };
  }
  return { error: null, session };
}






