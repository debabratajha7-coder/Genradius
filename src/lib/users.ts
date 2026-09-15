import { connectDB, useMemoryCatalog } from "@/lib/db";
import User from "@/models/User";

export type AuthUserRecord = {
  id: string;
  phone?: string;
  email?: string;
  name: string;
  googleId?: string;
  passwordHash?: string;
  provider: "phone" | "email" | "google";
};

type MemoryUser = AuthUserRecord;

const MEMORY = globalThis as unknown as {
  __genradiusAuthUsers?: Map<string, MemoryUser>;
};

function memoryStore() {
  if (!MEMORY.__genradiusAuthUsers) {
    MEMORY.__genradiusAuthUsers = new Map();
  }
  return MEMORY.__genradiusAuthUsers;
}

function memKey(parts: {
  phone?: string;
  email?: string;
  googleId?: string;
}) {
  if (parts.googleId) return `google:${parts.googleId}`;
  if (parts.email) return `email:${parts.email}`;
  if (parts.phone) return `phone:${parts.phone}`;
  return `anon:${Date.now()}`;
}

export async function upsertPhoneUser(phone: string): Promise<AuthUserRecord> {
  if (useMemoryCatalog()) {
    const store = memoryStore();
    const key = memKey({ phone });
    const existing = store.get(key);
    if (existing) return existing;
    const user: MemoryUser = {
      id: `mem-${Date.now()}`,
      phone,
      name: "",
      provider: "phone",
    };
    store.set(key, user);
    return user;
  }

  await connectDB();
  const user = await User.findOneAndUpdate(
    { phone },
    {
      $set: { lastLoginAt: new Date(), provider: "phone" },
      $setOnInsert: { phone },
    },
    { upsert: true, new: true },
  );
  return {
    id: String(user._id),
    phone: user.phone || undefined,
    email: user.email || undefined,
    name: user.name || "",
    passwordHash: user.passwordHash || undefined,
    provider: "phone",
  };
}

export function isProfileComplete(user: AuthUserRecord): boolean {
  if (user.googleId && user.email) return true;
  return Boolean(user.email && user.passwordHash);
}

export async function completePhoneProfile(input: {
  userId: string;
  email: string;
  passwordHash: string;
  name?: string;
}): Promise<
  | { ok: true; user: AuthUserRecord }
  | { ok: false; error: string; status: number }
> {
  if (useMemoryCatalog()) {
    const store = memoryStore();
    const user = [...store.values()].find((u) => u.id === input.userId);
    if (!user) {
      return { ok: false, error: "User not found", status: 404 };
    }
    const emailTaken = [...store.values()].find(
      (u) => u.email === input.email && u.id !== input.userId,
    );
    if (emailTaken) {
      return { ok: false, error: "That email is already in use", status: 409 };
    }
    user.email = input.email;
    user.passwordHash = input.passwordHash;
    if (input.name) user.name = input.name;
    store.set(memKey({ phone: user.phone, email: user.email }), user);
    return { ok: true, user };
  }

  await connectDB();
  const taken = await User.findOne({
    email: input.email,
    _id: { $ne: input.userId },
  });
  if (taken) {
    return { ok: false, error: "That email is already in use", status: 409 };
  }

  const user = await User.findByIdAndUpdate(
    input.userId,
    {
      $set: {
        email: input.email,
        passwordHash: input.passwordHash,
        ...(input.name ? { name: input.name } : {}),
        lastLoginAt: new Date(),
      },
    },
    { new: true },
  );
  if (!user) {
    return { ok: false, error: "User not found", status: 404 };
  }

  return {
    ok: true,
    user: {
      id: String(user._id),
      phone: user.phone || undefined,
      email: user.email || undefined,
      name: user.name || "",
      passwordHash: user.passwordHash || undefined,
      provider: (user.provider as AuthUserRecord["provider"]) || "phone",
    },
  };
}

export async function findUserById(
  userId: string,
): Promise<AuthUserRecord | null> {
  if (useMemoryCatalog()) {
    return [...memoryStore().values()].find((u) => u.id === userId) || null;
  }
  await connectDB();
  const user = await User.findById(userId);
  if (!user) return null;
  return {
    id: String(user._id),
    phone: user.phone || undefined,
    email: user.email || undefined,
    name: user.name || "",
    passwordHash: user.passwordHash || undefined,
    googleId: user.googleId || undefined,
    provider: (user.provider as AuthUserRecord["provider"]) || "phone",
  };
}

export async function upsertEmailUser(input: {
  email: string;
  passwordHash?: string;
  name?: string;
  create?: boolean;
}): Promise<
  | { ok: true; user: AuthUserRecord; created: boolean }
  | { ok: false; error: string; status: number }
> {
  const email = input.email;

  if (useMemoryCatalog()) {
    const store = memoryStore();
    const key = memKey({ email });
    const existing = [...store.values()].find((u) => u.email === email);
    if (existing) {
      if (input.create) {
        return { ok: false, error: "Account already exists. Log in instead.", status: 409 };
      }
      return { ok: true, user: existing, created: false };
    }
    if (!input.create) {
      return { ok: false, error: "No account with this email. Sign up first.", status: 404 };
    }
    if (!input.passwordHash) {
      return { ok: false, error: "Password required", status: 400 };
    }
    const user: MemoryUser = {
      id: `mem-${Date.now()}`,
      email,
      name: input.name || "",
      passwordHash: input.passwordHash,
      provider: "email",
    };
    store.set(key, user);
    return { ok: true, user, created: true };
  }

  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) {
    if (input.create) {
      return { ok: false, error: "Account already exists. Log in instead.", status: 409 };
    }
    return {
      ok: true,
      user: {
        id: String(existing._id),
        email: existing.email || undefined,
        phone: existing.phone || undefined,
        name: existing.name || "",
        passwordHash: existing.passwordHash || undefined,
        googleId: existing.googleId || undefined,
        provider: (existing.provider as AuthUserRecord["provider"]) || "email",
      },
      created: false,
    };
  }

  if (!input.create) {
    return { ok: false, error: "No account with this email. Sign up first.", status: 404 };
  }
  if (!input.passwordHash) {
    return { ok: false, error: "Password required", status: 400 };
  }

  const user = await User.create({
    email,
    passwordHash: input.passwordHash,
    name: input.name || "",
    provider: "email",
    lastLoginAt: new Date(),
  });

  return {
    ok: true,
    user: {
      id: String(user._id),
      email,
      name: user.name || "",
      passwordHash: user.passwordHash || undefined,
      provider: "email",
    },
    created: true,
  };
}

export async function upsertGoogleUser(input: {
  googleId: string;
  email?: string;
  name?: string;
}): Promise<AuthUserRecord> {
  if (useMemoryCatalog()) {
    const store = memoryStore();
    const byGoogle = [...store.values()].find(
      (u) => u.googleId === input.googleId,
    );
    if (byGoogle) {
      byGoogle.name = input.name || byGoogle.name;
      byGoogle.email = input.email || byGoogle.email;
      return byGoogle;
    }
    if (input.email) {
      const byEmail = [...store.values()].find((u) => u.email === input.email);
      if (byEmail) {
        byEmail.googleId = input.googleId;
        byEmail.name = input.name || byEmail.name;
        byEmail.provider = "google";
        return byEmail;
      }
    }
    const user: MemoryUser = {
      id: `mem-${Date.now()}`,
      googleId: input.googleId,
      email: input.email,
      name: input.name || "",
      provider: "google",
    };
    store.set(memKey({ googleId: input.googleId }), user);
    return user;
  }

  await connectDB();
  let user = await User.findOne({ googleId: input.googleId });
  if (!user && input.email) {
    user = await User.findOne({ email: input.email });
  }
  if (user) {
    user.googleId = input.googleId;
    if (input.email) user.email = input.email;
    if (input.name) user.name = input.name;
    user.provider = "google";
    user.lastLoginAt = new Date();
    await user.save();
  } else {
    user = await User.create({
      googleId: input.googleId,
      email: input.email,
      name: input.name || "",
      provider: "google",
      lastLoginAt: new Date(),
    });
  }

  return {
    id: String(user._id),
    googleId: user.googleId || undefined,
    email: user.email || undefined,
    phone: user.phone || undefined,
    name: user.name || "",
    provider: "google",
  };
}

export async function touchLogin(userId: string) {
  if (useMemoryCatalog()) return;
  await connectDB();
  await User.findByIdAndUpdate(userId, { lastLoginAt: new Date() });
}
