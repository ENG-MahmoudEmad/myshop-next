"use client";

import { useMutation } from "@tanstack/react-query";
import { addToWishlistApi } from "@/features/wishlist/api/wishlist.api";

type ApiError = {
  response?: { data?: { message?: string } };
  message?: string;
};

export function useAddToWishlist() {
  return useMutation({
    mutationFn: (productId: string) => addToWishlistApi(productId),
  });
}

export function getErrorMessage(err: unknown, fallback = "Something went wrong") {
  const e = err as ApiError;
  return e?.response?.data?.message || e?.message || fallback;
}