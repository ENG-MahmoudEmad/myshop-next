"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrandByIdApi } from "@/features/brands/api/brands.api";

export function useBrandDetails(id: string) {
  return useQuery({
    queryKey: ["brand-details", id],
    queryFn: () => getBrandByIdApi(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}