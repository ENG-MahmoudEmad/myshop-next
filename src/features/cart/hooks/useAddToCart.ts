import { useMutation } from "@tanstack/react-query";
import { addToCart, updateCartItemCount } from "../api/cart.api";

export const useAddToCart = () => {
  return useMutation({
    mutationFn: async ({ productId, count }: { productId: string; count: number }) => {
      // 1) add
      const added = await addToCart(productId);

      // 2) لو API ما بدعم count مباشرة، منحدّث count على cart item
      if (count > 1) {
        const item = (added?.data?.products ?? []).find((x: any) => x?.product?._id === productId);
        const itemId = item?._id;
        if (itemId) {
          await updateCartItemCount(itemId, count);
        }
      }

      return added;
    },
  });
};