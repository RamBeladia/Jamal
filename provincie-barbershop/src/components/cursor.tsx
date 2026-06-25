"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

const HOVER_SEL = "a,button,.frame,.svc,.svc-opt,.day:not(:disabled),.slot,.lang-btn";

export function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    const cursor = dotRef.current;
    const glow = glowRef.current;
    if (!cursor) return;

    let tX = window.innerWidth / 2;
    let tY = window.innerHeight / 2;
    let cX = tX;
    let cY = tY;
    let shown = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tX = e.clientX;
      tY = e.clientY;
      if (glow) {
        glow.style.setProperty("--cursor-x", e.clientX + "px");
        glow.style.setProperty("--cursor-y", e.clientY + "px");
      }
      if (!shown) {
        shown = true;
        cursor.classList.add("is-visible");
        glow?.classList.add("is-visible");
      }
    };
    const onLeave = () => {
      cursor.classList.remove("is-visible");
      glow?.classList.remove("is-visible");
    };
    const onEnter = () => {
      if (shown) {
        cursor.classList.add("is-visible");
        glow?.classList.add("is-visible");
      }
    };
    const onOver = (e: PointerEvent) => {
      const tgt = e.target as Element | null;
      if (tgt?.closest?.(HOVER_SEL)) {
        cursor.classList.add("is-hover");
        glow?.classList.add("is-hover");
      }
    };
    const onOut = (e: PointerEvent) => {
      const tgt = e.target as Element | null;
      if (tgt?.closest?.(HOVER_SEL)) {
        const to = e.relatedTarget as Element | null;
        if (!to || !to.closest?.(HOVER_SEL)) {
          cursor.classList.remove("is-hover");
          glow?.classList.remove("is-hover");
        }
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    const loop = () => {
      cX += (tX - cX) * 0.18;
      cY += (tY - cY) * 0.18;
      cursor.style.transform = `translate3d(${cX.toFixed(2)}px,${cY.toFixed(2)}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // ── magnetic pull on buttons (desktop widths only) ──
    const desktop = window.matchMedia("(min-width:1025px)").matches;
    const magCleanups: Array<() => void> = [];
    const attachMagnetic = (btn: HTMLElement) => {
      if (btn.dataset.mag === "1") return;
      btn.dataset.mag = "1";
      const move = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const mxp = Math.max(-6, Math.min(6, dx * 0.3));
        const myp = Math.max(-5, Math.min(5, dy * 0.4));
        btn.style.transform = `translate(${mxp.toFixed(1)}px,${myp.toFixed(1)}px)`;
      };
      const leave = () => (btn.style.transform = "");
      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);
      magCleanups.push(() => {
        btn.removeEventListener("mousemove", move);
        btn.removeEventListener("mouseleave", leave);
      });
    };

    let mo: MutationObserver | null = null;
    if (desktop) {
      document.querySelectorAll<HTMLElement>(".btn").forEach(attachMagnetic);
      mo = new MutationObserver((muts) => {
        muts.forEach((m) =>
          m.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.classList.contains("btn")) attachMagnetic(node);
            node.querySelectorAll<HTMLElement>(".btn").forEach(attachMagnetic);
          }),
        );
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      mo?.disconnect();
      magCleanups.forEach((c) => c());
    };
  }, [fine, reduced]);

  return (
    <>
      <div className="cursor-glow" id="cursorGlow" aria-hidden="true" ref={glowRef}>
        <span />
      </div>
      <div className="cursor" id="cursor" aria-hidden="true" ref={dotRef}>
        <span className="cursor-dot" />
      </div>
    </>
  );
}
