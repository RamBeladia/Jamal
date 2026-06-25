"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useLang } from "@/lib/i18n";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { smoothScrollTo } from "@/lib/scroll";

type Word = { w: string; em?: boolean };

const HEADLINE: Record<"nl" | "en", Word[]> = {
  nl: [{ w: "Scherp" }, { w: "geknipt," }, { w: "zonder", em: true }, { w: "gedoe.", em: true }],
  en: [{ w: "A" }, { w: "clean" }, { w: "cut," }, { w: "no", em: true }, { w: "fuss.", em: true }],
};

export function Hero() {
  const { lang, t } = useLang();
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // kick off the per-word kinetic reveal once mounted
  useEffect(() => {
    const h1 = h1Ref.current;
    if (h1) h1.classList.add("run");
  }, [lang]);

  // mouse-parallax depth on the ambient glow + brass ring (desktop, motion-on)
  useEffect(() => {
    if (!fine || reduced) return;
    const hero = heroRef.current;
    const ambient = ambientRef.current;
    const ring = ringRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const cx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const cy = (e.clientY - (r.top + r.height / 2)) / r.height;
      if (ambient) ambient.style.transform = `translate3d(${(cx * 18).toFixed(1)}px, ${(cy * 14).toFixed(1)}px, 0)`;
      if (ring) ring.style.transform = `translate3d(${(cx * -12).toFixed(1)}px, ${(cy * -9).toFixed(1)}px, 0)`;
    };
    const onLeave = () => {
      if (ambient) ambient.style.transform = "";
      if (ring) ring.style.transform = "";
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, [fine, reduced]);

  const words = HEADLINE[lang];

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-curtain" aria-hidden="true" />
      <div className="hero-ambient" ref={ambientRef} aria-hidden="true">
        <i />
      </div>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", willChange: "transform" }}
      >
        <div className="hero-ring" />
      </div>

      <div className="wrap">
        {/* Mobile only: Provincie wordmark at the top, in the empty space above
            the address. mix-blend lighten drops the PNG's black into the hero. */}
        <div className="hero-logo md:hidden fade-up" aria-hidden="true" />

        <p className="label fade-up d1">Provinciestraat 226 · 2018 Antwerpen</p>

        <h1 ref={h1Ref} className="kinetic" aria-label={words.map((x) => x.w).join(" ")}>
          {words.map((word, i) => (
            <Fragment key={`${lang}-${i}`}>
              <span className="word-mask" aria-hidden="true">
                <span
                  className={"word" + (word.em ? " em" : "")}
                  style={{ "--wd": `${(0.7 + i * 0.06).toFixed(2)}s` } as CSSProperties}
                >
                  {word.w}
                </span>
              </span>
              {i < words.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </h1>

        <p className="hero-sub fade-up d3">
          {t(
            "Eén man, één stoel, en alle tijd voor jou. Wip binnen of boek vooraf — jij kiest.",
            "One man, one chair, and all the time you need. Drop in or book ahead — your call.",
          )}
        </p>

        <div className="hero-cta fade-up d4">
          <span className="cta-pulse">
            <a
              href="#book"
              className="btn btn-primary btn-shine"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("book", reduced);
              }}
            >
              {t("Boek je afspraak", "Book your spot")}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
          </span>
          <a
            href="#book"
            className="btn btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("book", reduced);
            }}
          >
            {t("Bekijk de prijzen", "See the prices")}
          </a>
        </div>

        <div className="hero-meta fade-up d5">
          <span>
            <b>{t("Knippen vanaf", "Cuts from")}</b> €15
          </span>
          <span>{t("Di–Za · 10–19u", "Tue–Sat · 10–19h")}</span>
          <span>{t("Wandel binnen of boek vooraf", "Walk in or book ahead")}</span>
        </div>

        <div className="scroll-cue fade-up d5" aria-hidden="true">
          <span>Scroll</span>
          <span className="track" />
        </div>
      </div>

      {/* Mobile only: soft gradient that melts the black hero into the
          paper-colored Services section below — no hard black/white seam */}
      <div className="hero-fade md:hidden" aria-hidden="true" />
    </section>
  );
}
