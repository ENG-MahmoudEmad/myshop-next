import { api } from "@/lib/axios";

export type ProductsQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string; // example: "-price"
  brand?: string;
  "price[gte]"?: number;
  "price[lte]"?: number;
  // وغيرهم حسب doc
};

export async function getProducts(params: ProductsQuery = {}) {
  const res = await api.get("/api/v1/products", { params });
  return res.data;
}

export async function getProductById(id: string) {
  const res = await api.get(`/api/v1/products/${id}`);
  return res.data;
}