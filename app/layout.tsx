import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALIVOS | Cursos de Estimulación Temprana",
  description:
    "Plataforma educativa de ALIVOS Medicina de Rehabilitación. Cursos de estimulación temprana y rehabilitación pediátrica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
