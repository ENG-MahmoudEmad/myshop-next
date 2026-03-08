import { useMutation } from "@tanstack/react-query";
import { createCashOrder } from "../api/checkout.api";

export function useCashOrder() {
  return useMutation({
    mutationFn: ({
      cartId,
      shippingAddress,
    }: {
      cartId: string;
      shippingAddress: {
        details: string;
        phone: string;
        city: string;
      };
    }) => createCashOrder(cartId, shippingAddress),
  });
}