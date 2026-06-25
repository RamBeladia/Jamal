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
            <h3>{t("Tot in de zaak.", "See you at the shop.")}</h3>
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
              {/* INSTAGRAM PLACEHOLDER: replace href with the real Instagram profile URL */}
              <li>
                <span className="k">Instagram</span>
                <a href={CONTACT.instagramHref} rel="noopener">
                  {CONTACT.instagram}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className="label">Open</span>
            <ul className="f-list">
              <li>
                <span className="k">{t("Dinsdag — Zaterdag", "Tuesday — Saturday")}</span>
                10:00 – 19:00
              </li>
              <li>
                <span className="k">{t("Zondag & Maandag", "Sunday & Monday")}</span>
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
