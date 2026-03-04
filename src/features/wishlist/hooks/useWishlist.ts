import { useQuery } from "@tanstack/react-query";
import { getWishlistApi } from "../api/wishlist.api";

export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistApi,
  });
};