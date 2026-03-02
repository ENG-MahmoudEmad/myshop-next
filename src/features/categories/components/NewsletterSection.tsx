"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const isValid = email.trim().length > 3 && email.includes("@");

  return (
    <section className="mt-16">
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-8 md:p-12">
        
        {/* ✨ Subtle glass light overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          
          {/* Left */}
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-white/40 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
              Newsletter
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--brand-700)]">
              Get deals in your inbox ✨
            </h2>

            <p className="text-sm leading-6 text-zinc-700">
              Subscribe to receive weekly offers, seasonal picks, and new
              arrivals. No spam — unsubscribe anytime.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-700">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Exclusive discounts
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                New arrivals
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Seasonal bundles
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/40 backdrop-blur-md border border-white/30 p-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                
                {/* Input pill */}
                <div className="flex h-12 flex-1 items-center gap-3 rounded-full overflow-hidden bg-white backdrop-blur-md border border-white/40 px-4 transition-all duration-300 ease-out focus-within:ring-4 focus-within:ring-[var(--brand-200)]">
  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
    <Mail size={18} />
  </span>

        <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="newsletter-email h-full w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
            inputMode="email"
            autoComplete="email"
        />
</div>

                {/* Button */}
                <button
                  disabled={!isValid}
                  className={[
                    "h-12 rounded-full px-6 text-sm font-semibold text-white transition-all duration-300 ease-out",
                    isValid
                      ? "bg-[var(--brand-600)] hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95 shadow-md"
                      : "bg-zinc-300 cursor-not-allowed",
                  ].join(" ")}
                >
                  Subscribe
                </button>
              </div>

              <p className="mt-4 text-xs text-zinc-600">
                By subscribing, you agree to receive emails from myshop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}