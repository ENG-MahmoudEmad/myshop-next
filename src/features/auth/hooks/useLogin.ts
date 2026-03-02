import { useMutation } from "@tanstack/react-query";
import { loginApi, type LoginPayload, type LoginResponse } from "../api/auth.api";

export const useLogin = () => {
  return useMutation<LoginResponse, any, LoginPayload>({
    mutationFn: loginApi,
  });
};