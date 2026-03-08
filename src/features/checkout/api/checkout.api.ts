import { api } from "@/lib/axios";

export type ShippingAddressPayload = {
  details: string;
  phone: string;
  city: string;
};

export async function createCashOrder(
  cartId: string,
  shippingAddress: ShippingAddressPayload
) {
  const { data } = await api.post(`/orders/${cartId}`, {
    shippingAddress,
  });

  return data;
}

export async function createCheckoutSession(
  cartId: string,
  shippingAddress: ShippingAddressPayload,
  returnUrl: string
) {
  const { data } = await api.post(
    `/orders/checkout-session/${cartId}`,
    {
      shippingAddress,
    },
    {
      params: {
        url: returnUrl,
      },
    }
  );

  return data;
}