"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getRecentlyViewed, type RecentlyViewedItem } from "@/features/products/utils/recentlyViewed";

const GLASS =
  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";
const HOVER_LIFT = "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl";

export default function RecentlyViewedStrip() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setMounted(true);
    setItems(getRecentlyViewed());
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <div className={`${GLASS} rounded-3xl p-5 lg:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-zinc-900">Recently Viewed</h2>

        <Link
          href="/search"
          className="text-sm font-semibold text-[var(--brand-700)] underline underline-offset-4 transition-all duration-300 ease-out hover:text-[var(--brand-600)]"
        >
          View all →
        </Link>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className={`${GLASS} ${HOVER_LIFT} rounded-3xl p-4 block`}
          >
            <div className="relative h-32 overflow-hidden rounded-2xl bg-white/40">
              <Image src={p.image} alt={p.title} fill className="object-cover" />
            </div>

            <p className="mt-3 text-xs text-zinc-500">{p.category ?? "Product"}</p>
            <h3 className="mt-1 line-clamp-2 text-sm font-extrabold text-zinc-900">{p.title}</h3>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-base font-extrabold text-zinc-900">
                {p.price.toLocaleString("en-US")} EGP
              </span>

              {/* زر UI (لسه cart logic لاحقًا) */}
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-600)] text-white transition-all duration-300 ease-out hover:scale-105 hover:bg-[var(--brand-700)] active:scale-95"
                aria-label="Add to cart"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}