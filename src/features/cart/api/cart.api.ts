import { api } from "@/lib/axios";

export async function getLoggedUserCart() {
  const { data } = await api.get("/cart");
  return data;
}

export async function addToCart(productId: string) {
  const { data } = await api.post("/cart", { productId });
  return data;
}

export async function updateCartItemCount(productId: string, count: number) {
  const { data } = await api.put(`/cart/${productId}`, { count });
  return data;
}

export async function removeCartItem(productId: string) {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
}

export async function clearCart() {
  const { data } = await api.delete("/cart");
  return data;
}