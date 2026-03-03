"use client";

import { useMemo, useState } from "react";
import { FaKey } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { toastError, toastSuccess } from "@/lib/toast";

const passwordRules = {
  minLen: (s: string) => s.length >= 8,
  lower: (s: string) => /[a-z]/.test(s),
  upper: (s: string) => /[A-Z]/.test(s),
  number: (s: string) => /\d/.test(s),

  // ✅ special = رموز ASCII فقط (مش العربي)
  special: (s: string) => /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/.test(s),

  // ✅ ممنوع أي أحرف غير ASCII (يعني العربي ممنوع)
  asciiOnly: (s: string) => /^[\x00-\x7F]*$/.test(s),

  // ✅ ممنوع المسافات (اختياري لكن أنصح فيه)
  noSpaces: (s: string) => !/\s/.test(s),
};

// ✅ remove non-ascii (Arabic, emojis, etc)
const stripNonAscii = (s: string) => s.replace(/[^\x00-\x7F]/g, "");

export default function ResetPasswordScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = (searchParams.get("email") || "").trim();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const hasLength = passwordRules.minLen(password);
  const hasUpper = passwordRules.upper(password);
  const hasLower = passwordRules.lower(password);
  const hasNumber = passwordRules.number(password);
  const hasSpecial = passwordRules.special(password);
  const isAsciiOnly = passwordRules.asciiOnly(password);
  const noSpaces = passwordRules.noSpaces(password);

  const matches = password === confirm && password.length > 0;

  const isValid =
    hasLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    isAsciiOnly &&
    noSpaces &&
    matches;

  const inputWrap =
    "flex h-11 items-center gap-3 rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 transition-all duration-300 ease-out focus-within:shadow-xl";

  const input =
    "h-full w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900";

  const rule = (valid: boolean) =>
    `flex items-center gap-2 text-sm ${
      valid ? "text-[var(--brand-600)]" : "text-zinc-400"
    }`;

  const submit = async () => {
    if (!email) {
      toastError("Missing email. Please verify the code again.", { autoClose: 3500 });
      router.replace("/forgot-password");
      return;
    }

    // ✅ رسائل أوضح حسب السبب
    if (!password) {
      toastError("Please enter a new password.", { autoClose: 3000 });
      return;
    }

    if (!isAsciiOnly) {
      toastError("Password must be English characters only (no Arabic).", {
        autoClose: 3500,
      });
      return;
    }

    if (!noSpaces) {
      toastError("Password must not contain spaces.", { autoClose: 3500 });
      return;
    }

    if (!hasSpecial) {
      toastError("Password must include a special character like ! @ # $", {
        autoClose: 3500,
      });
      return;
    }

    if (!isValid) {
      toastError("Please fix the password requirements.", { autoClose: 3000 });
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/resetPassword", { email, newPassword: password });

      toastSuccess("Password updated ✅", { autoClose: 2200 });
      router.replace("/login");
    } catch (err: any) {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.msg ||
        (Array.isArray(data?.errors) ? data.errors?.[0]?.msg : null) ||
        "Failed to reset password. Please try again.";

      toastError(String(msg), { autoClose: 4500 });
    } finally {
      setLoading(false);
    }
  };

  const hintEmail = useMemo(() => {
    if (!email) return "";
    if (!email.includes("@")) return email;
    const [u, d] = email.split("@");
    return `${u.slice(0, 2)}***@${d}`;
  }, [email]);

  return (
    <div className="py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
          <FaKey size={18} />
        </div>

        <h1 className="text-xl font-semibold">Reset Password</h1>

        <p className="mt-2 text-sm text-zinc-600">
          {hintEmail ? (
            <>
              For{" "}
              <span className="font-semibold text-[var(--brand-600)]">{hintEmail}</span>
            </>
          ) : (
            "Enter your new password below."
          )}
        </p>

        <div className="mt-6 space-y-4 text-left">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-900">New Password</label>

            <div className={inputWrap}>
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
              <input
                type="password"
                placeholder="Enter new password"
                className={input}
                value={password}
                onChange={(e) => {
                  // ✅ امنع العربي/emoji فوراً
                  const cleaned = stripNonAscii(e.target.value);
                  setPassword(cleaned);
                }}
                onPaste={(e) => {
                  // ✅ امنع لصق العربي
                  e.preventDefault();
                  const text = (e.clipboardData || (window as any).clipboardData).getData("text");
                  setPassword((prev) => stripNonAscii(prev + text));
                }}
                autoComplete="new-password"
                inputMode="text"
              />
            </div>

            <div className="mt-2 space-y-1">
              <p className={rule(hasLength)}>• At least 8 characters</p>
              <p className={rule(hasUpper)}>• One uppercase letter</p>
              <p className={rule(hasLower)}>• One lowercase letter</p>
              <p className={rule(hasNumber)}>• One number</p>
              <p className={rule(hasSpecial)}>• One special character</p>

              {/* ✅ شروط إضافية عشان العربي */}
              <p className={rule(isAsciiOnly)}>• English characters only (no Arabic)</p>
              <p className={rule(noSpaces)}>• No spaces</p>
            </div>
          </div>

          {/* Confirm */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-900">
              Confirm New Password
            </label>

            <div className={inputWrap}>
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
              <input
                type="password"
                placeholder="Confirm new password"
                className={input}
                value={confirm}
                onChange={(e) => {
                  const cleaned = stripNonAscii(e.target.value);
                  setConfirm(cleaned);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = (e.clipboardData || (window as any).clipboardData).getData("text");
                  setConfirm((prev) => stripNonAscii(prev + text));
                }}
                autoComplete="new-password"
                inputMode="text"
              />
            </div>

            <div className="min-h-[16px]">
              {confirm.length > 0 && !matches ? (
                <p className="text-xs text-red-600 leading-4">Passwords do not match</p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className={[
              "w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out",
              "bg-[var(--brand-600)] hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95",
              "disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-center text-sm text-zinc-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="font-semibold text-[var(--brand-600)] underline underline-offset-4 hover:text-[var(--brand-700)] transition-all duration-300 ease-out"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}