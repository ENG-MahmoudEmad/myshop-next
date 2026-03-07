"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Boxes, PackageSearch } from "lucide-react";
import { useBrandDetails } from "@/features/brands/hooks/useBrandDetails";
import { useProducts } from "@/features/products/hooks/useProducts";
import ProductCard from "@/features/home/components/ProductCard";

type Props = {
  id: string;
};

function brandInitials(name: string) {
  const parts = name.replace(/['’]/g, "").split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "B";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function BrandDetailsScreen({ id }: Props) {
  const brandQuery = useBrandDetails(id);

  const brand = brandQuery.data?.data;

  const productsQuery = useProducts(
    {
      brand: id,
      limit: 12,
    },
    {
      enabled: !!id,
      staleTimeMs: 1000 * 60 * 5,
    }
  );

  const products = productsQuery.data?.data ?? [];
  const results = productsQuery.data?.results ?? products.length;

  return (
    <div className="py-8">
      <section className="mb-6">
        <Link
          href="/brands"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <ArrowLeft size={16} />
          Back to Brands
        </Link>
      </section>

      {brandQuery.isLoading ? (
        <div className="space-y-10">
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
      ) : brandQuery.isError || !brand ? (
        <div className="rounded-3xl border border-red-100 bg-red-50/80 p-8 text-center text-red-700">
          <h2 className="text-xl font-bold">Brand not found</h2>
          <p className="mt-2 text-sm">
            We couldn’t load this brand right now.
          </p>
        </div>
      ) : (
        <>
          {/* HERO */}
          <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-[var(--brand-100)]/60 px-6 py-10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:px-10 lg:px-12">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/35 via-white/10 to-transparent" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-[var(--brand-100)] bg-white shadow-sm sm:h-28 sm:w-28">
                  {brand.image ? (
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain p-4"
                      sizes="112px"
                    />
                  ) : (
                    <span className="text-2xl font-extrabold text-[var(--brand-700)]">
                      {brandInitials(brand.name)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-[var(--brand-700)] backdrop-blur-md">
                    <BadgeCheck size={14} />
                    Trusted Brand
                  </div>

                  <h1 className="mt-3 text-3xl font-extrabold text-zinc-900 sm:text-4xl">
                    {brand.name}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700 sm:text-base">
                    Explore products from {brand.name} in our curated myshop
                    collection.
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

          {/* PRODUCTS */}
          <section className="mt-20">
  <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
  <h2 className="text-2xl font-bold text-zinc-900">
    Products by {brand.name}
  </h2>
  <p className="text-sm text-zinc-600">
    Browse available products from this brand.
  </p>
</div>

<div className="self-start rounded-full border border-white/30 bg-white/70 px-4 py-2 text-sm text-zinc-700 shadow-sm backdrop-blur-md sm:self-auto">
  {results} item{results === 1 ? "" : "s"}
</div>
            </div>

            {productsQuery.isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[340px] animate-pulse rounded-2xl border border-zinc-200 bg-white"
                  />
                ))}
              </div>
            ) : productsQuery.isError ? (
              <div className="rounded-3xl border border-red-100 bg-red-50/80 p-8 text-center text-red-700">
                <h3 className="text-lg font-bold">Failed to load products</h3>
                <p className="mt-2 text-sm">
                  Please try again in a moment.
                </p>
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
                  This brand doesn’t have visible products right now.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.title}
                    price={product.price}
                    image={product.imageCover}
                    rating={product.ratingsAverage}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}