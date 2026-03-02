"use client";

import { LayoutGrid, List, ChevronDown } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export type ViewMode = "grid" | "list";
export type SortKey = "relevance" | "price_asc" | "price_desc" | "rating_desc";

const GLASS_PILL = "rounded-full bg-white/55 backdrop-blur-md border border-white/20";

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
  onOpenFilters?: () => void;
}) {
  const sortLabel = useMemo(() => {
    if (sortKey === "price_asc") return "Price: Low to High";
    if (sortKey === "price_desc") return "Price: High to Low";
    if (sortKey === "rating_desc") return "Top Rated";
    return "Relevance";
  }, [sortKey]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {onOpenFilters ? (
          <button
            type="button"
            onClick={onOpenFilters}
            className="lg:hidden rounded-full bg-white/55 px-4 py-2 text-sm font-semibold text-zinc-800 ring-1 ring-white/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
          >
            Filters
          </button>
        ) : null}

        <span className="text-sm font-semibold text-zinc-700">View:</span>

        <div className={`${GLASS_PILL} flex items-center p-1`}>
          <IconToggle
            active={viewMode === "grid"}
            onClick={() => onChangeView("grid")}
            icon={<LayoutGrid className="h-4 w-4" />}
          />
          <IconToggle
            active={viewMode === "list"}
            onClick={() => onChangeView("list")}
            icon={<List className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-sm font-semibold text-zinc-700">Sort by:</span>
        <SortDropdown label={sortLabel} value={sortKey} onChange={onChangeSort} />
      </div>
    </div>
  );
}

function IconToggle({
  active,
  onClick,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "grid h-9 w-10 place-items-center rounded-full transition-all duration-300 ease-out",
        active ? "bg-[var(--brand-600)] text-white shadow-sm" : "text-zinc-700 hover:bg-white/60",
      ].join(" ")}
      aria-pressed={active}
    >
      {icon}
    </button>
  );
}

function SortDropdown({
  label,
  value,
  onChange,
}: {
  label: string;
  value: SortKey;
  onChange: (k: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const items: { key: SortKey; label: string }[] = [
    { key: "relevance", label: "Relevance" },
    { key: "price_asc", label: "Price: Low to High" },
    { key: "price_desc", label: "Price: High to Low" },
    { key: "rating_desc", label: "Top Rated" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-w-[220px] items-center justify-between gap-3 rounded-full bg-white/55 px-4 py-2 text-sm font-semibold text-zinc-800 ring-1 ring-white/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
      >
        <span className="truncate">{label}</span>
        <ChevronDown className="h-4 w-4 text-zinc-600" />
      </button>

      <div
        className={[
          "absolute right-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-2xl border border-white/25 bg-white/90 shadow-[0_18px_60px_rgba(0,0,0,0.10)] backdrop-blur-xl transition-all duration-300 ease-out",
          open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
        ].join(" ")}
      >
        {items.map((it) => {
          const active = it.key === value;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => {
                onChange(it.key);
                setOpen(false);
              }}
              className={[
                "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-all duration-200",
                active
                  ? "bg-[var(--brand-100)] text-[var(--brand-700)] font-extrabold"
                  : "text-zinc-800 hover:bg-white/70",
              ].join(" ")}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}