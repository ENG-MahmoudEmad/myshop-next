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
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeFromWishlistApi(productId),

    onMutate: async (productId: string) => {
      await qc.cancelQueries({ queryKey: ["wishlist"] });

      const previousWishlist = qc.getQueryData(["wishlist"]);

      qc.setQueryData(["wishlist"], (old: any) => {
        if (!old) return old;

        const currentData = Array.isArray(old?.data)
          ? old.data
          : Array.isArray(old)
            ? old
            : [];

        const nextData = currentData.filter((item: any) => {
          const id = item?._id ?? item?.id ?? item?.product?._id;
          return String(id) !== String(productId);
        });

        if (Array.isArray(old)) return nextData;

        return {
          ...old,
          data: nextData,
        };
      });

      return { previousWishlist };
    },

    onError: (_error, _productId, context) => {
      if (context?.previousWishlist) {
        qc.setQueryData(["wishlist"], context.previousWishlist);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const getWishlistErrorKind = (e: any) => {
  const msg = String(extractMsg(e)).toLowerCase();
  const status = e?.response?.status;

  if (status === 400 && (msg.includes("already") || msg.includes("exist"))) {
    return "already";
  }

  return "other";
};