import { connectDB, useMemoryCatalog } from "@/lib/db";
import { INDIAN_STATES } from "@/lib/india-states";
import { normalizeEmail } from "@/lib/password";
import { normalizePhone } from "@/lib/phone";
import Product from "@/models/Product";
import Order from "@/models/Order";

export type CheckoutItemInput = {
  productId: string;
  slug: string;
  size: string;
  qty: number;
};

export type PricedItem = {
  productId: string;
  slug: string;
  title: string;
  size: string;
  qty: number;
  price: number;
};

const STATES = new Set<string>(INDIAN_STATES);

export function weightKg(items: { qty: number }[]): number {
  const kg = items.reduce((n, i) => n + i.qty * 0.4, 0);
  return Math.max(0.5, Math.round(kg * 10) / 10);
}

export async function priceCart(
  items: CheckoutItemInput[],
): Promise<{ ok: true; items: PricedItem[]; subtotal: number } | { ok: false; error: string }> {
  if (!items.length) return { ok: false, error: "Your bag is empty" };
  if (useMemoryCatalog()) {
    return { ok: false, error: "Checkout needs MongoDB (USE_MEMORY_CATALOG=false)." };
  }

  await connectDB();
  const slugs = [...new Set(items.map((i) => i.slug))];
  const products = await Product.find({
    slug: { $in: slugs },
    $or: [{ active: true }, { active: { $exists: false } }],
  }).lean();
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const priced: PricedItem[] = [];
  for (const item of items) {
    const qty = Math.floor(Number(item.qty));
    if (!item.slug || !item.size || qty < 1 || qty > 10) {
      return { ok: false, error: "Invalid bag item" };
    }
    const product = bySlug.get(item.slug);
    if (!product) return { ok: false, error: `Product unavailable: ${item.slug}` };
    if (!product.sizes?.includes(item.size)) {
      return { ok: false, error: `Size ${item.size} unavailable for ${product.title}` };
    }
    // Stock: check only — do not decrement (manual inventory / Shiprocket).
    const stockMap = product.stockBySize as
      | Map<string, number>
      | Record<string, number>
      | undefined;
    const stock =
      stockMap instanceof Map
        ? stockMap.get(item.size)
        : stockMap?.[item.size];
    if (typeof stock === "number" && stock < qty) {
      return {
        ok: false,
        error:
          stock <= 0
            ? `${product.title} (${item.size}) is out of stock`
            : `Only ${stock} left for ${product.title} (${item.size})`,
      };
    }
    priced.push({
      productId: String(product._id),
      slug: product.slug,
      title: product.title,
      size: item.size,
      qty,
      price: product.price,
    });
  }
  const subtotal = priced.reduce((n, i) => n + i.price * i.qty, 0);
  return { ok: true, items: priced, subtotal };
}

export function parseAddress(body: {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}):
  | {
      ok: true;
      name: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    }
  | { ok: false; error: string } {
  const name = String(body.name || "").trim();
  const phone = normalizePhone(String(body.phone || ""));
  const email = normalizeEmail(String(body.email || ""));
  const address = String(body.address || "").trim();
  const city = String(body.city || "").trim();
  const state = String(body.state || "").trim();
  const pincode = String(body.pincode || "").replace(/\D/g, "");

  if (name.length < 2) return { ok: false, error: "Enter your full name" };
  if (!phone) return { ok: false, error: "Enter a valid phone" };
  if (!email) return { ok: false, error: "Enter a valid email" };
  if (address.length < 6) return { ok: false, error: "Enter a full address" };
  if (city.length < 2) return { ok: false, error: "Enter a city" };
  if (!STATES.has(state)) return { ok: false, error: "Select a state" };
  if (!/^\d{6}$/.test(pincode)) return { ok: false, error: "Enter a 6-digit pincode" };

  return { ok: true, name, phone, email, address, city, state, pincode };
}

export async function listOrders(limit = 50) {
  if (useMemoryCatalog()) return [];
  await connectDB();
  const rows = await Order.find().sort({ createdAt: -1 }).limit(limit).lean();
  return rows.map((r) => ({
    _id: String(r._id),
    orderNumber: r.orderNumber || r.merchantOrderId,
    merchantOrderId: r.merchantOrderId,
    name: r.name,
    phone: r.phone,
    email: r.email,
    city: r.city,
    pincode: r.pincode,
    total: r.total,
    shipping: r.shippingFee ?? r.shipping,
    shippingFee: r.shippingFee ?? r.shipping,
    codFee: r.codFee || 0,
    paymentMethod: r.paymentMethod || "prepaid",
    paymentStatus: r.paymentStatus || "pending",
    status: r.status,
    courier: r.courier || "",
    awb: r.awb || "",
    trackingUrl: r.trackingUrl || "",
    shiprocketOrderId: r.shiprocketOrderId || "",
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
    items: r.items,
  }));
}
