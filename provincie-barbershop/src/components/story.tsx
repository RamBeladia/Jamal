"use client";

import { useLang } from "@/lib/i18n";

export function Story() {
  const { lang, t } = useLang();
  return (
    <section className="section story" id="story">
      <span className="watermark" aria-hidden="true">
        Provincie
      </span>
      <div className="wrap">
        <div className="section-head reveal" style={{ marginBottom: 0 }}>
          <span className="label">{t("Verhaal", "Story")}</span>
        </div>

        {/* PLACEHOLDER COPY: replace once Jamal shares his real story. No fabricated reviews. */}
        <p className="story-body reveal">
          {lang === "nl" ? (
            <>
              Al jaren dezelfde vertrouwde stoel op de Provinciestraat. Geen toeters of bellen — gewoon{" "}
              <em>iemand die zijn stiel kent</em> en de tijd neemt voor elke klant.
            </>
          ) : (
            <>
              The same trusted chair on Provinciestraat for years. No bells or whistles — just{" "}
              <em>someone who knows the trade</em> and takes his time with every client.
            </>
          )}
        </p>
        <p className="story-tag reveal">
          <b>Jamal Ali</b> — <span>{t("barbier & eigenaar", "barber & owner")}</span>
        </p>
      </div>
    </section>
  );
}
