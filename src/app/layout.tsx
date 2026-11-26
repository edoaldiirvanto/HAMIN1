import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Looop — Connecting Waste, Creating Value",
  description: "Platform digital terintegrasi pengelolaan sampah dan ekonomi sirkular",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans bg-looop-bg text-looop-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
