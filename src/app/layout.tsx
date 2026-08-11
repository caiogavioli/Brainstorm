import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gestão de Condomínios — Boletim Informativo Diário",
  description:
    "Boletim diário, gestão de ocorrências, planos de ação e dashboard gerencial para múltiplos condomínios.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // Cor única: a barra do navegador acompanha o fundo claro do sistema mesmo
  // quando o aparelho está em modo escuro.
  themeColor: "#f9f9f7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
