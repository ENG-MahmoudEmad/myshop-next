import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts, type ProductsQuery } from "../api/productsApi";

type UseProductsOptions = {
  staleTimeMs?: number;
  gcTimeMs?: number;
  enabled?: boolean;
};

export const useProducts = (params?: ProductsQuery, options?: UseProductsOptions) => {
  return useQuery({
    queryKey: ["products", params ?? {}],
    queryFn: () => getProducts(params ?? {}),
    enabled: options?.enabled ?? true,

    placeholderData: keepPreviousData,

    staleTime: options?.staleTimeMs ?? 1000 * 60 * 10, // 10 min fresh
    gcTime: options?.gcTimeMs ?? 1000 * 60 * 30, // keep 30 min in cache

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });
};