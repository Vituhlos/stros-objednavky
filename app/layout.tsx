import type { Metadata, Viewport } from "next";
import "./globals.css";
import SwRegister from "./components/SwRegister";

export const metadata: Metadata = {
  title: "Objednávky",
  description: "Objednávkový systém obědů a pizzy",
  appleWebApp: {
    capable: true,
    title: "Objednávky",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ea580c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
