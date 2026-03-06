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

    staleTime: options?.staleTimeMs,
    gcTime: options?.gcTimeMs,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });
};