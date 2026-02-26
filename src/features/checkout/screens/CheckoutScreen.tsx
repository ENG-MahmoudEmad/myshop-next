"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faLock,
  faMoneyBill1Wave,
  faCreditCard,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

type Method = "cod" | "online";

type Item = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
};

const items: Item[] = [
  { id: "202", name: "Organic Fresh Apples", price: 3.99, qty: 1, image: "/products/p3.png" },
  { id: "301", name: "Organic Whole Milk", price: 4.29, qty: 1, image: "/products/p1.png" },
  { id: "302", name: "Artisan Sourdough Bread", price: 3.99, qty: 1, image: "/products/p2.png" },
];

function Stepper() {
  const steps = [
    { label: "Cart", state: "done" as const },
    { label: "Review", state: "done" as const },
    { label: "Payment", state: "active" as const },
    { label: "Complete", state: "todo" as const },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {steps.map((s, idx) => {
        const isLast = idx === steps.length - 1;
        const cls =
          s.state === "active"
            ? "bg-[var(--brand-600)] text-white shadow-[0_8px_24px_rgba(216,67,21,0.25)]"
            : s.state === "done"
              ? "bg-[var(--brand-100)] text-[var(--brand-700)]"
              : "bg-zinc-200 text-zinc-600";

        return (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`flex h-8 items-center gap-2 rounded-full px-3 font-semibold ${cls}`}>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-xs">
                {s.state === "done" ? <FontAwesomeIcon icon={faCheck} /> : idx + 1}
              </span>
              <span>{s.label}</span>
            </div>
            {!isLast ? <span className="text-zinc-300">›</span> : null}
          </div>
        );
      })}
    </div>
  );
}

function Input({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-zinc-700">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
      />
    </label>
  );
}

export default function CheckoutScreen() {
  const [method, setMethod] = useState<Method>("online");
  const [sameAsDelivery, setSameAsDelivery] = useState(true);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    []
  );
  const discount = 2.46;
  const delivery = 4.99;
  const tax = 0.98;
  const total = subtotal - discount + delivery + tax;

  return (
    <div className="space-y-10">
      {/* Header row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Checkout</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Choose payment method and enter billing details.
          </p>
        </div>

        <Stepper />
      </div>

      <section className="grid gap-8 lg:grid-cols-3">
        {/* Left side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method */}
          <div className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
            <div className="border-b border-white/40 px-6 py-5">
              <h2 className="text-sm font-extrabold text-zinc-900">Payment Method</h2>
            </div>

            <div className="p-6 space-y-4">
              {/* COD */}
              <button
                type="button"
                onClick={() => setMethod("cod")}
                className={[
                  "w-full text-left rounded-3xl border p-5 transition-all duration-300",
                  method === "cod"
                    ? "border-[var(--brand-300)] bg-white shadow-[0_10px_30px_rgba(216,67,21,0.12)]"
                    : "border-zinc-200 bg-white/80 hover:shadow-md",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span
                      className={[
                        "mt-1 grid h-5 w-5 place-items-center rounded-full border",
                        method === "cod"
                          ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white"
                          : "border-zinc-300 bg-white",
                      ].join(" ")}
                    >
                      {method === "cod" ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
                          <FontAwesomeIcon icon={faMoneyBill1Wave} />
                        </span>
                        <div>
                          <div className="text-sm font-extrabold text-zinc-900">Cash on Delivery</div>
                          <div className="text-xs text-zinc-600">Pay when your order arrives</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-zinc-500">No extra charges</span>
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--brand-100)] bg-[var(--brand-50)]/60 p-4 text-xs text-zinc-700">
                  Please keep exact change ready for hassle-free delivery
                </div>
              </button>

              {/* Online */}
              <button
                type="button"
                onClick={() => setMethod("online")}
                className={[
                  "w-full text-left rounded-3xl border p-5 transition-all duration-300",
                  method === "online"
                    ? "border-[var(--brand-300)] bg-white shadow-[0_10px_30px_rgba(216,67,21,0.12)]"
                    : "border-zinc-200 bg-white/80 hover:shadow-md",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span
                      className={[
                        "mt-1 grid h-5 w-5 place-items-center rounded-full border",
                        method === "online"
                          ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white"
                          : "border-zinc-300 bg-white",
                      ].join(" ")}
                    >
                      {method === "online" ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
                          <FontAwesomeIcon icon={faCreditCard} />
                        </span>
                        <div>
                          <div className="text-sm font-extrabold text-zinc-900">Online Payment</div>
                          <div className="text-xs text-zinc-600">Pay securely with card or wallet</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-[var(--brand-100)] px-3 py-1 text-xs font-bold text-[var(--brand-700)]">
                    Recommended
                  </span>
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--brand-200)] bg-white p-4 text-xs text-zinc-700">
                  You will be redirected to secure payment gateway to complete your transaction
                </div>
              </button>
            </div>
          </div>

          {/* Billing Address */}
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-6 py-5">
              <h2 className="text-sm font-extrabold text-zinc-900">Billing Address</h2>
            </div>

            <div className="p-6 space-y-5">
              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={sameAsDelivery}
                  onChange={(e) => setSameAsDelivery(e.target.checked)}
                  className="h-4 w-4 accent-[var(--brand-600)]"
                />
                Same as delivery address
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First Name" placeholder="John" />
                <Input label="Last Name" placeholder="Doe" />
              </div>

              <Input label="Address" placeholder="Street address" />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="City" placeholder="Your city" />
                <Input label="ZIP Code" placeholder="12345" />
              </div>
            </div>
          </div>
        </div>

        {/* Right side summary */}
        <aside className="h-fit rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-lg font-extrabold text-zinc-900">Order Summary</h2>

          {/* Items list */}
          <div className="mt-5 space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-50">
                  <Image src={it.image} alt={it.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="line-clamp-1 text-sm font-semibold text-zinc-900">{it.name}</div>
                  <div className="text-xs text-zinc-500">Qty: {it.qty}</div>
                </div>
                <div className="text-sm font-bold text-zinc-900">${it.price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-zinc-700">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span>Discount</span>
              <span className="font-semibold text-[var(--brand-700)]">- ${discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span>Delivery</span>
              <span className="font-semibold">${delivery.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span>Tax</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>

            <div className="my-2 h-px bg-white/50" />

            <div className="flex justify-between text-zinc-900">
              <span className="font-bold">Total</span>
              <span className="font-extrabold text-[var(--brand-700)]">${total.toFixed(2)}</span>
            </div>
          </div>

          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]">
            Proceed to Payment
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          <Link
            href="/cart"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:shadow-md active:scale-[0.98]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Return to Cart
          </Link>

          {/* Secure checkout */}
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <FontAwesomeIcon icon={faLock} className="text-[var(--brand-700)]" />
              Secure Checkout
            </div>
            <div className="mt-1 text-xs text-zinc-600">
              Your payment information is secure.
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                VISA
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                MasterCard
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                AMEX
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                PayPal
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700">
                Apple Pay
              </span>
            </div>
          </div>
        </aside>
      </section>

      {/* You Might Also Like (reuse from cart later if you want) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-zinc-900">You might also like</h2>
          <div className="flex gap-2">
            <button className="h-10 w-10 rounded-full border border-zinc-200 bg-white transition hover:bg-[var(--brand-50)]">
              ‹
            </button>
            <button className="h-10 w-10 rounded-full border border-zinc-200 bg-white transition hover:bg-[var(--brand-50)]">
              ›
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <Link
              key={p.id + "_like"}
              href={`/product/${p.id}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 w-full bg-zinc-50">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="line-clamp-1 text-sm font-semibold text-zinc-900 group-hover:text-[var(--brand-700)]">
                  {p.name}
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-lg font-extrabold text-[var(--brand-700)]">
                    ${p.price.toFixed(2)}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] transition-all duration-300 group-hover:bg-[var(--brand-600)] group-hover:text-white">
                    +
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}