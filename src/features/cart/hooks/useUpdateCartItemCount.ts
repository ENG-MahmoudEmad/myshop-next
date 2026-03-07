import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItemCount } from "../api/cart.api";
import { CART_QUERY_KEY } from "./useCart";

export function useUpdateCartItemCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, count }: { itemId: string; count: number }) =>
      updateCartItemCount(itemId, count),

    onMutate: async ({ itemId, count }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });

      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);

      queryClient.setQueryData(CART_QUERY_KEY, (old: any) => {
        if (!old?.data?.products) return old;

        const updatedProducts = old.data.products.map((item: any) => {
          if (item?.product?._id === itemId) {
            const price = Number(item?.price ?? item?.product?.price ?? 0);

            return {
              ...item,
              count,
              price,
            };
          }

          return item;
        });

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