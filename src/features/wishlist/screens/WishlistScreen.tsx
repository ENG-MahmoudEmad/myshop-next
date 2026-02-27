"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCartShopping,
  faShareNodes,
  faCopy,
  faPlus,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

type WishItem = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
};

const wishlistItems: WishItem[] = [
  {
    id: "202",
    name: "Organic Fresh Apples (1kg)",
    category: "Fruits & Vegetables",
    rating: 4.3,
    reviews: 149,
    price: 3.99,
    image: "/products/p3.png",
  },
  {
    id: "301",
    name: "Organic Whole Milk (1 gallon)",
    category: "Dairy & Eggs",
    rating: 4.5,
    reviews: 87,
    price: 4.29,
    image: "/products/p1.png",
  },
  {
    id: "302",
    name: "Artisan Sourdough Bread",
    category: "Bakery & Snacks",
    rating: 5,
    reviews: 42,
    price: 3.99,
    image: "/products/p2.png",
  },
  {
    id: "401",
    name: "Fresh Atlantic Salmon (1lb)",
    category: "Meat & Seafood",
    rating: 4.2,
    reviews: 36,
    price: 9.99,
    image: "/products/p4.png",
  },
  {
    id: "501",
    name: "Hass Avocados (2pcs)",
    category: "Fruits & Vegetables",
    rating: 4.7,
    reviews: 154,
    price: 2.99,
    image: "/products/p5.png",
  },
  {
    id: "601",
    name: "Organic Bananas (1kg)",
    category: "Fruits & Vegetables",
    rating: 4.3,
    reviews: 89,
    price: 1.99,
    image: "/products/p6.png",
  },
];

const myWishlists = [
  { name: "Default Wishlist", items: 12 },
  { name: "Birthday Ideas", items: 8 },
  { name: "Weekly Groceries", items: 15 },
];

const recentlyViewed = [
  {
    id: "710",
    name: "Fresh Broccoli (1pc)",
    rating: 4.1,
    price: 1.79,
    image: "/products/p7.png",
  },
  {
    id: "711",
    name: "Greek Yogurt (32oz)",
    rating: 5,
    price: 4.49,
    image: "/products/p8.png",
  },
  {
    id: "712",
    name: "Organic Brown Eggs (12pcs)",
    rating: 4.2,
    price: 3.99,
    image: "/products/p9.png",
  },
  {
    id: "202",
    name: "Organic Fresh Apples (1kg)",
    rating: 4.3,
    price: 3.99,
    image: "/products/p3.png",
  },
  {
    id: "302",
    name: "Artisan Sourdough Bread",
    rating: 5,
    price: 3.99,
    image: "/products/p2.png",
  },
];

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1 text-[var(--brand-600)]">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-sm leading-none">
          {i < full ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md",
        "shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function WishlistScreen() {
  const count = wishlistItems.length;

  const subtotal = useMemo(
    () => wishlistItems.reduce((s, i) => s + i.price, 0),
    [],
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm text-zinc-500">
            <Link href="/" className="hover:text-[var(--brand-700)]">
              Home
            </Link>{" "}
            <span className="mx-2">/</span>
            <span className="text-zinc-700">Wishlist</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
            My Wishlist
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            {count} items in your wishlist • Subtotal{" "}
            <span className="font-semibold text-[var(--brand-700)]">
              ${subtotal.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98]">
            <FontAwesomeIcon icon={faTrash} className="text-zinc-600" />
            Clear All
          </button>

          <button className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]">
            <FontAwesomeIcon icon={faCartShopping} />
            Add All to Cart
          </button>
        </div>
      </div>

      {/* Main grid */}
      <section className="grid gap-8 lg:grid-cols-3">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="overflow-hidden">
            <div className="border-b border-white/40 px-6 py-5">
              <h2 className="text-sm font-extrabold text-zinc-900">
                Wishlist Items
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Keep your favorites here and move them to cart anytime.
              </p>
            </div>

            <div className="divide-y divide-white/50">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group px-6 py-5 transition hover:bg-white/60"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link
                      href={`/product/${item.id}`}
                      className="flex items-center gap-4"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-zinc-50">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs text-zinc-500">
                          {item.category}
                        </div>
                        <div className="mt-1 line-clamp-1 text-sm font-semibold text-zinc-900 group-hover:text-[var(--brand-700)]">
                          {item.name}
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <Stars rating={item.rating} />
                          <span className="text-xs text-zinc-500">
                            {item.rating.toFixed(1)} ({item.reviews})
                          </span>
                        </div>

                        <div className="mt-2 text-lg font-extrabold text-[var(--brand-700)]">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </Link>

                    {/* Right actions */}
                    <div className="sm:ml-auto flex items-center gap-3">
                      <button className="inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-md active:scale-[0.98]">
                        Add to Cart
                      </button>

                      <button
                        className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white/80 text-zinc-700 backdrop-blur transition hover:border-transparent hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
                        aria-label="Remove"
                        title="Remove"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination (UI only) */}
            <div className="flex items-center justify-center gap-2 px-6 py-5">
              <button className="h-10 w-10 rounded-xl border border-zinc-200 bg-white transition hover:bg-[var(--brand-50)]">
                ‹
              </button>
              {[1, 2].map((p) => (
                <button
                  key={p}
                  className={[
                    "h-10 w-10 rounded-xl border transition",
                    p === 1
                      ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white"
                      : "border-zinc-200 bg-white hover:bg-[var(--brand-50)]",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
              <button className="h-10 w-10 rounded-xl border border-zinc-200 bg-white transition hover:bg-[var(--brand-50)]">
                ›
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Create wishlist */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-extrabold text-zinc-900">
              Create New Wishlist
            </h3>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">
                  Wishlist Name
                </span>
                <input
                  placeholder="e.g., Holiday Shopping"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
                />
              </label>

              <div>
                <div className="text-xs font-semibold text-zinc-700">
                  Privacy
                </div>

                <div className="mt-2 flex items-center gap-4 text-sm text-zinc-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="privacy"
                      className="h-4 w-4 accent-[var(--brand-600)]"
                    />
                    Public
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="privacy"
                      defaultChecked
                      className="h-4 w-4 accent-[var(--brand-600)]"
                    />
                    Private
                  </label>
                </div>
              </div>

              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-600)] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]">
                <FontAwesomeIcon icon={faPlus} />
                Create Wishlist
              </button>
            </div>
          </GlassCard>

          {/* My wishlists */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-extrabold text-zinc-900">
              My Wishlists
            </h3>

            <div className="mt-4 space-y-3">
              {myWishlists.map((w) => (
                <div
                  key={w.name}
                  className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/60 px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">
                      {w.name}
                    </div>
                    <div className="text-xs text-zinc-500">{w.items} items</div>
                  </div>

                  <button className="text-sm font-semibold text-[var(--brand-700)] hover:underline">
                    View
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Share */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-900">
              <FontAwesomeIcon
                icon={faShareNodes}
                className="text-[var(--brand-700)]"
              />
              Share Your Wishlist
            </div>

            <p className="mt-2 text-xs text-zinc-600">
              Share your wishlist with friends and family.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-[var(--brand-50)]">
                Facebook
              </button>
              <button className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-[var(--brand-50)]">
                Twitter
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              <input
                readOnly
                value="https://myshop.vercel.app/wishlist"
                className="w-full bg-transparent text-xs text-zinc-600 outline-none"
              />
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-50)] px-3 py-2 text-xs font-semibold text-[var(--brand-700)] transition hover:bg-[var(--brand-100)]"
                title="Copy"
              >
                <FontAwesomeIcon icon={faCopy} />
                Copy
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-zinc-900">
            Recently Viewed
          </h2>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-[var(--brand-700)]"
            />
            Inspired picks for you
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {recentlyViewed.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-44 w-full bg-zinc-50">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-zinc-700 backdrop-blur transition-all duration-300 hover:bg-[var(--brand-600)] hover:text-white hover:scale-110 active:scale-95"
                  aria-label="Wishlist"
                  title="Wishlist"
                  onClick={(e) => e.preventDefault()}
                >
                  ♥
                </button>
              </div>

              <div className="p-4">
                <div className="line-clamp-1 text-sm font-semibold text-zinc-900 group-hover:text-[var(--brand-700)]">
                  {p.name}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <Stars rating={p.rating} />
                    <div className="mt-2 text-lg font-extrabold text-zinc-900">
                      ${p.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] transition-all duration-300 group-hover:bg-[var(--brand-600)] group-hover:text-white">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-lg leading-none"
                    />
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
