import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/productsApi";

type UseProductOptions = {
  staleTimeMs?: number;
  gcTimeMs?: number;
  enabled?: boolean;
};

export const useProduct = (id: string, options?: UseProductOptions) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: (options?.enabled ?? true) && !!id,

    staleTime: options?.staleTimeMs,
    gcTime: options?.gcTimeMs,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });
};