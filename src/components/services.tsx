"use client";

import { useEffect, useRef } from "react";
import { SERVICES } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/hooks";

export function Services() {
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);

  // price count-up — one-time, when the Services list scrolls into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const priceEls = Array.from(list.querySelectorAll<HTMLElement>(".svc-price"));
    priceEls.forEach((el) => el.setAttribute("data-val", (el.textContent || "").replace(/\D/g, "") || "0"));

    const setFinal = () =>
      priceEls.forEach((el) => (el.textContent = "€" + (parseInt(el.getAttribute("data-val")!, 10) || 0)));

    const run = () => {
      priceEls.forEach((el, idx) => {
        const target = parseInt(el.getAttribute("data-val")!, 10) || 0;
        el.textContent = "€0";
        const dur = 520;
        let t0 = 0;
        setTimeout(() => {
          const step = (ts: number) => {
            if (!t0) t0 = ts;
            const prog = Math.min(1, (ts - t0) / dur);
            const eased = 1 - Math.pow(1 - prog, 3);
            el.textContent = "€" + Math.round(eased * target);
            if (prog < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }, idx * 80);
      });
    };

    if (reduced || !("IntersectionObserver" in window)) {
      setFinal();
      return;
    }
    let fired = false;
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting && !fired) {
            fired = true;
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(list);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section className="section services" id="services">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">{t("Diensten", "Services")}</span>
          <h2>{t("Diensten & prijzen", "Services & prices")}</h2>
          <p className="svc-intro">
            {t(
              "Eerlijke prijzen, netjes op het bord. Wat je ziet, betaal je — niks erbij.",
              "Honest prices, right there on the board. What you see is what you pay — nothing extra.",
            )}
          </p>
        </div>

        <div className="menu-card reveal">
          {/* DURATIONS ARE ESTIMATES — confirm exact timings with Jamal before going live */}
          <ul className="svc-list stagger" ref={listRef}>
            {SERVICES.map((s) => (
              <li className="svc" key={s.id} tabIndex={0}>
                <div className="svc-main">
                  <span className="svc-name">{t(s.nl, s.en)}</span>
                  <span className="svc-dur">~{s.dur} min</span>
                </div>
                <span className="svc-lead" aria-hidden="true" />
                <span className="svc-price">€{s.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
