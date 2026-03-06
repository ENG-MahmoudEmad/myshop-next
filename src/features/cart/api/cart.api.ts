import { api } from "@/lib/axios";

export async function addToCart(productId: string) {
  const { data } = await api.post("/cart", { productId });
  return data;
}

export async function updateCartItemCount(itemId: string, count: number) {
  const { data } = await api.put(`/cart/${itemId}`, { count });
  return data;
}