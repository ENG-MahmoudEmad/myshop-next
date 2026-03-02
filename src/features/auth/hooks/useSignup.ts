import { useMutation } from "@tanstack/react-query";
import { signupApi, type SignupPayload, type AuthResponse } from "../api/auth.api";

export const useSignup = () => {
  return useMutation<AuthResponse, any, SignupPayload>({
    mutationFn: signupApi,
  });
};