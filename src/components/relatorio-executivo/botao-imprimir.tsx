"use client";

export function BotaoImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="botao botao-secundario sem-impressao"
    >
      Gerar relatório (PDF)
    </button>
  );
}
