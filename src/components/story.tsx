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
          <span className="label">{t("Over Jamal", "About Jamal")}</span>
        </div>

        {/* Kinetic wordmark — hover a letter to reveal a real shop photo through it */}
        <div ref={headlineRef} className="story-headline" aria-label="Provincie Barbershop">
          <RevealText text="PROVINCIE" start={inView} />
        </div>

        <p className="story-body reveal">
          {lang === "nl" ? (
            <>
              Jamal runt Provincie Barbershop al jaren vanuit dezelfde stoel op de Provinciestraat. Geen overbodige fratsen, geen wachttijden van een uur —{" "}
              <em>gewoon vakwerk, eerlijk geprijsd</em>, door iemand die zijn stiel door en door kent en er elke dag zijn beste werk van maakt.
            </>
          ) : (
            <>
              Jamal has been running Provincie Barbershop from the same chair on Provinciestraat for years. No fuss, no inflated ego —{" "}
              <em>just solid craft, honestly priced</em>, from someone who knows exactly what he&apos;s doing and shows up every day to prove it.
            </>
          )}
        </p>
        <p className="story-tag reveal">
          <b>Jamal Alli</b> — <span>{t("barbier & eigenaar", "barber & owner")}</span>
        </p>
      </div>
    </section>
  );
}
