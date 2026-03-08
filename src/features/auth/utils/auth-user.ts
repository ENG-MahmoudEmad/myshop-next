import { getToken } from "./auth-storage";

type DecodedToken = {
  id?: string;
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
};

function decodeJwtPayload(token: string): DecodedToken | null {
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

export function getLoggedInUserData() {
  const token = getToken();
  if (!token) {
    return {
      id: "",
      name: "",
      email: "",
      role: "",
    };
  }

  const payload = decodeJwtPayload(token);

  return {
    id: payload?.id || payload?._id || payload?.userId || "",
    name: payload?.name || payload?.user?.name || "",
    email: payload?.email || payload?.user?.email || "",
    role: payload?.role || payload?.user?.role || "",
  };
}

export function getLoggedInUserName() {
  return getLoggedInUserData().name;
}

export function getUserInitials(name?: string) {
  const value = String(name || "").trim();
  if (!value) return "JD";

  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const first = parts[0][0] || "";
  const last = parts[parts.length - 1][0] || "";

  return `${first}${last}`.toUpperCase();
}