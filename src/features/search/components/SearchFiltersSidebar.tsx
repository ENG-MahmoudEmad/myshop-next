"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

export type FiltersState = {
  categories: Set<string>;
  brands: Set<string>;
  ratings: Set<number>;
  inStockOnly: boolean;
  outOfStock: boolean;
  dietary: Set<string>;
  priceMin: number;
  priceMax: number;
};

export type FilterOption = { id: string; name: string };

const GLASS =
  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[var(--brand-600)]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="min-w-0 truncate">{label}</span>
    </label>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 rounded bg-zinc-200/70" />
      <div className="h-3 w-40 rounded bg-zinc-200/70" />
    </div>
  );
}

export default function SearchFiltersSidebar({
  draft,
  onDraftChange,
  onApply,
  onReset,
  categoriesOptions = [],
  brandsOptions = [],
}: {
  draft: FiltersState;
  onDraftChange: (next: FiltersState) => void;
  onApply: () => void;
  onReset: () => void;
  categoriesOptions?: FilterOption[];
  brandsOptions?: FilterOption[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [brandsOpen, setBrandsOpen] = useState(false);

  // ✅ IMPORTANT: avoid hydration mismatch
  // server render + first client render => always show skeleton
  const safeCategories = mounted ? categoriesOptions : [];
  const safeBrands = mounted ? brandsOptions : [];

  const tags = useMemo(
    () => ["New Arrivals", "Best Sellers", "On Sale", "Premium Quality"],
    []
  );

  const setSet = (key: "categories" | "brands" | "dietary", item: string, checked: boolean) => {
    const next = { ...draft, [key]: new Set(draft[key]) } as FiltersState;
    if (checked) next[key].add(item);
    else next[key].delete(item);
    onDraftChange(next);
  };

  const setRatings = (stars: number, checked: boolean) => {
    const next = { ...draft, ratings: new Set(draft.ratings) };
    if (checked) next.ratings.add(stars);
    else next.ratings.delete(stars);
    onDraftChange(next);
  };

  return (
    <aside className={`${GLASS} rounded-3xl p-4 lg:p-5`}>
      <div className="space-y-6">
        <Section title="Categories">
          <div className="space-y-2">
            {safeCategories.length ? (
              safeCategories.map((c) => (
                <CheckboxRow
                  key={c.id}
                  label={c.name}
                  checked={draft.categories.has(c.id)}
                  onChange={(ch) => setSet("categories", c.id, ch)}
                />
              ))
            ) : (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </>
            )}
          </div>
        </Section>

        <Divider />

        <Section title="Price Range">
          <div className="grid grid-cols-2 gap-3">
            <LabeledNumber
              label="From"
              value={draft.priceMin}
              onChange={(n) => onDraftChange({ ...draft, priceMin: n })}
            />
            <LabeledNumber
              label="To"
              value={draft.priceMax}
              onChange={(n) => onDraftChange({ ...draft, priceMax: n })}
            />
          </div>
        </Section>

        <Divider />

        <Section title="Brands">
          <button
            type="button"
            onClick={() => setBrandsOpen((v) => !v)}
            className={[
              "flex w-full items-center justify-between gap-3 rounded-2xl bg-white/55 px-4 py-3",
              "text-sm font-semibold ring-1 ring-white/20",
              "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl",
              brandsOpen ? "bg-[var(--brand-600)] text-white" : "text-zinc-800",
            ].join(" ")}
          >
            <span className="truncate">
              {draft.brands.size ? `${draft.brands.size} selected` : "Choose brands"}
            </span>
            <ChevronDown
              className={[
                "h-4 w-4 transition-transform duration-300",
                brandsOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          <div
            className={[
              "mt-3 overflow-hidden rounded-2xl border border-white/25 bg-white/70 backdrop-blur-md",
              "shadow-[0_18px_60px_rgba(0,0,0,0.10)] transition-all duration-300 ease-out",
              brandsOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="max-h-[320px] overflow-auto p-3">
              {safeBrands.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {safeBrands.map((b) => (
                    <label
                      key={b.id}
                      className="flex cursor-pointer items-center gap-2 rounded-xl bg-white/45 px-3 py-2 text-sm text-zinc-700 ring-1 ring-white/15 transition-all duration-200 hover:bg-white/60"
                      title={b.name}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[var(--brand-600)]"
                        checked={draft.brands.has(b.id)}
                        onChange={(e) => setSet("brands", b.id, e.target.checked)}
                      />
                      <span className="min-w-0 flex-1 truncate">{b.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="rounded-xl bg-white/45 px-3 py-2 ring-1 ring-white/15">
                      <div className="h-3 w-20 rounded bg-zinc-200/70" />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onDraftChange({ ...draft, brands: new Set() })}
                  className="rounded-full bg-white/55 px-4 py-2 text-xs font-semibold text-zinc-800 ring-1 ring-white/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => setBrandsOpen(false)}
                  className="rounded-full bg-[var(--brand-600)] px-4 py-2 text-xs font-semibold text-white transition-all duration-300 ease-out hover:bg-[var(--brand-700)] active:scale-95"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        <Section title="Ratings">
          <div className="space-y-2">
            {[5, 4, 3, 2].map((s) => (
              <CheckboxRow
                key={s}
                label={`${s}★ & up`}
                checked={draft.ratings.has(s)}
                onChange={(ch) => setRatings(s, ch)}
              />
            ))}
          </div>
        </Section>

        <Divider />

        <Section title="Availability (UI only)">
          <div className="space-y-2">
            <CheckboxRow
              label="In Stock"
              checked={draft.inStockOnly}
              onChange={(ch) => onDraftChange({ ...draft, inStockOnly: ch })}
            />
            <CheckboxRow
              label="Out of Stock"
              checked={draft.outOfStock}
              onChange={(ch) => onDraftChange({ ...draft, outOfStock: ch })}
            />
          </div>
        </Section>

        <Divider />

        <Section title="Tags (UI only)">
          <div className="space-y-2">
            {tags.map((t) => (
              <CheckboxRow
                key={t}
                label={t}
                checked={draft.dietary.has(t)}
                onChange={(ch) => setSet("dietary", t, ch)}
              />
            ))}
          </div>
        </Section>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onApply}
            className="rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:bg-[var(--brand-700)] active:scale-95"
          >
            Apply Filters
          </button>

          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-white/55 px-5 py-3 text-sm font-semibold text-zinc-800 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-extrabold text-zinc-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-zinc-200" />;
}

function LabeledNumber({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-zinc-600">{label}</span>
      <div className="mt-1 rounded-2xl bg-white/55 px-3 py-2 ring-1 ring-white/20 transition-all duration-300 ease-out focus-within:shadow-xl">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value || 0))}
          className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        />
      </div>
    </label>
  );
}