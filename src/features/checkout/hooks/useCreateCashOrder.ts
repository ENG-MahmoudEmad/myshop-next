import { useMutation } from "@tanstack/react-query";
import { createCashOrder, type ShippingAddressPayload } from "../api/checkout.api";

export function useCreateCashOrder() {
  return useMutation({
    mutationFn: ({
      cartId,
      shippingAddress,
    }: {
      cartId: string;
      shippingAddress: ShippingAddressPayload;
    }) => createCashOrder(cartId, shippingAddress),
  });
}