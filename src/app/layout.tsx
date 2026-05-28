import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "DX 공장 ERP 기획안 및 개발 실습",
  description: "Next.js + TailwindCSS + AI 기반의 수기 공장 DX 사내시스템 구축을 위한 강의자료 및 실습 프로토타입",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${outfit.variable} dark`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%22 width=%22100%22 height=%22100%22><text y=%220.9em%22 font-size=%2290%22>🏢</text></svg>" />
      </head>
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
