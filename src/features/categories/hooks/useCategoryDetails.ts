"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoryByIdApi } from "@/features/categories/api/categories.api";

export function useCategoryDetails(id: string) {
  return useQuery({
    queryKey: ["category-details", id],
    queryFn: () => getCategoryByIdApi(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 min
    gcTime: 1000 * 60 * 30, // 30 min
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });
}