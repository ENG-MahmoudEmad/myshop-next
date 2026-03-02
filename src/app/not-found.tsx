"use client";

import Link from "next/link";
import { Headphones, Mail, Phone, Search, Home, MessageCircle } from "lucide-react";

const GLASS =
  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";

const HOVER = "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl";

const categories = [
  { name: "Fruits & Vegetables", href: "/categories", icon: "🍎" },
  { name: "Dairy & Eggs", href: "/categories", icon: "🥚" },
  { name: "Bakery & Snacks", href: "/categories", icon: "🥐" },
  { name: "Meat & Seafood", href: "/categories", icon: "🐟" },
];

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="mx-auto w-[92%] max-w-7xl py-10 lg:py-14">
        {/* Hero */}
        <div className={`${GLASS} rounded-3xl p-6 lg:p-10`}>
          <div className="mx-auto max-w-2xl text-center">
            {/* 404 */}
            <div className="relative mx-auto flex w-fit items-center justify-center">
              <div className="text-[120px] font-extrabold leading-none tracking-tight text-(--brand-200)/60 lg:text-[150px]">
                4
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 align-middle text-3xl text-(--brand-700) ring-1 ring-white/20 lg:h-16 lg:w-16">
                  🛒
                </span>
                4
              </div>
            </div>

            {/* Title */}
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-(--brand-700)">
              Oops! Page Not Found
            </h2>

            {/* Description */}
            <p className="mt-2 text-sm text-zinc-600 lg:text-base">
              The page you’re looking for seems to have gone shopping! Don’t worry — our fresh products are still here
              for you.
            </p>

            {/* Actions */}
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-(--brand-600) px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:bg-(--brand-700) active:scale-95"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Link>

              <Link
                href="/search"
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-full bg-white/60 px-6 py-3 text-sm font-semibold text-(--brand-700) ring-1 ring-white/20",
                  HOVER,
                ].join(" ")}
              >
                <Search className="h-4 w-4" />
                Search Products
              </Link>
            </div>

            {/* Categories */}
            <div className="mt-8">
              <p className="text-sm font-extrabold text-zinc-900">
                Or explore our popular categories
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((c) => (
                  <Link
                    key={c.name}
                    href={c.href}
                    className={[GLASS, HOVER, "rounded-3xl p-4 text-center"].join(" ")}
                  >
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/60 text-2xl ring-1 ring-white/20">
                      {c.icon}
                    </div>
                    <div className="mt-3 text-sm font-extrabold text-zinc-900">
                      {c.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help box */}
            <div className="mt-10">
              <div className="rounded-3xl bg-(--brand-50)/60 p-5 ring-1 ring-white/20">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="inline-flex items-center gap-2 text-sm font-extrabold text-zinc-900">
                    <Headphones className="h-4 w-4 text-(--brand-700)" />
                    Need Help?
                  </div>

                  <p className="text-sm text-zinc-600">
                    Our customer support team is here to assist you 24/7
                  </p>

                  <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a
                      href="tel:+18001234567"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-(--brand-700) underline underline-offset-4 hover:opacity-80"
                    >
                      <Phone className="h-4 w-4" />
                      +1 (800) 123-4567
                    </a>

                    <a
                      href="mailto:support@myshop.com"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-(--brand-700) underline underline-offset-4 hover:opacity-80"
                    >
                      <Mail className="h-4 w-4" />
                      support@myshop.com
                    </a>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-(--brand-700) underline underline-offset-4 hover:opacity-80"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Live Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 rounded-3xl bg-(--brand-50)/60 p-6 ring-1 ring-white/20 lg:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-extrabold text-(--brand-700) lg:text-2xl">
              Subscribe to our Newsletter
            </h2>

            <p className="mt-2 text-sm text-zinc-600">
              Stay updated with our latest offers, recipes, and health tips.
            </p>

            <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <input
                placeholder="Your email address"
                className="h-12 w-full rounded-2xl bg-white/70 px-4 text-sm text-zinc-900 outline-none ring-1 ring-white/20 placeholder:text-zinc-400 focus:shadow-xl"
              />
              <button
                type="submit"
                className="h-12 rounded-2xl bg-(--brand-600) px-6 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:bg-[var(--brand-700)] active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}