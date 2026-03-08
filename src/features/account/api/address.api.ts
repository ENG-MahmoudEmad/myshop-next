import { api } from "@/lib/axios";

export type AddressPayload = {
  name: string;
  details: string;
  phone: string;
  city: string;
};

export async function getAddresses() {
  const { data } = await api.get("/addresses");
  return data;
}

export async function addAddress(payload: AddressPayload) {
  const { data } = await api.post("/addresses", payload);
  return data;
}

export async function removeAddress(addressId: string) {
  const { data } = await api.delete(`/addresses/${addressId}`);
  return data;
}