import axios from "axios";
import { getToken, removeToken } from "@/features/auth/utils/auth-storage";

export const api = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
});

// ✅ Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      // Route API uses "token" header (not Authorization Bearer)
      (config.headers as any).token = token;
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

    // لا تعمل logout على أخطاء تسجيل الدخول/التسجيل نفسها
    const isAuthEndpoint =
      url.includes("/auth/signin") ||
      url.includes("/auth/signup") ||
      url.includes("/auth/forgotPasswords") ||
      url.includes("/auth/verifyResetCode") ||
      url.includes("/auth/resetPassword");

    if (typeof window !== "undefined" && status === 401 && !isAuthEndpoint) {
      // امسح التوكن
      removeToken();

      // Toast (بدون import مباشر لتفادي مشاكل SSR/Client)
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { toast } = require("react-toastify");
        toast.error("Session expired. Please login again.", { autoClose: 3500 });
      } catch {
        // ignore
      }

      // رجّع المستخدم للّوجين مع next
      const current =
        window.location.pathname + window.location.search + window.location.hash;

      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign(`/login?next=${encodeURIComponent(current)}`);
      }
    }

    return Promise.reject(error);
  }
);