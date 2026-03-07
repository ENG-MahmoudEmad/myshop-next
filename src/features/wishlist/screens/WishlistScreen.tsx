"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCartShopping,
  faShareNodes,
  faCopy,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { useWishlist, useRemoveFromWishlist } from "@/features/wishlist/hooks/useWishlist";
import RecentlyViewed from "@/features/products/components/RecentlyViewed";

function shortTitle(title: string) {
  const short = String(title ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");

  return short.length < String(title ?? "").length ? `${short}…` : short;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1 text-[var(--brand-600)]">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-sm leading-none">
          {i < full ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md",
        "shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

const WISHLIST_NAME_KEY = "myshop:wishlistName";

export default function WishlistScreen() {
  const { data, isLoading, isError } = useWishlist();
  const removeWishlistItem = useRemoveFromWishlist();

  const products = data?.data ?? [];
  const count = products.length;

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, page]);

  const subtotal = useMemo(
    () => products.reduce((s, p) => s + Number(p.price ?? 0), 0),
    [products]
  );

  const [wishlistName, setWishlistName] = useState("My Wishlist");
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_NAME_KEY);
      if (saved) setWishlistName(saved);
    } catch {
      //
    }
  }, []);

  const handleSaveName = () => {
    const v = nameInput.trim();
    if (!v) return;
    setWishlistName(v);
    setNameInput("");

    try {
      localStorage.setItem(WISHLIST_NAME_KEY, v);
    } catch {
      //
    }
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm text-zinc-500">
            <Link href="/" className="hover:text-[var(--brand-700)]">
              Home
            </Link>{" "}
            <span className="mx-2">/</span>
            <span className="text-zinc-700">Wishlist</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
            {wishlistName}
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            {isLoading ? "Loading..." : `${count} items in your wishlist`} •
            {" "}Subtotal{" "}
            <span className="font-semibold text-[var(--brand-700)]">
              EGP {subtotal.toFixed(2)}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:shadow-md active:scale-[0.98] disabled:opacity-60"
            disabled={isLoading || count === 0}
            onClick={() => {}}
          >
            <FontAwesomeIcon icon={faTrash} className="text-zinc-600" />
            Clear All
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
            disabled={isLoading || count === 0}
            onClick={() => {}}
          >
            <FontAwesomeIcon icon={faCartShopping} />
            Add All to Cart
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-md">
          Loading wishlist...
        </div>
      )}

      {isError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Failed to load wishlist.
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-3">
        {/* List */}
        <div className="space-y-4 lg:col-span-2">
          <GlassCard className="overflow-hidden">
            <div className="border-b border-white/40 px-6 py-5">
              <h2 className="text-sm font-extrabold text-zinc-900">
                Wishlist Items
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Keep your favorites here and move them to cart anytime.
              </p>
            </div>

            <div className="divide-y divide-white/50">
              {!isLoading && products.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <div className="text-lg font-extrabold text-zinc-900">
                    Your wishlist is empty
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">
                    Add products by clicking the ♥ on product cards or from the
                    product page.
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-700)]"
                    >
                      Browse products
                    </Link>
                  </div>
                </div>
              )}

              {pagedProducts.map((item) => (
                <div
                  key={item._id}
                  className="group px-6 py-5 transition hover:bg-white/60"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link
                      href={`/product/${item._id}`}
                      className="flex items-center gap-4"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-zinc-50">
                        <Image
                          src={item.imageCover}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs text-zinc-500">
                          {item.category?.name ?? item.brand?.name ?? "—"}
                        </div>

                        <div className="mt-1 line-clamp-1 text-sm font-semibold text-zinc-900 group-hover:text-[var(--brand-700)]">
                          {shortTitle(item.title)}
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <Stars rating={item.ratingsAverage ?? 0} />
                          <span className="text-xs text-zinc-500">
                            {(item.ratingsAverage ?? 0).toFixed(1)} (
                            {item.ratingsQuantity ?? 0})
                          </span>
                        </div>

                        <div className="mt-2 text-lg font-extrabold text-[var(--brand-700)]">
                          EGP {Number(item.price ?? 0).toFixed(2)}
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center gap-3 sm:ml-auto">
                      <button
                        className="inline-flex items-center justify-center rounded-full bg-[var(--brand-600)] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-md active:scale-[0.98]"
                        onClick={() => {}}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white/80 text-zinc-700 backdrop-blur transition hover:border-transparent hover:bg-red-50 hover:text-red-600 active:scale-[0.98] disabled:opacity-60"
                        aria-label="Remove"
                        title="Remove"
                        disabled={
                          removeWishlistItem.isPending &&
                          removeWishlistItem.variables === item._id
                        }
                        onClick={() => removeWishlistItem.mutate(item._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isLoading && count > 0 && totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 px-6 py-5">
                <button
                  className="h-10 w-10 rounded-xl border border-zinc-200 bg-white transition hover:bg-[var(--brand-50)] disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                  title="Previous"
                >
                  ‹
                </button>

                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={[
                      "h-10 w-10 rounded-xl border transition",
                      p === page
                        ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white"
                        : "border-zinc-200 bg-white hover:bg-[var(--brand-50)]",
                    ].join(" ")}
                    aria-label={`Page ${p}`}
                    title={`Page ${p}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className="h-10 w-10 rounded-xl border border-zinc-200 bg-white transition hover:bg-[var(--brand-50)] disabled:opacity-50"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                  title="Next"
                >
                  ›
                </button>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-sm font-extrabold text-zinc-900">
              Wishlist Name
            </h3>

            <p className="mt-2 text-xs text-zinc-600">
              Route API supports a single wishlist per user. This just renames
              it locally for UI.
            </p>

            <div className="mt-4 space-y-3">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g., Electronics Wishlist"
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-200)] focus:ring-4 focus:ring-[var(--brand-50)]"
              />

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-600)] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
                disabled={!nameInput.trim()}
                onClick={handleSaveName}
              >
                <FontAwesomeIcon icon={faPlus} />
                Save Name
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-sm font-extrabold text-zinc-900">
              My Wishlist
            </h3>

            <div className="mt-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/60 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {wishlistName}
                  </div>
                  <div className="text-xs text-zinc-500">{count} items</div>
                </div>

                <button
                  className="text-sm font-semibold text-[var(--brand-700)] hover:underline"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-900">
              <FontAwesomeIcon
                icon={faShareNodes}
                className="text-[var(--brand-700)]"
              />
              Share Your Wishlist
            </div>

            <p className="mt-2 text-xs text-zinc-600">
              Share your wishlist with friends and family.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-[var(--brand-50)]">
                Facebook
              </button>
              <button className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-[var(--brand-50)]">
                Twitter
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
              <input
                readOnly
                value="https://myshop-next-alpha.vercel.app/"
                className="w-full bg-transparent text-xs text-zinc-600 outline-none"
              />
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-50)] px-3 py-2 text-xs font-semibold text-[var(--brand-700)] transition hover:bg-[var(--brand-100)]"
                title="Copy"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      "https://myshop-next-alpha.vercel.app/"
                    );
                  } catch {
                    //
                  }
                }}
              >
                <FontAwesomeIcon icon={faCopy} />
                Copy
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />
    </div>
  );
}