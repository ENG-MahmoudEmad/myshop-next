"use client";

import { useQuery } from "@tanstack/react-query";
import { getWishlistApi } from "../api/wishlist.api";

function extractWishlistArray(res: any): any[] {
  // يدعم أكثر من شكل response (عشان ما نتعب)
  const a = res?.data;
  if (Array.isArray(a)) return a;
  if (Array.isArray(a?.data)) return a.data;
  if (Array.isArray(a?.products)) return a.products;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

export const useWishlistProducts = (enabled: boolean) => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistApi,
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
    select: (res) => extractWishlistArray(res),
  });
};