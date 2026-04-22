import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STROS – Interní systém",
  description: "Interní objednávkový systém pro STROS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
