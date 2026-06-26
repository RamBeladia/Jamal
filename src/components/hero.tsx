"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { useFinePointer, useMobileHero, usePrefersReducedMotion } from "@/lib/hooks";
import { smoothScrollTo } from "@/lib/scroll";

type Word = { w: string; em?: boolean };

const HEADLINE: Record<"nl" | "en", Word[]> = {
  nl: [{ w: "Tijd" }, { w: "voor" }, { w: "een" }, { w: "knipbeurt?", em: true }],
  en: [{ w: "Need" }, { w: "a" }, { w: "Haircut?", em: true }],
};

export function Hero() {
  const { lang, t } = useLang();
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const isMobile = useMobileHero();

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
        {/* Mobile only: clean Provincie wordmark — transparent PNG, no blend-mode needed.
            Choreographed entrance: logo first, then address, headline, CTA, meta. */}
        <motion.div
          className="hero-logo md:hidden"
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={reduced ? false : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1], delay: 0.08 }}
        >
          <Image
            src="/images/barber-provinicie-logo-clean.png"
            alt=""
            width={260}
            height={120}
            priority
            className="hero-logo-img"
          />
        </motion.div>

        {/* Address — mobile: framer-motion stagger; desktop: original fade-up CSS */}
        {isMobile ? (
          <motion.p
            className="label"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1], delay: 0.52 }}
          >
            Provinciestraat 226 · 2018 Antwerpen
          </motion.p>
        ) : (
          <p className="label fade-up d1">Provinciestraat 226 · 2018 Antwerpen</p>
        )}

        {/* Headline — mobile: delayed word-rise (logo settles first); desktop: original timing */}
        <h1
          ref={h1Ref}
          className="kinetic"
          aria-label={words.map((x) => x.w).join(" ")}
        >
          {words.map((word, i) => (
            <Fragment key={`${lang}-${i}`}>
              <span className="word-mask" aria-hidden="true">
                <span
                  className={"word" + (word.em ? " em" : "")}
                  style={{
                    "--wd": isMobile
                      ? `${(0.72 + i * 0.06).toFixed(2)}s`
                      : `${(0.7 + i * 0.06).toFixed(2)}s`,
                  } as CSSProperties}
                >
                  {word.w}
                </span>
              </span>
              {i < words.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </h1>

        {/* CTA — mobile: fade+slide-up; desktop: original fade-up CSS */}
        {isMobile ? (
          <motion.div
            className="hero-cta"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay: 1.1 }}
          >
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
          </motion.div>
        ) : (
          <div className="hero-cta fade-up d3">
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
          </div>
        )}

        {/* Meta — mobile: delayed fade; desktop: original fade-up CSS */}
        {isMobile ? (
          <motion.div
            className="hero-meta"
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? false : { opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1], delay: 1.3 }}
          >
            <span>
              <b>{t("Knippen vanaf", "Cuts from")}</b> €15
            </span>
            <span>{t("Di–Za · 10–19u", "Tue–Sat · 10–19h")}</span>
            <span>{t("Wandel binnen of boek vooraf", "Walk in or book ahead")}</span>
          </motion.div>
        ) : (
          <div className="hero-meta fade-up d4">
            <span>
              <b>{t("Knippen vanaf", "Cuts from")}</b> €15
            </span>
            <span>{t("Di–Za · 10–19u", "Tue–Sat · 10–19h")}</span>
            <span>{t("Wandel binnen of boek vooraf", "Walk in or book ahead")}</span>
          </div>
        )}

        <div className="scroll-cue fade-up d4" aria-hidden="true">
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
