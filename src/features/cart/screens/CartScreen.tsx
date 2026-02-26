"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type Item = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating?: number;
  category?: string;
};

const initialItems: Item[] = [
  {
    id: "202",
    name: "Organic Fresh Apples (1kg)",
    price: 7.98,
    oldPrice: 10.98,
    image: "/products/p3.png",
    rating: 4,
    category: "Fruits & Vegetables",
  },
  {
    id: "301",
    name: "Organic Whole Milk (1 gallon)",
    price: 4.29,
    oldPrice: 4.99,
    image: "/products/p1.png",
    rating: 5,
    category: "Dairy & Eggs",
  },
  {
    id: "302",
    name: "Artisan Sourdough Bread",
    price: 3.99,
    oldPrice: 4.99,
    image: "/products/p2.png",
    rating: 5,
    category: "Bakery & Snacks",
  },
];

const youMayAlsoLike: Item[] = [
  {
    id: "401",
    name: "Hass Avocados (2pcs)",
    price: 2.99,
    image: "/products/p4.png",
    rating: 4,
    category: "Fruits & Vegetables",
  },
  {
    id: "402",
    name: "Organic Bananas (1kg)",
    price: 1.99,
    oldPrice: 2.5,
    image: "/products/p2.png",
    rating: 4,
    category: "Fruits & Vegetables",
  },
  {
    id: "403",
    name: "Greek Yogurt (32oz)",
    price: 4.49,
    image: "/products/p1.png",
    rating: 4,
    category: "Dairy & Eggs",
  },
  {
    id: "404",
    name: "Fresh Broccoli (1pc)",
    price: 1.79,
    image: "/products/p3.png",
    rating: 4,
    category: "Fruits & Vegetables",
  },
];

function Stars({ rating = 4 }: { rating?: number }) {
  return (
    <div className="text-[var(--brand-600)] text-sm leading-none">
      {"★".repeat(Math.max(0, Math.min(5, rating)))}
      {"☆".repeat(Math.max(0, 5 - Math.min(5, Math.max(0, rating))))}
    </div>
  );
}

export default function CartScreen() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [qty, setQty] = useState<Record<string, number>>({
    "202": 2,
    "301": 1,
    "302": 1,
  });

  // Coupon UI only
  const couponCode = "FRESH20";
  const discount = items.length ? 3.25 : 0;

  const subtotal = items.reduce((sum, it) => sum + it.price * (qty[it.id] ?? 1), 0);
  const shipping = items.length ? (subtotal > 30 ? 0 : 3.99) : 0;
  const tax = items.length ? 1.04 : 0;
  const total = subtotal + shipping + tax - discount;

  const changeQty = (id: string, delta: number) => {
    setQty((prev) => {
      const next = Math.max(1, (prev[id] ?? 1) + delta);
      return { ...prev, [id]: next };
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setQty((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div className="text-sm text-zinc-500">
        <Link className="hover:text-[var(--brand-700)]" href="/">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">Shopping Cart</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {items.length} item{items.length === 1 ? "" : "s"} in your cart
          </p>
        </div>

        <Link
          href="/search"
          className="text-sm font-semibold text-[var(--brand-600)] transition hover:text-[var(--brand-700)]"
        >
          Continue shopping →
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-zinc-200 px-6 py-5">
              <div className="text-sm font-extrabold text-zinc-900">Your Items</div>
              <div className="mt-1 text-xs text-zinc-500">
                Update quantities or remove products.
              </div>
            </div>

            {items.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-zinc-600">Your cart is empty.</p>
                <Link
                  href="/"
                  className="mt-4 inline-flex rounded-full bg-[var(--brand-600)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-700)]"
                >
                  Go Home
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200">
                {items.map((it) => (
                  <div key={it.id} className="px-6 py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Left */}
                      <Link
                        href={`/product/${it.id}`}
                        className="flex items-center gap-4"
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-zinc-50">
                          <Image src={it.image} alt={it.name} fill className="object-cover" />
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-zinc-900 hover:text-[var(--brand-700)]">
                            {it.name}
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            {it.category ?? "Category"}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Stars rating={it.rating ?? 4} />
                            <span className="text-xs text-zinc-500">(149)</span>
                          </div>
                        </div>
                      </Link>

                      {/* Right */}
                      <div className="sm:ml-auto flex flex-wrap items-center gap-4">
                        {/* Qty */}
                        <div className="flex items-center rounded-2xl border border-zinc-200 bg-white">
                          <button
                            onClick={() => changeQty(it.id, -1)}
                            className="h-10 w-10 rounded-2xl text-lg text-zinc-700 transition hover:bg-[var(--brand-50)]"
                          >
                            −
                          </button>
                          <div className="w-12 text-center text-sm font-semibold text-zinc-800">
                            {qty[it.id] ?? 1}
                          </div>
                          <button
                            onClick={() => changeQty(it.id, +1)}
                            className="h-10 w-10 rounded-2xl text-lg text-zinc-700 transition hover:bg-[var(--brand-50)]"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="min-w-[90px] text-right">
                          <div className="text-lg font-extrabold text-zinc-900">
                            ${(it.price * (qty[it.id] ?? 1)).toFixed(2)}
                          </div>
                          {it.oldPrice ? (
                            <div className="text-xs text-zinc-400 line-through">
                              ${(it.oldPrice * (qty[it.id] ?? 1)).toFixed(2)}
                            </div>
                          ) : null}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(it.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-600 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
                          aria-label="Remove item"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coupon Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-zinc-900">Apply Coupon</h3>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                placeholder="Enter coupon code"
                className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
              />
              <button className="rounded-2xl bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] active:scale-95">
                Apply
              </button>
            </div>

            {/* Applied (UI only) */}
            {items.length ? (
              <div className="mt-4 rounded-2xl border border-[var(--brand-100)] bg-[var(--brand-50)]/60 p-4 text-sm text-zinc-700">
                <span className="font-semibold text-[var(--brand-700)]">{couponCode}</span>{" "}
                Applied
                <span className="float-right font-extrabold text-[var(--brand-700)]">
                  - ${discount.toFixed(2)}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-lg font-extrabold text-zinc-900">Order Summary</h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-zinc-700">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span>Shipping</span>
              <span className="font-semibold text-[var(--brand-700)]">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span>Discount ({couponCode})</span>
              <span className="font-semibold text-[var(--brand-700)]">
                - ${discount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span>Tax</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>

            <div className="my-2 h-px bg-white/50" />

            <div className="flex justify-between text-zinc-900">
              <span className="font-bold">Total</span>
              <span className="font-extrabold text-[var(--brand-700)]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/search"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:shadow-md active:scale-[0.98]"
          >
            Continue Shopping
          </Link>

          {/* Small features like the design */}
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur p-4">
              <div className="text-sm font-bold text-zinc-900">Free Delivery</div>
              <div className="mt-1 text-xs text-zinc-600">
                Estimated delivery: 2–3 business days.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--brand-100)] bg-[var(--brand-50)]/60 p-4">
              <div className="text-sm font-bold text-zinc-900">Secure Checkout</div>
              <div className="mt-1 text-xs text-zinc-600">
                Your payment is protected with secure encryption.
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* You might also like */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-zinc-900">You might also like</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {youMayAlsoLike.map((p) => (
            <Link
              key={p.id}
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
                <div className="text-xs text-zinc-500">{p.category ?? "Category"}</div>
                <div className="mt-1 line-clamp-1 text-sm font-semibold text-zinc-900 group-hover:text-[var(--brand-700)]">
                  {p.name}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <Stars rating={p.rating ?? 4} />
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div className="text-lg font-extrabold text-[var(--brand-700)]">
                    ${p.price.toFixed(2)}
                  </div>

                    {/* plus sign */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] transition-all duration-300 group-hover:bg-[var(--brand-600)] group-hover:text-white">
                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
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