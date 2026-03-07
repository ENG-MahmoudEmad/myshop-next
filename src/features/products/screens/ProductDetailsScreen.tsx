"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReviewApi, deleteReviewApi } from "@/features/reviews/api/reviews.api";

import ProductCard from "@/features/home/components/ProductCard";
import RecentlyViewed from "@/features/products/components/RecentlyViewed";

import { useProduct } from "@/features/products/hooks/useProduct";
import { useProducts } from "@/features/products/hooks/useProducts";

import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  getWishlistErrorKind,
} from "@/features/wishlist/hooks/useWishlistMutations";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";

import { toastError, toastSuccess } from "@/lib/toast";
import { addRecentlyViewed } from "@/features/products/utils/recentlyViewed";
import { useProductReviews } from "@/features/reviews/hooks/useProductReviews";
import { useAddReview } from "@/features/reviews/hooks/useAddReview";

import { getToken } from "@/features/auth/utils/auth-storage";

type Props = { id: string };

const GLASS =
  "bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]";

function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getUserIdFromTokenSafe() {
  const t = getToken();
  if (!t) return null;
  const p = decodeJwtPayload(t);
  return p?.id ?? p?._id ?? p?.userId ?? p?.sub ?? null;
}

function getApiErrorMessage(e: any) {
  const d = e?.response?.data;
  const firstErr =
    Array.isArray(d?.errors) && d.errors.length ? d.errors[0]?.msg : null;

  return firstErr || d?.message || e?.message || "Something went wrong";
}

function isAlreadyReviewedError(e: any) {
  const msg = String(getApiErrorMessage(e) || "").toLowerCase();
  return (
    (msg.includes("already") && msg.includes("review")) ||
    msg.includes("reviewed") ||
    msg.includes("already reviewed")
  );
}

export default function ProductDetailsScreen({ id }: Props) {
  const router = useRouter();

  const [localCartLoading, setLocalCartLoading] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"details" | "reviews" | "shipping">("details");

  const productQ = useProduct(id, { staleTimeMs: 60_000, gcTimeMs: 10 * 60_000 });
  const product: any =
    (productQ.data as any)?.data?.data ??
    (productQ.data as any)?.data ??
    productQ.data;

  const reviewsQ = useProductReviews(id);

  const qc = useQueryClient();
  const myUserId = useMemo(() => getUserIdFromTokenSafe(), []);

  const [editingId, setEditingId] = useState<string | null>(null);

const updateReviewM = useMutation({
  mutationFn: (args: { reviewId: string; review: string; rating: number }) =>
    updateReviewApi(args.reviewId, { review: args.review, rating: args.rating }),

  onMutate: async ({ reviewId, review, rating }) => {
    await qc.cancelQueries({ queryKey: ["product-reviews", id] });

    const previousReviews = qc.getQueryData(["product-reviews", id]);

    qc.setQueryData(["product-reviews", id], (old: any) => {
      if (!old) return old;

      const current = Array.isArray(old?.data)
        ? old.data
        : Array.isArray(old)
          ? old
          : [];

      const updated = current.map((item: any) =>
        String(item?._id) === String(reviewId)
          ? { ...item, review, rating }
          : item
      );

      if (Array.isArray(old)) return updated;

      return {
        ...old,
        data: updated,
      };
    });

    return { previousReviews };
  },

  onError: (_err, _vars, context) => {
    if (context?.previousReviews) {
      qc.setQueryData(["product-reviews", id], context.previousReviews);
    }
  },

  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["product-reviews", id] });
  },
});

const deleteReviewM = useMutation({
  mutationFn: (reviewId: string) => deleteReviewApi(reviewId),

  onMutate: async (reviewId: string) => {
    await qc.cancelQueries({ queryKey: ["product-reviews", id] });

    const previousReviews = qc.getQueryData(["product-reviews", id]);

    qc.setQueryData(["product-reviews", id], (old: any) => {
      if (!old) return old;

      const current = Array.isArray(old?.data)
        ? old.data
        : Array.isArray(old)
          ? old
          : [];

      const updated = current.filter(
        (item: any) => String(item?._id) !== String(reviewId)
      );

      if (Array.isArray(old)) return updated;

      return {
        ...old,
        data: updated,
      };
    });

    return { previousReviews };
  },

  onError: (_err, _reviewId, context) => {
    if (context?.previousReviews) {
      qc.setQueryData(["product-reviews", id], context.previousReviews);
    }
  },

  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["product-reviews", id] });
  },
});

  const reviewsList: any[] = useMemo(() => {
    const d: any = reviewsQ.data as any;
    const list = d?.data ?? d?.results ?? d ?? [];
    return Array.isArray(list) ? list : [];
  }, [reviewsQ.data]);

  const reviewsCount = reviewsList.length;

  const myReview = useMemo(() => {
    if (!myUserId) return null;
    return (
      reviewsList.find((r: any) => {
        const reviewUserId = r?.user?._id ?? r?.user?.id ?? null;
        return !!reviewUserId && String(reviewUserId) === String(myUserId);
      }) ?? null
    );
  }, [reviewsList, myUserId]);

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const addReviewM = useAddReview(id);

  const canReview = !!getToken();

  const onSubmitReview = async () => {
  if (!getToken()) {
    toastError("Please login to write a review.", { autoClose: 2500 });
    return;
  }

  const text = reviewText.trim();
  const rating = Math.min(5, Math.max(1, Number(reviewRating || 0)));

  if (!text) {
    toastError("Please write your review.", { autoClose: 2500 });
    return;
  }

  try {
    if (!editingId && myReview?._id) {
      setEditingId(String(myReview._id));
      setReviewText(
        String(myReview?.review ?? myReview?.comment ?? myReview?.message ?? "")
      );
      setReviewRating(Number(myReview?.rating ?? 5));
      return;
    }

    if (editingId) {
      await updateReviewM.mutateAsync({
        reviewId: editingId,
        review: text,
        rating,
      });
      setEditingId(null);
    } else {
      await addReviewM.mutateAsync({ review: text, rating });
      await qc.invalidateQueries({ queryKey: ["product-reviews", id] });
    }

    setReviewText("");
    setReviewRating(5);
  } catch (e: any) {
    if (isAlreadyReviewedError(e) && myReview?._id) {
      setEditingId(String(myReview._id));
      setReviewText(
        String(myReview?.review ?? myReview?.comment ?? myReview?.message ?? "")
      );
      setReviewRating(Number(myReview?.rating ?? 5));
      return;
    }

    toastError(getApiErrorMessage(e), { autoClose: 3500 });
  }
};

  const relatedQ = useProducts(
    { limit: 20, sort: "-createdAt" },
    { staleTimeMs: 30_000, gcTimeMs: 5 * 60_000 }
  );

  const related = useMemo(() => {
    const list = (relatedQ.data?.data ?? []) as any[];
    return list.filter((p) => p?._id !== id).slice(0, 8);
  }, [relatedQ.data, id]);

  const wishlistQ = useWishlist();
  const addWishM = useAddToWishlist();
  const removeWishM = useRemoveFromWishlist();

  const wishlistIds = useMemo(() => {
    const root: any = wishlistQ.data as any;
    const maybeList =
      root?.data ??
      root?.data?.data ??
      root?.data?.products ??
      root?.products ??
      [];

    const list = Array.isArray(maybeList) ? maybeList : [];

    return new Set(list.map((x: any) => x?._id ?? x?.id ?? x?.product?._id).filter(Boolean));
  }, [wishlistQ.data]);

  const isInWishlist = !!product?._id && wishlistIds.has(product._id);

  const [localWishlist, setLocalWishlist] = useState<boolean | null>(null);

useEffect(() => {
  if (!product?._id) return;
  setLocalWishlist(isInWishlist);
}, [isInWishlist, product?._id]);

const finalIsInWishlist = localWishlist ?? isInWishlist;

const onWishlistToggle = async () => {
  if (!product?._id) return;

  const prev = finalIsInWishlist;

  // ✅ UI first
  setLocalWishlist(!prev);

  try {
    if (prev) {
      await removeWishM.mutateAsync(product._id);
      toastSuccess("Removed from wishlist", { autoClose: 2000 });
    } else {
      await addWishM.mutateAsync(product._id);
      toastSuccess("Added to wishlist", { autoClose: 2000 });
    }
  } catch (e: any) {
    // ✅ rollback
    setLocalWishlist(prev);

    const kind = getWishlistErrorKind(e);
    if (kind === "already") {
      setLocalWishlist(true);
      toastError("Already in your wishlist", { autoClose: 2500 });
      return;
    }

    toastError(getApiErrorMessage(e), { autoClose: 3500 });
  }
};

  const unitPrice = useMemo(() => {
    const pad = product?.priceAfterDiscount;
    const price = product?.price;
    if (pad != null && Number(pad) > 0 && Number(pad) < Number(price)) return Number(pad);
    return Number(price ?? 0);
  }, [product?.priceAfterDiscount, product?.price]);

  const oldPrice = useMemo(() => {
    const pad = product?.priceAfterDiscount;
    const price = product?.price;
    if (pad != null && Number(pad) > 0 && Number(pad) < Number(price)) return Number(price);
    return undefined;
  }, [product?.priceAfterDiscount, product?.price]);

  const totalPrice = useMemo(() => unitPrice * qty, [unitPrice, qty]);

  const discount = useMemo(() => {
    if (!oldPrice) return null;
    if (oldPrice <= unitPrice) return null;
    return Math.round(((oldPrice - unitPrice) / oldPrice) * 100);
  }, [oldPrice, unitPrice]);

  // ---------- Images ----------
  const images: string[] = useMemo(() => {
    const rawImages = [
      product?.imageCover,
      ...(Array.isArray(product?.images) ? product.images : []),
    ]
      .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
      .map((img) => img.trim());

    const uniqueMap = new Map<string, string>();

    rawImages.forEach((img) => {
      const clean = img.split("?")[0].split("#")[0].trim();
      const fileName = clean.split("/").pop()?.toLowerCase() ?? clean.toLowerCase();

      // remove extension
      const withoutExt = fileName.replace(/\.[a-z0-9]+$/i, "");

      // normalize things like -1, -2, _1, _2, copy
      const normalizedKey = withoutExt
        .replace(/[-_](copy|\d+)$/i, "")
        .replace(/\s+/g, "");

      if (!uniqueMap.has(normalizedKey)) {
        uniqueMap.set(normalizedKey, img);
      }
    });

    return Array.from(uniqueMap.values());
  }, [product?.imageCover, product?.images]);

  useEffect(() => {
    if (!images.length) {
      setActiveImage(null);
      return;
    }

    setActiveImage((prev) => {
      if (prev && images.includes(prev)) return prev;
      return images[0];
    });
  }, [images]);

  useEffect(() => {
    if (!product?._id) return;

    addRecentlyViewed({
      id: product._id,
      title: product.title ?? "Product",
      image: product.imageCover ?? images[0] ?? "",
      price: unitPrice,
      category: product.category?.name ?? "Product",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  const breadcrumbTitle = useMemo(() => {
    const t = String(product?.title ?? "");
    if (!t) return `Product #${id}`;
    const parts = t.split(" ").filter(Boolean);
    return parts.slice(0, 3).join(" ");
  }, [product?.title, id]);

  const addCartM = useAddToCart();
  const inStock = (product?.quantity ?? 1) > 0;

const onAddToCart = async () => {
  if (!product?._id) return;

  setLocalCartLoading(true);

  try {
    await addCartM.mutateAsync({ productId: product._id, count: qty });
    toastSuccess(`Added to cart (x${qty})`, { autoClose: 2000 });
  } catch (e: any) {
    toastError(getApiErrorMessage(e), { autoClose: 3500 });
  } finally {
    setLocalCartLoading(false);
  }
};

  const onBuyNow = () => router.push("/cart");

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;

    try {
      if (navigator.share) {
        await navigator.share({ title: product?.title ?? "MyShop Product", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toastSuccess("Link copied", { autoClose: 2000 });
    } catch {
      toastError("Could not share link", { autoClose: 2000 });
    }
  };

  if (productQ.isLoading) {
    return (
      <div className={`${GLASS} rounded-3xl p-8 text-center`}>
        <p className="text-sm font-semibold text-zinc-900">Loading product…</p>
      </div>
    );
  }

  if (productQ.isError || !product) {
    return (
      <div className={`${GLASS} rounded-3xl p-8 text-center`}>
        <p className="text-lg font-extrabold text-zinc-900">Failed to load product</p>
        <p className="mt-2 text-sm text-zinc-600">Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-sm text-zinc-500">
        <Link className="hover:text-[var(--brand-700)]" href="/">Home</Link>
        <span className="mx-2">/</span>
        <Link className="hover:text-[var(--brand-700)]" href="/search">Search</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">{breadcrumbTitle}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <div className={`${GLASS} group relative aspect-square overflow-hidden rounded-3xl`}>
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.title ?? "Product"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-white/40" />
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 8).map((src, index) => {
              const active = src === activeImage;

              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={[
                    "relative aspect-square overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300",
                    active
                      ? "border-[var(--brand-600)] shadow-[0_0_0_4px_rgba(255,171,145,0.35)]"
                      : "border-zinc-200 hover:-translate-y-0.5 hover:shadow-md",
                  ].join(" ")}
                >
                  <Image
                    src={src}
                    alt={`${product.title ?? "Product"} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${GLASS} rounded-3xl p-6 sm:p-8`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span
                className={[
                  "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                  inStock ? "bg-[var(--brand-50)] text-[var(--brand-700)]" : "bg-zinc-100 text-zinc-700",
                ].join(" ")}
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </span>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
                {product.title}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
                <div className="text-[var(--brand-600)]">
                  {"★".repeat(Math.round(product?.ratingsAverage ?? 0))}
                  {"☆".repeat(Math.max(0, 5 - Math.round(product?.ratingsAverage ?? 0)))}
                </div>
                <span>{Number(product?.ratingsAverage ?? 0).toFixed(1)}</span>
                <span className="text-zinc-400">({product?.ratingsQuantity ?? 0} reviews)</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onWishlistToggle}
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition active:scale-95",
                  finalIsInWishlist
                    ? "bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]"
                    : "bg-white/70 text-zinc-800 hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)]",
                ].join(" ")}
                aria-label="Toggle wishlist"
              >
                <FontAwesomeIcon icon={faHeart} size="sm" />
              </button>

              <button
                type="button"
                onClick={onShare}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-zinc-800 backdrop-blur transition hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] active:scale-95"
                aria-label="Share"
              >
                <FontAwesomeIcon icon={faShareNodes} size="sm" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div className="text-3xl font-extrabold text-[var(--brand-700)]">
              {totalPrice.toLocaleString("en-US")} EGP
            </div>

            <div className="pb-1 text-xs text-zinc-500">
              ( {unitPrice.toLocaleString("en-US")} EGP / each )
            </div>

            {oldPrice ? (
              <div className="pb-1 text-sm text-zinc-500 line-through">
                {oldPrice.toLocaleString("en-US")} EGP
              </div>
            ) : null}

            {discount ? (
              <span className="mb-1 inline-flex rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-bold text-[var(--brand-700)]">
                Save {discount}%
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-600">
            {(product?.description as string) ?? "No description available yet."}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="w-12 text-sm font-semibold text-zinc-800">Qty:</span>

            <div className="flex items-center rounded-full border border-zinc-200 bg-white/80 backdrop-blur">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-full text-lg text-zinc-700 transition hover:bg-[var(--brand-50)]"
              >
                −
              </button>
              <div className="w-12 text-center text-sm font-semibold text-zinc-800">{qty}</div>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="h-10 w-10 rounded-full text-lg text-zinc-700 transition hover:bg-[var(--brand-50)]"
              >
                +
              </button>
            </div>

            <span className="text-xs text-zinc-500">
              {inStock ? `Available: ${product?.quantity ?? "-"}` : "Not available now"}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onAddToCart}
              disabled={localCartLoading || !inStock}
              className={[
                "rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300",
                "bg-[var(--brand-600)] hover:bg-[var(--brand-700)] hover:shadow-lg active:scale-[0.98]",
                (!inStock || localCartLoading) ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {localCartLoading ? "Adding…" : "Add to cart"}
            </button>

            <button
              type="button"
              onClick={onBuyNow}
              className="rounded-full border border-zinc-200 bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:shadow-md active:scale-[0.98]"
            >
              Buy now
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="relative flex flex-wrap gap-2 border-b border-zinc-200 bg-[var(--brand-50)]/50 px-4 py-3">
          {[
            { key: "details", label: "Product Details" },
            { key: "reviews", label: `Reviews (${reviewsCount})` },
            { key: "shipping", label: "Shipping & Returns" },
          ].map((t) => {
            const active = tab === (t.key as any);
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key as any)}
                className={[
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                  active ? "text-[var(--brand-700)]" : "text-zinc-600 hover:text-[var(--brand-700)]",
                ].join(" ")}
              >
                {t.label}
                <span
                  className={[
                    "absolute left-1/2 -bottom-1 h-[3px] w-10 -translate-x-1/2 rounded-full bg-[var(--brand-600)] transition-all duration-300",
                    active ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8">
          {tab === "details" ? (
            <div className="text-sm text-zinc-600 leading-7">
              {(product?.description as string) ?? "No details available yet."}
            </div>
          ) : tab === "reviews" ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-zinc-200 bg-white/60 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-extrabold text-zinc-900">
                    {editingId ? "Edit your review" : "Write a review"}
                  </p>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const n = i + 1;
                      const active = n <= reviewRating;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewRating(n)}
                          className={[
                            "text-lg transition active:scale-95",
                            active ? "text-[var(--brand-600)]" : "text-zinc-300 hover:text-zinc-400",
                          ].join(" ")}
                          aria-label={`Rate ${n}`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={canReview ? "Share your thoughts about this product..." : "Login to write a review..."}
                  disabled={!canReview || addReviewM.isPending || updateReviewM.isPending}
                  className="mt-3 w-full resize-none rounded-2xl border border-zinc-200 bg-white/80 p-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[var(--brand-300)]"
                  rows={3}
                />

                <div className="mt-3 flex items-center justify-end gap-2">
                  {editingId ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setReviewText("");
                        setReviewRating(5);
                      }}
                      className="rounded-full border border-zinc-200 bg-white px-5 py-2 text-xs font-semibold text-zinc-900 hover:shadow-sm"
                    >
                      Cancel
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={onSubmitReview}
                    disabled={!canReview || addReviewM.isPending || updateReviewM.isPending}
                    className={[
                      "rounded-full px-6 py-2 text-xs font-semibold text-white transition-all duration-300 active:scale-95",
                      "bg-[var(--brand-600)] hover:bg-[var(--brand-700)]",
                      (!canReview || addReviewM.isPending || updateReviewM.isPending) ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {editingId
                      ? (updateReviewM.isPending ? "Updating..." : "Update review")
                      : (addReviewM.isPending ? "Posting..." : "Post review")}
                  </button>
                </div>
              </div>

              {reviewsQ.isLoading ? (
                <p className="text-sm text-zinc-600">Loading reviews…</p>
              ) : reviewsQ.isError ? (
                <p className="text-sm text-red-600">Failed to load reviews.</p>
              ) : !reviewsCount ? (
                <p className="text-sm text-zinc-600">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {reviewsList.slice(0, 10).map((r: any) => {
                    const reviewUserId = r?.user?._id ?? r?.user?.id ?? null;
                    const isMine =
                      !!myUserId && !!reviewUserId && String(reviewUserId) === String(myUserId);

                    return (
                      <div
                        key={r?._id ?? `${r?.user?._id ?? "u"}-${r?.createdAt ?? Math.random()}`}
                        className="rounded-2xl border border-zinc-200 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-zinc-900">
                            {r?.user?.name ?? "User"}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {Number(r?.rating ?? 0).toFixed(1)} ★
                          </p>
                        </div>

                        <p className="mt-2 text-sm text-zinc-600">
                          {r?.review ?? r?.comment ?? r?.title ?? r?.message ?? "—"}
                        </p>

                        {isMine ? (
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(String(r._id));
                                setReviewText(String(r?.review ?? r?.comment ?? r?.message ?? ""));
                                setReviewRating(Number(r?.rating ?? 5));
                              }}
                              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-900 hover:shadow-sm"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
  try {
    await deleteReviewM.mutateAsync(String(r._id));

    if (editingId === String(r._id)) {
      setEditingId(null);
      setReviewText("");
      setReviewRating(5);
    }
  } catch (e: any) {
    toastError(getApiErrorMessage(e), { autoClose: 3500 });
  }
}}
                              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:shadow-sm"
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-sm text-zinc-600 leading-7">
              <p>
                <span className="font-semibold text-zinc-900">Shipping:</span> Delivery typically takes 2–5 business days.
              </p>
              <p>
                <span className="font-semibold text-zinc-900">Returns:</span> Return eligible items within 14 days if unused.
              </p>
              <p className="text-xs text-zinc-500">More detailed policy can be added later.</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-zinc-900">You may also like</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p: any) => {
            const pad = p.priceAfterDiscount != null ? Number(p.priceAfterDiscount) : null;
            const hasRealDiscount = pad != null && pad > 0 && pad < p.price;

            return (
              <ProductCard
                key={p._id}
                id={p._id}
                name={p.title}
                price={hasRealDiscount ? pad : p.price}
                oldPrice={hasRealDiscount ? p.price : undefined}
                image={p.imageCover}
                rating={p.ratingsAverage}
                compact
              />
            );
          })}
        </div>
      </section>

      <RecentlyViewed />
    </div>
  );
}