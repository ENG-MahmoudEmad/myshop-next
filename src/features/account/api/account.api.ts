import { api } from "@/lib/axios";

export async function updateLoggedUserDataApi(payload: {
  name: string;
  email: string;
  phone: string;
}) {
  const { data } = await api.put("/users/updateMe", payload);
  return data;
}

export async function changeMyPasswordApi(payload: {
  currentPassword: string;
  password: string;
  rePassword: string;
}) {
  const { data } = await api.put("/users/changeMyPassword", payload);
  return data;
}