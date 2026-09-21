export function isPhonePeConfigured(): boolean {
  return Boolean(
    process.env.PHONEPE_CLIENT_ID?.trim() &&
      process.env.PHONEPE_CLIENT_SECRET?.trim(),
  );
}

function bases() {
  const prod = process.env.PHONEPE_ENV === "production";
  return prod
    ? {
        auth: "https://api.phonepe.com/apis/identity-manager/v1/oauth/login",
        pg: "https://api.phonepe.com/apis/pg",
      }
    : {
        auth: "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/login",
        pg: "https://api-preprod.phonepe.com/apis/pg-sandbox",
      };
}

let cached: { token: string; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && Date.now() < cached.expires) return cached.token;

  const body = new URLSearchParams({
    client_id: process.env.PHONEPE_CLIENT_ID || "",
    client_version: process.env.PHONEPE_CLIENT_VERSION || "1",
    client_secret: process.env.PHONEPE_CLIENT_SECRET || "",
    grant_type: "client_credentials",
  });

  const res = await fetch(bases().auth, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await res.json()) as {
    access_token?: string;
    expires_at?: number;
    message?: string;
  };
  if (!res.ok || !data.access_token) {
    throw new Error(data.message || "PhonePe auth failed");
  }
  const expires =
    typeof data.expires_at === "number"
      ? data.expires_at * 1000 - 60_000
      : Date.now() + 20 * 60 * 1000;
  cached = { token: data.access_token, expires };
  return data.access_token;
}

export async function createPhonePePayment(opts: {
  merchantOrderId: string;
  amountPaise: number;
  redirectUrl: string;
}): Promise<{ redirectUrl: string; phonepeOrderId: string }> {
  const token = await accessToken();
  const res = await fetch(`${bases().pg}/checkout/v2/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify({
      merchantOrderId: opts.merchantOrderId,
      amount: opts.amountPaise,
      expireAfter: 1200,
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Genradius order",
        merchantUrls: { redirectUrl: opts.redirectUrl },
      },
    }),
  });
  const data = (await res.json()) as {
    redirectUrl?: string;
    orderId?: string;
    message?: string;
    code?: string;
  };
  if (!res.ok || !data.redirectUrl) {
    throw new Error(data.message || data.code || "PhonePe checkout failed");
  }
  return {
    redirectUrl: data.redirectUrl,
    phonepeOrderId: data.orderId || "",
  };
}

export async function getPhonePeStatus(
  merchantOrderId: string,
): Promise<"COMPLETED" | "FAILED" | "PENDING"> {
  const token = await accessToken();
  const res = await fetch(
    `${bases().pg}/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status?details=false`,
    {
      headers: { Authorization: `O-Bearer ${token}` },
      cache: "no-store",
    },
  );
  const data = (await res.json()) as { state?: string };
  if (data.state === "COMPLETED") return "COMPLETED";
  if (data.state === "FAILED") return "FAILED";
  return "PENDING";
}
