"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { excluirOrcamentoAction } from "@/lib/acoes/orcamentos";
import type { ResultadoAcao } from "@/lib/acoes/boletim";
import { Aviso } from "@/components/aviso";

/**
 * Ações do orçamento: PDF, impressão, edição e exclusão.
 *
 * Editar e excluir só existem enquanto o orçamento é rascunho. Depois de
 * enviado, o cliente tem um PDF e um link nas mãos — mudar os valores por baixo
 * faria esta tela dizer uma coisa e o e-mail dele outra, e a divergência só
 * apareceria na hora de cobrar.
 */
export function AcoesOrcamento({
  id,
  numero,
  rascunho,
  link,
}: {
  id: number;
  numero: string;
  rascunho: boolean;
  link: string | null;
}) {
  const router = useRouter();
  const [estado, setEstado] = useState<ResultadoAcao | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [processando, iniciar] = useTransition();
  const [copiado, setCopiado] = useState(false);

  return (
    <section className="card card-pad">
      <h2 className="font-semibold mb-3">Ações</h2>

      <div className="space-y-2">
        <a
          href={`/orcamentos/${id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="botao botao-primario w-full"
        >
          Ver PDF
        </a>

        <Link href={`/orcamentos/${id}/imprimir`} className="botao botao-secundario w-full">
          Versão para impressão
        </Link>

        {rascunho ? (
          <Link href={`/orcamentos/${id}/editar`} className="botao botao-secundario w-full">
            Editar
          </Link>
        ) : null}
      </div>

      {link ? (
        <div className="mt-3">
          <div className="titulo-secao mb-1">Link do cliente</div>
          <p
            className="text-xs break-all rounded-lg px-2 py-1.5"
            style={{ background: "var(--superficie-2)", color: "var(--tinta-2)" }}
          >
            {link}
          </p>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(link).then(() => {
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
              });
            }}
            className="text-xs font-semibold underline mt-1"
            style={{ color: "var(--serie-1)" }}
          >
            {copiado ? "Copiado!" : "Copiar link"}
          </button>
        </div>
      ) : null}

      {rascunho ? (
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--borda)" }}>
          {confirmando ? (
            <div>
              <p className="text-sm mb-2">Excluir o orçamento {numero}?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={processando}
                  onClick={() =>
                    iniciar(async () => {
                      const r = await excluirOrcamentoAction(id);
                      setEstado(r);
                      if (r.ok) router.push("/orcamentos");
                    })
                  }
                  className="botao botao-perigo flex-1"
                >
                  {processando ? "Excluindo…" : "Sim, excluir"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="botao botao-secundario"
                >
                  Não
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="text-xs font-semibold underline"
              style={{ color: "var(--status-critico-texto)" }}
            >
              Excluir rascunho
            </button>
          )}
        </div>
      ) : null}

      <Aviso estado={estado} className="mt-3" />
    </section>
  );
}
