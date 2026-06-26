"use client";

import { useState } from "react";
import { SERVICES, timeSlots, upcomingDays, dayKey, isClosed, type Service } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export function Booking() {
  const { t, lang, locale } = useLang();

  const [service, setService] = useState<string | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [dateObj, setDateObj] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  const svc = (id: string | null): Service | null => SERVICES.find((s) => s.id === id) ?? null;

  const fmtWhen = () => {
    if (!dateObj || !time) return "—";
    return (
      dateObj.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" }) + " · " + time
    );
  };

  const reset = () => {
    setService(null);
    setDateKey(null);
    setDateObj(null);
    setTime(null);
    setConfirmed(false);
    setStep(1);
  };

  const chosen = svc(service);
  const days = upcomingDays(7);
  const slots = timeSlots();
  const canContinue = !!(dateKey && time);

  const pill = (n: number) => {
    const done = confirmed || n < step;
    const active = !confirmed && n === step;
    return "step-pill" + (active ? " active" : "") + (done ? " done" : "");
  };

  return (
    <section className="section book" id="book">
      {/* secondary anchor so any lingering #services link still lands here */}
      <span id="services" aria-hidden="true" className="anchor-offset" />
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">{t("Boeken", "Book")}</span>
          <h2>{t("Kies je dienst en boek direct", "Pick your service and book right now")}</h2>
          <p className="book-intro">
            {t(
              "Geen verrassingen. Wat je ziet, betaal je. Kies wat je nodig hebt en een moment dat uitkomt.",
              "No surprises. What you see is what you pay. Pick what you need and a time that works.",
            )}
          </p>
        </div>

        {/* DEMO BOOKING: state lives in React only (no backend). Wire up a real
            calendar / booking backend before going live to actual customers. */}
        <div className="booking reveal" id="booking">
          <div className="stepper" aria-hidden="true">
            <div className={pill(1)}>
              <span className="num">1</span>
              <span className="step-label">{t("Dienst", "Service")}</span>
            </div>
            <div className={pill(2)}>
              <span className="num">2</span>
              <span className="step-label">{t("Dag & uur", "Day & time")}</span>
            </div>
            <div className={pill(3)}>
              <span className="num">3</span>
              <span className="step-label">{t("Bevestig", "Confirm")}</span>
            </div>
          </div>

          {/* STEP 1 */}
          {!confirmed && step === 1 && (
            <div className="panel panel-anim" role="group" aria-label={t("Stap 1: kies een dienst", "Step 1: choose a service")}>
              <h3>{t("Wat wordt het vandaag?", "What's it going to be?")}</h3>
              <p className="panel-hint">{t("Kies hieronder wat je zoekt.", "Pick what you're after below.")}</p>
              <div className="svc-opts">
                {SERVICES.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className={"svc-opt" + (service === s.id ? " selected" : "")}
                    aria-pressed={service === s.id}
                    onClick={() => {
                      setService(s.id);
                      setStep(2);
                    }}
                  >
                    <span className="svc-opt-name">{t(s.nl, s.en)}</span>
                    <span className="svc-opt-meta">
                      €{s.price} · ~{s.dur} min
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {!confirmed && step === 2 && (
            <div className="panel panel-anim" role="group" aria-label={t("Stap 2: kies dag en uur", "Step 2: choose day and time")}>
              <h3>{t("Wanneer past het jou?", "When works for you?")}</h3>
              <p className="panel-hint">
                {t(
                  "Open van dinsdag tot zaterdag. Grijze dagen zijn we toe.",
                  "Open Tuesday to Saturday. Greyed-out days the shop is closed.",
                )}
              </p>
              <div className="day-grid" role="group" aria-label={t("Dagen", "Days")}>
                {days.map((d) => {
                  const closed = isClosed(d);
                  const key = dayKey(d);
                  const long = d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
                  return (
                    <button
                      type="button"
                      key={key}
                      className={"day" + (closed ? " closed" : "") + (dateKey === key ? " selected" : "")}
                      disabled={closed}
                      aria-label={long + (closed ? (lang === "en" ? " — closed" : " — gesloten") : "")}
                      onClick={() => {
                        setDateKey(key);
                        setDateObj(d);
                        setTime(null);
                      }}
                    >
                      <span className="day-wd">{d.toLocaleDateString(locale, { weekday: "short" })}</span>
                      <span className="day-num">{d.getDate()}</span>
                      <span className="day-mo">{d.toLocaleDateString(locale, { month: "short" })}</span>
                    </button>
                  );
                })}
              </div>

              {dateKey && (
                <div className="time-wrap">
                  <span className="field-label">{t("Vrije momenten", "Open times")}</span>
                  <div className="time-grid" role="group" aria-label={t("Uren", "Times")}>
                    {slots.map((tm) => (
                      <button
                        type="button"
                        key={tm}
                        className={"slot" + (time === tm ? " selected" : "")}
                        aria-pressed={time === tm}
                        onClick={() => setTime(tm)}
                      >
                        {tm}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="panel-actions">
                <button className="btn btn-sm btn-line" onClick={() => setStep(1)}>
                  {t("Terug", "Back")}
                </button>
                <button className="btn btn-sm btn-dark" disabled={!canContinue} onClick={() => setStep(3)}>
                  {t("Verder", "Continue")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {!confirmed && step === 3 && (
            <div className="panel panel-anim" role="group" aria-label={t("Stap 3: bevestig", "Step 3: confirm")}>
              <h3>{t("Alles in orde?", "Does this look right?")}</h3>
              <p className="panel-hint">{t("Controleer even je keuze en bevestig.", "Have a quick look, then lock it in.")}</p>
              <div className="summary">
                <div className="summary-row">
                  <span className="k">{t("Dienst", "Service")}</span>
                  <span className="v">{chosen ? t(chosen.nl, chosen.en) : "—"}</span>
                </div>
                <div className="summary-row">
                  <span className="k">{t("Wanneer", "When")}</span>
                  <span className="v">{fmtWhen()}</span>
                </div>
                <div className="summary-row">
                  <span className="k">{t("Prijs", "Price")}</span>
                  <span className="v price">{chosen ? "€" + chosen.price : "—"}</span>
                </div>
              </div>
              <div className="panel-actions">
                <button className="btn btn-sm btn-line" onClick={() => setStep(2)}>
                  {t("Terug", "Back")}
                </button>
                <button className="btn btn-sm btn-primary" onClick={() => setConfirmed(true)}>
                  {t("Bevestig afspraak", "Confirm booking")}
                </button>
              </div>
              <p className="book-note">{t("Demo. Er wordt nog niks vastgelegd, dus bel of app voor een echte afspraak.", "Demo only. Nothing's booked yet, so call or message to reserve your spot.")}</p>
            </div>
          )}

          {/* CONFIRMATION */}
          {confirmed && (
            <div className="panel done panel-anim" role="group" aria-label={t("Bevestiging", "Confirmation")}>
              <div className="check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3>{t("Tot snel bij Jamal!", "See you soon!")}</h3>
              <p>
                {t(
                  "Afspraak gemaakt. De stoel staat voor je klaar.",
                  "You're booked in. The chair's waiting.",
                )}
              </p>
              <div className="done-card">
                <div className="summary-row">
                  <span className="k">{t("Dienst", "Service")}</span>
                  <span className="v">{chosen ? t(chosen.nl, chosen.en) : "—"}</span>
                </div>
                <div className="summary-row">
                  <span className="k">{t("Wanneer", "When")}</span>
                  <span className="v">{fmtWhen()}</span>
                </div>
                <div className="summary-row">
                  <span className="k">{t("Prijs", "Price")}</span>
                  <span className="v price">{chosen ? "€" + chosen.price : "—"}</span>
                </div>
              </div>
              <div style={{ marginTop: 28 }}>
                <button className="btn btn-sm btn-line" onClick={reset}>
                  {t("Nieuwe afspraak", "Book another")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
