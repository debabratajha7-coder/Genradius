import { NextResponse } from "next/server";
import { findOrderByNumber, markOrderPaid } from "@/lib/order-lifecycle";
import { getPhonePeStatus, isPhonePeConfigured } from "@/lib/phonepe";

type Ctx = { params: Promise<{ orderNumber: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { orderNumber } = await ctx.params;
  const order = await findOrderByNumber(orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (
    order.paymentMethod === "prepaid" &&
    order.paymentStatus === "pending" &&
    isPhonePeConfigured()
  ) {
    const state = await getPhonePeStatus(
      order.orderNumber || order.merchantOrderId,
    );
    if (state === "COMPLETED") {
      await markOrderPaid(order.orderNumber || order.merchantOrderId);
    } else if (state === "FAILED") {
      order.paymentStatus = "failed";
      order.timeline.push({
        status: "payment_failed",
        at: new Date(),
        note: "",
      });
      await order.save();
    }
  }

  const fresh = await findOrderByNumber(orderNumber);
  if (!fresh) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: fresh.orderNumber || fresh.merchantOrderId,
    status: fresh.status,
    paymentMethod: fresh.paymentMethod || "prepaid",
    paymentStatus: fresh.paymentStatus || "pending",
    total: fresh.total,
    shippingFee: fresh.shippingFee ?? fresh.shipping ?? 0,
    codFee: fresh.codFee || 0,
    items: fresh.items,
    awb: fresh.awb || "",
    trackingUrl: fresh.trackingUrl || "",
    courier: fresh.courier || "",
    name: fresh.name,
    createdAt: fresh.createdAt,
  });
}
