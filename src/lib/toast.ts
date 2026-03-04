import { toast } from "react-toastify";

let errorAudio: HTMLAudioElement | null = null;
let successAudio: HTMLAudioElement | null = null;

function getAudio(type: "error" | "success") {
  try {
    if (type === "error") {
      if (!errorAudio) {
        errorAudio = new Audio("/sounds/error.mp3");
        errorAudio.volume = 0.5;
      }
      return errorAudio;
    }

    if (!successAudio) {
      successAudio = new Audio("/sounds/success.mp3");
      successAudio.volume = 0.5;
    }
    return successAudio;
  } catch {
    return null;
  }
}

function play(type: "error" | "success") {
  const audio = getAudio(type);
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {}
}

export function toastSuccess(message: string, options?: any) {
  play("success");
  return toast.success(message, options);
}

export function toastError(message: string, options?: any) {
  play("error");
  return toast.error(message, options);
}

export function toastWarning(message: string, options?: any) {
  return toast.warning(message, options);
}