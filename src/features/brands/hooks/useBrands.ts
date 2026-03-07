"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrandsApi } from "@/features/brands/api/brands.api";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrandsApi,
    staleTime: 1000 * 60 * 10,
  });
}