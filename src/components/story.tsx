"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { RevealText } from "@/components/ui/reveal-text";

export function Story() {
  const { lang, t } = useLang();
  const headlineRef = useRef<HTMLDivElement>(null);
  // run the kinetic wordmark once it scrolls into view
  const inView = useInView(headlineRef, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <section className="section story" id="story">
      <div className="wrap">
        <div className="section-head reveal" style={{ marginBottom: 0 }}>
          <span className="label">{t("Verhaal", "Story")}</span>
        </div>

        {/* Kinetic wordmark — hover a letter to reveal a real shop photo through it */}
        <div ref={headlineRef} className="story-headline" aria-label="Provincie Barbershop">
          <RevealText text="PROVINCIE" start={inView} />
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
