import twilio from "twilio";

const OTP_STORE = globalThis as unknown as {
  __genradiusOtp?: Map<string, { code: string; expires: number }>;
};

function otpStore() {
  if (!OTP_STORE.__genradiusOtp) {
    OTP_STORE.__genradiusOtp = new Map();
  }
  return OTP_STORE.__genradiusOtp;
}

export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      (process.env.TWILIO_VERIFY_SERVICE_SID || process.env.TWILIO_PHONE_NUMBER),
  );
}

function client() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!,
  );
}

/** Send OTP via Twilio Verify (preferred) or SMS fallback / local mock. */
export async function sendPhoneOtp(phone: string): Promise<{
  ok: boolean;
  mock?: boolean;
  message: string;
}> {
  if (!isTwilioConfigured()) {
    const code = "123456";
    otpStore().set(phone, {
      code,
      expires: Date.now() + 10 * 60 * 1000,
    });
    console.info(`[auth] Twilio not configured — mock OTP for ${phone}: ${code}`);
    return {
      ok: true,
      mock: true,
      message: "Dev mode: use OTP 123456 (add Twilio env to send real SMS).",
    };
  }

  const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (verifySid) {
    await client().verify.v2.services(verifySid).verifications.create({
      to: phone,
      channel: "sms",
    });
    return { ok: true, message: "OTP sent via Twilio Verify." };
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore().set(phone, {
    code,
    expires: Date.now() + 10 * 60 * 1000,
  });
  await client().messages.create({
    to: phone,
    from: process.env.TWILIO_PHONE_NUMBER!,
    body: `Your Genradius login code is ${code}. Valid for 10 minutes.`,
  });
  return { ok: true, message: "OTP sent via SMS." };
}

export async function checkPhoneOtp(
  phone: string,
  code: string,
): Promise<boolean> {
  const trimmed = code.trim();

  if (!isTwilioConfigured()) {
    const entry = otpStore().get(phone);
    if (!entry) return trimmed === "123456";
    if (Date.now() > entry.expires) {
      otpStore().delete(phone);
      return false;
    }
    const ok = entry.code === trimmed;
    if (ok) otpStore().delete(phone);
    return ok;
  }

  const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (verifySid) {
    const result = await client()
      .verify.v2.services(verifySid)
      .verificationChecks.create({ to: phone, code: trimmed });
    return result.status === "approved";
  }

  const entry = otpStore().get(phone);
  if (!entry || Date.now() > entry.expires) {
    otpStore().delete(phone);
    return false;
  }
  const ok = entry.code === trimmed;
  if (ok) otpStore().delete(phone);
  return ok;
}
