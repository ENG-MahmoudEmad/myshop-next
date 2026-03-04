import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromWishlistApi } from "../api/wishlist.api";

export const useRemoveFromWishlist = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: removeFromWishlistApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};