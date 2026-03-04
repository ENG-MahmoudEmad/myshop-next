"use client";

import Link from "next/link";
import ProductCard from "@/features/home/components/ProductCard";
import { useProducts } from "@/features/products/hooks/useProducts";

export default function DealsSection() {
  const { data, isLoading, isError } = useProducts({
    limit: 40,
    sort: "-createdAt",
  });

  const products = data?.data ?? [];

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Featured Products</h2>
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

      {/* ✅ 5 cards on large screens */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p) => {
          // ✅ خصم “حقيقي” فقط لو الـ API فيه priceAfterDiscount
          const priceAfterDiscount =
            (p as any).priceAfterDiscount != null
              ? Number((p as any).priceAfterDiscount)
              : null;

          const hasRealDiscount =
            priceAfterDiscount != null && priceAfterDiscount > 0 && priceAfterDiscount < p.price;

          return (
            <ProductCard
              key={p._id}
              id={p._id}
              name={p.title}
              price={hasRealDiscount ? priceAfterDiscount : p.price}
              oldPrice={hasRealDiscount ? p.price : undefined}
              // tag={hasRealDiscount ? "Sale" : undefined}
              image={p.imageCover}
              rating={p.ratingsAverage}
              compact
            />
          );
        })}
      </div>
    </section>
  );
}