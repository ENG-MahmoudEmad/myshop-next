"use client";

import { useMemo } from "react";

export type FiltersState = {
  categories: Set<string>;
  brands: Set<string>;
  ratings: Set<number>; // 4, 3, ...
  inStockOnly: boolean;
  outOfStock: boolean;
  dietary: Set<string>;
  priceMin: number;
  priceMax: number;
};

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
      <span>{label}</span>
    </label>
  );
}

export default function SearchFiltersSidebar({
  draft,
  onDraftChange,
  onApply,
  onReset,
}: {
  draft: FiltersState;
  onDraftChange: (next: FiltersState) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  const categories = useMemo(
    () => ["Vegetables", "Fruits", "Herbs & Greens", "Organic Products", "Mixed Boxes"],
    []
  );

  const brands = useMemo(
    () => ["Organic Farms", "Nature's Basket", "Fresh Harvest", "Green Valley", "Earth Grown"],
    []
  );

  const dietary = useMemo(() => ["100% Organic", "Vegan", "Gluten-Free", "Non-GMO"], []);

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
            {categories.map((c) => (
              <CheckboxRow
                key={c}
                label={c}
                checked={draft.categories.has(c)}
                onChange={(ch) => setSet("categories", c, ch)}
              />
            ))}
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
          <p className="mt-2 text-xs text-zinc-500">(Mock range for UI — will wire to API later)</p>
        </Section>

        <Divider />

        <Section title="Brands">
          <div className="space-y-2">
            {brands.map((b) => (
              <CheckboxRow
                key={b}
                label={b}
                checked={draft.brands.has(b)}
                onChange={(ch) => setSet("brands", b, ch)}
              />
            ))}
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

        <Section title="Availability">
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

        <Section title="Dietary Preferences">
          <div className="space-y-2">
            {dietary.map((d) => (
              <CheckboxRow
                key={d}
                label={d}
                checked={draft.dietary.has(d)}
                onChange={(ch) => setSet("dietary", d, ch)}
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