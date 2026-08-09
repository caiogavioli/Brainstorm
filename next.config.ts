import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Empacota apenas o necessário para rodar, o que mantém a imagem Docker
  // pequena e permite `node server.js` sem instalar dependências no destino.
  output: "standalone",
};

export default nextConfig;
