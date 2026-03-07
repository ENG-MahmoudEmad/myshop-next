import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearCart } from "../api/cart.api";
import { CART_QUERY_KEY } from "./useCart";

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}