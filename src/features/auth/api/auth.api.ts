import { api } from "@/lib/axios";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user?: { name: string; email: string; role: string };
};

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await api.post<LoginResponse>("/api/v1/auth/signin", payload);
  return data;
};