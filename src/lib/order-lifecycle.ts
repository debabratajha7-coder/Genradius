import { createHash, timingSafeEqual } from "crypto";
import { connectDB } from "@/lib/db";
import { weightKg } from "@/lib/orders";
import { sendTransactionalEmail } from "@/lib/order-email";
import {
  createShiprocketOrder,
  isShiprocketConfigured,
} from "@/lib/shiprocket";
import { getCheckoutSettings } from "@/lib/site-settings";
import Order from "@/models/Order";

function pushTimeline(
  order: {
    timeline?: { status: string; at?: Date; note?: string }[];
  },
  status: string,
  note = "",
) {
  if (!order.timeline) order.timeline = [];
  order.timeline.push({ status, at: new Date(), note });
}

export async function findOrderByNumber(orderNumber: string) {
  await connectDB();
  return Order.findOne({
    $or: [{ orderNumber }, { merchantOrderId: orderNumber }],
  });
}

/** Idempotent: mark prepaid order paid and push Shiprocket. */
export async function markOrderPaid(
  orderNumber: string,
  transactionId = "",
): Promise<{ ok: boolean; already?: boolean }> {
  await connectDB();
  const order = await findOrderByNumber(orderNumber);
  if (!order) return { ok: false };

  if (order.paymentStatus === "paid" && order.status !== "pending_payment") {
    if (!order.shiprocketOrderId) {
      await pushOrderToShiprocket(order.orderNumber || order.merchantOrderId);
    }
    return { ok: true, already: true };
  }

  order.paymentStatus = "paid";
  order.status = "confirmed";
  if (transactionId) order.phonepeTransactionId = transactionId;
  // legacy
  if ((order.status as string) === "pending") order.status = "confirmed";
  pushTimeline(order, "paid", transactionId ? `txn ${transactionId}` : "");
  await order.save();

  await pushOrderToShiprocket(order.orderNumber || order.merchantOrderId);
  await sendTransactionalEmail({
    to: order.email,
    subject: `Order ${order.orderNumber || order.merchantOrderId} confirmed — Genradius`,
    html: `<p>Hey ${order.name},</p><p>Payment received for <strong>${order.orderNumber || order.merchantOrderId}</strong> (₹${order.total}). We’re packing your drop.</p><p>— Genradius</p>`,
  });
  return { ok: true };
}

/** COD: confirm immediately and push Shiprocket. */
export async function confirmCodOrder(
  orderNumber: string,
): Promise<{ ok: boolean; already?: boolean }> {
  await connectDB();
  const order = await findOrderByNumber(orderNumber);
  if (!order) return { ok: false };
  if (order.paymentMethod !== "cod") return { ok: false };

  if (order.status === "confirmed" || order.status === "processing") {
    if (!order.shiprocketOrderId) {
      await pushOrderToShiprocket(order.orderNumber || order.merchantOrderId);
    }
    return { ok: true, already: true };
  }

  order.status = "confirmed";
  order.paymentStatus = "pending";
  pushTimeline(order, "confirmed", "COD — pay on delivery");
  await order.save();

  await pushOrderToShiprocket(order.orderNumber || order.merchantOrderId);
  await sendTransactionalEmail({
    to: order.email,
    subject: `Order ${order.orderNumber || order.merchantOrderId} confirmed (COD) — Genradius`,
    html: `<p>Hey ${order.name},</p><p>Order <strong>${order.orderNumber || order.merchantOrderId}</strong> is confirmed. Pay <strong>₹${order.total}</strong> on delivery.</p><p>— Genradius</p>`,
  });
  return { ok: true };
}

export async function markCodCollected(orderNumber: string) {
  await connectDB();
  const order = await findOrderByNumber(orderNumber);
  if (!order || order.paymentMethod !== "cod") return;
  if (order.paymentStatus === "paid") return;
  order.paymentStatus = "paid";
  pushTimeline(order, "cod_collected", "Cash collected on delivery");
  await order.save();
}

export async function pushOrderToShiprocket(
  orderNumber: string,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  await connectDB();
  const order = await findOrderByNumber(orderNumber);
  if (!order) return { ok: false, error: "Order not found" };

  if (order.shiprocketOrderId) {
    return { ok: true };
  }

  if (!isShiprocketConfigured()) {
    pushTimeline(order, "shiprocket_skipped", "Shiprocket credentials missing");
    await order.save();
    return { ok: true, skipped: true };
  }

  const settings = await getCheckoutSettings();
  const pickup =
    process.env.SHIPROCKET_PICKUP_LOCATION?.trim() ||
    settings.pickupLocationName ||
    "Primary";

  try {
    const shipment = await createShiprocketOrder({
      orderId: order.orderNumber || order.merchantOrderId,
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
      /** Cash to collect for COD = full order total */
      subtotal:
        order.paymentMethod === "cod" ? order.total : order.subtotal,
      weightKg: weightKg(order.items),
      paymentMethod: order.paymentMethod === "cod" ? "COD" : "Prepaid",
      pickupLocation: pickup,
    });
    order.shiprocketOrderId = shipment.orderId;
    order.shiprocketShipmentId = shipment.shipmentId;
    if (shipment.awb) {
      order.awb = shipment.awb;
      order.trackingUrl = `https://shiprocket.co/tracking/${shipment.awb}`;
    }
    if (shipment.courier) order.courier = shipment.courier;
    order.status = "processing";
    pushTimeline(order, "shiprocket_created", shipment.orderId);
    await order.save();
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Shiprocket error";
    pushTimeline(order, "shiprocket_error", message);
    await order.save();
    return { ok: false, error: message };
  }
}

const CANCELABLE = new Set([
  "pending_payment",
  "confirmed",
  "processing",
  "pending",
  "paid",
]);

export async function cancelOrder(opts: {
  orderNumber: string;
  reason?: string;
  by: "customer" | "admin" | "phone";
}): Promise<
  | { ok: true; refundNote: string }
  | { ok: false; error: string; status?: number }
> {
  await connectDB();
  const order = await findOrderByNumber(opts.orderNumber);
  if (!order) return { ok: false, error: "Order not found", status: 404 };

  if (order.status === "cancelled") {
    return { ok: true, refundNote: "Already cancelled" };
  }
  if (order.status === "shipped" || order.status === "delivered") {
    return {
      ok: false,
      error: "This order has already shipped and can’t be cancelled online.",
      status: 400,
    };
  }
  if (!CANCELABLE.has(order.status)) {
    return { ok: false, error: "Order can’t be cancelled", status: 400 };
  }

  order.status = "cancelled";
  order.cancelReason = opts.reason || `Cancelled by ${opts.by}`;
  pushTimeline(order, "cancelled", order.cancelReason);

  let refundNote = "No payment was collected.";
  if (order.paymentMethod === "prepaid" && order.paymentStatus === "paid") {
    refundNote =
      "Refund will be processed in 5–7 business days to your original payment method.";
    pushTimeline(order, "refund_pending", refundNote);
  }
  await order.save();

  await sendTransactionalEmail({
    to: order.email,
    subject: `Order ${order.orderNumber || order.merchantOrderId} cancelled — Genradius`,
    html: `<p>Hey ${order.name},</p><p>Order <strong>${order.orderNumber || order.merchantOrderId}</strong> is cancelled.</p><p>${refundNote}</p><p>— Genradius</p>`,
  });

  return { ok: true, refundNote };
}

/** Map Shiprocket / courier status labels → local status (never regress past delivered). */
export function mapFulfillmentStatus(raw: string): {
  status?: "processing" | "shipped" | "delivered" | "cancelled";
  label: string;
} {
  const s = raw.toLowerCase().replace(/[_-]/g, " ");
  if (/deliver/.test(s) && !/undeliver|rto/.test(s))
    return { status: "delivered", label: raw };
  if (/ship|in transit|out for|picked|dispatched|ofd/.test(s))
    return { status: "shipped", label: raw };
  if (/cancel|rto|returned/.test(s)) return { status: "cancelled", label: raw };
  if (/process|pack|manifest|ready|awb/.test(s))
    return { status: "processing", label: raw };
  return { label: raw };
}

const RANK: Record<string, number> = {
  pending_payment: 0,
  pending: 0,
  confirmed: 1,
  paid: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: 5,
  failed: 0,
};

export async function applyFulfillmentUpdate(opts: {
  orderNumber?: string;
  shiprocketOrderId?: string;
  shipmentId?: string;
  awb?: string;
  courier?: string;
  statusLabel: string;
}): Promise<{ matched: boolean }> {
  await connectDB();
  let order = null;
  if (opts.orderNumber) order = await findOrderByNumber(opts.orderNumber);
  if (!order && opts.shiprocketOrderId) {
    order = await Order.findOne({ shiprocketOrderId: String(opts.shiprocketOrderId) });
  }
  if (!order && opts.shipmentId) {
    order = await Order.findOne({
      shiprocketShipmentId: String(opts.shipmentId),
    });
  }
  if (!order && opts.awb) {
    order = await Order.findOne({ awb: String(opts.awb) });
  }
  if (!order) return { matched: false };

  if (opts.awb) {
    order.awb = opts.awb;
    order.trackingUrl = `https://shiprocket.co/tracking/${opts.awb}`;
  }
  if (opts.courier) order.courier = opts.courier;
  if (opts.shiprocketOrderId && !order.shiprocketOrderId)
    order.shiprocketOrderId = String(opts.shiprocketOrderId);
  if (opts.shipmentId && !order.shiprocketShipmentId)
    order.shiprocketShipmentId = String(opts.shipmentId);

  const mapped = mapFulfillmentStatus(opts.statusLabel);
  const prev = order.status;
  if (
    mapped.status &&
    (RANK[mapped.status] ?? 0) >= (RANK[order.status] ?? 0) &&
    order.status !== "delivered"
  ) {
    order.status = mapped.status;
  }
  pushTimeline(order, `shipping:${mapped.label}`, mapped.status || "");
  await order.save();

  if (mapped.status === "delivered" && order.paymentMethod === "cod") {
    await markCodCollected(order.orderNumber || order.merchantOrderId);
  }

  if (mapped.status && mapped.status !== prev) {
    await sendTransactionalEmail({
      to: order.email,
      subject: `Order ${order.orderNumber || order.merchantOrderId} update — Genradius`,
      html: `<p>Hey ${order.name},</p><p>Your order is now <strong>${mapped.status}</strong>${order.awb ? ` · AWB ${order.awb}` : ""}.</p>${order.trackingUrl ? `<p><a href="${order.trackingUrl}">Track shipment</a></p>` : ""}<p>— Genradius</p>`,
    });
  }

  return { matched: true };
}

export function verifyPhonePeWebhookAuth(
  authorizationHeader: string | null,
): boolean {
  const user = process.env.PHONEPE_WEBHOOK_USERNAME?.trim();
  const pass = process.env.PHONEPE_WEBHOOK_PASSWORD?.trim();
  const isProd = process.env.PHONEPE_ENV === "production";
  if (!user || !pass) {
    return !isProd; // allow without creds only in non-production
  }
  if (!authorizationHeader) return false;
  // PhonePe: Authorization = SHA256(username:password) hex
  const expected = createHash("sha256")
    .update(`${user}:${pass}`)
    .digest("hex");
  const got = authorizationHeader.replace(/^SHA256\s+/i, "").trim();
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(got, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyFulfillmentWebhookToken(req: Request): boolean {
  const token = process.env.SHIPROCKET_WEBHOOK_TOKEN?.trim();
  if (!token) {
    return process.env.NODE_ENV !== "production";
  }
  const header =
    req.headers.get("x-api-key") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    new URL(req.url).searchParams.get("token") ||
    "";
  return header === token;
}
