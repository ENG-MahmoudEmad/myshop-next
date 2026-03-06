import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../api/filters.api";

export const useBrands = () =>
  useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });