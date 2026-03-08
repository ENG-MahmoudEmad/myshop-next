"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);

    const isMobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      );

    const smallScreen = window.innerWidth < 1024;

    if (!isMobile && !smallScreen) {
      setIsDesktop(true);
    }
  }, []);

  if (!isDesktop) {
    return null; // لا تعرض الصفحة على الجوال
  }

  const canUse = baseUrl.length > 0;

  return (
    <div className="mx-auto w-[80%] py-10">
      <div className="rounded-3xl bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6">
        <h1 className="text-xl font-extrabold text-zinc-900">Developer Tools</h1>

        <p className="mt-2 text-sm text-zinc-600">
          Browsers do not allow websites to open DevTools automatically.
          Use one of the options below.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className="rounded-2xl bg-[var(--brand-50)]/70 px-4 py-3 text-left font-semibold text-[var(--brand-700)] border border-white/30 transition hover:bg-[var(--brand-100)]/70"
            onClick={() => navigator.clipboard.writeText("Ctrl+Shift+I")}
          >
            Copy DevTools shortcut (Ctrl+Shift+I)
          </button>

          <button
            className="rounded-2xl bg-[var(--brand-50)]/70 px-4 py-3 text-left font-semibold text-[var(--brand-700)] border border-white/30 transition hover:bg-[var(--brand-100)]/70"
            onClick={() => navigator.clipboard.writeText("F12")}
          >
            Copy shortcut (F12)
          </button>

          <button
            disabled={!canUse}
            className={[
              "rounded-2xl px-4 py-3 text-left font-semibold border border-white/30 transition",
              canUse
                ? "bg-white/70 text-zinc-800 hover:bg-white/85"
                : "bg-zinc-200/70 text-zinc-500 cursor-not-allowed",
            ].join(" ")}
            onClick={() => {
              if (!canUse) return;
              window.open(`view-source:${baseUrl}`, "_blank", "noopener,noreferrer");
            }}
          >
            Open View Source
          </button>

          <button
            disabled={!canUse}
            className={[
              "rounded-2xl px-4 py-3 text-left font-semibold border border-white/30 transition",
              canUse
                ? "bg-white/70 text-zinc-800 hover:bg-white/85"
                : "bg-zinc-200/70 text-zinc-500 cursor-not-allowed",
            ].join(" ")}
            onClick={() => {
              if (!canUse) return;
              navigator.clipboard.writeText(baseUrl);
            }}
          >
            Copy site URL
          </button>
        </div>
      </div>
    </div>
  );
}