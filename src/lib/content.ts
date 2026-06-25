/**
 * All structured content — carried over verbatim from the original index.html.
 * Invent nothing here: prices, durations, reviews, hours, address, phone are exact.
 */

export type Service = { id: string; en: string; nl: string; price: number; dur: number };

export const SERVICES: Service[] = [
  { id: "cut", en: "Haircut", nl: "Knipbeurt", price: 15, dur: 20 },
  { id: "cutwash", en: "Haircut + wash", nl: "Knippen + wassen", price: 16, dur: 25 },
  { id: "kids", en: "Kids haircut", nl: "Kinderknipbeurt", price: 12, dur: 20 },
  { id: "beard", en: "Beard trim", nl: "Baard bijwerken", price: 8, dur: 15 },
  { id: "color", en: "Hair colour", nl: "Haarkleuring", price: 20, dur: 45 },
];

/** REAL Google reviews (4.7★ · 30 reviews) — positive ones only, customers' own words, verbatim. */
export type Review = { stars: number; text: string; name: string };

export const REVIEWS: Review[] = [
  {
    stars: 5,
    text: "“Always top-notch service with Jamal! Great haircuts, an eye for detail, and a super friendly atmosphere. He knows exactly what you need. Definitely recommended!”",
    name: "Nasser",
  },
  {
    stars: 5,
    text: "“We discussed my husbands hair and what Jamal suggested for his balding hair. Jamal did a great job making my husband look and feel great in the new look. 15 euros well spent! Please check out this local shop!”",
    name: "Anna",
  },
  {
    stars: 5,
    text: "“Cheap and good. I've been going for years on my own, but also with children. It's no problem if you want to cut a child's hair under a year old.”",
    name: "Dariusz",
  },
  { stars: 5, text: "“The Best from the City of Antwerp.”", name: "Stephan" },
  { stars: 5, text: "“Good Barbershop 🍻”", name: "Jeffrey" },
];

export const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/TDx3i4UBPoSX87S97";

/** Hours — PLACEHOLDER: confirm real opening hours with Jamal. Tue–Sat 10:00–19:00. */
export type HoursRow = { dow: number; nl: string; en: string; closed?: boolean; time?: string };

export const HOURS: HoursRow[] = [
  { dow: 1, nl: "Maandag", en: "Monday", closed: true },
  { dow: 2, nl: "Dinsdag", en: "Tuesday", time: "10:00 – 19:00" },
  { dow: 3, nl: "Woensdag", en: "Wednesday", time: "10:00 – 19:00" },
  { dow: 4, nl: "Donderdag", en: "Thursday", time: "10:00 – 19:00" },
  { dow: 5, nl: "Vrijdag", en: "Friday", time: "10:00 – 19:00" },
  { dow: 6, nl: "Zaterdag", en: "Saturday", time: "10:00 – 19:00" },
  { dow: 0, nl: "Zondag", en: "Sunday", closed: true },
];

export const TODAY_LABEL = { nl: "vandaag", en: "today" } as const;

export const CONTACT = {
  name: "Provincie Barbershop",
  street: "Provinciestraat 226",
  city: "2018 Antwerpen, België",
  phoneDisplay: "+32 488 58 29 80",
  phoneHref: "tel:+32488582980",
  instagram: "@provinciebarbershop",
  instagramHref: "#", // PLACEHOLDER: replace with the real Instagram profile URL
  mapSrc:
    "https://www.google.com/maps?q=Provinciestraat%20226,%202018%20Antwerpen,%20Belgium&z=16&output=embed",
};

export const NAV = [
  { id: "home", nl: "Home", en: "Home" },
  { id: "book", nl: "Boeken", en: "Book" },
  { id: "reviews", nl: "Reviews", en: "Reviews" },
  { id: "story", nl: "Verhaal", en: "Story" },
  { id: "hours", nl: "Uren", en: "Hours" },
];

/** Booking time slots: 10:00 → 18:30 every 30 min. */
export function timeSlots(): string[] {
  const out: string[] = [];
  for (let mins = 600; mins <= 1110; mins += 30) {
    out.push(
      String(Math.floor(mins / 60)).padStart(2, "0") + ":" + String(mins % 60).padStart(2, "0"),
    );
  }
  return out;
}

export function upcomingDays(count: number): Date[] {
  const arr: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    arr.push(d);
  }
  return arr;
}

export function dayKey(d: Date): string {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

/** Sun (0) & Mon (1) closed. */
export function isClosed(d: Date): boolean {
  const w = d.getDay();
  return w === 0 || w === 1;
}
