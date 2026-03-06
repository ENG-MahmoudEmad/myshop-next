import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReviewApi, type AddReviewPayload } from "../api/reviews.api";

export const useAddReview = (productId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<AddReviewPayload, "product">) =>
      addReviewApi({ ...payload, product: productId }), // ✅ هنا التعديل
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-reviews", productId] });
    },
  });
};