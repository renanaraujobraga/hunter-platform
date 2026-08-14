import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hunter AI",
  description: "Inteligência de viagens",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
