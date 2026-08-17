"use client";

import type { ResultadoAcao } from "@/lib/acoes/boletim";

/**
 * Retorno de uma Server Action mostrado como mensagem de sucesso ou de erro.
 *
 * `role="status"` faz o leitor de tela anunciar o resultado sem roubar o foco
 * de quem está no formulário — o texto aparece logo abaixo do campo, e quem
 * navega por teclado continua de onde estava.
 */
export function Aviso({
  estado,
  className = "",
}: {
  estado: ResultadoAcao | null;
  className?: string;
}) {
  if (!estado) return null;

  const cor = estado.ok ? "var(--status-bom)" : "var(--status-critico)";
  const texto = estado.ok ? "var(--status-bom-texto)" : "var(--status-critico-texto)";

  return (
    <p
      role="status"
      className={`text-sm rounded-lg px-3 py-2 ${className}`}
      style={{
        color: texto,
        background: `color-mix(in srgb, ${cor} 10%, var(--superficie))`,
        border: `1px solid color-mix(in srgb, ${cor} 30%, transparent)`,
      }}
    >
      {estado.ok ? estado.mensagem : estado.erro}
    </p>
  );
}
