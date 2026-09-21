"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Step = "credentials" | "otp";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [phoneMasked, setPhoneMasked] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onCredentials(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setHint("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setPhoneMasked(data.phoneMasked || "");
      setHint(data.message || "");
      setStep("otp");
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function onVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP failed");
    } finally {
      setBusy(false);
    }
  }

  async function resendOtp() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login/resend-otp", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not resend");
      setHint(data.message || "OTP resent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "mt-2 w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 shadow-[2px_2px_0_0_var(--ink)]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] p-6 shadow-[6px_6px_0_0_var(--ink)]">
        <h1 className="font-[family-name:var(--font-logo)] text-2xl uppercase">
          Genradius Admin
        </h1>
        <p className="mt-1 text-sm text-[var(--moss)]">
          {step === "credentials"
            ? "Sign in with your admin email and password."
            : "Enter the OTP sent to your phone."}
        </p>

        {step === "credentials" ? (
          <form onSubmit={onCredentials} className="mt-5 space-y-3">
            <label className="block text-xs font-extrabold tracking-wider uppercase">
              Email
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
                placeholder="you@genradius.in"
              />
            </label>
            <label className="block text-xs font-extrabold tracking-wider uppercase">
              Password
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
                placeholder="Password"
              />
            </label>
            {error && (
              <p className="text-sm font-semibold text-red-700">{error}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn-accent mt-2 w-full py-3 text-sm"
            >
              {busy ? "Checking…" : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={onVerifyOtp} className="mt-5 space-y-3">
            <p className="text-sm text-[var(--moss)]">
              Code sent to{" "}
              <span className="font-bold text-[var(--ink)]">{phoneMasked}</span>
            </p>
            {hint && (
              <p className="rounded-md border border-[var(--ink)]/20 bg-white/70 px-3 py-2 text-xs text-[var(--moss)]">
                {hint}
              </p>
            )}
            <label className="block text-xs font-extrabold tracking-wider uppercase">
              Phone OTP
              <input
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={field}
                placeholder="6-digit code"
              />
            </label>
            {error && (
              <p className="text-sm font-semibold text-red-700">{error}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn-accent w-full py-3 text-sm"
            >
              {busy ? "Verifying…" : "Verify & enter"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void resendOtp()}
              className="w-full text-xs font-bold tracking-wider text-[var(--moss)] uppercase underline"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setCode("");
                setError("");
              }}
              className="w-full text-xs font-bold tracking-wider text-[var(--moss)] uppercase underline"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
