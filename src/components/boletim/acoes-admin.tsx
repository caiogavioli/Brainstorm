"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { excluirBoletimAction } from "@/lib/acoes/boletim";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

/**
 * Exclusão de um boletim, pelo admin, a partir da própria página do boletim.
 *
 * O texto lista o que sai junto porque a exclusão leva as ocorrências que este
 * boletim abriu — quem só quer arrumar uma resposta errada deve usar "Corrigir".
 */
export function ExcluirBoletim({
  id,
  ocorrencias,
  reincidencias,
}: {
  id: number;
  /** Ocorrências abertas por este boletim — somem junto. */
  ocorrencias: number;
  /** Ocorrências de outros dias em que este boletim só marcou reincidência. */
  reincidencias: number;
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [estado, setEstado] = useState<ResultadoAcao | null>(null);
  const [processando, iniciar] = useTransition();

  return (
    <div className="sem-impressao">
      <button
        type="button"
        onClick={() => {
          setAberto((v) => !v);
          setEstado(null);
        }}
        className="botao botao-secundario"
        style={{ color: "var(--status-critico-texto)" }}
        aria-expanded={aberto}
      >
        {aberto ? "Cancelar" : "Excluir"}
      </button>

      {aberto ? (
        <div
          className="mt-3 rounded-xl p-3 text-left"
          style={{
            width: "min(24rem, 90vw)",
            background: "color-mix(in srgb, var(--status-critico) 6%, var(--superficie))",
            border: "1px solid color-mix(in srgb, var(--status-critico) 35%, transparent)",
          }}
        >
          <p className="text-sm font-semibold mb-2">Excluir este boletim?</p>
          <ul className="text-sm mb-3 space-y-0.5" style={{ color: "var(--tinta-2)" }}>
            <li>Todas as respostas do checklist do dia são apagadas.</li>
            {ocorrencias > 0 ? (
              <li className="num">
                {ocorrencias} ocorrência(s) aberta(s) por ele também são apagadas.
              </li>
            ) : null}
            {reincidencias > 0 ? (
              <li className="num">
                {reincidencias} ocorrência(s) de outros dias perdem a marca de
                reincidência deste boletim, mas continuam abertas.
              </li>
            ) : null}
          </ul>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-2)" }}>
            Se a ideia é só arrumar uma resposta, use <strong>Corrigir</strong> — o
            boletim é regravado sem perder o dia.
          </p>

          {estado && !estado.ok ? (
            <p
              role="alert"
              className="text-sm rounded-lg px-3 py-2 mb-3"
              style={{
                color: "var(--status-critico-texto)",
                background:
                  "color-mix(in srgb, var(--status-critico) 10%, var(--superficie))",
                border:
                  "1px solid color-mix(in srgb, var(--status-critico) 30%, transparent)",
              }}
            >
              {estado.erro}
            </p>
          ) : null}

          <button
            type="button"
            disabled={processando}
            onClick={() =>
              iniciar(async () => {
                const r = await excluirBoletimAction(id);
                setEstado(r);
                if (r.ok) {
                  router.push("/boletim");
                  router.refresh();
                }
              })
            }
            className="botao botao-perigo w-full"
          >
            {processando ? "Excluindo…" : "Excluir definitivamente"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
