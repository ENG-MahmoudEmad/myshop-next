"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type ViewMode = "grid" | "list";
export type SortKey = "relevance" | "price_asc" | "price_desc" | "rating_desc";

const BTN_BASE =
  "inline-flex items-center justify-center rounded-full transition-all duration-300 ease-out active:scale-95";
const BTN_ICON =
  "h-10 w-10 bg-white/70 text-zinc-800 ring-1 ring-white/20 backdrop-blur hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)]";

export default function SearchToolbar({
  viewMode,
  onChangeView,
  sortKey,
  onChangeSort,
  onOpenFilters,
}: {
  viewMode: ViewMode;
  onChangeView: (m: ViewMode) => void;
  sortKey: SortKey;
  onChangeSort: (k: SortKey) => void;
  onOpenFilters: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const sortLabel =
    sortKey === "relevance"
      ? "Relevance"
      : sortKey === "price_asc"
      ? "Price: Low → High"
      : sortKey === "price_desc"
      ? "Price: High → Low"
      : "Rating";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* LEFT: View */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-zinc-700">View:</span>

        {/* ✅ IMPORTANT: type="button" so it never submits any parent form */}
        <button
          type="button"
          onClick={() => onChangeView("grid")}
          className={[
  BTN_BASE,
  BTN_ICON,
  viewMode === "grid"
    ? "bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]"
    : "text-zinc-700",
].join(" ")}
          aria-label="Grid view"
        >
          <span className="grid h-4 w-4 grid-cols-2 gap-0.5">
  <span className="rounded-sm bg-current" />
  <span className="rounded-sm bg-current" />
  <span className="rounded-sm bg-current" />
  <span className="rounded-sm bg-current" />
</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeView("list")}
          className={[
            BTN_BASE,
            BTN_ICON,
            viewMode === "list"
              ? "bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]"
              : "",
          ].join(" ")}
          aria-label="List view"
        >
          <span className="flex flex-col gap-0.5">
  <span className="h-0.5 w-4 rounded bg-current" />
  <span className="h-0.5 w-4 rounded bg-current" />
  <span className="h-0.5 w-4 rounded bg-current" />
</span>
        </button>

        {/* Filters button (mobile only) */}
        <button
          type="button"
          onClick={onOpenFilters}
          className="ml-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 ring-1 ring-white/20 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl lg:hidden"
        >
          Filters
        </button>
      </div>

      {/* RIGHT: Sort */}
      <div className="relative" ref={ref}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-700">Sort by:</span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 ring-1 ring-white/20 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl"
          >
            <span className="max-w-[220px] truncate">{sortLabel}</span>
            <ChevronDown
              className={[
                "h-4 w-4 text-zinc-600 transition-transform duration-300",
                open ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </div>

        <div
          className={[
            "absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/30 bg-white/95 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.12)]",
            "transition-all duration-200",
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none",
          ].join(" ")}
        >
          <SortItem
            active={sortKey === "relevance"}
            onClick={() => {
              onChangeSort("relevance");
              setOpen(false);
            }}
          >
            Relevance
          </SortItem>

          <SortItem
            active={sortKey === "price_asc"}
            onClick={() => {
              onChangeSort("price_asc");
              setOpen(false);
            }}
          >
            Price: Low → High
          </SortItem>

          <SortItem
            active={sortKey === "price_desc"}
            onClick={() => {
              onChangeSort("price_desc");
              setOpen(false);
            }}
          >
            Price: High → Low
          </SortItem>

          <SortItem
            active={sortKey === "rating_desc"}
            onClick={() => {
              onChangeSort("rating_desc");
              setOpen(false);
            }}
          >
            Rating
          </SortItem>
        </div>
      </div>
    </div>
  );
}

function SortItem({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "block w-full px-4 py-3 text-left text-sm transition-all duration-200",
        active
          ? "bg-[var(--brand-50)] text-[var(--brand-700)] font-semibold"
          : "text-zinc-800 hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}