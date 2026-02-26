"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] px-8 py-14 sm:px-16">
  <div className="mx-auto max-w-3xl text-center">
    <h2 className="text-3xl font-extrabold text-[var(--brand-700)]">
      Subscribe to our newsletter
    </h2>

    <p className="mt-4 text-sm text-zinc-700">
      Get updates about new products, exclusive offers, and seasonal deals.
    </p>

    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full rounded-full border border-white/50 bg-white/70 backdrop-blur px-6 py-3 text-sm outline-none transition focus:border-[var(--brand-600)] focus:ring-4 focus:ring-[var(--brand-200)] sm:w-96"
      />

      <button className="rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-md active:scale-[0.98]">
        Subscribe
      </button>
    </div>
  </div>
</section>
  );
}