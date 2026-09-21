const API = "https://apiv2.shiprocket.in/v1/external";

export function isShiprocketConfigured(): boolean {
  return Boolean(
    process.env.SHIPROCKET_EMAIL?.trim() &&
      process.env.SHIPROCKET_PASSWORD?.trim() &&
      process.env.SHIPROCKET_PICKUP_PINCODE?.trim(),
  );
}

let cached: { token: string; expires: number } | null = null;

async function token(): Promise<string> {
  if (cached && Date.now() < cached.expires) return cached.token;
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = (await res.json()) as { token?: string; message?: string };
  if (!res.ok || !data.token) {
    throw new Error(data.message || "Shiprocket login failed");
  }
  cached = { token: data.token, expires: Date.now() + 9 * 24 * 60 * 60 * 1000 };
  return data.token;
}

export type ShippingQuote = {
  amount: number;
  courier: string;
  etd: string;
};

/** Cheapest prepaid courier for a delivery pincode. Weight in kg. */
export async function quoteShipping(opts: {
  deliveryPincode: string;
  weightKg: number;
}): Promise<ShippingQuote> {
  const pickup = process.env.SHIPROCKET_PICKUP_PINCODE || "";
  const tok = await token();
  const url = new URL(`${API}/courier/serviceability/`);
  url.searchParams.set("pickup_postcode", pickup);
  url.searchParams.set("delivery_postcode", opts.deliveryPincode);
  url.searchParams.set("cod", "0");
  url.searchParams.set("weight", String(Math.max(0.5, opts.weightKg)));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${tok}` },
    cache: "no-store",
  });
  const data = (await res.json()) as {
    data?: {
      available_courier_companies?: Array<{
        courier_name?: string;
        rate?: number;
        freight_charge?: number;
        etd?: string;
      }>;
    };
    message?: string;
  };
  const companies = data.data?.available_courier_companies || [];
  if (!res.ok || !companies.length) {
    throw new Error(data.message || "No courier for this pincode");
  }
  const best = companies.reduce((a, b) => {
    const ar = Number(a.rate ?? a.freight_charge ?? 99999);
    const br = Number(b.rate ?? b.freight_charge ?? 99999);
    return br < ar ? b : a;
  });
  return {
    amount: Math.ceil(Number(best.rate ?? best.freight_charge ?? 0)),
    courier: best.courier_name || "Shiprocket",
    etd: best.etd || "",
  };
}

export async function createShiprocketOrder(opts: {
  orderId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { title: string; slug: string; qty: number; price: number }[];
  subtotal: number;
  weightKg: number;
}): Promise<{ orderId: string; shipmentId: string }> {
  const tok = await token();
  const [first, ...rest] = opts.name.trim().split(/\s+/);
  const res = await fetch(`${API}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tok}`,
    },
    body: JSON.stringify({
      order_id: opts.orderId,
      order_date: new Date().toISOString().slice(0, 16).replace("T", " "),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
      billing_customer_name: first || opts.name,
      billing_last_name: rest.join(" ") || ".",
      billing_address: opts.address,
      billing_city: opts.city,
      billing_pincode: opts.pincode,
      billing_state: opts.state,
      billing_country: "India",
      billing_email: opts.email,
      billing_phone: opts.phone.replace(/\D/g, "").slice(-10),
      shipping_is_billing: true,
      order_items: opts.items.map((item) => ({
        name: item.title,
        sku: `${item.slug}-${item.qty}`,
        units: item.qty,
        selling_price: item.price,
      })),
      payment_method: "Prepaid",
      sub_total: opts.subtotal,
      length: 25,
      breadth: 20,
      height: 5,
      weight: Math.max(0.5, opts.weightKg),
    }),
  });
  const data = (await res.json()) as {
    order_id?: number;
    shipment_id?: number;
    message?: string;
  };
  if (!res.ok || !data.order_id) {
    throw new Error(data.message || "Shiprocket order failed");
  }
  return {
    orderId: String(data.order_id),
    shipmentId: String(data.shipment_id || ""),
  };
}
