import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  createAdminUser,
  listAdminUsers,
} from "@/lib/admin-users";
import type { AdminPermissionId } from "@/lib/admin-permissions";

export async function GET() {
  const gate = await requireAdminSession("team");
  if (gate.error) return gate.error;

  try {
    const users = await listAdminUsers();
    return NextResponse.json({ users });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = await requireAdminSession("team");
  if (gate.error || !gate.session) {
    return (
      gate.error ||
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );
  }
  const session = gate.session;

  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
      name?: string;
      phone?: string;
      role?: "owner" | "staff";
      permissions?: AdminPermissionId[];
    };

    if (body.role === "owner" && session.role !== "owner") {
      return NextResponse.json(
        { error: "Only owners can create other owners" },
        { status: 403 },
      );
    }

    const result = await createAdminUser({
      email: String(body.email || ""),
      password: String(body.password || ""),
      name: String(body.name || ""),
      phone: String(body.phone || ""),
      role: body.role === "owner" ? "owner" : "staff",
      permissions: body.permissions || [],
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
