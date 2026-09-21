import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  deleteAdminUser,
  updateAdminUser,
} from "@/lib/admin-users";
import type { AdminPermissionId } from "@/lib/admin-permissions";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const gate = await requireAdminSession("team");
  if (gate.error || !gate.session) {
    return (
      gate.error ||
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );
  }
  const session = gate.session;

  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      role?: "owner" | "staff";
      permissions?: AdminPermissionId[];
      active?: boolean;
      password?: string;
    };

    if (body.role === "owner" && session.role !== "owner") {
      return NextResponse.json(
        { error: "Only owners can promote to owner" },
        { status: 403 },
      );
    }

    if (id === session.adminId && body.active === false) {
      return NextResponse.json(
        { error: "You can’t deactivate yourself" },
        { status: 400 },
      );
    }

    const result = await updateAdminUser(id, body);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    return NextResponse.json({ user: result.user });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const gate = await requireAdminSession("team");
  if (gate.error || !gate.session) {
    return (
      gate.error ||
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );
  }
  const session = gate.session;

  try {
    const { id } = await ctx.params;
    if (id === session.adminId) {
      return NextResponse.json(
        { error: "You can’t delete yourself" },
        { status: 400 },
      );
    }
    const result = await deleteAdminUser(id);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
