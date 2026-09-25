import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  markOrderPaid,
  verifyPhonePeWebhookAuth,
  findOrderByNumber,
} from "@/lib/order-lifecycle";

/**
 * PhonePe payment webhook.
 * Dashboard URL: {APP_URL}/api/webhooks/phonepe
 * Authorization header = SHA256 hex of username:password
 */
export async function POST(req: Request) {
  const limited = rateLimit({
    key: `phonepe-wh:${clientIp(req)}`,
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const auth = req.headers.get("authorization");
  if (!verifyPhonePeWebhookAuth(auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const event =
      String(body.event || body.type || "").toUpperCase() ||
      String((body.payload as { state?: string } | undefined)?.state || "");
    const payload = (body.payload || body.data || body) as Record<
      string,
      unknown
    >;
    const merchantOrderId = String(
      payload.merchantOrderId ||
        payload.merchant_order_id ||
        body.merchantOrderId ||
        "",
    );
    const transactionId = String(
      payload.transactionId ||
        payload.paymentId ||
        payload.orderId ||
        "",
    );
    const state = String(payload.state || event || "").toUpperCase();

    if (!merchantOrderId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (
      state.includes("COMPLETED") ||
      event.includes("ORDER_COMPLETED") ||
      event === "CHECKOUT_ORDER_COMPLETED"
    ) {
      await markOrderPaid(merchantOrderId, transactionId);
      return NextResponse.json({ ok: true });
    }

    if (
      (state.includes("FAILED") || event.includes("ORDER_FAILED")) &&
      !event.includes("ATTEMPT")
    ) {
      const order = await findOrderByNumber(merchantOrderId);
      if (order && order.paymentStatus === "pending") {
        order.paymentStatus = "failed";
        order.timeline.push({
          status: "payment_failed",
          at: new Date(),
          note: event || state,
        });
        await order.save();
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, ignored: true });
  } catch (e) {
    console.error("[phonepe webhook]", e);
    return NextResponse.json({ error: "webhook error" }, { status: 500 });
  }
}
