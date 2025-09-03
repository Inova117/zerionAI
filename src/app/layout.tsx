import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sintra AI LATAM - Asistentes IA para tu Negocio",
  description: "Automatiza tu negocio con 12 asistentes IA especializados. Marketing, ventas, soporte y más. Prueba gratis 14 días.",
  keywords: "IA, asistentes virtuales, automatización, marketing, ventas, soporte, chatbot, América Latina",
  authors: [{ name: "Sintra AI LATAM" }],
  openGraph: {
    title: "Sintra AI LATAM - Asistentes IA para tu Negocio",
    description: "Automatiza tu negocio con 12 asistentes IA especializados",
    url: "https://sintra-latam.com",
    siteName: "Sintra AI LATAM",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
