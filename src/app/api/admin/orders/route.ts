import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import {
  findOrderByNumber,
  pushOrderToShiprocket,
} from "@/lib/order-lifecycle";
import { connectDB } from "@/lib/db";

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

export async function PUT(req: Request) {
  const denied = await requireAdminApi("orders");
  if (denied) return denied;
  try {
    const body = await req.json();
    const orderNumber = String(body.orderNumber || body.merchantOrderId || "");
    if (!orderNumber) {
      return NextResponse.json({ error: "orderNumber required" }, { status: 400 });
    }

    if (body.retryShiprocket) {
      const result = await pushOrderToShiprocket(orderNumber);
      if (!result.ok && !result.skipped) {
        return NextResponse.json(
          { error: result.error || "Shiprocket retry failed" },
          { status: 502 },
        );
      }
      return NextResponse.json({ ...result, ok: true });
    }

    await connectDB();
    const order = await findOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (body.status) order.status = body.status;
    if (body.awb != null) {
      order.awb = String(body.awb);
      order.trackingUrl = order.awb
        ? `https://shiprocket.co/tracking/${order.awb}`
        : "";
    }
    if (body.courier != null) order.courier = String(body.courier);
    if (body.paymentStatus != null) order.paymentStatus = body.paymentStatus;
    order.timeline.push({
      status: "admin_update",
      at: new Date(),
      note: JSON.stringify(body),
    });
    await order.save();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
