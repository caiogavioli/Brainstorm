"use client";

import { useState } from "react";

/**
 * O boletim pronto para virar mensagem.
 *
 * Só copiar, sem link direto para o WhatsApp: o botão "abrir no WhatsApp"
 * (via wa.me) depende do app instalado, do navegador deixar abrir a aba e —
 * na prática — de detalhes de codificação fora do nosso controle que já
 * quebraram o texto para quem usa WhatsApp Web/Desktop sem fonte de emoji.
 * Copiar e colar manualmente é mais garantido: funciona em qualquer
 * navegador e serve tanto para WhatsApp quanto e-mail, Teams etc.
 */
export function ResumoWhatsApp({
  texto,
  titulo = "Resumo para o WhatsApp",
}: {
  texto: string;
  titulo?: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const [erroCopia, setErroCopia] = useState(false);

  async function copiar() {
    setErroCopia(false);
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // clipboard exige contexto seguro; sem ele, o usuário seleciona à mão.
      setErroCopia(true);
    }
  }

  return (
    <section
      className="card card-pad text-left sem-impressao"
      aria-label={titulo}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h2 className="font-semibold">{titulo}</h2>
        <span className="text-xs num" style={{ color: "var(--tinta-3)" }}>
          {texto.length} caracteres
        </span>
      </div>
      <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
        Mesmo formato do boletim que já circula no grupo. Os asteriscos viram
        negrito quando a mensagem é enviada.
      </p>

      <pre
        className="rounded-xl p-3 text-sm whitespace-pre-wrap break-words overflow-y-auto"
        style={{
          maxHeight: "22rem",
          background: "var(--superficie-2)",
          color: "var(--tinta)",
          fontFamily: "inherit",
          lineHeight: 1.5,
          userSelect: "text",
        }}
      >
        {texto}
      </pre>

      <div className="mt-3">
        <button
          type="button"
          onClick={copiar}
          className="botao botao-primario w-full justify-center"
          aria-live="polite"
        >
          {copiado ? "✓ Copiado" : "Copiar texto"}
        </button>
      </div>

      {erroCopia ? (
        <p className="mt-2 text-xs" style={{ color: "var(--status-critico-texto)" }}>
          Seu navegador não liberou a cópia automática. Selecione o texto acima e
          copie normalmente.
        </p>
      ) : null}

      <p
        className="mt-3 text-center text-base font-bold"
        style={{ color: "var(--serie-1)" }}
      >
        COPIE E COLE NO WHATSAPP
      </p>
    </section>
  );
}
