import { api } from "@/lib/axios";
import { WishlistResponse } from "../types/wishlist.types";

// GET /wishlist
export const getWishlistApi = async () => {
  const { data } = await api.get<WishlistResponse>("/wishlist");
  return data;
};

// POST /wishlist
export const addToWishlistApi = async (productId: string) => {
  const { data } = await api.post("/wishlist", { productId });
  return data;
};

// DELETE /wishlist/:productId
export const removeFromWishlistApi = async (productId: string) => {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return data;
};