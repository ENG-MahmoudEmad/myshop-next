"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import RecentlyViewedStrip from "@/features/search/components/RecentlyViewedStrip";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "../hooks/useCart";
import { useUpdateCartItemCount } from "../hooks/useUpdateCartItemCount";
import { useRemoveCartItem } from "../hooks/useRemoveCartItem";
import { useClearCart } from "../hooks/useClearCart";

function Stars({ rating = 4 }: { rating?: number }) {
  return (
    <div className="text-[var(--brand-600)] text-sm leading-none">
      {"★".repeat(Math.max(0, Math.min(5, Math.round(rating))))}
      {"☆".repeat(Math.max(0, 5 - Math.min(5, Math.max(0, Math.round(rating)))))}
    </div>
  );
}

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

function getFirstThreeWords(text?: string) {
  if (!text) return "Product";
  return text.trim().split(/\s+/).slice(0, 3).join(" ");
}

export default function CartScreen() {
  const ITEMS_PER_PAGE = 6;

  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useCart();
  const { mutate: updateCount, isPending: isUpdatingCount } = useUpdateCartItemCount();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cart = data?.data;
  const cartItems = cart?.products ?? [];
  const cartId = cart?._id ?? cart?.id ?? "";

  const totalPages = Math.max(1, Math.ceil(cartItems.length / ITEMS_PER_PAGE));

  const paginatedCartItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return cartItems.slice(start, end);
  }, [cartItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const subtotal = Number(cart?.totalCartPrice ?? 0);
  const shipping = cartItems.length ? 0 : 0;
  const tax = 0;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  const handleDecrease = (productId: string, currentCount: number) => {
    if (currentCount <= 1) return;

    updateCount({
      itemId: productId,
      count: currentCount - 1,
    });
  };

  const handleIncrease = (productId: string, currentCount: number) => {
    updateCount({
      itemId: productId,
      count: currentCount + 1,
    });
  };

  if (!mounted) {
    return <div className="space-y-10" />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/70 px-5 py-4 text-sm font-semibold text-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--brand-600)]" />
          Loading your cart...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <div className="text-sm text-zinc-500">
          <Link className="hover:text-[var(--brand-700)]" href="/">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-700">Shopping Cart</span>
        </div>

        <div className="rounded-3xl border border-red-100 bg-red-50/70 p-8 text-center">
          <p className="text-sm font-medium text-red-700">
            Failed to load your cart. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="text-sm text-zinc-500">
        <Link className="hover:text-[var(--brand-700)]" href="/">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">Shopping Cart</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {cartItems.length} item{cartItems.length === 1 ? "" : "s"} in your cart
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {cartItems.length > 0 ? (
            <button
              type="button"
              onClick={() => clearCart()}
              disabled={isClearing}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isClearing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Clear cart
            </button>
          ) : null}

          <Link
            href="/search"
            className="text-sm font-semibold text-[var(--brand-600)] transition hover:text-[var(--brand-700)]"
          >
            Continue shopping →
          </Link>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-6 py-5">
              <div className="text-sm font-extrabold text-zinc-900">Your Items</div>
              <div className="mt-1 text-xs text-zinc-500">
                Update quantities or remove products.
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-600)]">
                  <ShoppingBag className="h-8 w-8" />
                </div>

                <h2 className="mt-4 text-xl font-extrabold text-zinc-900">
                  Your cart is empty
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Looks like you haven’t added anything yet.
                </p>

                <Link
                  href="/search"
                  className="mt-5 inline-flex rounded-full bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-700)]"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200">
                {paginatedCartItems.map((item: any) => {
                  const product = item?.product;
                  const productId = product?._id;
                  const count = item?.count ?? 1;
                  const unitPrice = Number(item?.price ?? product?.price ?? 0);
                  const totalItemPrice = unitPrice * count;
                  const image =
                    product?.imageCover ||
                    product?.images?.[0] ||
                    "/placeholder-product.png";

                  return (
                    <div key={productId} className="px-6 py-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Link href={`/product/${productId}`} className="flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-zinc-50">
                            <Image
                              src={image}
                              alt={product?.title ?? "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <div className="line-clamp-1 text-sm font-semibold text-zinc-900 hover:text-[var(--brand-700)]">
                              {getFirstThreeWords(product?.title)}
                            </div>

                            <div className="mt-1 text-xs text-zinc-500">
                              {product?.category?.name ?? "Category"}
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <Stars rating={product?.ratingsAverage ?? 4} />
                              <span className="text-xs text-zinc-500">
                                ({product?.ratingsQuantity ?? 0})
                              </span>
                            </div>
                          </div>
                        </Link>

                        <div className="sm:ml-auto flex items-center gap-4">
                          <div className="flex min-w-[150px] flex-col items-end">
                            <div className="text-lg font-extrabold text-zinc-900">
                              {formatEGP(totalItemPrice)}
                            </div>

                            <div className="mt-1 text-xs text-zinc-500">
                              {formatEGP(unitPrice)} each
                            </div>

                            <div className="mt-3 flex items-center rounded-2xl border border-zinc-200 bg-white">
                              <button
                                onClick={() => handleDecrease(productId, count)}
                                disabled={count <= 1 || isUpdatingCount || isRemoving}
                                className="h-10 w-10 rounded-2xl text-lg text-zinc-700 transition hover:bg-[var(--brand-50)] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                −
                              </button>

                              <div className="w-12 text-center text-sm font-semibold text-zinc-800">
                                {count}
                              </div>

                              <button
                                onClick={() => handleIncrease(productId, count)}
                                disabled={isUpdatingCount}
                                className="h-10 w-10 rounded-2xl text-lg text-zinc-700 transition hover:bg-[var(--brand-50)] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(productId)}
                            disabled={isRemoving}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-zinc-600 transition hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Remove item"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {cartItems.length > ITEMS_PER_PAGE ? (
              <div className="flex items-center justify-center gap-3 border-t border-zinc-200 px-6 py-5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition hover:border-[var(--brand-300)] hover:text-[var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const active = currentPage === page;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={[
                        "flex h-12 w-12 items-center justify-center rounded-2xl border text-lg font-semibold transition",
                        active
                          ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white"
                          : "border-zinc-200 bg-white text-zinc-800 hover:border-[var(--brand-300)] hover:text-[var(--brand-700)]",
                      ].join(" ")}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition hover:border-[var(--brand-300)] hover:text-[var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-zinc-900">Coupon</h3>

            <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
              Coupon logic will be connected later in checkout flow.
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <h2 className="text-lg font-extrabold text-zinc-900">Order Summary</h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-zinc-700">
              <span>Subtotal ({cartItems.length} items)</span>
              <span className="font-semibold">{formatEGP(subtotal)}</span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span>Shipping</span>
              <span className="font-semibold text-[var(--brand-700)]">
                {shipping === 0 ? "Free" : formatEGP(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span>Discount</span>
              <span className="font-semibold text-[var(--brand-700)]">
                {discount > 0 ? `- ${formatEGP(discount)}` : "—"}
              </span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span>Tax</span>
              <span className="font-semibold">{tax > 0 ? formatEGP(tax) : "—"}</span>
            </div>

            <div className="my-2 h-px bg-white/50" />

            <div className="flex justify-between text-zinc-900">
              <span className="font-bold">Total</span>
              <span className="font-extrabold text-[var(--brand-700)]">
                {formatEGP(total)}
              </span>
            </div>
          </div>

          <Link
            href={cartId ? `/checkout?cartId=${cartId}` : "/checkout"}
            className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ${
              cartItems.length
                ? "bg-[var(--brand-600)] hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]"
                : "pointer-events-none bg-zinc-300"
            }`}
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/search"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:shadow-md active:scale-[0.98] backdrop-blur"
          >
            Continue Shopping
          </Link>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 backdrop-blur">
              <div className="text-sm font-bold text-zinc-900">Free Delivery</div>
              <div className="mt-1 text-xs text-zinc-600">
                Delivery details will appear at checkout.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--brand-100)] bg-[var(--brand-50)]/60 p-4">
              <div className="text-sm font-bold text-zinc-900">Secure Checkout</div>
              <div className="mt-1 text-xs text-zinc-600">
                Your payment is protected with secure encryption.
              </div>
            </div>
          </div>
        </aside>
      </section>

      <RecentlyViewedStrip />
    </div>
  );
}