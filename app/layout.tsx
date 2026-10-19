import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Celebra — Convites digitais especiais",
  description: "Crie convites digitais, compartilhe e acompanhe confirmações em um só lugar."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
