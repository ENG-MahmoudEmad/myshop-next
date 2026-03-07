import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, updateCartItemCount } from "../api/cart.api";
import { CART_QUERY_KEY } from "./useCart";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, count }: { productId: string; count: number }) => {
      const added = await addToCart(productId);

      if (count > 1) {
        const item = (added?.data?.products ?? []).find(
          (x: any) => x?.product?._id === productId
        );
        const itemId = item?._id;

        if (itemId) {
          await updateCartItemCount(itemId, count);
        }
      }

      return added;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};