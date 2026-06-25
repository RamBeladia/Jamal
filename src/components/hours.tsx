"use client";

import { useEffect, useState } from "react";
import { HOURS, TODAY_LABEL, CONTACT } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export function Hours() {
  const { lang, t } = useLang();
  // resolve "today" on the client only (avoids SSR/client date mismatch)
  const [todayDow, setTodayDow] = useState<number | null>(null);
  useEffect(() => setTodayDow(new Date().getDay()), []);

  return (
    <section className="section hours-sec" id="hours">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">{t("Uren & adres", "Hours & location")}</span>
          <h2>{t("Kom langs", "Come find us")}</h2>
        </div>

        <div className="hl-grid reveal">
          <div className="hours-card">
            {/* PLACEHOLDER HOURS: confirm real opening hours with Jamal */}
            <ul className="hours">
              {HOURS.map((row) => {
                const isToday = todayDow === row.dow;
                return (
                  <li key={row.dow} className={isToday ? "today" : undefined}>
                    <span className="h-day" data-today={isToday ? TODAY_LABEL[lang] : undefined}>
                      {t(row.nl, row.en)}
                    </span>
                    {row.closed ? (
                      <span className="h-time closed">{t("Gesloten", "Closed")}</span>
                    ) : (
                      <span className="h-time">{row.time}</span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="addr">
              <p>
                <strong>{CONTACT.name}</strong>
              </p>
              <p>
                {CONTACT.street}
                <br />
                {CONTACT.city}
              </p>
              <p style={{ marginTop: 10 }}>
                <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
              </p>
            </div>
          </div>

          {/* Google Maps embed pinned to Provinciestraat 226, 2018 Antwerpen */}
          <div className="map">
            <iframe
              title={t("Kaart — Provinciestraat 226, Antwerpen", "Map — Provinciestraat 226, Antwerp")}
              src={CONTACT.mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
