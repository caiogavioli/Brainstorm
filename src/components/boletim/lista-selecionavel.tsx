"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { StatusGeralDia } from "@prisma/client";

import { formatarDataReferencia, formatarDataHora } from "@/lib/datas";
import { STATUS_DIA_CLASSE, STATUS_DIA_LABEL } from "@/lib/labels";
import { excluirBoletinsEmLoteAction } from "@/lib/acoes/boletim";

const FRASE_CONFIRMACAO = "EXCLUIR";

export type BoletimLista = {
  id: number;
  dataReferencia: string;
  condominioNome: string;
  statusGeral: StatusGeralDia;
  houveFaltas: boolean;
  qtdeFaltas: number;
  setoresFaltas: string | null;
  preenchidoPor: string | null;
  criadoPorNome: string | null;
  dataRegistro: Date;
  ocorrencias: number;
  recorrencias: number;
};

/**
 * Lista de boletins com seleção múltipla, para quem precisa apagar vários de
 * uma vez — um mês inteiro lançado por engano no condomínio errado, por
 * exemplo. Sem `podeExcluir` (quem não é admin), fica exatamente como antes:
 * cartões e tabela sem nenhuma caixa de seleção.
 */
export function ListaBoletins({
  boletins,
  podeExcluir,
}: {
  boletins: BoletimLista[];
  podeExcluir: boolean;
}) {
  const router = useRouter();
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [confirmando, setConfirmando] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");
  const [excluindo, iniciarExclusao] = useTransition();

  // A lista muda de baixo dos pés quando o filtro muda ou depois de excluir —
  // nos dois casos, uma seleção antiga apontando para linhas que já não estão
  // na tela é mais confusa do que útil.
  const assinatura = boletins.map((b) => b.id).join(",");
  useEffect(() => {
    setSelecionados(new Set());
    setConfirmando(false);
    setConfirmacao("");
  }, [assinatura]);

  function alternar(id: number) {
    setSelecionados((atual) => {
      const copia = new Set(atual);
      if (copia.has(id)) copia.delete(id);
      else copia.add(id);
      return copia;
    });
  }

  function alternarTodos() {
    setSelecionados((atual) =>
      atual.size === boletins.length ? new Set() : new Set(boletins.map((b) => b.id)),
    );
  }

  function confirmarExclusao() {
    if (confirmacao.trim().toUpperCase() !== FRASE_CONFIRMACAO || selecionados.size === 0) {
      return;
    }
    iniciarExclusao(async () => {
      await excluirBoletinsEmLoteAction([...selecionados]);
      router.refresh();
    });
  }

  const selecao = boletins.filter((b) => selecionados.has(b.id));
  const totalOcorrencias = selecao.reduce((s, b) => s + b.ocorrencias, 0);
  const totalRecorrencias = selecao.reduce((s, b) => s + b.recorrencias, 0);

  return (
    <>
      {/* Cartões no celular */}
      <ul className="space-y-2 md:hidden">
        {boletins.map((b) => (
          <li key={b.id} className="flex items-stretch gap-2">
            {podeExcluir ? (
              <label
                className="flex-none flex items-center px-1"
                aria-label={`Selecionar boletim de ${formatarDataReferencia(b.dataReferencia)} — ${b.condominioNome}`}
              >
                <input
                  type="checkbox"
                  checked={selecionados.has(b.id)}
                  onChange={() => alternar(b.id)}
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
              </label>
            ) : null}
            <Link href={`/boletim/${b.id}`} className="card card-pad block flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{b.condominioNome}</div>
                  <div className="text-xs num" style={{ color: "var(--tinta-3)" }}>
                    {formatarDataReferencia(b.dataReferencia)}
                  </div>
                </div>
                <span className={STATUS_DIA_CLASSE[b.statusGeral]}>
                  {STATUS_DIA_LABEL[b.statusGeral]}
                </span>
              </div>
              <div className="flex gap-4 text-xs" style={{ color: "var(--tinta-2)" }}>
                <span className="num">{b.ocorrencias} ocorrência(s)</span>
                <span>{b.houveFaltas ? `Faltas: ${b.setoresFaltas}` : "Sem faltas"}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Tabela no desktop */}
      <div className="card hidden md:block">
        <div className="tabela-rolagem">
          <table className="tabela">
            <thead>
              <tr>
                {podeExcluir ? (
                  <th>
                    <input
                      type="checkbox"
                      checked={selecionados.size === boletins.length && boletins.length > 0}
                      onChange={alternarTodos}
                      aria-label="Selecionar todos os boletins da lista"
                    />
                  </th>
                ) : null}
                <th>Data</th>
                <th>Condomínio</th>
                <th>Status do dia</th>
                <th>Ocorrências</th>
                <th>Faltas</th>
                <th>Registrado por</th>
                <th>Enviado em</th>
              </tr>
            </thead>
            <tbody>
              {boletins.map((b) => (
                <tr key={b.id}>
                  {podeExcluir ? (
                    <td>
                      <input
                        type="checkbox"
                        checked={selecionados.has(b.id)}
                        onChange={() => alternar(b.id)}
                        aria-label={`Selecionar boletim de ${formatarDataReferencia(b.dataReferencia)} — ${b.condominioNome}`}
                      />
                    </td>
                  ) : null}
                  <td className="num">
                    <Link
                      href={`/boletim/${b.id}`}
                      className="font-semibold"
                      style={{ color: "var(--serie-1)" }}
                    >
                      {formatarDataReferencia(b.dataReferencia)}
                    </Link>
                  </td>
                  <td>{b.condominioNome}</td>
                  <td>
                    <span className={STATUS_DIA_CLASSE[b.statusGeral]}>
                      {STATUS_DIA_LABEL[b.statusGeral]}
                    </span>
                  </td>
                  <td className="num">{b.ocorrencias}</td>
                  <td>
                    {b.houveFaltas ? (
                      <span>
                        {b.qtdeFaltas > 0 ? `${b.qtdeFaltas} — ` : ""}
                        {b.setoresFaltas}
                      </span>
                    ) : (
                      <span style={{ color: "var(--tinta-3)" }}>Não</span>
                    )}
                  </td>
                  <td>{b.preenchidoPor ?? b.criadoPorNome ?? "—"}</td>
                  <td className="num">{formatarDataHora(b.dataRegistro)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barra de seleção — só existe enquanto há algo selecionado, presa ao
          rodapé para acompanhar a rolagem de listas longas. Fica acima da
          navegação inferior do celular, que também é fixa. */}
      {podeExcluir && selecionados.size > 0 ? (
        <div
          className="fixed left-0 right-0 z-40 px-3 sem-impressao"
          style={{ bottom: "calc(4.25rem + env(safe-area-inset-bottom))" }}
        >
          <div
            className="mx-auto max-w-3xl rounded-xl p-3"
            style={{
              background: "var(--superficie)",
              border: "1px solid var(--borda-forte)",
              boxShadow: "var(--sombra)",
            }}
          >
            {!confirmando ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold num">
                  {selecionados.size} boletim(ns) selecionado(s)
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelecionados(new Set())}
                    className="botao botao-secundario"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmando(true)}
                    className="botao botao-perigo"
                  >
                    Excluir selecionados
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold mb-2">
                  Excluir {selecionados.size} boletim(ns)?
                </p>
                <ul className="text-sm mb-3 space-y-0.5" style={{ color: "var(--tinta-2)" }}>
                  <li>Todas as respostas do checklist de cada dia são apagadas.</li>
                  {totalOcorrencias > 0 ? (
                    <li className="num">
                      {totalOcorrencias} ocorrência(s) aberta(s) por eles também são
                      apagadas.
                    </li>
                  ) : null}
                  {totalRecorrencias > 0 ? (
                    <li className="num">
                      {totalRecorrencias} marca(s) de reincidência em ocorrências de
                      outros dias somem, mas as ocorrências continuam abertas.
                    </li>
                  ) : null}
                </ul>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    className="campo"
                    style={{ maxWidth: "10rem" }}
                    placeholder={`Digite ${FRASE_CONFIRMACAO}`}
                    value={confirmacao}
                    onChange={(e) => setConfirmacao(e.target.value)}
                    aria-label={`Digite ${FRASE_CONFIRMACAO} para confirmar`}
                  />
                  <button
                    type="button"
                    onClick={confirmarExclusao}
                    disabled={
                      excluindo || confirmacao.trim().toUpperCase() !== FRASE_CONFIRMACAO
                    }
                    className="botao botao-perigo"
                  >
                    {excluindo ? "Excluindo…" : "Excluir definitivamente"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmando(false)}
                    className="botao botao-secundario"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
