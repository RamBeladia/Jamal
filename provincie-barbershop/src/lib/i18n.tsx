"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Lang = "nl" | "en";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** pick a string by language — t("Diensten", "Services") */
  t: (nl: string, en: string) => string;
  locale: string;
};

const LangContext = createContext<Ctx | null>(null);

/** Dutch is the default on load (this is Antwerp). */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nl");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback((nl: string, en: string) => (lang === "en" ? en : nl), [lang]);
  const locale = lang === "en" ? "en-GB" : "nl-BE";

  return (
    <LangContext.Provider value={{ lang, setLang, t, locale }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LanguageProvider>");
  return ctx;
}
