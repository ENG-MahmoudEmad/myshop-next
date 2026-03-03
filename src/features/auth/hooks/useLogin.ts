import { useMutation } from "@tanstack/react-query";
import { loginApi, type LoginPayload, type AuthResponse } from "../api/auth.api";

export const useLogin = () => {
  return useMutation<AuthResponse, any, LoginPayload>({
    mutationFn: loginApi,
  });
};