import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItem } from "../api/cart.api";
import { CART_QUERY_KEY } from "./useCart";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });

      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);

      queryClient.setQueryData(CART_QUERY_KEY, (old: any) => {
        if (!old?.data?.products) return old;

        const updatedProducts = old.data.products.filter(
          (item: any) => item?.product?._id !== itemId
        );

        const totalCartPrice = updatedProducts.reduce((sum: number, item: any) => {
          const price = Number(item?.price ?? item?.product?.price ?? 0);
          const qty = Number(item?.count ?? 1);
          return sum + price * qty;
        }, 0);

        return {
          ...old,
          data: {
            ...old.data,
            products: updatedProducts,
            totalCartPrice,
          },
        };
      });

      return { previousCart };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}