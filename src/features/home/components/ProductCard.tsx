"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toastSuccess, toastError, toastWarning } from "@/lib/toast";

import { useAuthToken } from "@/features/auth/hooks/useAuthToken";
import {
  useAddToWishlist,
  getErrorMessage,
} from "@/features/wishlist/hooks/useAddToWishlist";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useWishlistProducts } from "@/features/wishlist/hooks/useWishlistProducts";

type Props = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  tag?: string;
  image: string;
  rating?: number;
  compact?: boolean; // smaller card for Featured grid
};

export default function ProductCard({
  id,
  name,
  price,
  oldPrice,
  tag,
  image,
  rating,
  compact = false,
}: Props) {
  const qc = useQueryClient();
  const { token, ready } = useAuthToken();

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  const fullStars = rating != null ? Math.floor(rating) : 0;

  // ✅ optimistic local flag (instant)
  const [localWishlist, setLocalWishlist] = useState(false);

  // ✅ only fetch wishlist list when logged in
  const wishlistQuery = useWishlistProducts(!!token);
  const wishlistItems = wishlistQuery.data ?? [];

  const isInWishlist = wishlistItems.some((x: any) => {
    const pid = x?._id || x?.id || x?.product?._id || x?.product?.id;
    return String(pid) === String(id);
  });

  const finalIsInWishlist = isInWishlist || localWishlist;

  const addWishlist = useAddToWishlist();
  const addCart = useAddToCart();

  const ensureAuth = () => {
    if (!ready) return { ok: false as const, reason: "Please wait a moment…" };
    if (!token) return { ok: false as const, reason: "Please login to continue." };
    return { ok: true as const };
  };

  const onAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const auth = ensureAuth();
    if (!auth.ok) {
      toastError(auth.reason);
      return;
    }

    // ✅ instant block
    if (finalIsInWishlist) {
      toastWarning("Already in your wishlist.");
      return;
    }

    // ✅ instant UI
    setLocalWishlist(true);

    addWishlist.mutate(id, {
      onSuccess: () => {
        // ✅ update wishlist cache immediately
        qc.setQueryData(["wishlist"], (old: any) => {
          const arr = Array.isArray(old) ? old : [];

          const exists = arr.some((x: any) => {
            const pid = x?._id || x?.id || x?.product?._id || x?.product?.id;
            return String(pid) === String(id);
          });
          if (exists) return arr;

          return [...arr, { _id: id }];
        });

        // ✅ background refresh to get full objects
        qc.invalidateQueries({ queryKey: ["wishlist"] });

        toastSuccess("Added to wishlist.");
      },

      onError: (err: any) => {
        // رجّع optimistic flag لو فشل
        setLocalWishlist(false);

        const msg = String(
          err?.response?.data?.message || err?.message || "",
        ).toLowerCase();
        const status = err?.response?.status;

        const already =
          status === 409 ||
          msg.includes("already") ||
          msg.includes("exist") ||
          msg.includes("added");

        if (already) {
          toastWarning("Already in your wishlist.");

          // حتى لو السيرفر قال already، خلّي الكاش يعرف
          qc.setQueryData(["wishlist"], (old: any) => {
            const arr = Array.isArray(old) ? old : [];
            const exists = arr.some((x: any) => {
              const pid = x?._id || x?.id || x?.product?._id || x?.product?.id;
              return String(pid) === String(id);
            });
            if (exists) return arr;
            return [...arr, { _id: id }];
          });

          // وخلّيه true عشان الضغط بعدها يعطي warning فورًا
          setLocalWishlist(true);
          return;
        }

        toastError("Couldn't add to wishlist.");
      },
    });
  };

  const onAddToCart = () => {
    const auth = ensureAuth();
    if (!auth.ok) {
      toastError(auth.reason);
      return;
    }

    addCart.mutate(
  { productId: id, count: 1 },
  {
    onSuccess: () => {
      toastSuccess("Added to cart.");
    },
    onError: (err) => {
      toastError(getErrorMessage(err, "Couldn't add to cart."));
    },
  }
);
  };

  const wishlistLoading = addWishlist.isPending;
  const cartLoading = addCart.isPending;

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        {discount ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--brand-600)] px-3 py-1 text-xs font-bold text-white shadow-sm">
            -{discount}%
          </span>
        ) : null}

        {tag ? (
          <span className="absolute left-3 top-12 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white shadow-sm">
            {tag}
          </span>
        ) : null}

        <div
          className={[
            "relative w-full overflow-hidden bg-gradient-to-b from-zinc-50 to-white",
            compact ? "aspect-[1/1]" : "aspect-[4/5]",
          ].join(" ")}
        >
          {/* Wishlist */}
          <button
            type="button"
            className={[
  "absolute right-3 top-3 z-20 flex items-center justify-center rounded-full",
  "bg-white/70 text-zinc-700 backdrop-blur transition-all duration-300",
  "hover:bg-[var(--brand-600)] hover:text-white",
  "active:scale-90 active:bg-[var(--brand-600)] active:text-white",
  "cursor-pointer",
  compact ? "h-7 w-7" : "h-8 w-8",

  // ✅ mobile: visible always
  "opacity-100 translate-y-0 pointer-events-auto",

  // ✅ md+ (tablet/laptop): hidden until hover
  "md:opacity-0 md:translate-y-1 md:pointer-events-none",
  "md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto",

  // ✅ keep visible while loading on any screen
  wishlistLoading ? "opacity-100 translate-y-0 pointer-events-auto" : "",
].join(" ")}
            onClick={onAddToWishlist}
            aria-label="Add to wishlist"
            title="Add to wishlist"
            disabled={wishlistLoading}
          >
            {wishlistLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin style={{ width: 16, height: 16 }} />
            ) : (
              <FontAwesomeIcon icon={faHeart} style={{ width: 16, height: 16 }} />
            )}
          </button>

          <Link href={`/product/${id}`} className="block h-full w-full">
            <Image
              src={image}
              alt={name}
              fill
              className={[
                "object-contain transition-transform duration-500 group-hover:scale-[1.06]",
                compact ? "p-3" : "p-4",
              ].join(" ")}
            />

            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/30" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-[var(--brand-700)] shadow-md transition hover:scale-105 active:scale-95">
                Quick View
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className={compact ? "p-4" : "p-5"}>
        <Link href={`/product/${id}`}>
          <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 transition hover:text-[var(--brand-700)]">
            {(() => {
              const short = name.split(" ").slice(0, 3).join(" ");
              return short.length < name.length ? `${short}…` : short;
            })()}
          </h3>

          {rating != null ? (
            <div className="mt-2 flex items-center gap-1 text-[var(--brand-600)]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm leading-none">
                  {i < fullStars ? "★" : "☆"}
                </span>
              ))}
              <span className="ml-2 text-xs text-zinc-500">{rating.toFixed(1)}</span>
            </div>
          ) : null}
        </Link>

        {/* fixed height price area so button aligns across cards */}
        <div className="mt-2 min-h-[44px] flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
  <span
    className={[
      "text-lg font-bold text-[var(--brand-700)]",
      "whitespace-nowrap leading-none",
      "tabular-nums", // ✅ أرقام بنفس العرض (اختياري بس ممتاز)
    ].join(" ")}
  >
    EGP {price.toFixed(2)}
  </span>

  {oldPrice ? (
    <span className="text-sm text-zinc-500 line-through whitespace-nowrap leading-none tabular-nums">
      EGP {oldPrice.toFixed(2)}
    </span>
  ) : (
    <span className="text-sm text-transparent select-none whitespace-nowrap leading-none tabular-nums">
      EGP 0000.00
    </span>
  )}
</div>

        <button
          type="button"
          className={[
  compact ? "mt-3" : "mt-4",
  "w-full rounded-full bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white",
  "transition-transform duration-150 active:scale-[0.97]",
  "hover:bg-[var(--brand-700)] hover:shadow-md",
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-70",
  "select-none touch-manipulation",
].join(" ")}
          onClick={onAddToCart}
          disabled={cartLoading}
        >
          {cartLoading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faSpinner} spin />
              Adding…
            </span>
          ) : (
            "Add to cart"
          )}
        </button>
      </div>
    </div>
  );
}