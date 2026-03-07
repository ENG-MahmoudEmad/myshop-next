import { useQuery } from "@tanstack/react-query";
import { getLoggedUserCart } from "../api/cart.api";

export const CART_QUERY_KEY = ["cart"] as const;

export function useCart() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getLoggedUserCart,
    retry: false,
  });
}