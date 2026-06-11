import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bolão Grileiros 2026",
  description:
    "Palpites da Seleção Brasileira na Copa 2026 — Grupo Grileiros.",
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
