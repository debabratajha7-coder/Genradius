import { Resend } from "resend";

export async function sendTransactionalEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESEND_FROM?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    "Genradius <info@genradius.in>";
  if (!key || !opts.to) {
    console.info("[email] skip (no RESEND_API_KEY or to)", opts.subject);
    return;
  }
  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  } catch (e) {
    console.error("[email] failed", e instanceof Error ? e.message : e);
  }
}
