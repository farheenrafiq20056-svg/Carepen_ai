import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarePen AI - Clinical Scribe & Triage Assistant for Pakistani Clinics",
  description:
    "AI-powered clinical intake and note generator for doctors in Pakistan, supporting English, Urdu, and Roman Urdu.",
  openGraph: {
    title: "CarePen AI",
    description:
      "AI-powered clinical intake and note generator for doctors in Pakistan, supporting English, Urdu, and Roman Urdu.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
