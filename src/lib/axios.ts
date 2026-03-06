import axios from "axios";
import { getToken, removeToken } from "@/features/auth/utils/auth-storage";

export const api = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
});

// endpoints تعتبر "public" (لا نرسل token لها)
const PUBLIC_PREFIXES = ["/products", "/categories", "/brands", "/subcategories"];

// ✅ Add token ONLY for protected endpoints
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};

      // ✅ Route sometimes expects token header
      (config.headers as any).token = token;

      // ✅ and sometimes expects Authorization Bearer
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global 401 handler (session expired)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url || "");

    const isAuthEndpoint =
      url.includes("/auth/signin") ||
      url.includes("/auth/signup") ||
      url.includes("/auth/forgotPasswords") ||
      url.includes("/auth/verifyResetCode") ||
      url.includes("/auth/resetPassword");

    // ✅ لا تعمل logout على 401 من endpoints العامة (احتياط)
    const isPublicEndpoint =
      url.includes("/products") ||
      url.includes("/categories") ||
      url.includes("/brands") ||
      url.includes("/subcategories");

    if (
      typeof window !== "undefined" &&
      status === 401 &&
      !isAuthEndpoint &&
      !isPublicEndpoint
    ) {
      removeToken();

      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { toast } = require("react-toastify");
        toast.error("Session expired. Please login again.", { autoClose: 3500 });
      } catch {
        // ignore
      }

      const current =
        window.location.pathname + window.location.search + window.location.hash;

      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign(`/login?next=${encodeURIComponent(current)}`);
      }
    }

    return Promise.reject(error);
  }
); 