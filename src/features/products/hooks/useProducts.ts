import { useQuery } from "@tanstack/react-query";
import { getProducts, ProductsQuery } from "../api/productsApi";

export const useProducts = (params?: ProductsQuery) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params ?? {}),
  });
};