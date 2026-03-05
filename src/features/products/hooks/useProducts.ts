import { useQuery } from "@tanstack/react-query";
import { getProducts, ProductsQuery } from "../api/productsApi";

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

    // ✅ caching behavior (override per page/component)
    staleTime: options?.staleTimeMs,
    gcTime: options?.gcTimeMs,

    // ✅ stop annoying refetches
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });
};