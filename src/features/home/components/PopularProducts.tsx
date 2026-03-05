"use client";

import Link from "next/link";
import ProductCard from "@/features/home/components/ProductCard";
import { useProducts } from "@/features/products/hooks/useProducts";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export default function PopularProducts() {
  const { data, isLoading, isError } = useProducts(
  {
    limit: 4,
    sort: "-ratingsAverage",
  },
  {
    staleTimeMs: THIRTY_DAYS,
    gcTimeMs: THIRTY_DAYS,
  }
);

  const products = data?.data ?? [];

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Popular Products</h2>

        <Link
          href="/search"
          className="text-sm font-semibold text-[var(--brand-600)] transition hover:text-[var(--brand-700)]"
        >
          View All →
        </Link>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          Loading products...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Failed to load products.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p: any) => (
          <ProductCard
            key={p._id}
            id={p._id}
            name={p.title}
            price={p.price}
            image={p.imageCover}
            rating={p.ratingsAverage}
          />
        ))}
      </div>
    </section>
  );
}