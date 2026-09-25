import { NextResponse } from "next/server";
import { cancelOrder, findOrderByNumber } from "@/lib/order-lifecycle";
import { getAdminSession } from "@/lib/admin-auth";
import { getUserSession } from "@/lib/user-auth";
import { normalizePhone } from "@/lib/phone";

type Ctx = { params: Promise<{ orderNumber: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { orderNumber } = await ctx.params;
  const order = await findOrderByNumber(orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  let body: { phone?: string; reason?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty */
  }

  const session = await getUserSession();
  const admin = await getAdminSession();
  const phone = normalizePhone(String(body.phone || ""));

  const allowed =
    Boolean(admin) ||
    (session && order.userId && session.userId === order.userId) ||
    (phone && phone === order.phone);

  if (!allowed) {
    return NextResponse.json(
      { error: "Unauthorized — sign in or enter the order phone." },
      { status: 401 },
    );
  }

  const result = await cancelOrder({
    orderNumber,
    reason: body.reason,
    by: admin ? "admin" : session ? "customer" : "phone",
  });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status || 400 },
    );
  }
  return NextResponse.json({ ok: true, refundNote: result.refundNote });
}
