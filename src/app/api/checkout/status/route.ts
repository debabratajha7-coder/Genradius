import { NextResponse } from "next/server";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import { weightKg } from "@/lib/orders";
import { getPhonePeStatus, isPhonePeConfigured } from "@/lib/phonepe";
import {
  createShiprocketOrder,
  isShiprocketConfigured,
} from "@/lib/shiprocket";
import Order from "@/models/Order";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("order") || "";
  if (!id) {
    return NextResponse.json({ error: "Missing order" }, { status: 400 });
  }
  if (useMemoryCatalog()) {
    return NextResponse.json({ error: "Orders need MongoDB" }, { status: 503 });
  }

  await connectDB();
  const order = await Order.findOne({ merchantOrderId: id });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "pending" && isPhonePeConfigured()) {
    const state = await getPhonePeStatus(order.merchantOrderId);
    if (state === "COMPLETED") order.status = "paid";
    if (state === "FAILED") order.status = "failed";
    await order.save();
  }

  if (
    order.status === "paid" &&
    !order.shiprocketOrderId &&
    isShiprocketConfigured()
  ) {
    try {
      const shipment = await createShiprocketOrder({
        orderId: order.merchantOrderId,
        name: order.name,
        phone: order.phone,
        email: order.email,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        items: order.items.map((item) => ({
          title: item.title,
          slug: item.slug,
          qty: item.qty,
          price: item.price,
        })),
        subtotal: order.subtotal,
        weightKg: weightKg(order.items),
      });
      order.shiprocketOrderId = shipment.orderId;
      order.shiprocketShipmentId = shipment.shipmentId;
      order.status = "shipped";
      await order.save();
    } catch {
      /* payment is captured; shipping can be retried from admin later */
    }
  }

  return NextResponse.json({
    merchantOrderId: order.merchantOrderId,
    status: order.status,
    total: order.total,
    shipping: order.shipping,
    courier: order.courier,
    shiprocketOrderId: order.shiprocketOrderId || "",
  });
}
