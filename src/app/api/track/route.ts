import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { findOrderByNumber } from "@/lib/order-lifecycle";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const limited = rateLimit({
    key: `track:${clientIp(req)}`,
    limit: 30,
    windowMs: 10 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const url = new URL(req.url);
  const orderNumber = String(url.searchParams.get("order") || "").trim();
  const phone = normalizePhone(String(url.searchParams.get("phone") || ""));

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: "Order number and phone are required" },
      { status: 400 },
    );
  }

  const order = await findOrderByNumber(orderNumber);
  if (!order || order.phone !== phone) {
    return NextResponse.json(
      { error: "No order found for that number + phone" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    orderNumber: order.orderNumber || order.merchantOrderId,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    total: order.total,
    items: order.items,
    awb: order.awb || "",
    trackingUrl: order.trackingUrl || "",
    courier: order.courier || "",
    timeline: order.timeline || [],
    createdAt: order.createdAt,
  });
}
