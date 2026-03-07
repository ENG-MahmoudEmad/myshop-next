"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  BadgeCheck,
  Sparkles,
  Store,
} from "lucide-react";
import BrandsSortDropdown from "@/features/brands/components/BrandsSortDropdown";
import { useBrands } from "@/features/brands/hooks/useBrands";
import type { ApiBrand } from "@/features/brands/api/brands.api";

const SORTS = [
  { label: "Featured", value: "featured" as const },
  { label: "A → Z", value: "az" as const },
  { label: "Z → A", value: "za" as const },
];

type SortValue = (typeof SORTS)[number]["value"];

function brandInitials(name: string) {
  const parts = name.replace(/['’]/g, "").split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "B";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function isFeaturedBrand(index: number) {
  return index < 3;
}

export default function BrandsScreen() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("featured");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const { data, isLoading, isError } = useBrands();

  const allBrands = data?.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = allBrands.filter((brand) => {
      if (!q) return true;
      return brand.name.toLowerCase().includes(q);
    });

    switch (sort) {
      case "featured":
        list = [...list].sort((a, b) => {
          const aFeatured = isFeaturedBrand(allBrands.findIndex((x) => x._id === a._id));
          const bFeatured = isFeaturedBrand(allBrands.findIndex((x) => x._id === b._id));
          return Number(bFeatured) - Number(aFeatured);
        });
        break;
      case "az":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return list;
  }, [allBrands, query, sort]);

  useEffect(() => {
    setPage(1);
  }, [query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const safePage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const featured = useMemo(() => {
    return allBrands.slice(0, 3);
  }, [allBrands]);

  return (
    <div className="py-8">
      {/* HERO */}
      <section className="relative mt-2">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/60 px-8 py-14 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:px-16">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/35 via-white/10 to-transparent" />

          <div className="relative mx-auto max-w-3xl space-y-4 text-center">
            <h1 className="text-3xl font-extrabold text-[var(--brand-700)] sm:text-4xl">
              Shop by Brands
            </h1>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Discover trusted fashion and electronics brands in one curated place.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-700">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/35 px-3 py-1 backdrop-blur-md">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Trusted brands
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/35 px-3 py-1 backdrop-blur-md">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Premium picks
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/35 px-3 py-1 backdrop-blur-md">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                New arrivals
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
              Popular brands available in our store.
            </p>
          </div>

          <Link
            href="/categories"
            className="text-sm font-semibold text-[var(--brand-600)] transition-all duration-300 ease-out hover:text-[var(--brand-700)]"
          >
            Explore Categories →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[190px] animate-pulse rounded-3xl border border-white/20 bg-white/65 backdrop-blur-md"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((b) => (
              <Link key={b._id} href={`/brands/${b._id}`} className="group block">
                <div className="relative rounded-3xl border border-white/20 bg-white/65 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
                      <Sparkles size={14} />
                      Featured
                    </span>

                    <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
                      <BadgeCheck size={14} className="text-[var(--brand-700)]" />
                      Trusted
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-[var(--brand-100)] bg-white shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-md">
  {b.image ? (
    <Image
      src={b.image}
      alt={b.name}
      fill
      className="object-contain p-3"
      sizes="80px"
    />
  ) : (
    <span className="text-xl font-extrabold text-[var(--brand-700)]">
      {brandInitials(b.name)}
    </span>
  )}
</div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-zinc-900">
                        {b.name}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        Brand collection
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
        )}
      </section>

      {/* SEARCH + SORT */}
      <section className="mt-16 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">All Brands</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Search by brand name.
            </p>
          </div>

          <div className="relative z-50 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-12 w-full items-center gap-3 overflow-hidden rounded-full border border-white/40 bg-white/70 px-4 backdrop-blur-md transition-all duration-300 ease-out focus-within:ring-4 focus-within:ring-[var(--brand-200)] sm:w-[360px]">
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

            <div className="flex h-12 items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 backdrop-blur-md">
              <ArrowUpDown size={16} className="text-zinc-600" />
              <BrandsSortDropdown
                label="Sort by:"
                options={[
                  { label: "Featured", value: "featured" },
                  { label: "A → Z", value: "az" },
                  { label: "Z → A", value: "za" },
                ]}
                value={sort}
                onChange={(v) => setSort(v as SortValue)}
              />
            </div>
          </div>
        </div>

        {isError ? (
          <div className="rounded-3xl border border-red-100 bg-red-50/80 p-6 text-sm text-red-700">
            Failed to load brands. Please try again.
          </div>
        ) : isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[150px] animate-pulse rounded-2xl border border-white/20 bg-white/65"
              />
            ))}
          </div>
        ) : paged.length === 0 ? (
          <div className="rounded-3xl border border-white/20 bg-white/65 p-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
              <Store size={26} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-900">No brands found</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Try a different brand keyword.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-6 rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[var(--brand-700)] active:scale-95"
            >
              Clear search
            </button>
          </div>
        ) : (
         <div className="flex min-h-[470px] flex-col">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {paged.map((b) => (
                <Link key={b._id} href={`/brands/${b._id}`} className="group block">
                  <div className="rounded-2xl border border-white/20 bg-white/65 p-6 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--brand-200)] hover:shadow-xl">
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[var(--brand-100)] bg-white shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-md">
  {b.image ? (
    <Image
      src={b.image}
      alt={b.name}
      fill
      className="object-contain p-2.5"
      sizes="64px"
    />
  ) : (
    <span className="text-lg font-extrabold text-[var(--brand-700)]">
      {brandInitials(b.name)}
    </span>
  )}
</div>

                    <h4 className="mt-4 truncate text-sm font-semibold text-zinc-900">
                      {b.name}
                    </h4>

                    <p className="mt-1 text-xs text-zinc-500">Brand collection</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-10">
              <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/20 bg-white/55 p-4 backdrop-blur-md sm:flex-row">
                <p className="text-xs text-zinc-600">
                  Page <span className="font-semibold text-zinc-900">{safePage}</span>{" "}
                  of <span className="font-semibold text-zinc-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                      safePage === 1
                        ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                        : "border border-white/30 bg-white/70 text-zinc-800 hover:-translate-y-0.5 hover:shadow-md",
                    ].join(" ")}
                  >
                    Prev
                  </button>

                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                      safePage === totalPages
                        ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                        : "bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] hover:shadow-md active:scale-[0.98]",
                    ].join(" ")}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* PARTNER */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/60 p-10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/35 via-white/10 to-transparent" />

          <div className="relative max-w-xl space-y-4">
            <h3 className="text-2xl font-extrabold text-[var(--brand-700)]">
              Want to become a brand partner?
            </h3>

            <p className="text-sm leading-relaxed text-zinc-700">
              Join our marketplace and showcase your products to more customers with premium visibility.
            </p>

            <ul className="space-y-2 text-sm text-zinc-700">
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Better brand exposure
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Dedicated support
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Marketing opportunities
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)]" />
                Smooth growth workflow
              </li>
            </ul>

            <button
              type="button"
              className="mt-4 rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[var(--brand-700)] active:scale-95"
            >
              Apply as Partner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}