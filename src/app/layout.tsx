import type { Metadata, Viewport } from "next";
import { Fraunces, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { Cursor } from "@/components/cursor";
import { ScrollReveal } from "@/components/scroll-reveal";

const display = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const body = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

const SITE_URL = "https://jamal-ram-personal-terminal.vercel.app";
const SITE_TITLE = "Provincie Barbershop — Provinciestraat 226, Antwerpen";
const SITE_DESC =
  "Provincie Barbershop op de Provinciestraat in Antwerpen. Eerlijk, betaalbaar en zonder gedoe. Knippen vanaf €15. Boek je afspraak online.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  alternates: { canonical: "/" },
  // The site ships its own NL/EN toggle, so machine-translation only mangles it
  // (Chrome was auto-translating the Dutch page into a half-finished English).
  // Tell Google/Chrome not to offer or apply translation — our toggle is authoritative.
  other: { google: "notranslate" },
  openGraph: {
    type: "website",
    locale: "nl_BE",
    alternateLocale: "en_GB",
    url: SITE_URL,
    siteName: "Provincie Barbershop",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [
      {
        url: "/images/barber-provincie-hero-desktop.png",
        width: 1200,
        height: 630,
        alt: "Provincie Barbershop, Provinciestraat 226, Antwerpen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/images/barber-provincie-hero-desktop.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" translate="no" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        {/* enable the .js-gated reveal/headline hidden states before first paint */}
        <script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.classList.add('js')}catch(e){}" }} />
        <LanguageProvider>{children}</LanguageProvider>
        <Cursor />
        <ScrollReveal />
      </body>
    </html>
  );
}
