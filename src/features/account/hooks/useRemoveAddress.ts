import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAddress } from "../api/address.api";
import { ADDRESSES_QUERY_KEY } from "./useAddresses";

export function useRemoveAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => removeAddress(addressId),

    onMutate: async (addressId) => {
      await queryClient.cancelQueries({ queryKey: ADDRESSES_QUERY_KEY });

      const previousAddresses = queryClient.getQueryData(ADDRESSES_QUERY_KEY);

      queryClient.setQueryData(ADDRESSES_QUERY_KEY, (old: any) => {
        const current = old?.data ?? old?.addresses ?? [];
        const next = current.filter((item: any) => item?._id !== addressId);

        if (Array.isArray(old?.data)) {
          return { ...old, data: next };
        }

        if (Array.isArray(old?.addresses)) {
          return { ...old, addresses: next };
        }

        return { ...old, data: next };
      });

      return { previousAddresses };
    },

    onError: (_error, _addressId, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(ADDRESSES_QUERY_KEY, context.previousAddresses);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}