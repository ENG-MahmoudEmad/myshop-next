"use client";

import { useMemo, useState } from "react";
import { mockProducts, recentlyViewed } from "../data/mockSearch";
import SearchFiltersSidebar, { FiltersState } from "../components/SearchFiltersSidebar";
import SearchToolbar, { ViewMode, SortKey } from "../components/SearchToolbar";
import SearchResultsGrid from "../components/SearchResultsGrid";
import SearchPagination from "../components/SearchPagination";
import RecentlyViewedStrip from "../components/RecentlyViewedStrip";
import FiltersDrawer from "../components/FiltersDrawer";

const GLASS =
  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";

export default function SearchScreen() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query] = useState("organic vegetables");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortKey, setSortKey] = useState<SortKey>("relevance");

  const defaultFilters: FiltersState = {
    categories: new Set(),
    brands: new Set(),
    ratings: new Set(),
    inStockOnly: false,
    outOfStock: false,
    dietary: new Set(),
    priceMin: 5,
    priceMax: 75,
  };

  const [draftFilters, setDraftFilters] = useState<FiltersState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>(defaultFilters);

  const [page, setPage] = useState(1);
  const pageSize = 9;

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
  };

  const resetFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
  };

  const all = useMemo(() => {
    let items = [...mockProducts];
    const f = appliedFilters;

    if (f.categories.size) items = items.filter((p) => f.categories.has(p.category));
    if (f.brands.size) items = items.filter((p) => f.brands.has(p.brand));

    if (f.ratings.size) {
      const mins = Array.from(f.ratings.values());
      const minReq = Math.max(...mins);
      items = items.filter((p) => p.rating >= minReq);
    }

    if (f.inStockOnly && !f.outOfStock) items = items.filter((p) => p.inStock);
    if (!f.inStockOnly && f.outOfStock) items = items.filter((p) => !p.inStock);

    if (f.dietary.size) {
      items = items.filter((p) => (p.tags ?? []).some((t) => f.dietary.has(t)));
    }

    items = items.filter((p) => p.price >= f.priceMin && p.price <= f.priceMax);

    items.sort((a, b) => {
      if (sortKey === "price_asc") return a.price - b.price;
      if (sortKey === "price_desc") return b.price - a.price;
      if (sortKey === "rating_desc") return b.rating - a.rating;
      return 0;
    });

    return items;
  }, [appliedFilters, sortKey]);

  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return all.slice(start, start + pageSize);
  }, [all, page]);

  if (page > totalPages) setPage(1);

  return (
    <div className="min-h-screen">

      <div className="mx-auto w-[92%] max-w-7xl py-8">
        {/* Header */}
        <div className={`${GLASS} rounded-3xl p-5 lg:p-6`}>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 lg:text-2xl">
              Search Results for <span className="text-[var(--brand-700)]">"{query}"</span>
            </h1>
            <p className="text-sm text-zinc-600">
              We found <span className="font-semibold text-zinc-900">{all.length}</span> products for you
            </p>
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
                <SearchResultsGrid items={paged} viewMode={viewMode} />
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
          />
        </FiltersDrawer>

        {/* Recently viewed */}
        <div className="mt-10">
          <RecentlyViewedStrip items={recentlyViewed} />
        </div>
      </div>
    </div>
  );
}