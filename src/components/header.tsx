"use client";

import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { smoothScrollTo } from "@/lib/scroll";
import { LangToggle } from "@/components/lang-toggle";

export function Header() {
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const headerRef = useRef<HTMLElement>(null);

  // shrink + shadow once scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active nav highlight via IntersectionObserver
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    smoothScrollTo(id, reduced);
  };

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => go(e, "main")}>
        {t("Naar inhoud", "Skip to content")}
      </a>

      <header ref={headerRef} className={"header" + (scrolled ? " scrolled" : "") + (open ? " open" : "")} id="header">
        <div className="wrap header-bar">
          <a href="#home" className="wordmark" onClick={(e) => go(e, "home")}>
            Provincie Barbershop<span className="dot">.</span>
          </a>

          <nav className="nav" id="nav" aria-label={t("Hoofdnavigatie", "Main navigation")}>
            {NAV.map((n) => (
              <a
                key={n.id}
                href={"#" + n.id}
                className={active === n.id ? "active" : undefined}
                onClick={(e) => go(e, n.id)}
              >
                {t(n.nl, n.en)}
              </a>
            ))}
          </nav>

          <div className="header-right">
            <LangToggle />
            <button
              className="menu-btn"
              id="menuBtn"
              aria-expanded={open}
              aria-label={open ? t("Menu sluiten", "Close menu") : t("Menu openen", "Open menu")}
              onClick={() => setOpen((o) => !o)}
            >
              <svg className="burger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <svg className="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
