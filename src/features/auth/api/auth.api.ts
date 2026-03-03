import { api } from "@/lib/axios";

export type LoginPayload = { email: string; password: string };

export type AuthResponse = { message: string; token: string };

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await api.post<AuthResponse>("/auth/signin", payload);
  return data;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string; // مصري
};

export const signupApi = async (payload: SignupPayload) => {
  const { data } = await api.post<AuthResponse>("/auth/signup", payload);
  return data;
};