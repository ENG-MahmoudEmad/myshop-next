"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  BadgeCheck,
  Sparkles,
  Store,
} from "lucide-react";
import BrandsSortDropdown from "@/features/brands/components/BrandsSortDropdown";

type Brand = {
  id: string;
  name: string;
  productsCount: number;
  category: string;
  featured?: boolean;
};

const ALL_BRANDS: Brand[] = [
  { id: "natures-harvest", name: "Nature's Harvest", productsCount: 124, category: "Organic", featured: true },
  { id: "pure-dairy", name: "Pure Dairy", productsCount: 87, category: "Dairy", featured: true },
  { id: "hearth-grain", name: "Hearth & Grain", productsCount: 62, category: "Bakery", featured: true },

  { id: "ocean-fresh", name: "Ocean Fresh", productsCount: 48, category: "Seafood" },
  { id: "green-earth", name: "Green Earth", productsCount: 53, category: "Organic" },
  { id: "sweet-valley", name: "Sweet Valley", productsCount: 39, category: "Snacks" },
  { id: "nutri-life", name: "Nutri Life", productsCount: 71, category: "Wellness" },
  { id: "fresh-farms", name: "Fresh Farms", productsCount: 66, category: "Produce" },
  { id: "wholesome-kitchen", name: "Wholesome Kitchen", productsCount: 44, category: "Home Cooking" },
  { id: "brew-perfect", name: "Brew Perfect", productsCount: 28, category: "Beverages" },
  { id: "grain-seed", name: "Grain & Seed", productsCount: 57, category: "Bakery" },
  { id: "eco-clean", name: "Eco Clean", productsCount: 33, category: "Household" },
  { id: "daily-delight", name: "Daily Delight", productsCount: 41, category: "Dairy" },
  { id: "farm-origin", name: "Farm Origin", productsCount: 52, category: "Produce" },
  { id: "spice-studio", name: "Spice Studio", productsCount: 36, category: "Pantry" },
];

const SORTS = [
  { label: "Featured", value: "featured" as const },
  { label: "A → Z", value: "az" as const },
  { label: "Z → A", value: "za" as const },
  { label: "Most Products", value: "most" as const },
];

type SortValue = (typeof SORTS)[number]["value"];

function brandInitials(name: string) {
  const parts = name.replace(/['’]/g, "").split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "B";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function BrandsScreen() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("featured");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = ALL_BRANDS.filter((b) => {
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    });

    switch (sort) {
      case "featured":
        list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
        break;
      case "az":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "most":
        list = [...list].sort((a, b) => b.productsCount - a.productsCount);
        break;
    }

    return list;
  }, [query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paged = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, totalPages]);

  // reset page when query/sort changes
  useMemo(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sort]);

  const featured = useMemo(() => ALL_BRANDS.filter((b) => b.featured), []);

  return (
    <div className="py-8">
      {/* HERO */}
      <section className="relative mt-2">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] px-8 py-14 sm:px-16">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/35 via-white/10 to-transparent" />

          <div className="relative mx-auto max-w-3xl text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--brand-700)]">
              Shop by Brands
            </h1>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
              Discover trusted brands across groceries, household essentials, and
              more — all in one place.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/35 backdrop-blur-md border border-white/30 px-3 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Verified partners
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/35 backdrop-blur-md border border-white/30 px-3 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Premium quality
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/35 backdrop-blur-md border border-white/30 px-3 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Fresh arrivals
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mt-16 space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Featured Brands</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Popular picks loved by our customers.
            </p>
          </div>

          <Link
            href="/categories"
            className="text-sm font-semibold text-[var(--brand-600)] transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
          >
            Explore Categories →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((b) => (
            <Link key={b.id} href={`/brands/${b.id}`} className="group block">
              <div className="relative rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
                    <Sparkles size={14} />
                    Featured
                  </span>

                  <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
                    <BadgeCheck size={14} className="text-[var(--brand-700)]" />
                    Verified
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)] text-xl font-extrabold transition-all duration-300 ease-out group-hover:bg-[var(--brand-600)] group-hover:text-white">
                    {brandInitials(b.name)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-zinc-900">
                      {b.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {b.category} • {b.productsCount} products
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-sm font-semibold text-[var(--brand-600)] transition-all duration-300 ease-out group-hover:text-[var(--brand-700)]">
                    View products →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEARCH + SORT */}
      <section className="mt-16 space-y-6 ">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">All Brands</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Search by brand name or category.
            </p>
          </div>

          <div className="relative z-50 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search pill */}
            <div className="flex h-12 w-full  sm:w-[360px] items-center gap-3 rounded-full overflow-hidden bg-white/70 backdrop-blur-md border border-white/40 px-4 transition-all duration-300 ease-out focus-within:ring-4 focus-within:ring-[var(--brand-200)]">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-700)]">
                <Search size={18} />
              </span>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brands..."
                className="h-full w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
                autoComplete="off"
              />
            </div>

            {/* Sort */}
            <div className="flex h-12 items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-white/40 px-4">
              <ArrowUpDown size={16} className="text-zinc-600" />
              <BrandsSortDropdown
  label="Sort by:"
  options={[
    { label: "Featured", value: "featured" },
    { label: "A → Z", value: "az" },
    { label: "Z → A", value: "za" },
    { label: "Most Products", value: "most" },
  ]}
  value={sort}
  onChange={(v) => setSort(v as SortValue)}
/>
            </div>
          </div>
        </div>

        {/* GRID */}
        {paged.length === 0 ? (
          <div className="rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
              <Store size={26} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-900">
              No brands found
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Try a different keyword (brand name or category).
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-6 rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
  <div className="flex min-h-[470px] flex-col">
    {/* Grid */}
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {paged.map((b) => (
        <Link key={b.id} href={`/brands/${b.id}`} className="group block">
          <div className="rounded-2xl bg-white/65 backdrop-blur-md border border-white/20 p-6 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--brand-200)] hover:shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-700)] text-lg font-extrabold transition-all duration-300 ease-out group-hover:bg-[var(--brand-600)] group-hover:text-white">
              {brandInitials(b.name)}
            </div>

            <h4 className="mt-4 text-sm font-semibold text-zinc-900 truncate">
              {b.name}
            </h4>

            <p className="mt-1 text-xs text-zinc-500">
              {b.category} • {b.productsCount} products
            </p>
          </div>
        </Link>
      ))}
    </div>

    {/* Pagination (Pinned) */}
    <div className="mt-auto pt-10">
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-white/55 backdrop-blur-md border border-white/20 p-4 sm:flex-row">
        <p className="text-xs text-zinc-600">
          Page <span className="font-semibold text-zinc-900">{page}</span>{" "}
          of <span className="font-semibold text-zinc-900">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
              page === 1
                ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                : "bg-white/70 border border-white/30 text-zinc-800 hover:-translate-y-0.5 hover:shadow-md",
            ].join(" ")}
          >
            Prev
          </button>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
              page === totalPages
                ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                : "bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] hover:shadow-md active:scale-[0.98]",
            ].join(" ")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</>
        )}
      </section>

      {/* PARTNER */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-10">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/35 via-white/10 to-transparent" />

          <div className="relative max-w-xl space-y-4">
            <h3 className="text-2xl font-extrabold text-[var(--brand-700)]">
              Want to become a brand partner?
            </h3>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Join our marketplace and showcase your products to thousands of
              customers with premium placement opportunities.
            </p>

            <ul className="space-y-2 text-sm text-zinc-700">
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Access to active customers
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Dedicated brand support
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Marketing opportunities
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Streamlined fulfillment
              </li>
            </ul>

            <button
              type="button"
              className="mt-4 rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:scale-105 active:scale-95"
            >
              Apply as Partner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}