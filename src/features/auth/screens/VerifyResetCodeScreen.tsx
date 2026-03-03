"use client";

import { useEffect, useMemo, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

import OtpInput from "@/features/auth/components/OtpInput";
import { api } from "@/lib/axios";
import { toastError, toastSuccess } from "@/lib/toast";

const RESEND_COOLDOWN_SEC = 180; // 3 دقائق
const storageKey = (email: string) => `myshop_reset_resend_until:${email}`;

export default function VerifyResetCodeScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = (searchParams.get("email") || "").trim();
  const maskedEmail = useMemo(() => {
    if (!email.includes("@")) return "";
    const [u, d] = email.split("@");
    const head = u.slice(0, 2);
    const tail = u.slice(-1);
    return `${head}***${tail}@${d}`;
  }, [email]);

  const [otpValue, setOtpValue] = useState("");
  const isReady = otpValue.length === 6;

  const [resendUntil, setResendUntil] = useState<number>(0);
  const [now, setNow] = useState<number>(() => Date.now());
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // لو مافي ايميل باللينك رجّع المستخدم
  useEffect(() => {
    if (!email) {
      toastError("Missing email. Please request a reset code again.", { autoClose: 3500 });
      router.replace("/forgot-password");
    }
  }, [email, router]);

  // حمّل الكول داون من localStorage (عشان ما يروح مع الريفريش)
  useEffect(() => {
    if (!email) return;
    const raw = localStorage.getItem(storageKey(email));
    const until = raw ? Number(raw) : 0;
    if (!Number.isNaN(until)) setResendUntil(until);
  }, [email]);

  // tick للعداد
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const remainingSec = Math.max(0, Math.ceil((resendUntil - now) / 1000));
  const canResend = remainingSec === 0 && !sending;

  const handleVerify = async () => {
    if (!email) return;
    if (!isReady || verifying) return;

    setVerifying(true);
    try {
      // Route API: POST /auth/verifyResetCode  body: { resetCode }
      await api.post("/auth/verifyResetCode", { resetCode: otpValue });

      toastSuccess("Code verified ✅", { autoClose: 2200 });

      const encoded = encodeURIComponent(email);
      router.push(`/reset-password?email=${encoded}`);
    } catch (err: any) {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.msg ||
        (Array.isArray(data?.errors) ? data.errors?.[0]?.msg : null) ||
        "Invalid code. Please try again.";
      toastError(String(msg), { autoClose: 4500 });
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    if (!canResend) {
      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      toastError(
        `You can resend after ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
        { autoClose: 3000 }
      );
      return;
    }

    setSending(true);
    try {
      // Route API: POST /auth/forgotPasswords  body: { email }
      await api.post("/auth/forgotPasswords", { email });

      toastSuccess("New code sent ✅", { autoClose: 2200 });

      const until = Date.now() + RESEND_COOLDOWN_SEC * 1000;
      setResendUntil(until);
      localStorage.setItem(storageKey(email), String(until));
    } catch (err: any) {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.msg ||
        (Array.isArray(data?.errors) ? data.errors?.[0]?.msg : null) ||
        "Failed to resend code. Please try again.";
      toastError(String(msg), { autoClose: 4500 });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
          <FaShieldAlt size={18} />
        </div>

        <h1 className="text-xl font-semibold">Verify Reset Code</h1>

        <p className="mt-2 text-sm text-zinc-600">
          We’ve sent a verification code to your email
        </p>

        {maskedEmail ? (
          <p className="mt-1 text-sm font-semibold text-[var(--brand-600)]">
            {maskedEmail}
          </p>
        ) : null}

        <p className="mt-6 text-sm text-zinc-600">Enter 6-digit verification code</p>

        <OtpInput length={6} onChange={setOtpValue} />

        <button
          type="button"
          onClick={handleVerify}
          disabled={!isReady || verifying}
          className={[
            "mt-6 w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out",
            isReady && !verifying
              ? "bg-[var(--brand-600)] hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95"
              : "bg-zinc-300 cursor-not-allowed",
          ].join(" ")}
        >
          {verifying ? "Verifying..." : "Verify Code"}
        </button>

        <p className="mt-6 text-sm text-zinc-600">Didn’t receive the code?</p>

        <button
          type="button"
          onClick={handleResend}
          className={[
            "mt-2 font-semibold underline underline-offset-4 transition-all duration-300 ease-out",
            canResend
              ? "text-[var(--brand-600)] hover:text-[var(--brand-700)] cursor-pointer"
              : "text-zinc-400 cursor-pointer",
          ].join(" ")}
        >
          {canResend
            ? sending
              ? "Sending..."
              : "Resend Code"
            : `Resend available in ${String(Math.floor(remainingSec / 60)).padStart(2, "0")}:${String(
                remainingSec % 60
              ).padStart(2, "0")}`}
        </button>

        <div className="mt-4">
          <a
            href="/login"
            className="text-sm font-semibold text-[var(--brand-600)] underline underline-offset-4 hover:text-[var(--brand-700)] transition-all duration-300 ease-out"
          >
            Back to Sign In
          </a>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-zinc-600">
        Need help?{" "}
        <a
          href="/contact"
          className="font-semibold text-[var(--brand-600)] underline underline-offset-4 hover:text-[var(--brand-700)] transition-all duration-300 ease-out"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}