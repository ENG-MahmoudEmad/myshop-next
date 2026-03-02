"use client";

import Image from "next/image";
import { Heart, Shuffle, Eye, Plus } from "lucide-react";
import type { SearchProduct } from "../data/mockSearch";
import { ViewMode } from "./SearchToolbar";

const HOVER_LIFT = "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl";
const GLASS_CARD =
  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";

export default function SearchResultsGrid({
  items,
  viewMode,
}: {
  items: SearchProduct[];
  viewMode: ViewMode;
}) {
  if (!items.length) {
    return (
      <div className={`${GLASS_CARD} rounded-3xl p-10 text-center`}>
        <p className="text-lg font-extrabold text-zinc-900">No results found</p>
        <p className="mt-2 text-sm text-zinc-600">
          Try changing your filters or searching with a different keyword.
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {items.map((p) => (
          <ListRow key={p.id} p={p} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}

function ProductCard({ p }: { p: SearchProduct }) {
  return (
    <div className={`${GLASS_CARD} ${HOVER_LIFT} group relative overflow-hidden rounded-3xl p-4`}>
      {/* badge */}
      {p.badge ? (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-[var(--brand-600)] px-3 py-1 text-xs font-semibold text-white">
          {p.badge}
        </div>
      ) : null}

      {/* actions */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
        <IconCircle icon={<Heart className="h-4 w-4" />} />
        <IconCircle icon={<Shuffle className="h-4 w-4" />} />
        <IconCircle icon={<Eye className="h-4 w-4" />} />
      </div>

      <div className="relative h-44 overflow-hidden rounded-2xl bg-white/40">
        <Image
          src={p.image}
          alt={p.title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>

      <div className="mt-4">
        <p className="text-xs text-zinc-500">{p.category}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold text-zinc-900">{p.title}</h3>

        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
          <Stars value={p.rating} />
          <span className="font-semibold text-zinc-800">{p.rating.toFixed(1)}</span>
          <span>({p.reviewsCount})</span>
          {!p.inStock ? (
            <span className="ml-auto rounded-full bg-white/55 px-3 py-1 text-[11px] font-semibold text-zinc-700 ring-1 ring-white/20">
              Out of stock
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-extrabold text-zinc-900">${p.price.toFixed(2)}</span>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-600)] text-white transition-all duration-300 ease-out hover:scale-105 hover:bg-[var(--brand-700)] active:scale-95"
            aria-label="Add to cart"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ListRow({ p }: { p: SearchProduct }) {
  return (
    <div className={`${GLASS_CARD} ${HOVER_LIFT} flex gap-4 rounded-3xl p-4`}>
      <div className="relative h-24 w-28 flex-none overflow-hidden rounded-2xl bg-white/40">
        <Image src={p.image} alt={p.title} fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-zinc-500">{p.category}</p>
            <h3 className="mt-1 truncate text-sm font-extrabold text-zinc-900">{p.title}</h3>
          </div>
          <span className="text-lg font-extrabold text-zinc-900">${p.price.toFixed(2)}</span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
          <Stars value={p.rating} />
          <span className="font-semibold text-zinc-800">{p.rating.toFixed(1)}</span>
          <span>({p.reviewsCount})</span>
          {!p.inStock ? <span className="ml-auto font-semibold text-zinc-500">Out of stock</span> : null}
        </div>
      </div>
    </div>
  );
}

function IconCircle({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="grid h-9 w-9 place-items-center rounded-full bg-white/75 text-zinc-800 shadow-sm ring-1 ring-white/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl"
    >
      {icon}
    </button>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const total = 5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => {
        const on = i < full || (i === full && half);
        return (
          <span
            key={i}
            className={[
              "text-[12px]",
              on ? "text-amber-500" : "text-zinc-300",
            ].join(" ")}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}