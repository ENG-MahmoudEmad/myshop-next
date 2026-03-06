"use client";

import ProductCard from "@/features/home/components/ProductCard";
import type { Product } from "@/features/products/types/product.types";
import { ViewMode } from "./SearchToolbar";

const GLASS_CARD =
  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";

export default function SearchResultsGrid({
  items,
  viewMode,
  loading,
}: {
  items: Product[];
  viewMode: ViewMode;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`${GLASS_CARD} rounded-3xl p-4 animate-pulse`}>
            <div className="h-44 rounded-2xl bg-white/50" />
            <div className="mt-4 h-3 w-2/3 rounded bg-white/60" />
            <div className="mt-2 h-3 w-1/2 rounded bg-white/60" />
            <div className="mt-5 h-10 w-full rounded-2xl bg-white/50" />
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={`${GLASS_CARD} rounded-3xl p-10 text-center`}>
        <p className="text-lg font-extrabold text-zinc-900">No results found</p>
        <p className="mt-2 text-sm text-zinc-600">
          Try changing your filters or searching with a different keyword.
        </p>
      </div>
    );
  }

  // لو بدك list mode لاحقًا نعمله بنفس ستايل الهوم، حاليا نخليه grid (لأنك مهتم بالكاردات والأزرار)
  if (viewMode === "list") {
    // نعرض grid برضو عشان نفس كارد الهوم يشتغل (اختياري)
    // لو بدك list حقيقي قولي وبعمله
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p: any) => {
        const priceAfterDiscount =
          p.priceAfterDiscount != null ? Number(p.priceAfterDiscount) : null;

        const hasRealDiscount =
          priceAfterDiscount != null && priceAfterDiscount > 0 && priceAfterDiscount < p.price;

        return (
          <ProductCard
            key={p._id}
            id={p._id}
            name={p.title}
            price={hasRealDiscount ? priceAfterDiscount : p.price}
            oldPrice={hasRealDiscount ? p.price : undefined}
            image={p.imageCover}
            rating={p.ratingsAverage}
            compact
          />
        );
      })}
    </div>
  );
}