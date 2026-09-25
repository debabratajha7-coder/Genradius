import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  applyFulfillmentUpdate,
  verifyFulfillmentWebhookToken,
} from "@/lib/order-lifecycle";

/**
 * Shiprocket / fulfillment tracking webhook (path avoids "shiprocket" in URL).
 * Dashboard URL: {APP_URL}/api/webhooks/fulfillment?token=SHIPROCKET_WEBHOOK_TOKEN
 * Or header x-api-key / Authorization: Bearer …
 */
export async function POST(req: Request) {
  const limited = rateLimit({
    key: `fulfill-wh:${clientIp(req)}`,
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  if (!verifyFulfillmentWebhookToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const orderNumber = String(
      body.channel_order_id ||
        body.order_id ||
        body.orderId ||
        body.sr_order_id ||
        "",
    );
    const shiprocketOrderId = String(
      body.sr_order_id || body.shiprocket_order_id || body.order_id || "",
    );
    const shipmentId = String(
      body.shipment_id || body.sr_shipment_id || body.shipmentId || "",
    );
    const awb = String(body.awb || body.awb_code || body.awbNumber || "");
    const courier = String(
      body.courier_name || body.courier || body.courierName || "",
    );
    const statusLabel = String(
      body.current_status ||
        body.shipment_status ||
        body.status ||
        body.current_status_id ||
        "update",
    );

    const result = await applyFulfillmentUpdate({
      orderNumber: orderNumber || undefined,
      shiprocketOrderId: shiprocketOrderId || undefined,
      shipmentId: shipmentId || undefined,
      awb: awb || undefined,
      courier: courier || undefined,
      statusLabel,
    });

    return NextResponse.json({ ok: true, matched: result.matched });
  } catch (e) {
    console.error("[fulfillment webhook]", e);
    return NextResponse.json({ ok: true, matched: false });
  }
}
