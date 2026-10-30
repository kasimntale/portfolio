import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { profile } from "@/content/portfolio";
import { siteUrl } from "@/lib/site";
import "./globals.css";
const display = localFont({
  src: "../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2",
  variable: "--font-display",
  display: "swap",
});
const sans = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ntale Kasim — Software Engineer & Open-Source Builder",
    template: "%s — Ntale Kasim",
  },
  description: profile.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ntale Kasim",
    title: "Ntale Kasim — Building with intention.",
    description: profile.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ntale Kasim — Software Engineer",
    description: profile.description,
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#171918" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
