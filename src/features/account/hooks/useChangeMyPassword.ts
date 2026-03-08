import { useMutation } from "@tanstack/react-query";
import { changeMyPasswordApi } from "../api/account.api";

export function useChangeMyPassword() {
  return useMutation({
    mutationFn: changeMyPasswordApi,
  });
}