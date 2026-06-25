"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

const PHOTOS = [
  {
    src: "/photos/gallery-fade.jpg",
    altNl: "Strakke fade, geknipt bij Provincie Barbershop",
    altEn: "Sharp fade, cut at Provincie Barbershop",
    capNl: "Verse fade",
    capEn: "Fresh fade",
  },
  {
    src: "/photos/gallery-kids.jpg",
    altNl: "Kinderknipbeurt met lijntje, Provincie Barbershop",
    altEn: "Kids haircut with a line, Provincie Barbershop",
    capNl: "Kids Cut",
    capEn: "Kids Cut",
  },
];

export function Gallery() {
  const { t } = useLang();
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  // 3D tilt + cursor-tracked sheen sweep (desktop / fine-pointer only)
  useEffect(() => {
    if (!fine || reduced) return;
    const grid = gridRef.current;
    if (!grid) return;
    const frames = Array.from(grid.querySelectorAll<HTMLElement>(".frame"));
    const cleanups: Array<() => void> = [];
    frames.forEach((frame) => {
      const sheen = frame.querySelector<HTMLElement>(".sheen");
      const onMove = (e: MouseEvent) => {
        const r = frame.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 10;
        const rx = (0.5 - py) * 8;
        frame.style.transform = `translateY(-7px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        if (sheen) {
          sheen.style.setProperty("--sx", (px * 100).toFixed(1) + "%");
          sheen.style.setProperty("--sy", (py * 100).toFixed(1) + "%");
          sheen.style.opacity = "0.6";
        }
      };
      const onLeave = () => {
        frame.style.transform = "";
        if (sheen) sheen.style.opacity = "0";
      };
      frame.addEventListener("mousemove", onMove);
      frame.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        frame.removeEventListener("mousemove", onMove);
        frame.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, [fine, reduced]);

  return (
    <section className="section gallery" id="gallery">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">{t("In de zaak", "Inside")}</span>
          <h2>{t("Een blik binnen", "A look inside")}</h2>
        </div>

        <div className="gallery-grid stagger" ref={gridRef}>
          {PHOTOS.map((p) => (
            <figure className="frame" key={p.src}>
              <div className="photo-frame">
                <Image
                  className="photo"
                  src={p.src}
                  alt={t(p.altNl, p.altEn)}
                  fill
                  sizes="(max-width:620px) 92vw, 360px"
                />
                <span className="sheen" aria-hidden="true" />
              </div>
              <figcaption>{t(p.capNl, p.capEn)}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
