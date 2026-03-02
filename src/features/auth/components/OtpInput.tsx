"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  length?: number; // default 6
  value?: string; // optional controlled value (not required now)
  onChange?: (otp: string) => void; // fires on every change
};

export default function OtpInput({ length = 6, onChange }: Props) {
  const [values, setValues] = useState<string[]>(() => Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const otp = useMemo(() => values.join(""), [values]);

  // notify parent AFTER render (safe)
  useEffect(() => {
    onChange?.(otp);
  }, [otp, onChange]);

  function focusIndex(i: number) {
    inputsRef.current[i]?.focus();
    inputsRef.current[i]?.select();
  }

  function setAt(i: number, v: string) {
    setValues((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  function onInputChange(i: number, raw: string) {
    const v = raw.replace(/\D/g, ""); // digits only

    // Paste support (multiple digits)
    if (v.length > 1) {
      const chars = v.slice(0, length - i).split("");
      setValues((prev) => {
        const next = [...prev];
        for (let k = 0; k < chars.length; k++) {
          next[i + k] = chars[k];
        }
        return next;
      });

      const nextIndex = Math.min(i + v.length, length - 1);
      focusIndex(nextIndex);
      return;
    }

    setAt(i, v);

    if (v && i < length - 1) {
      focusIndex(i + 1);
    }
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (values[i]) {
        setAt(i, "");
        return;
      }
      if (i > 0) {
        focusIndex(i - 1);
        setAt(i - 1, "");
      }
    }

    if (e.key === "ArrowLeft" && i > 0) focusIndex(i - 1);
    if (e.key === "ArrowRight" && i < length - 1) focusIndex(i + 1);
  }

  const otpBox =
    "h-12 w-12 rounded-xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-center text-lg font-semibold outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--brand-200)]";

  return (
    <div className="mt-4 flex justify-center gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={length} // helps paste in some browsers
          value={values[i]}
          onChange={(e) => onInputChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className={otpBox}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}