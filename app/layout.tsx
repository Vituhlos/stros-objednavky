import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STROS interni system",
  description: "Interni objednavkovy system pro STROS",
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
