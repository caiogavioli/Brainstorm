"use client";

import { useState } from "react";

import { linkWhatsApp } from "@/lib/resumo-whatsapp";

/**
 * O boletim pronto para virar mensagem.
 *
 * Dois caminhos porque os dois falham em situações diferentes: o botão do
 * WhatsApp é o atalho, mas depende do app instalado e de o navegador deixar
 * abrir a aba; copiar funciona sempre e serve para colar em e-mail, Teams ou
 * onde mais for preciso. Por isso o texto fica visível e selecionável — nunca
 * escondido atrás de um botão só.
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

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <a
          href={linkWhatsApp(texto)}
          target="_blank"
          rel="noopener noreferrer"
          className="botao botao-primario flex-1 justify-center"
          style={{ background: "#25D366", borderColor: "#25D366", color: "#06301a" }}
        >
          Enviar no WhatsApp
        </a>
        <button
          type="button"
          onClick={copiar}
          className="botao botao-secundario flex-1"
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

      <p className="mt-2 text-xs" style={{ color: "var(--tinta-3)" }}>
        O botão abre o WhatsApp com a mensagem pronta — é só escolher o grupo.
      </p>
    </section>
  );
}
