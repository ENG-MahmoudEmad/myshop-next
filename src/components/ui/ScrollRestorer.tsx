"use client";

import { useEffect } from "react";

const KEY = "myshop:scrollY";

export default function ScrollRestorer() {
  useEffect(() => {
    const saved = sessionStorage.getItem(KEY);
    const target = saved ? Number(saved) : null;

    // ✅ restore (retry) on load/mount
    if (target != null && !Number.isNaN(target)) {
      const start = Date.now();
      const maxWait = 2500; // 2.5s retry window

      const tryRestore = () => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        // إذا الصفحة لسه قصيرة وما بتوصل للمكان المطلوب، بنستنى ونحاول
        const canReach = maxScroll >= target;

        window.scrollTo({ top: Math.min(target, Math.max(0, maxScroll)), left: 0 });

        // إذا وصلنا (أو صار ممكن الوصول)، بنوقف
        const closeEnough = Math.abs(window.scrollY - target) < 4;

        if ((canReach && closeEnough) || Date.now() - start > maxWait) return;

        setTimeout(tryRestore, 80);
      };

      // جرّب بعد أول رندر
      setTimeout(tryRestore, 0);

      // وكمان بعد تحميل الصور/الـ resources
      window.addEventListener("load", tryRestore, { once: true });
    }

    // ✅ save on scroll (throttled)
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sessionStorage.setItem(KEY, String(window.scrollY));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const onBeforeUnload = () => {
      sessionStorage.setItem(KEY, String(window.scrollY));
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  return null;
}