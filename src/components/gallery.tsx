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
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const vw = window.innerWidth;
      // mobile: smaller cards + more side margin so the fan fits the screen
      const w = mobile
        ? Math.min(296, Math.max(208, vw - 116))
        : Math.min(440, Math.max(244, vw - 72));
      setDims((prev) => {
        const h = Math.round(w * (mobile ? 0.66 : 0.7));
        return prev.w === w && prev.h === h ? prev : { w, h };
      });
    };
    calc();
    // debounce: mobile address-bar show/hide fires many resize events during
    // scroll — without this, each one re-renders the CardStack mid-scroll.
    let tid: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(calc, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const items: CardStackItem[] = [
    {
      id: "interior",
      title: t("In de zaak", "Inside the shop"),
      description: t("Thuis op de Provinciestraat, al jaren.", "Home on Provinciestraat, for years."),
      imageSrc: "/photos/shop-interior.jpg",
    },
    {
      id: "fade",
      title: t("Verse fade", "Fresh fade"),
      description: t("Strak, clean en tot in de puntjes.", "Clean lines, sharp finish."),
      imageSrc: "/photos/gallery-fade.jpg",
    },
    {
      id: "cut1",
      title: t("Vakwerk", "The craft"),
      description: t("Elke knipbeurt met de tijd en aandacht die ze verdient.", "Every cut gets the time and attention it deserves."),
      imageSrc: "/photos/shop-cut-1.jpg",
    },
    {
      id: "kids",
      title: t("Kids Cut", "Kids Cut"),
      description: t("Geduldig en rustig, ook voor de allerkleinsten.", "Calm and patient, even with the little ones."),
      imageSrc: "/photos/gallery-kids.jpg",
    },
    {
      id: "cut2",
      title: t("Klaar voor de spiegel", "Ready for the mirror"),
      description: t("Naar buiten met een goed gevoel — dat is het idee.", "Walk out feeling like yourself, only better."),
      imageSrc: "/photos/shop-cut-2.jpg",
    },
  ];

  return (
    <section className="section gallery" id="gallery">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">{t("De zaak", "The shop")}</span>
          <h2>{t("Een kijkje in de zaak", "A look at what we get up to")}</h2>
          <p className="svc-intro">
            {t(
              "Sleep door de stapel of laat ze vanzelf draaien — een eerlijke blik op de zaak en het werk.",
              "Drag through the stack or let it spin — a straight look at the shop and the work we do.",
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
