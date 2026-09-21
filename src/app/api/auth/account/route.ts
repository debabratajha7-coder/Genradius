import { NextResponse } from "next/server";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import AccountDeletion from "@/models/AccountDeletion";
import Subscriber from "@/models/Subscriber";
import { clearUserSession, getUserSession } from "@/lib/user-auth";
import { deleteUserAccount } from "@/lib/users";

export const DELETE_REASONS = [
  { id: "too_many_emails", label: "Too many emails / notifications" },
  { id: "privacy", label: "Privacy concerns" },
  { id: "not_using", label: "I’m not using Genradius anymore" },
  { id: "created_by_mistake", label: "Created by mistake / testing" },
  { id: "switching_account", label: "Switching to another account" },
  { id: "other", label: "Other" },
] as const;

export async function DELETE(req: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      reason?: string;
      details?: string;
      confirm?: string;
      removeNewsletter?: boolean;
    };

    const reason = String(body.reason || "").trim();
    const details = String(body.details || "").trim().slice(0, 1000);
    const confirm = String(body.confirm || "").trim().toUpperCase();
    const removeNewsletter = body.removeNewsletter !== false;

    const validReason = DELETE_REASONS.some((r) => r.id === reason);
    if (!validReason) {
      return NextResponse.json(
        { error: "Please select a reason for leaving" },
        { status: 400 },
      );
    }
    if (confirm !== "DELETE") {
      return NextResponse.json(
        { error: 'Type DELETE to confirm account deletion' },
        { status: 400 },
      );
    }

    const result = await deleteUserAccount(session.userId);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    // Anonymized feedback only — no phone/email stored
    if (!useMemoryCatalog()) {
      try {
        await connectDB();
        await AccountDeletion.create({
          reason,
          details,
          provider: session.provider || "",
        });
        if (removeNewsletter && result.email) {
          await Subscriber.findOneAndUpdate(
            { email: result.email.toLowerCase() },
            { $set: { active: false } },
          );
        }
      } catch {
        /* feedback is best-effort */
      }
    }

    await clearUserSession();

    return NextResponse.json({
      ok: true,
      message: "Your account has been permanently deleted.",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not delete account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
