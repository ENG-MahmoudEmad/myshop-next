import { useQuery } from "@tanstack/react-query";
import { getLoggedUserOrders } from "../api/orders.api";

export const ORDERS_QUERY_KEY = ["orders"] as const;

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: getLoggedUserOrders,
    retry: false,
  });
}