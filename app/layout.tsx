import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bolão Copa 2026 — Seleção Brasileira",
  description:
    "Palpites dos jogos do Brasil na Copa do Mundo 2026. Bolão entre amigos.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bolão 2026",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#064e3b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-gray-50 font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
