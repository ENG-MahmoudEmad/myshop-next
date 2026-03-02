export const authStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("myshop_token");
  },
  setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("myshop_token", token);
  },
  clearToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("myshop_token");
  },
};