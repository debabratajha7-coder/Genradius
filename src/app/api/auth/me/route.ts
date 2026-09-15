import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";
import { maskPhone } from "@/lib/phone";
import { findUserById, isProfileComplete } from "@/lib/users";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const record = await findUserById(session.userId);
  const profileComplete = record ? isProfileComplete(record) : false;

  return NextResponse.json({
    user: {
      id: session.userId,
      phone: session.phone || record?.phone || null,
      phoneMasked: session.phone
        ? maskPhone(session.phone)
        : record?.phone
          ? maskPhone(record.phone)
          : null,
      email: session.email || record?.email || null,
      name: session.name || record?.name || null,
      provider: session.provider || record?.provider || "phone",
      profileComplete,
    },
  });
}
