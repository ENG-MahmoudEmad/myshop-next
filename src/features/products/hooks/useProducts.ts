import { useQuery } from "@tanstack/react-query";
import { getProducts, ProductsQuery } from "../api/productsApi";

export const useProducts = (params?: ProductsQuery) => {
  return useQuery({
    queryKey: ["products", params ?? {}],
    queryFn: () => getProducts(params ?? {}),

    // ✅ cache قوي (الـ API عند Route نفسه عامل cache ~10h)
    staleTime: 10 * 60 * 60 * 1000, // 10 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours keep in cache

    // ✅ لا تعيد fetch بشكل مزعج
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

    retry: 1,
  });
};