import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { APP_SUBTITLE, APP_TITLE } from "@/lib/theme";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: APP_TITLE,
  description: `Palpites da Seleção Brasileira na Copa 2026 — ${APP_SUBTITLE}.`,
  openGraph: {
    title: APP_TITLE,
    description: `Palpites da Seleção Brasileira na Copa 2026 — ${APP_SUBTITLE}.`,
    siteName: APP_TITLE,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: `Palpites da Seleção Brasileira na Copa 2026 — ${APP_SUBTITLE}.`,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Grileiros 2026",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c0a09",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`}>
      <body className="min-h-dvh bg-stone-950 font-sans text-base text-amber-100 antialiased">
        {children}
      </body>
    </html>
  );
}
