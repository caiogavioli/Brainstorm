"use client";

import { useEffect, useState } from "react";

/**
 * Recharts precisa de cores concretas (não aceita `var(--x)` em todos os
 * pontos), então resolvemos os tokens do design system no cliente.
 *
 * A leitura acontece uma vez: o sistema é claro sempre, então os valores não
 * mudam depois da montagem. Continua lendo do CSS, e não de constantes
 * duplicadas, para que mexer em `globals.css` continue sendo o único lugar
 * onde se muda uma cor.
 */
const TOKENS = [
  "superficie",
  "superficie-2",
  "tinta",
  "tinta-2",
  "tinta-3",
  "grade",
  "eixo",
  "serie-1",
  "serie-2",
  "ordinal-1",
  "ordinal-2",
  "ordinal-3",
  "status-critico",
] as const;

export type TokensViz = Record<(typeof TOKENS)[number], string>;

const PADRAO: TokensViz = {
  superficie: "#fcfcfb",
  "superficie-2": "#f2f2ee",
  tinta: "#0b0b0b",
  "tinta-2": "#52514e",
  "tinta-3": "#898781",
  grade: "#e1e0d9",
  eixo: "#c3c2b7",
  "serie-1": "#2a78d6",
  "serie-2": "#1baf7a",
  "ordinal-1": "#86b6ef",
  "ordinal-2": "#2a78d6",
  "ordinal-3": "#104281",
  "status-critico": "#d03b3b",
};

export function useTokensViz(): TokensViz {
  const [tokens, setTokens] = useState<TokensViz>(PADRAO);

  useEffect(() => {
    const estilo = getComputedStyle(document.documentElement);
    const lidos = { ...PADRAO };
    for (const nome of TOKENS) {
      const valor = estilo.getPropertyValue(`--${nome}`).trim();
      if (valor) lidos[nome] = valor;
    }
    setTokens(lidos);
  }, []);

  return tokens;
}
