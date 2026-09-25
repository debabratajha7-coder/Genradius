import { NextResponse } from "next/server";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import {
  computeCheckoutTotals,
  getCheckoutSettings,
} from "@/lib/site-settings";
import { parseAddress, priceCart, type CheckoutItemInput } from "@/lib/orders";
import { createPhonePePayment, isPhonePeConfigured } from "@/lib/phonepe";
import { confirmCodOrder } from "@/lib/order-lifecycle";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/site";
import { checkPhoneOtp } from "@/lib/twilio";
import { getUserSession } from "@/lib/user-auth";
import Order from "@/models/Order";

function orderNumber() {
  return `GR${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

export async function POST(req: Request) {
  const limited = rateLimit({
    key: `checkout:${clientIp(req)}`,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Wait a few minutes." },
      { status: 429 },
    );
  }

  if (useMemoryCatalog()) {
    return NextResponse.json(
      { error: "Checkout needs MongoDB (USE_MEMORY_CATALOG=false)." },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
      line2?: string;
      city?: string;
      state?: string;
      pincode?: string;
      items?: CheckoutItemInput[];
      paymentMethod?: "prepaid" | "cod";
      codOtp?: string;
    };

    const paymentMethod =
      body.paymentMethod === "cod" ? "cod" : "prepaid";
    const settings = await getCheckoutSettings();

    if (paymentMethod === "cod" && !settings.codEnabled) {
      return NextResponse.json(
        { error: "Cash on delivery is not available right now." },
        { status: 400 },
      );
    }
    if (paymentMethod === "prepaid" && !isPhonePeConfigured()) {
      return NextResponse.json(
        {
          error:
            "Online payment isn’t configured yet. Add PhonePe credentials or choose COD.",
        },
        { status: 503 },
      );
    }

    const address = parseAddress(body);
    if (!address.ok) {
      return NextResponse.json({ error: address.error }, { status: 400 });
    }

    if (paymentMethod === "cod" && settings.codOtpRequired) {
      const otp = String(body.codOtp || "").trim();
      if (!otp) {
        return NextResponse.json(
          { error: "Enter the OTP sent to your phone for COD." },
          { status: 400 },
        );
      }
      const ok = await checkPhoneOtp(address.phone, otp);
      if (!ok) {
        return NextResponse.json(
          { error: "Invalid or expired COD OTP." },
          { status: 400 },
        );
      }
    }

    const priced = await priceCart(body.items || []);
    if (!priced.ok) {
      return NextResponse.json({ error: priced.error }, { status: 400 });
    }

    const fees = computeCheckoutTotals(
      priced.subtotal,
      paymentMethod,
      settings,
    );
    const id = orderNumber();
    const session = await getUserSession();
    const line2 = String(body.line2 || "").trim();
    const snapshot = {
      fullName: address.name,
      phone: address.phone,
      email: address.email,
      line1: address.address,
      line2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: "India",
    };

    await connectDB();
    await Order.create({
      orderNumber: id,
      merchantOrderId: id,
      userId: session?.userId || "",
      items: priced.items.map((i) => ({ ...i, weightKg: 0.4 })),
      subtotal: priced.subtotal,
      shippingFee: fees.shippingFee,
      shipping: fees.shippingFee,
      codFee: fees.codFee,
      total: fees.total,
      paymentMethod,
      paymentStatus: "pending",
      status: "pending_payment",
      shippingAddress: snapshot,
      billingAddress: snapshot,
      name: address.name,
      phone: address.phone,
      email: address.email,
      address: [address.address, line2].filter(Boolean).join(", "),
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      timeline: [{ status: "created", at: new Date(), note: paymentMethod }],
    });

    if (paymentMethod === "cod") {
      await confirmCodOrder(id);
      return NextResponse.json({
        ok: true,
        orderNumber: id,
        merchantOrderId: id,
        paymentMethod: "cod",
        redirectUrl: `${getSiteUrl()}/checkout/success?order_id=${id}`,
        total: fees.total,
        shippingFee: fees.shippingFee,
        codFee: fees.codFee,
      });
    }

    const pay = await createPhonePePayment({
      merchantOrderId: id,
      amountPaise: Math.round(fees.total * 100),
      redirectUrl: `${getSiteUrl()}/checkout/success?order_id=${id}`,
    });

    await Order.findOneAndUpdate(
      { orderNumber: id },
      { $set: { phonepeOrderId: pay.phonepeOrderId } },
    );

    return NextResponse.json({
      ok: true,
      orderNumber: id,
      merchantOrderId: id,
      paymentMethod: "prepaid",
      redirectUrl: pay.redirectUrl,
      total: fees.total,
      shippingFee: fees.shippingFee,
      codFee: fees.codFee,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    console.error("[checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
