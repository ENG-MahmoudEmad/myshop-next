"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "@/features/categories/api/categories.api";

type UseCategoriesParams = {
  page?: number;
  limit?: number;
  keyword?: string;
};

export function useCategories(params?: UseCategoriesParams) {
  return useQuery({
    queryKey: ["categories", params ?? {}],
    queryFn: () => getCategoriesApi(params),
    staleTime: 1000 * 60 * 10, // 10 minutes fresh
    gcTime: 1000 * 60 * 30, // keep in cache 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });
}