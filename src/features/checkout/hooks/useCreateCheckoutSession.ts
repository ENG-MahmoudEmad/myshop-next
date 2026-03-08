import { useMutation } from "@tanstack/react-query";
import {
  createCheckoutSession,
  type ShippingAddressPayload,
} from "../api/checkout.api";

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: ({
      cartId,
      shippingAddress,
      returnUrl,
    }: {
      cartId: string;
      shippingAddress: ShippingAddressPayload;
      returnUrl: string;
    }) => createCheckoutSession(cartId, shippingAddress, returnUrl),
  });
}