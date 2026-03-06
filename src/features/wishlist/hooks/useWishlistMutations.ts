import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlistApi, removeFromWishlistApi } from "../api/wishlist.api";

const extractMsg = (e: any) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Request failed";

export const useAddToWishlist = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => addToWishlistApi(productId),
    onSuccess: () => {
      // عشان القلب يتحدث مباشرة
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeFromWishlistApi(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const getWishlistErrorKind = (e: any) => {
  const msg = String(extractMsg(e)).toLowerCase();
  const status = e?.response?.status;

  // RouteMisr غالبًا بيرجع 400 أو رسالة already
  if (status === 400 && (msg.includes("already") || msg.includes("exist"))) {
    return "already";
  }

  return "other";
};