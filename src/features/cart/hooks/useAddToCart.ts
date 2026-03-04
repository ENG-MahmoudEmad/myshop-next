"use client";

import { useMutation } from "@tanstack/react-query";
import { addToCartApi } from "@/features/cart/api/cartApi";

export function useAddToCart() {
  return useMutation({
    mutationFn: (productId: string) => addToCartApi(productId),
  });
}