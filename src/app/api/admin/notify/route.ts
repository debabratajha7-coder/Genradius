import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  getAudienceEmails,
  listSubscribers,
  type Audience,
} from "@/lib/subscribers";
import {
  isResendConfigured,
  sendCampaignBulk,
  sendCampaignEmail,
  textToHtml,
  wrapCampaignHtml,
  type MailAttachment,
} from "@/lib/resend";

export async function GET() {
  const denied = await requireAdminApi("notify");
  if (denied) return denied;

  try {
    const [audience, subscribers] = await Promise.all([
      getAudienceEmails("all"),
      listSubscribers(),
    ]);
    return NextResponse.json({
      resendReady: isResendConfigured(),
      from: process.env.RESEND_FROM || "Genradius <onboarding@resend.dev>",
      newsletter: audience.newsletter,
      members: audience.members,
      totalUnique: audience.emails.length,
      subscribers: subscribers.slice(0, 100),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdminApi("notify");
  if (denied) return denied;

  if (!isResendConfigured()) {
    return NextResponse.json(
      {
        error:
          "Add RESEND_API_KEY to .env.local (and RESEND_FROM with a verified domain).",
      },
      { status: 503 },
    );
  }

  try {
    const form = await req.formData();
    const subject = String(form.get("subject") || "").trim();
    const body = String(form.get("body") || "").trim();
    const audience = String(form.get("audience") || "all") as Audience;
    const testTo = String(form.get("testTo") || "").trim().toLowerCase();

    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }
    if (!body) {
      return NextResponse.json(
        { error: "Message body is required" },
        { status: 400 },
      );
    }
    if (!["newsletter", "members", "all"].includes(audience) && !testTo) {
      return NextResponse.json({ error: "Invalid audience" }, { status: 400 });
    }

    const attachments: MailAttachment[] = [];
    const files = form.getAll("attachments");
    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) continue;
      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json(
          {
            error: `${file.name} is over 8MB — compress or split attachments`,
          },
          { status: 413 },
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type || undefined,
      });
    }

    const html = wrapCampaignHtml(textToHtml(body), subject);
    const text = body;

    if (testTo) {
      const result = await sendCampaignEmail({
        to: testTo,
        subject: `[TEST] ${subject}`,
        html,
        text,
        attachments,
      });
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 502 });
      }
      return NextResponse.json({ ok: true, test: true, sent: 1, to: testTo });
    }

    const { emails } = await getAudienceEmails(audience);
    if (!emails.length) {
      return NextResponse.json(
        { error: "No emails in that audience yet" },
        { status: 400 },
      );
    }

    if (emails.length > 200) {
      return NextResponse.json(
        {
          error: `Audience is ${emails.length} — send in smaller batches (max 200 per send for now).`,
        },
        { status: 400 },
      );
    }

    const result = await sendCampaignBulk({
      emails,
      subject,
      html,
      text,
      attachments,
    });

    return NextResponse.json({
      ok: true,
      audience,
      ...result,
      recipients: emails.length,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Send failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
