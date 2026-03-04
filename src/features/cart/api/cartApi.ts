import { api } from "@/lib/axios";

export async function addToCartApi(productId: string) {
  const res = await api.post("/cart", { productId });
  return res.data;
}