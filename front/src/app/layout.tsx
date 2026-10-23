import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Noir Atelier — Perfumería de autor", template: "%s · Noir Atelier" },
  description:
    "Fragancias de autor concebidas en pequeños lotes. Amaderadas, cítricas, orientales, florales y acuáticas, con envío a todo el país.",
  openGraph: { type: "website", locale: "es_AR", siteName: "Noir Atelier" },
};

export const viewport: Viewport = { themeColor: "#faf7f2" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
