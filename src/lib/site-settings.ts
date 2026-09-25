import { connectDB, useMemoryCatalog } from "@/lib/db";
import { isTwilioConfigured } from "@/lib/twilio";
import SiteSettings from "@/models/SiteSettings";

export type CheckoutSettings = {
  freeShippingThreshold: number;
  shippingFee: number;
  codFee: number;
  codEnabled: boolean;
  emiEnabled: boolean;
  pickupLocationName: string;
  /** True when Twilio/SMS is configured — COD OTP required */
  codOtpRequired: boolean;
};

const DEFAULTS: Omit<CheckoutSettings, "codOtpRequired"> = {
  freeShippingThreshold: 1000,
  shippingFee: 99,
  codFee: 49,
  codEnabled: true,
  emiEnabled: false,
  pickupLocationName: "Primary",
};

declare global {
  // eslint-disable-next-line no-var
  var __genradiusSiteSettings: CheckoutSettings | undefined;
}

function withOtp(
  row: Omit<CheckoutSettings, "codOtpRequired">,
): CheckoutSettings {
  return { ...row, codOtpRequired: isTwilioConfigured() };
}

export async function getCheckoutSettings(): Promise<CheckoutSettings> {
  if (useMemoryCatalog()) {
    return withOtp({ ...DEFAULTS });
  }
  try {
    await connectDB();
    let doc = await SiteSettings.findOne({ key: "default" });
    if (!doc) {
      doc = await SiteSettings.create({ key: "default", ...DEFAULTS });
    }
    return withOtp({
      freeShippingThreshold: Number(doc.freeShippingThreshold) || 1000,
      shippingFee: Math.max(0, Number(doc.shippingFee) || 0),
      codFee: Math.max(0, Number(doc.codFee) || 0),
      codEnabled: doc.codEnabled !== false,
      emiEnabled: Boolean(doc.emiEnabled),
      pickupLocationName:
        String(doc.pickupLocationName || "").trim() || "Primary",
    });
  } catch {
    return withOtp({ ...DEFAULTS });
  }
}

export async function updateCheckoutSettings(
  patch: Partial<Omit<CheckoutSettings, "codOtpRequired">>,
): Promise<CheckoutSettings> {
  if (useMemoryCatalog()) {
    throw new Error("Settings need MongoDB (USE_MEMORY_CATALOG=false).");
  }
  await connectDB();
  const update: Record<string, unknown> = {};
  if (patch.freeShippingThreshold != null)
    update.freeShippingThreshold = Math.max(
      0,
      Number(patch.freeShippingThreshold),
    );
  if (patch.shippingFee != null)
    update.shippingFee = Math.max(0, Number(patch.shippingFee));
  if (patch.codFee != null) update.codFee = Math.max(0, Number(patch.codFee));
  if (patch.codEnabled != null) update.codEnabled = Boolean(patch.codEnabled);
  if (patch.emiEnabled != null) update.emiEnabled = Boolean(patch.emiEnabled);
  if (patch.pickupLocationName != null)
    update.pickupLocationName =
      String(patch.pickupLocationName).trim() || "Primary";

  const doc = await SiteSettings.findOneAndUpdate(
    { key: "default" },
    { $set: update, $setOnInsert: { key: "default" } },
    { upsert: true, new: true },
  );
  return withOtp({
    freeShippingThreshold: Number(doc.freeShippingThreshold) || 1000,
    shippingFee: Math.max(0, Number(doc.shippingFee) || 0),
    codFee: Math.max(0, Number(doc.codFee) || 0),
    codEnabled: doc.codEnabled !== false,
    emiEnabled: Boolean(doc.emiEnabled),
    pickupLocationName:
      String(doc.pickupLocationName || "").trim() || "Primary",
  });
}

/** Server-side fee math — never trust the client. */
export function computeCheckoutTotals(
  subtotal: number,
  paymentMethod: "prepaid" | "cod",
  settings: CheckoutSettings,
): { shippingFee: number; codFee: number; total: number } {
  const shippingFee =
    subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const codFee =
    paymentMethod === "cod" && settings.codEnabled ? settings.codFee : 0;
  return {
    shippingFee,
    codFee,
    total: subtotal + shippingFee + codFee,
  };
}
