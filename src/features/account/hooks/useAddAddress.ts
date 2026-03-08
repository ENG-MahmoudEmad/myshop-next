import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddress, type AddressPayload } from "../api/address.api";
import { ADDRESSES_QUERY_KEY } from "./useAddresses";

export function useAddAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddressPayload) => addAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}