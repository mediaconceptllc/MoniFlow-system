import { create } from "zustand";
import type { Locale } from "./i18n";

function readStored(): Locale {
  if (typeof window === "undefined") return "mn";
  try {
    const v = window.localStorage.getItem("moniflow.locale");
    if (v === "en" || v === "mn") return v;
  } catch {
    /* ignore */
  }
  return "mn";
}

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocale = create<LocaleState>((set) => ({
  locale: readStored(),
  setLocale: (locale) => {
    try {
      window.localStorage.setItem("moniflow.locale", locale);
    } catch {
      /* ignore */
    }
    set({ locale });
  },
}));
