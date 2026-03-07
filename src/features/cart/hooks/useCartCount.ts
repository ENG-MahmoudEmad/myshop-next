import { useMemo } from "react";
import { useCart } from "./useCart";

export function useCartCount() {
  const { data, isLoading } = useCart();

  const count = useMemo(() => {
    const products = data?.data?.products ?? [];
    return products.reduce((sum: number, item: any) => sum + (item?.count ?? 0), 0);
  }, [data]);

  return {
    count,
    isLoading,
  };
}