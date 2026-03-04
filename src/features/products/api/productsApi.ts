import { api } from "@/lib/axios";
import type {
  ProductsResponse,
  ProductDetailsResponse,
} from "../types/product.types";

export type ProductsQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string; // example: "-price"
  brand?: string;
  "price[gte]"?: number;
  "price[lte]"?: number;
};

export async function getProducts(params: ProductsQuery = {}) {
  const res = await api.get<ProductsResponse>("/products", { params });
  return res.data;
}

export async function getProductById(id: string) {
  const res = await api.get<ProductDetailsResponse>(`/products/${id}`);
  return res.data;
}