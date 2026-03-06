import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "../api/reviews.api";

export const useProductReviews = (productId?: string) => {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => getProductReviews(productId as string),
    enabled: !!productId,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};