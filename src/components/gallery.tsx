"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";

export function Gallery() {
  const { t } = useLang();

  // responsive card sizing so the fan never overwhelms small screens
  const [dims, setDims] = useState({ w: 440, h: 308 });
  useEffect(() => {
    const calc = () => {
      const w = Math.min(440, Math.max(244, window.innerWidth - 72));
      setDims({ w, h: Math.round(w * 0.7) });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const items: CardStackItem[] = [
    {
      id: "interior",
      title: t("In de zaak", "Inside the shop"),
      description: t("De vertrouwde stoel op de Provinciestraat.", "The trusted chair on Provinciestraat."),
      imageSrc: "/photos/shop-interior.jpg",
    },
    {
      id: "fade",
      title: t("Verse fade", "Fresh fade"),
      description: t("Strak afgewerkt, tot in de details.", "Sharp finish, down to the detail."),
      imageSrc: "/photos/gallery-fade.jpg",
    },
    {
      id: "cut1",
      title: t("Vakwerk", "Craftsmanship"),
      description: t("Jaren ervaring in elke knipbeurt.", "Years of experience in every cut."),
      imageSrc: "/photos/shop-cut-1.jpg",
    },
    {
      id: "kids",
      title: t("Kids Cut", "Kids Cut"),
      description: t("Geduldig, ook voor de allerkleinsten.", "Patient, even with the little ones."),
      imageSrc: "/photos/gallery-kids.jpg",
    },
    {
      id: "cut2",
      title: t("Klaar voor de spiegel", "Ready for the mirror"),
      description: t("Buitenkomen met een goed gevoel.", "Walk out feeling sharp."),
      imageSrc: "/photos/shop-cut-2.jpg",
    },
  ];

  return (
    <section className="section gallery" id="gallery">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">{t("In de zaak", "Inside")}</span>
          <h2>{t("Een blik binnen", "A look inside")}</h2>
          <p className="svc-intro">
            {t(
              "Sleep door de stapel of laat ze vanzelf draaien — een blik op het werk en de zaak.",
              "Drag through the stack or let it turn on its own — a glimpse of the work and the shop.",
            )}
          </p>
        </div>
      </div>

      <div className="gallery-stage reveal">
        <CardStack
          items={items}
          initialIndex={2}
          maxVisible={5}
          cardWidth={dims.w}
          cardHeight={dims.h}
          overlap={0.5}
          spreadDeg={42}
          activeLiftPx={24}
          autoAdvance
          intervalMs={3200}
          pauseOnHover
          showDots
        />
      </div>
    </section>
  );
}
