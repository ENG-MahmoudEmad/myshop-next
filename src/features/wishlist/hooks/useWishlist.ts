import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
} from "../api/wishlist.api";

export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistApi,
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

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