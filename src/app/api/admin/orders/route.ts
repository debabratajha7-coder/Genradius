import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";

export async function GET() {
  const denied = await requireAdminApi("orders");
  if (denied) return denied;
  try {
    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
