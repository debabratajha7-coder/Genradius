import { randomInt } from "crypto";
import { normalizeEmail } from "@/lib/password";
import { isResendConfigured, getResendFrom } from "@/lib/resend";
import { Resend } from "resend";

const STORE = globalThis as unknown as {
  __genradiusEmailOtp?: Map<
    string,
    { code: string; expires: number; userId: string }
  >;
  __genradiusEmailVerified?: Map<string, { email: string; expires: number }>;
};

function otpStore() {
  if (!STORE.__genradiusEmailOtp) STORE.__genradiusEmailOtp = new Map();
  return STORE.__genradiusEmailOtp;
}

function verifiedStore() {
  if (!STORE.__genradiusEmailVerified) {
    STORE.__genradiusEmailVerified = new Map();
  }
  return STORE.__genradiusEmailVerified;
}

function keyFor(userId: string, email: string) {
  return `${userId}:${email}`;
}

export async function sendEmailOtp(opts: {
  userId: string;
  email: string;
}): Promise<{ ok: true; mock?: boolean; message: string } | { ok: false; error: string }> {
  const email = normalizeEmail(opts.email);
  if (!email) return { ok: false, error: "Enter a valid email" };

  const code = isResendConfigured()
    ? String(randomInt(100000, 999999))
    : "123456";

  otpStore().set(keyFor(opts.userId, email), {
    code,
    expires: Date.now() + 10 * 60 * 1000,
    userId: opts.userId,
  });

  if (!isResendConfigured()) {
    console.info(
      `[auth] Resend not configured — mock email OTP for ${email}: ${code}`,
    );
    return {
      ok: true,
      mock: true,
      message: "Dev mode: use OTP 123456 (add RESEND_API_KEY to send real email).",
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const { error } = await resend.emails.send({
      from: getResendFrom(),
      to: email,
      subject: `${code} is your Genradius email code`,
      text: `Your Genradius verification code is ${code}. It expires in 10 minutes.\n\nIf you didn’t request this, ignore this email.`,
      html: `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;background:#f7f5f0;color:#2a291e;padding:32px">
  <div style="max-width:420px;margin:0 auto;background:#fff;border:2px solid #2a291e;padding:24px;box-shadow:4px 4px 0 #2a291e">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#be9c7d;font-weight:800;margin:0 0 12px">Genradius</p>
    <p style="margin:0 0 8px;font-size:14px">Your email verification code:</p>
    <p style="margin:0;font-size:32px;font-weight:800;letter-spacing:0.2em">${code}</p>
    <p style="margin:16px 0 0;font-size:12px;color:#5c5a4e">Expires in 10 minutes.</p>
  </div>
</body></html>`,
    });
    if (error) {
      return { ok: false, error: error.message || "Could not send email OTP" };
    }
    return { ok: true, message: `OTP sent to ${email}` };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not send email OTP",
    };
  }
}

export function checkEmailOtp(opts: {
  userId: string;
  email: string;
  code: string;
}): boolean {
  const email = normalizeEmail(opts.email);
  if (!email) return false;
  const trimmed = opts.code.trim();
  const key = keyFor(opts.userId, email);
  const entry = otpStore().get(key);

  if (!entry) {
    // Dev fallback when Resend wasn’t configured
    if (!isResendConfigured() && trimmed === "123456") {
      markEmailVerified(opts.userId, email);
      return true;
    }
    return false;
  }

  if (Date.now() > entry.expires || entry.userId !== opts.userId) {
    otpStore().delete(key);
    return false;
  }

  const ok = entry.code === trimmed;
  if (ok) {
    otpStore().delete(key);
    markEmailVerified(opts.userId, email);
  }
  return ok;
}

export function markEmailVerified(userId: string, email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  verifiedStore().set(userId, {
    email: normalized,
    expires: Date.now() + 30 * 60 * 1000,
  });
}

export function consumeEmailVerification(
  userId: string,
  email: string,
): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  const entry = verifiedStore().get(userId);
  if (!entry) return false;
  if (Date.now() > entry.expires) {
    verifiedStore().delete(userId);
    return false;
  }
  if (entry.email !== normalized) return false;
  verifiedStore().delete(userId);
  return true;
}

/** Peek without consuming — for UI messaging */
export function hasEmailVerification(userId: string, email: string): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  const entry = verifiedStore().get(userId);
  if (!entry || Date.now() > entry.expires) return false;
  return entry.email === normalized;
}
