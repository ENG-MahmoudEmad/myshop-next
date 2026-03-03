"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/features/auth/utils/auth-storage";

export function useAuthToken() {
  // ✅ اقرأ التوكن من أول render (بدون flicker)
  const [token, setToken] = useState<string | null>(() => getToken());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setToken(getToken());

    // تأكيد القراءة بعد mount
    sync();
    setReady(true);

    // same-tab updates
    window.addEventListener("auth-token-changed", sync);

    // other-tab updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") sync();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("auth-token-changed", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { token, ready };
}