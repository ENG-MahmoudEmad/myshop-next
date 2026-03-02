"use client";

import { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import OtpInput from "@/features/auth/components/OtpInput";

export default function VerifyResetCodeScreen() {
  const [otpValue, setOtpValue] = useState("");

  const isReady = otpValue.length === 6;

  return (
    <div className="py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
          <FaShieldAlt size={18} />
        </div>

        <h1 className="text-xl font-semibold">Verify Reset Code</h1>

        <p className="mt-2 text-sm text-zinc-600">
          We’ve sent a verification code to your email address
        </p>

        <p className="mt-1 text-sm font-semibold text-[var(--brand-600)]">
          john.doe@example.com
        </p>

        <p className="mt-6 text-sm text-zinc-600">
          Enter 6-digit verification code
        </p>

        {/* OTP */}
        <OtpInput length={6} onChange={setOtpValue} />

        <p className="mt-4 text-sm text-zinc-600">
          Code expires in{" "}
          <span className="font-semibold text-[var(--brand-600)]">03:03</span>
        </p>

        {/* Verify Button */}
        <button
          type="button"
          disabled={!isReady}
          className={[
            "mt-6 w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out",
            isReady
              ? "bg-[var(--brand-600)] hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95"
              : "bg-zinc-300 cursor-not-allowed",
          ].join(" ")}
        >
          Verify Code
        </button>

        <p className="mt-6 text-sm text-zinc-600">Didn’t receive the code?</p>

        <button
          type="button"
          className="mt-2 font-semibold text-[var(--brand-600)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
        >
          Resend Code
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