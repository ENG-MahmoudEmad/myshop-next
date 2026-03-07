"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Boxes, PackageSearch } from "lucide-react";

import { useCategoryDetails } from "@/features/categories/hooks/useCategoryDetails";
import { useProducts } from "@/features/products/hooks/useProducts";
import ProductCard from "@/features/home/components/ProductCard";

type Props = {
  id: string;
};

function categoryInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "C";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function getCategoryDescription(name: string) {
  const n = name.toLowerCase();

  if (
    n.includes("men") ||
    n.includes("women") ||
    n.includes("fashion") ||
    n.includes("clothes")
  ) {
    return `Explore trending styles, modern essentials, and curated fashion picks inside ${name}.`;
  }

  if (
    n.includes("elect") ||
    n.includes("mobile") ||
    n.includes("laptop") ||
    n.includes("tech")
  ) {
    return `Browse smart devices, practical gadgets, and top-rated tech products in ${name}.`;
  }

  if (n.includes("beauty")) {
    return `Discover beauty essentials, self-care products, and fresh daily picks in ${name}.`;
  }

  if (n.includes("home")) {
    return `Shop modern essentials and practical everyday items from ${name}.`;
  }

  return `Browse curated products and fresh arrivals from ${name}.`;
}

export default function CategoryDetailsScreen({ id }: Props) {
  const categoryQ = useCategoryDetails(id);
  const category = categoryQ.data?.data;

  const productsQ = useProducts(
    {
      category: id,
      limit: 20,
    },
    {
      enabled: !!id,
      staleTimeMs: 1000 * 60 * 5,
      gcTimeMs: 1000 * 60 * 30,
    },
  );

  const products = productsQ.data?.data ?? [];
  const results = productsQ.data?.results ?? products.length;

  if (categoryQ.isLoading) {
    return (
      <div className="space-y-10 py-8">
        <div className="h-[260px] animate-pulse rounded-3xl border border-white/20 bg-white/65 backdrop-blur-md" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-[340px] animate-pulse rounded-2xl border border-zinc-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  if (categoryQ.isError || !category) {
    return (
      <div className="py-8">
        <div className="rounded-3xl border border-red-100 bg-red-50/80 p-8 text-center text-red-700">
          <h2 className="text-xl font-bold">Category not found</h2>
          <p className="mt-2 text-sm">
            We couldn&apos;t load this category right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Back */}
      <section className="mb-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <ArrowLeft size={16} />
          Back to Categories
        </Link>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/60 px-6 py-10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/35 via-white/10 to-transparent" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-[var(--brand-100)] bg-white shadow-sm sm:h-28 sm:w-28">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                  priority
                />
              ) : (
                <span className="text-2xl font-extrabold text-[var(--brand-700)]">
                  {categoryInitials(category.name)}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-[var(--brand-700)] backdrop-blur-md">
                <BadgeCheck size={14} />
                Featured Category
              </div>

              <h1 className="mt-3 text-3xl font-extrabold text-zinc-900 sm:text-4xl">
                {category.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700 sm:text-base">
                {getCategoryDescription(category.name)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/30 bg-white/55 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[var(--brand-700)]">
                <Boxes size={18} />
                <span className="text-sm font-semibold">Products</span>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-zinc-900">
                {results}
              </p>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/55 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[var(--brand-700)]">
                <BadgeCheck size={18} />
                <span className="text-sm font-semibold">Status</span>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-zinc-900">
                Active
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mt-20">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900">
              Products in {category.name}
            </h2>
            <p className="text-sm text-zinc-600">
              Browse available products from this category.
            </p>
          </div>

          <div className="self-start rounded-full border border-white/30 bg-white/70 px-4 py-2 text-sm text-zinc-700 shadow-sm backdrop-blur-md sm:self-auto">
            {results} item{results === 1 ? "" : "s"}
          </div>
        </div>

        {productsQ.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[340px] animate-pulse rounded-2xl border border-zinc-200 bg-white"
              />
            ))}
          </div>
        ) : productsQ.isError ? (
          <div className="rounded-3xl border border-red-100 bg-red-50/80 p-8 text-center text-red-700">
            <h3 className="text-lg font-bold">Failed to load products</h3>
            <p className="mt-2 text-sm">Please try again in a moment.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-white/20 bg-white/65 p-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-700)]">
              <PackageSearch size={26} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-900">
              No products found
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              This category doesn&apos;t have visible products right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product: any) => {
              const pad =
                product.priceAfterDiscount != null
                  ? Number(product.priceAfterDiscount)
                  : null;

              const hasRealDiscount =
                pad != null && pad > 0 && pad < Number(product.price);

              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.title}
                  price={hasRealDiscount ? pad : product.price}
                  oldPrice={hasRealDiscount ? product.price : undefined}
                  image={product.imageCover}
                  rating={product.ratingsAverage}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
