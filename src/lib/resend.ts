import { Resend } from "resend";

export type MailAttachment = {
  filename: string;
  content: Buffer | string;
  contentType?: string;
};

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getResendFrom(): string {
  return (
    process.env.RESEND_FROM?.trim() ||
    "Genradius <onboarding@resend.dev>"
  );
}

function client() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "RESEND_API_KEY is missing. Add it to .env.local from resend.com",
    );
  }
  return new Resend(key);
}

/** Escape plain text for safe HTML email bodies */
export function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return escaped
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 1em;line-height:1.5">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

export function wrapCampaignHtml(bodyHtml: string, subject: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><title>${subject.replace(/</g, "")}</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;color:#2a291e;font-family:system-ui,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <p style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#be9c7d;font-weight:800;margin:0 0 12px">Genradius</p>
    <div style="background:#fff;border:2px solid #2a291e;padding:24px;box-shadow:4px 4px 0 0 #2a291e">
      ${bodyHtml}
    </div>
    <p style="margin:20px 0 0;font-size:11px;color:#5c5a4e;line-height:1.4">
      You’re getting this because you joined the Genradius circle or have an account with us.
    </p>
  </div>
</body>
</html>`;
}

export async function sendCampaignEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: MailAttachment[];
}): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  try {
    const resend = client();
    const { data, error } = await resend.emails.send({
      from: getResendFrom(),
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      attachments: opts.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });
    if (error) {
      return { ok: false, error: error.message || "Send failed" };
    }
    return { ok: true, id: data?.id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Send failed",
    };
  }
}

/** Send to many recipients one-by-one (Resend free tier friendly). */
export async function sendCampaignBulk(opts: {
  emails: string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: MailAttachment[];
}): Promise<{ sent: number; failed: number; errors: string[] }> {
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const to of opts.emails) {
    const result = await sendCampaignEmail({
      to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      attachments: opts.attachments,
    });
    if (result.ok) {
      sent += 1;
    } else {
      failed += 1;
      if (errors.length < 8) {
        errors.push(`${to}: ${result.error}`);
      }
    }
  }

  return { sent, failed, errors };
}
