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

export const metadata: Metadata = {
  title: "Provincie Barbershop — Provinciestraat 226, Antwerpen",
  description:
    "Provincie Barbershop op de Provinciestraat in Antwerpen. Eerlijk, betaalbaar en zonder gedoe. Knippen vanaf €15. Boek je afspraak online.",
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${display.variable} ${body.variable} ${mono.variable}`}>
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
