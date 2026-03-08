import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../api/address.api";

export const ADDRESSES_QUERY_KEY = ["addresses"] as const;

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: getAddresses,
    retry: false,
  });
}