import { connectDB, useMemoryCatalog } from "@/lib/db";
import { normalizeEmail } from "@/lib/password";
import { listMemberEmails } from "@/lib/users";
import Subscriber from "@/models/Subscriber";

export type Audience = "newsletter" | "members" | "all";

export type SubscriberLean = {
  _id: string;
  email: string;
  source: string;
  active: boolean;
  createdAt?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __genradiusSubscribers: Map<string, SubscriberLean> | undefined;
}

function memStore() {
  if (!global.__genradiusSubscribers) {
    global.__genradiusSubscribers = new Map();
  }
  return global.__genradiusSubscribers;
}

export async function addSubscriber(
  rawEmail: string,
  source: "footer" | "admin" | "import" = "footer",
): Promise<
  { ok: true; email: string } | { ok: false; error: string; status: number }
> {
  const email = normalizeEmail(rawEmail);
  if (!email) {
    return { ok: false, error: "Enter a valid email", status: 400 };
  }

  if (useMemoryCatalog()) {
    const store = memStore();
    const existing = store.get(email);
    if (existing) {
      existing.active = true;
      store.set(email, existing);
      return { ok: true, email };
    }
    store.set(email, {
      _id: `sub-${Date.now()}`,
      email,
      source,
      active: true,
      createdAt: new Date().toISOString(),
    });
    return { ok: true, email };
  }

  try {
    await connectDB();
    await Subscriber.findOneAndUpdate(
      { email },
      { $set: { email, source, active: true } },
      { upsert: true, new: true },
    );
    return { ok: true, email };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not subscribe";
    return { ok: false, error: message, status: 500 };
  }
}

export async function listSubscribers(): Promise<SubscriberLean[]> {
  if (useMemoryCatalog()) {
    return [...memStore().values()].filter((s) => s.active);
  }
  await connectDB();
  const rows = await Subscriber.find({ active: true })
    .sort({ createdAt: -1 })
    .lean();
  return rows.map((r) => ({
    _id: String(r._id),
    email: r.email,
    source: r.source || "footer",
    active: Boolean(r.active),
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
  }));
}

export async function getAudienceEmails(
  audience: Audience,
): Promise<{ emails: string[]; newsletter: number; members: number }> {
  const [subs, members] = await Promise.all([
    listSubscribers(),
    listMemberEmails(),
  ]);
  const newsletter = subs.map((s) => s.email.toLowerCase());

  const set = new Set<string>();
  if (audience === "newsletter" || audience === "all") {
    newsletter.forEach((e) => set.add(e));
  }
  if (audience === "members" || audience === "all") {
    members.forEach((e) => set.add(e));
  }

  return {
    emails: [...set],
    newsletter: newsletter.length,
    members: members.length,
  };
}
