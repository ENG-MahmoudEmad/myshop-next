const TOKEN_KEY = "token";

const notifyAuthChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("auth-token-changed"));
};

export const saveToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChange();
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  notifyAuthChange();
};