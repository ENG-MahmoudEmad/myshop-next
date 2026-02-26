"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/features/home/components/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import RecentlyViewed from "@/features/products/components/RecentlyViewed";

type Props = { id: string };

const mockImages = [
  "/products/p1.png",
  "/products/p2.png",
  "/products/p3.png",
  "/products/p4.png",
];

const related = [
  { id: "201", name: "Organic Bananas (1kg)", price: 1.99, oldPrice: 2.5, image: "/products/p2.png", rating: 4 },
  { id: "202", name: "Organic Fresh Apples (1kg)", price: 3.99, oldPrice: 4.69, image: "/products/p3.png", rating: 5 },
  { id: "203", name: "Fresh Broccoli (1pc)", price: 1.79, image: "/products/p4.png", rating: 4 },
  { id: "204", name: "Greek Yogurt (32oz)", price: 4.49, image: "/products/p1.png", rating: 4 },
];

export default function ProductDetailsScreen({ id }: Props) {
  const [activeImage, setActiveImage] = useState(mockImages[0]);
  const [weight, setWeight] = useState<"250g" | "500g" | "1kg">("250g");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"details" | "reviews" | "shipping">("details");

  const price = 4.99;
  const oldPrice = 6.99;

  const discount = useMemo(() => {
    return oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;
  }, [oldPrice, price]);

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div className="text-sm text-zinc-500">
        <Link className="hover:text-[var(--brand-700)]" href="/">Home</Link>
        <span className="mx-2">/</span>
        <Link className="hover:text-[var(--brand-700)]" href="/categories">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">Product #{id}</span>
      </div>

      {/* Top Section */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
<div className="group relative aspect-square overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)]">            <Image
  src={activeImage}
  alt="Product"
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-105"
/>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {mockImages.map((src) => {
              const active = src === activeImage;
              return (
                <button
                  key={src}
                  onClick={() => setActiveImage(src)}
                  className={[
                    "relative aspect-square overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300",
                    active
                    ? "border-[var(--brand-600)] shadow-[0_0_0_4px_rgba(255,171,145,0.35)]"
                    : "border-zinc-200 hover:-translate-y-0.5 hover:shadow-md"
                  ].join(" ")}
                >
                  <Image src={src} alt="Thumb" fill className="object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Panel (glassy) */}
        <div className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
                In Stock
              </span>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
                Organic Fresh Strawberries
              </h1>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
                <div className="text-[var(--brand-600)]">
                  {"★".repeat(4)}{"☆".repeat(1)}
                </div>    
                <span>4.5</span>
                <span className="text-zinc-400">(149 reviews)</span>
              </div>
            </div>

            {/* Icons placeholder */}
            <div className="flex gap-2">
  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-zinc-800 backdrop-blur transition hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] active:scale-95">
    <FontAwesomeIcon icon={faHeart} size="sm" />
  </button>

  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-zinc-800 backdrop-blur transition hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] active:scale-95">
    <FontAwesomeIcon icon={faShareNodes} size="sm" />
  </button>
</div>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-end gap-3">
            <div className="text-3xl font-extrabold text-[var(--brand-700)]">${price.toFixed(2)}</div>
            <div className="pb-1 text-sm text-zinc-500 line-through">${oldPrice.toFixed(2)}</div>
            {discount ? (
              <span className="mb-1 inline-flex rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-bold text-[var(--brand-700)]">
                Save {discount}%
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-600">
            Sweet, juicy, and bursting with flavor. Perfect for snacking, baking, or adding to your favorite smoothies.
          </p>

          {/* Weight */}
          <div className="mt-6 flex items-center gap-3">
            <span className="w-20 text-sm font-semibold text-zinc-800">Weight:</span>
            <div className="flex flex-wrap gap-2">
              {(["250g", "500g", "1kg"] as const).map((w) => {
                const active = w === weight;
                return (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                      active
                        ? "bg-[var(--brand-600)] text-white shadow-md"
                        : "bg-white/80 backdrop-blur border border-zinc-200 text-zinc-800 hover:border-[var(--brand-200)] hover:shadow-sm",
                    ].join(" ")}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5 flex items-center gap-3">
            <span className="w-20 text-sm font-semibold text-zinc-800">Qty:</span>
            <div className="flex items-center rounded-full border border-zinc-200 bg-white/80 backdrop-blur">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-full text-lg text-zinc-700 transition hover:bg-[var(--brand-50)]"
              >
                −
              </button>
              <div className="w-12 text-center text-sm font-semibold text-zinc-800">{qty}</div>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="h-10 w-10 rounded-full text-lg text-zinc-700 transition hover:bg-[var(--brand-50)]"
              >
                +
              </button>
            </div>

            <span className="text-xs text-zinc-500">Only 12 items left in stock</span>
          </div>

          {/* Actions */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button className="rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]">
              Add to cart
            </button>
            <button className="rounded-full border border-zinc-200 bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:shadow-md active:scale-[0.98]">
              Buy now
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="relative flex flex-wrap gap-2 border-b border-zinc-200 bg-[var(--brand-50)]/50 px-4 py-3">
  {[
    { key: "details", label: "Product Details" },
    { key: "reviews", label: "Reviews (149)" },
    { key: "shipping", label: "Shipping & Returns" },
  ].map((t) => {
    const active = tab === (t.key as any);
    return (
      <button
        key={t.key}
        onClick={() => setTab(t.key as any)}
        className={[
          "relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
          active
            ? "text-[var(--brand-700)]"
            : "text-zinc-600 hover:text-[var(--brand-700)]",
        ].join(" ")}
      >
        {t.label}

        {/* Underline indicator */}
        <span
          className={[
            "absolute left-1/2 -bottom-1 h-[3px] w-10 -translate-x-1/2 rounded-full bg-[var(--brand-600)] transition-all duration-300",
            active ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      </button>
    );
  })}
</div>

        <div className="p-6 sm:p-8 animate-fadeIn">
          {tab === "details" ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Product Description</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Our organic strawberries are carefully grown without synthetic pesticides or fertilizers, ensuring the purest taste.
                </p>

                <h4 className="mt-6 text-sm font-bold text-zinc-900">Benefits</h4>
                <ul className="mt-3 list-disc pl-5 text-sm text-zinc-600 space-y-2">
                  <li>Rich in vitamins C and K</li>
                  <li>Good source of fiber and antioxidants</li>
                  <li>Supports heart health</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-[var(--brand-50)]/40 p-5">
                <h4 className="text-sm font-bold text-zinc-900">Product Details</h4>
                <div className="mt-4 space-y-3 text-sm text-zinc-600">
                  <div className="flex justify-between"><span>Origin</span><span className="font-semibold text-zinc-800">California, USA</span></div>
                  <div className="flex justify-between"><span>Storage</span><span className="font-semibold text-zinc-800">Refrigerate upon arrival</span></div>
                  <div className="flex justify-between"><span>Shelf Life</span><span className="font-semibold text-zinc-800">5–7 days</span></div>
                </div>
              </div>
            </div>
          ) : tab === "reviews" ? (
            <div className="text-sm text-zinc-600">
              Reviews UI (later we connect API).
            </div>
          ) : (
            <div className="text-sm text-zinc-600">
              Shipping & Returns UI (later we connect API).
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-zinc-900">You may also like</h2>
          <div className="flex gap-2">
            <button className="h-10 w-10 rounded-full border border-zinc-200 bg-white transition hover:bg-[var(--brand-50)]">‹</button>
            <button className="h-10 w-10 rounded-full border border-zinc-200 bg-white transition hover:bg-[var(--brand-50)]">›</button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
      <RecentlyViewed />
    </div>
  );
}