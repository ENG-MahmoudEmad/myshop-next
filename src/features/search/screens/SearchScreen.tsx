"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { useCategories } from "../hooks/useCategories";
import { useBrands } from "../hooks/useBrands";

import SearchFiltersSidebar, { FiltersState } from "../components/SearchFiltersSidebar";
import SearchToolbar, { ViewMode, SortKey } from "../components/SearchToolbar";
import SearchResultsGrid from "../components/SearchResultsGrid";
import SearchPagination from "../components/SearchPagination";
import RecentlyViewedStrip from "../components/RecentlyViewedStrip";
import FiltersDrawer from "../components/FiltersDrawer";

import { useProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types/product.types";

const GLASS =
  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";

function mapSort(sortKey: SortKey): string | undefined {
  if (sortKey === "price_asc") return "price";
  if (sortKey === "price_desc") return "-price";
  if (sortKey === "rating_desc") return "-ratingsAverage";
  return undefined;
}

function useDebouncedValue<T>(value: T, delay = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchScreen() {
  const router = useRouter();
  const sp = useSearchParams();

  // ✅ hydration-safe
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: catsData } = useCategories();
  const { data: brandsData } = useBrands();

  const categoriesOptions = useMemo(
    () => (catsData?.data ?? []).map((c) => ({ id: c._id, name: c.name })),
    [catsData]
  );

  const brandsOptions = useMemo(
    () => (brandsData?.data ?? []).map((b) => ({ id: b._id, name: b.name })),
    [brandsData]
  );

  // ✅ IMPORTANT: don't read sp.get("q") inside useState initializer (causes mismatch)
  const [query, setQuery] = useState("");

  // sync input from URL ONLY after mounted
  useEffect(() => {
    if (!mounted) return;
    const next = sp.get("q") ?? "";
    setQuery(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, sp]);

  const debouncedQuery = useDebouncedValue(query, 450);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortKey, setSortKey] = useState<SortKey>("relevance");

  const defaultFilters: FiltersState = {
    categories: new Set(),
    brands: new Set(),
    ratings: new Set(),
    inStockOnly: false,
    outOfStock: false,
    dietary: new Set(), // UI only
    priceMin: 0,
    priceMax: 999999,
  };

  const [draftFilters, setDraftFilters] = useState<FiltersState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>(defaultFilters);

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
  };

  const resetFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
  };

  const kw = debouncedQuery.trim();

  // ---------- Primary API query (with keyword) ----------
  const primaryParams = useMemo(() => {
    const sort = mapSort(sortKey);

    const params: any = { page, limit: pageSize };

    if (kw) params.keyword = kw;
    if (sort) params.sort = sort;

    const categoryId = Array.from(appliedFilters.categories)[0];
    const brandId = Array.from(appliedFilters.brands)[0];
    if (categoryId) params.category = categoryId;
    if (brandId) params.brand = brandId;

    if (Number.isFinite(appliedFilters.priceMin)) params["price[gte]"] = appliedFilters.priceMin;
    if (Number.isFinite(appliedFilters.priceMax)) params["price[lte]"] = appliedFilters.priceMax;

    return params;
  }, [
    page,
    pageSize,
    kw,
    sortKey,
    appliedFilters.categories,
    appliedFilters.brands,
    appliedFilters.priceMin,
    appliedFilters.priceMax,
  ]);

  const primary = useProducts(primaryParams, {
    staleTimeMs: 10_000,
    gcTimeMs: 5 * 60_000,
    enabled: mounted, // ✅ don't fetch before mounted (avoids mismatch + weird first paint)
  });

  const primaryItems: Product[] = primary.data?.data ?? [];
  const primaryTotalPages = primary.data?.metadata?.numberOfPages ?? 1;
  const primaryTotalResults = primary.data?.results ?? primaryItems.length;

  // ---------- Fallback API query (NO keyword) ----------
  const shouldFallback = mounted && !!kw && !primary.isLoading && primaryItems.length === 0;

  const fallbackParams = useMemo(() => {
    const sort = mapSort(sortKey);

    const params: any = {
      page: 1,
      limit: 80,
    };

    if (sort) params.sort = sort;

    const categoryId = Array.from(appliedFilters.categories)[0];
    const brandId = Array.from(appliedFilters.brands)[0];
    if (categoryId) params.category = categoryId;
    if (brandId) params.brand = brandId;

    if (Number.isFinite(appliedFilters.priceMin)) params["price[gte]"] = appliedFilters.priceMin;
    if (Number.isFinite(appliedFilters.priceMax)) params["price[lte]"] = appliedFilters.priceMax;

    return params;
  }, [
    sortKey,
    appliedFilters.categories,
    appliedFilters.brands,
    appliedFilters.priceMin,
    appliedFilters.priceMax,
  ]);

  const fallback = useProducts(fallbackParams, {
    staleTimeMs: 10_000,
    gcTimeMs: 5 * 60_000,
    enabled: shouldFallback,
  });

  const fallbackRaw: Product[] = fallback.data?.data ?? [];

  const fallbackFiltered = useMemo(() => {
    if (!kw) return [];
    const q = kw.toLowerCase();
    return fallbackRaw.filter((p: any) => {
      const title = (p.title ?? "").toLowerCase();
      const brandName = (p.brand?.name ?? "").toLowerCase();
      return title.includes(q) || brandName.includes(q);
    });
  }, [kw, fallbackRaw]);

  const usingFallback = shouldFallback;

  // ---------- Availability (client-side) ----------
  const applyAvailability = (list: Product[]) => {
    const inStock = appliedFilters.inStockOnly;
    const outOfStock = appliedFilters.outOfStock;

    if (!inStock && !outOfStock) return list;

    if (inStock && !outOfStock) {
      return list.filter((p: any) => ((p as any).quantity ?? 1) > 0);
    }
    if (!inStock && outOfStock) {
      return list.filter((p: any) => ((p as any).quantity ?? 1) <= 0);
    }
    return list;
  };

  const baseItems = usingFallback ? fallbackFiltered : primaryItems;

  const items = useMemo(
    () => applyAvailability(baseItems),
    [baseItems, appliedFilters.inStockOnly, appliedFilters.outOfStock]
  );

  // ---------- Pagination ----------
  const totalResults = usingFallback ? items.length : primaryTotalResults;

  const totalPages = usingFallback
    ? Math.max(1, Math.ceil(items.length / pageSize))
    : primaryTotalPages;

  const pagedItems = useMemo(() => {
    if (!usingFallback) return items;
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize, usingFallback]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  // URL sync (debounced) — only after mounted
  useEffect(() => {
    if (!mounted) return;

    const next = new URLSearchParams(Array.from(sp.entries()));

    if (kw) next.set("q", kw);
    else next.delete("q");

    next.delete("page");

    router.replace(`/search?${next.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, kw]);

  const isLoading = !mounted || primary.isLoading || (usingFallback && fallback.isLoading);
  const isFetching = primary.isFetching || (usingFallback && fallback.isFetching);
  const isError = primary.isError || (usingFallback && fallback.isError);
  const error = (primary.error as any) ?? (fallback.error as any);

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-[92%] max-w-7xl py-8">
        {/* Header */}
        <div className={`${GLASS} rounded-3xl p-5 lg:p-6`}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 lg:text-2xl">
                Search
                {mounted && kw ? (
                  <>
                    {" "}
                    Results for <span className="text-[var(--brand-700)]">"{kw}"</span>
                  </>
                ) : null}
              </h1>

              {/* ✅ key fix: don't render changing text before mounted */}
              <p className="text-sm text-zinc-600">
                {!mounted ? (
                  <span>Loading results…</span>
                ) : isLoading ? (
                  <span>Loading results…</span>
                ) : isError ? (
                  <span className="text-red-600">Failed to load results</span>
                ) : (
                  <>
                    We found <span className="font-semibold text-zinc-900">{totalResults}</span>{" "}
                    products for you
                    {isFetching ? <span className="ml-2 text-zinc-500">(updating…)</span> : null}
                    {usingFallback ? <span className="ml-2 text-zinc-500">(smart match)</span> : null}
                  </>
                )}
              </p>
            </div>

            {/* Search Input */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="flex-1 rounded-3xl bg-white/55 px-4 py-3 ring-1 ring-white/20 transition-all duration-300 ease-out focus-within:shadow-xl">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search products… (apparel, electronics, brands)"
                  className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="rounded-full bg-white/55 px-5 py-3 text-sm font-semibold text-zinc-800 ring-1 ring-white/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
              >
                Clear
              </button>
            </form>
          </div>
        </div>

        {/* Main layout */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <SearchFiltersSidebar
              draft={draftFilters}
              onDraftChange={setDraftFilters}
              onApply={applyFilters}
              onReset={resetFilters}
              categoriesOptions={categoriesOptions}
              brandsOptions={brandsOptions}
            />
          </div>

          {/* Right content */}
          <div className="min-h-[640px]">
            <div className={`${GLASS} rounded-3xl p-4 lg:p-5`}>
              <SearchToolbar
                viewMode={viewMode}
                onChangeView={setViewMode}
                sortKey={sortKey}
                onChangeSort={(k) => {
                  setSortKey(k);
                  setPage(1);
                }}
                onOpenFilters={() => setFiltersOpen(true)}
              />

              <div className="mt-4">
                {isError ? (
                  <div className="rounded-3xl bg-white/55 p-8 text-center ring-1 ring-white/20">
                    <p className="text-base font-extrabold text-zinc-900">Something went wrong</p>
                    <p className="mt-2 text-sm text-zinc-600">{error?.message ?? "Please try again."}</p>
                  </div>
                ) : (
                  <SearchResultsGrid items={pagedItems} viewMode={viewMode} loading={isLoading} />
                )}
              </div>

              <div className="mt-6">
                <SearchPagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <FiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)}>
          <SearchFiltersSidebar
            draft={draftFilters}
            onDraftChange={setDraftFilters}
            onApply={() => {
              applyFilters();
              setFiltersOpen(false);
            }}
            onReset={resetFilters}
            categoriesOptions={categoriesOptions}
            brandsOptions={brandsOptions}
          />
        </FiltersDrawer>

        {/* Recently viewed (UI demo) */}
        <div className="mt-10">
          <RecentlyViewedStrip />
        </div>
      </div>
    </div>
  );
}