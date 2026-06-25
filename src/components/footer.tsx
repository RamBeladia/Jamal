"use client";

import { CONTACT } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top reveal">
          <div>
            <span className="label">Provincie Barbershop</span>
            <h3>{t("Tot snel op de Provinciestraat.", "We'll see you on Provinciestraat.")}</h3>
          </div>
          <div>
            <span className="label">Contact</span>
            <ul className="f-list">
              <li>
                <span className="k">{t("Telefoon", "Phone")}</span>
                <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
              </li>
              <li>
                <span className="k">{t("Adres", "Address")}</span>
                Provinciestraat 226, 2018 Antwerpen
              </li>
              <li>
                <span className="k">Instagram</span>
                <a href={CONTACT.instagramHref} rel="noopener noreferrer" target="_blank">
                  {CONTACT.instagram}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className="label">{t("Openingsuren", "Hours")}</span>
            <ul className="f-list">
              <li>
                <span className="k">{t("Dinsdag — Zaterdag", "Tuesday — Saturday")}</span>
                10:00 – 19:00
              </li>
              <li>
                <span className="k">{t("Zon- & Maandag", "Sunday & Monday")}</span>
                <span>{t("Gesloten", "Closed")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="copy">© {year} Provincie Barbershop</span>
          <LangToggle />
        </div>
      </div>
    </footer>
  );
}
