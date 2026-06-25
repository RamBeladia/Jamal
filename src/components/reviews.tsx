"use client";

import { useEffect, useRef, useState } from "react";
import { REVIEWS, GOOGLE_REVIEWS_URL } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Official Google "G" mark — credibility cue next to each rating. */
function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function Reviews() {
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();
  const vpRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<boolean[]>(() => REVIEWS.map(() => false));
  const [overflowing, setOverflowing] = useState<boolean[]>(() => REVIEWS.map(() => false));

  // ── detect which (collapsed) reviews overflow ~3 lines, so we only show "Read more" where needed ──
  useEffect(() => {
    const measure = () =>
      setOverflowing((prev) =>
        REVIEWS.map((_, i) => {
          if (expanded[i]) return prev[i]; // keep state for expanded cards (can't measure clamp height)
          const el = textRefs.current[i];
          if (!el) return prev[i];
          return el.scrollHeight - el.clientHeight > 1;
        }),
      );
    measure();
    window.addEventListener("resize", measure);
    // re-check once fonts settle (line counts can shift)
    (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready?.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [expanded]);

  // ── existing drag-to-scroll + idle auto-drift, PLUS arrow-key nav and active-card tracking ──
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let resumeT: ReturnType<typeof setTimeout> | null = null;
    let drift = true;
    let raf = 0;
    let activeRaf = 0;
    const cleanups: Array<() => void> = [];

    const pause = () => {
      drift = false;
      if (resumeT) {
        clearTimeout(resumeT);
        resumeT = null;
      }
    };
    const scheduleResume = () => {
      if (resumeT) clearTimeout(resumeT);
      resumeT = setTimeout(() => (drift = true), 2000);
    };
    const maxScroll = () => vp.scrollWidth - vp.clientWidth;

    // track the card nearest the viewport centre → drives the active-depth styling
    const computeActive = () => {
      const cards = vp.querySelectorAll<HTMLElement>(".review-card");
      if (!cards.length) return;
      const vr = vp.getBoundingClientRect();
      const center = vr.left + vr.width / 2;
      let best = 0;
      let bestD = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScrollActive = () => {
      if (activeRaf) return;
      activeRaf = requestAnimationFrame(() => {
        activeRaf = 0;
        computeActive();
      });
    };

    if (!reduced) {
      let dir = 1;
      const loop = () => {
        if (drift && !dragging && vp.scrollWidth > vp.clientWidth) {
          vp.scrollLeft += 0.4 * dir;
          const ms = maxScroll();
          if (vp.scrollLeft >= ms - 1) {
            vp.scrollLeft = ms;
            dir = -1;
          } else if (vp.scrollLeft <= 0) {
            vp.scrollLeft = 0;
            dir = 1;
          }
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      vp.addEventListener("mouseenter", pause);
      vp.addEventListener("mouseleave", scheduleResume);
      cleanups.push(() => {
        vp.removeEventListener("mouseenter", pause);
        vp.removeEventListener("mouseleave", scheduleResume);
      });
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        pause();
        return;
      }
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = vp.scrollLeft;
      try {
        vp.setPointerCapture(e.pointerId);
      } catch {}
      vp.classList.add("dragging");
      pause();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      vp.scrollLeft = startScroll - dx;
    };
    const endDrag = () => {
      if (dragging) {
        dragging = false;
        vp.classList.remove("dragging");
      }
      scheduleResume();
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onTouchStart = () => pause();
    const onTouchEnd = () => scheduleResume();
    const onWheel = () => {
      pause();
      scheduleResume();
    };

    // arrow-key navigation — one card per keypress while the carousel has focus
    const stepByCard = (sign: number) => {
      const cards = vp.querySelectorAll<HTMLElement>(".review-card");
      if (!cards.length) return;
      let step = cards[0].getBoundingClientRect().width + 20;
      if (cards.length > 1) {
        step = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
      }
      vp.scrollBy({ left: sign * step, behavior: reduced ? "auto" : "smooth" });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        pause();
        stepByCard(1);
        scheduleResume();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        pause();
        stepByCard(-1);
        scheduleResume();
      }
    };

    vp.addEventListener("pointerdown", onDown);
    vp.addEventListener("pointermove", onMove);
    vp.addEventListener("pointerup", endDrag);
    vp.addEventListener("pointercancel", endDrag);
    vp.addEventListener("touchstart", onTouchStart, { passive: true });
    vp.addEventListener("touchend", onTouchEnd, { passive: true });
    vp.addEventListener("wheel", onWheel, { passive: true });
    vp.addEventListener("click", onClickCapture, true);
    vp.addEventListener("keydown", onKey);
    vp.addEventListener("scroll", onScrollActive, { passive: true });
    computeActive();

    cleanups.push(() => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(activeRaf);
      if (resumeT) clearTimeout(resumeT);
      vp.removeEventListener("pointerdown", onDown);
      vp.removeEventListener("pointermove", onMove);
      vp.removeEventListener("pointerup", endDrag);
      vp.removeEventListener("pointercancel", endDrag);
      vp.removeEventListener("touchstart", onTouchStart);
      vp.removeEventListener("touchend", onTouchEnd);
      vp.removeEventListener("wheel", onWheel);
      vp.removeEventListener("click", onClickCapture, true);
      vp.removeEventListener("keydown", onKey);
      vp.removeEventListener("scroll", onScrollActive);
    });

    return () => cleanups.forEach((c) => c());
  }, [reduced]);

  const toggle = (i: number) => setExpanded((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <section className="section reviews" id="reviews">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">{t("Reviews", "Reviews")}</span>
          <h2>{t("Wat de mensen zeggen", "Straight from the clients")}</h2>
        </div>
      </div>

      <div
        className="reviews-viewport"
        id="reviewsViewport"
        ref={vpRef}
        role="region"
        tabIndex={0}
        aria-keyshortcuts="ArrowLeft ArrowRight"
        aria-label={t(
          "Klantreviews — sleep of gebruik de pijltjestoetsen om te bladeren",
          "Reviews from real clients — drag or use the arrow keys to browse",
        )}
      >
        <div className="reviews-track stagger">
          {REVIEWS.map((r, i) => (
            <article className="review-card" key={i}>
              <div className={"review-card-inner" + (active === i ? " is-active" : "")}>
                <div className="review-head">
                  <div className="review-stars" aria-label={`${r.stars} / 5`}>
                    {"★".repeat(r.stars)}
                  </div>
                  <span className="review-source">
                    <GoogleG />
                    <span>Google</span>
                  </span>
                </div>
                <p
                  className={"review-text" + (expanded[i] ? "" : " clamp")}
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                >
                  {r.text}
                </p>
                {overflowing[i] && (
                  <button type="button" className="review-more" onClick={() => toggle(i)} aria-expanded={expanded[i]}>
                    {expanded[i] ? t("Minder", "Read less") : t("Meer lezen", "Read more")}
                  </button>
                )}
                <p className="review-name">{r.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="wrap">
        <a className="reviews-all" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener">
          {t("Alle reviews op Google", "Read all reviews on Google")}
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
