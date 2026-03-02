"use client";

import { useState } from "react";
import { FaKey } from "react-icons/fa";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const matches = password === confirm && password.length > 0;

  const isValid = hasLength && hasUpper && hasNumber && matches;

  const inputWrap =
    "flex h-11 items-center gap-3 rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 transition-all duration-300 ease-out focus-within:shadow-xl";

  const input =
    "h-full w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900";

  const rule = (valid: boolean) =>
    `flex items-center gap-2 text-sm ${
      valid ? "text-[var(--brand-600)]" : "text-zinc-400"
    }`;

  return (
    <div className="py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 text-center">

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
          <FaKey size={18} />
        </div>

        <h1 className="text-xl font-semibold">
          Reset Password
        </h1>

        <p className="mt-2 text-sm text-zinc-600">
          Enter your new password below.
        </p>

        <form className="mt-6 space-y-4 text-left">

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-900">
              New Password
            </label>

            <div className={inputWrap}>
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
              <input
                type="password"
                placeholder="Enter new password"
                className={input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mt-2 space-y-1">
              <p className={rule(hasLength)}>• At least 8 characters</p>
              <p className={rule(hasUpper)}>• One uppercase letter</p>
              <p className={rule(hasNumber)}>• One number</p>
            </div>
          </div>

          {/* Confirm Password */}
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
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {confirm.length > 0 && !matches && (
              <p className="text-sm text-red-500">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="button"
            disabled={!isValid}
            className={[
              "w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out",
              isValid
                ? "bg-[var(--brand-600)] hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95"
                : "bg-zinc-300 cursor-not-allowed",
            ].join(" ")}
          >
            Reset Password
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

        </form>
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