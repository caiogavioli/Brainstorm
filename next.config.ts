import type { NextConfig } from "next";

// A saída "standalone" existe para a imagem Docker: ela empacota o servidor e
// só as dependências que ele carrega, permitindo `node server.js` sem instalar
// nada no destino.
//
// Fora do Docker ela fica desligada de propósito. Plataformas como Render,
// Netlify e Koyeb montam o próprio empacotamento a partir do build padrão, e
// forçar "standalone" ali só acrescenta uma variável a mais para dar errado.
// O Dockerfile define DOCKER_BUILD=1 no estágio de build.
const empacotarParaDocker = process.env.DOCKER_BUILD === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(empacotarParaDocker ? { output: "standalone" as const } : {}),
};

export default nextConfig;
