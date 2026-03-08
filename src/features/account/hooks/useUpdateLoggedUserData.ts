import { useMutation } from "@tanstack/react-query";
import { updateLoggedUserDataApi } from "../api/account.api";

export function useUpdateLoggedUserData() {
  return useMutation({
    mutationFn: updateLoggedUserDataApi,
  });
}