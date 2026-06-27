"use client";

import { useLang } from "@/lib/i18n";

/** EN/NL pill with the sliding brass thumb. Instant swap, no reload. */
export function LangToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang" data-lang={lang} role="group" aria-label={t("Taal", "Language")} translate="no">
      <button
        className={"lang-btn" + (lang === "nl" ? " active" : "")}
        data-lang="nl"
        aria-pressed={lang === "nl"}
        onClick={() => setLang("nl")}
      >
        NL
      </button>
      <button
        className={"lang-btn" + (lang === "en" ? " active" : "")}
        data-lang="en"
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}
