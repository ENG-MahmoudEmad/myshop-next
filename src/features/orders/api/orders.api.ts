import { api } from "@/lib/axios";
import { getToken } from "@/features/auth/utils/auth-storage";

function decodeJwtPayload(token: string) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded =
      typeof window !== "undefined"
        ? window.atob(normalized)
        : Buffer.from(normalized, "base64").toString("utf8");

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getUserIdFromToken() {
  const token = getToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload?.id ?? payload?._id ?? payload?.userId ?? null;
}

export async function getLoggedUserOrders() {
  const userId = getUserIdFromToken();

  if (!userId) {
    throw new Error("Unable to determine logged-in user.");
  }

  const { data } = await api.get(`/orders/user/${userId}`);
  return data;
}