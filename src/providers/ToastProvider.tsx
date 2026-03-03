"use client";

import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

let errorAudio: HTMLAudioElement | null = null;
let successAudio: HTMLAudioElement | null = null;

function initAudios() {
  try {
    if (!errorAudio) {
      errorAudio = new Audio("/sounds/error.mp3");
      errorAudio.volume = 0.5;
      errorAudio.load();
    }
    if (!successAudio) {
      successAudio = new Audio("/sounds/success.mp3");
      successAudio.volume = 0.5;
      successAudio.load();
    }
  } catch {
    // ignore
  }
}

function play(audio: HTMLAudioElement | null) {
  try {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export default function ToastProvider() {
  useEffect(() => {
    initAudios();

    const unlock = () => initAudios();
    window.addEventListener("pointerdown", unlock, { once: true });

    const unsubscribe = toast.onChange((payload: any) => {
      if (!payload || payload.status !== "added") return;

      const t = String(payload.type || "").toLowerCase();
      if (t === "error") play(errorAudio);
      if (t === "success") play(successAudio);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("pointerdown", unlock as any);
    };
  }, []);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      closeButton
      newestOnTop
      pauseOnHover
      draggable
      theme="light"
      style={{
        marginTop: 65,   // ✅ تحت navbar
        zIndex: 20000,   // ✅ فوق navbar z-[9999]
      }}
    />
  );
}