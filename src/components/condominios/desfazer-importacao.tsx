"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { formatarDataHora } from "@/lib/datas";
import {
  candidatosExclusaoEmLoteAction,
  excluirCondominiosEmLoteAction,
  type CandidatosExclusaoEmLote,
} from "@/lib/acoes/desfazer-importacao-condominios";

const FRASE_CONFIRMACAO = "EXCLUIR";

const ATALHOS = [
  { rotulo: "Últimos 15 min", minutos: 15 },
  { rotulo: "Última hora", minutos: 60 },
  { rotulo: "Últimas 3 horas", minutos: 180 },
  { rotulo: "Hoje", minutos: 24 * 60 },
] as const;

/** "2026-08-20T14:30" — formato que <input type="datetime-local"> aceita. */
function paraDatetimeLocal(data: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}T${pad(data.getHours())}:${pad(data.getMinutes())}`;
}

/**
 * Desfazer uma importação feita no lugar errado ou com o arquivo trocado.
 *
 * Não existe um botão "desfazer última ação" de verdade — o que existe é
 * "mostre tudo que foi criado depois deste instante, e deixe eu decidir".
 * Por isso a primeira coisa que a tela pede é a hora, não uma lista: a hora é
 * o que transforma "vários condomínios estranhos na lista" em "exatamente os
 * que entraram naquele import".
 */
export function DesfazerImportacaoCondominios() {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [desde, setDesde] = useState<string | null>(null);
  const [candidatos, setCandidatos] = useState<CandidatosExclusaoEmLote | null>(null);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [confirmacao, setConfirmacao] = useState("");
  const [resultado, setResultado] = useState<{
    excluidos: number;
    ignorados: { id: number; nome: string }[];
  } | null>(null);
  const [buscando, iniciarBusca] = useTransition();
  const [excluindo, iniciarExclusao] = useTransition();

  function buscar(desdeIso: string) {
    setDesde(desdeIso);
    setResultado(null);
    setConfirmacao("");
    iniciarBusca(async () => {
      const r = await candidatosExclusaoEmLoteAction(desdeIso);
      setCandidatos(r);
      setSelecionados(new Set(r.elegiveis.map((c) => c.id)));
    });
  }

  function alternarSelecao(id: number) {
    setSelecionados((atual) => {
      const copia = new Set(atual);
      if (copia.has(id)) copia.delete(id);
      else copia.add(id);
      return copia;
    });
  }

  function confirmarExclusao() {
    if (confirmacao.trim().toUpperCase() !== FRASE_CONFIRMACAO || selecionados.size === 0) {
      return;
    }
    iniciarExclusao(async () => {
      const r = await excluirCondominiosEmLoteAction([...selecionados]);
      setResultado(r);
      setCandidatos(null);
      setConfirmacao("");
      router.refresh();
    });
  }

  function recomecar() {
    setDesde(null);
    setCandidatos(null);
    setSelecionados(new Set());
    setConfirmacao("");
    setResultado(null);
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="text-xs underline"
        style={{ color: "var(--tinta-3)" }}
      >
        Importei o arquivo errado — desfazer uma importação
      </button>
    );
  }

  return (
    <div
      className="rounded-xl p-3"
      style={{
        border: "1px solid color-mix(in srgb, var(--status-critico) 35%, transparent)",
        background: "color-mix(in srgb, var(--status-critico) 4%, var(--superficie))",
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm">Desfazer importação</h3>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="text-xs underline"
          style={{ color: "var(--tinta-3)" }}
        >
          fechar
        </button>
      </div>

      <p className="text-xs mb-3" style={{ color: "var(--tinta-2)" }}>
        Escolha desde quando procurar. Só entram na exclusão em lote os
        condomínios criados nesse período que ainda não têm nenhum boletim,
        ocorrência, plano ou usuário vinculado — o resto fica de fora, para
        você decidir caso a caso.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {ATALHOS.map((a) => (
          <button
            key={a.rotulo}
            type="button"
            onClick={() => buscar(new Date(Date.now() - a.minutos * 60_000).toISOString())}
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              border: "1px solid var(--borda-forte)",
              background: "var(--superficie)",
              color: "var(--tinta-2)",
            }}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs" style={{ color: "var(--tinta-3)" }} htmlFor="desde-personalizado">
          ou escolha a hora exata:
        </label>
        <input
          id="desde-personalizado"
          type="datetime-local"
          className="campo"
          style={{ padding: "0.35rem 0.5rem", fontSize: "0.8125rem" }}
          defaultValue={paraDatetimeLocal(new Date(Date.now() - 60 * 60_000))}
          onChange={(e) => e.target.value && buscar(new Date(e.target.value).toISOString())}
        />
      </div>

      {buscando ? (
        <p className="text-sm" style={{ color: "var(--tinta-3)" }}>
          Procurando…
        </p>
      ) : null}

      {!buscando && desde && candidatos ? (
        <div>
          {candidatos.elegiveis.length === 0 &&
          candidatos.comDados.length === 0 &&
          candidatos.alterados.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--tinta-3)" }}>
              Nenhum condomínio criado ou alterado desde{" "}
              {formatarDataHora(new Date(desde))}.
            </p>
          ) : (
            <>
              {candidatos.elegiveis.length > 0 ? (
                <>
                  <p className="text-xs font-semibold mb-1">
                    {candidatos.elegiveis.length} condomínio(s) prontos para excluir
                  </p>
                  <div className="tabela-rolagem mb-3" style={{ maxHeight: "14rem" }}>
                    <table className="tabela">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Nome</th>
                          <th>Criado em</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidatos.elegiveis.map((c) => (
                          <tr key={c.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selecionados.has(c.id)}
                                onChange={() => alternarSelecao(c.id)}
                                aria-label={`Selecionar ${c.nome}`}
                              />
                            </td>
                            <td>
                              {c.nome}
                              {c.email ? (
                                <span
                                  className="block text-xs"
                                  style={{ color: "var(--tinta-3)" }}
                                >
                                  {c.email}
                                </span>
                              ) : null}
                            </td>
                            <td className="num text-xs">{formatarDataHora(c.criadoEm)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!resultado ? (
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
                          excluindo ||
                          selecionados.size === 0 ||
                          confirmacao.trim().toUpperCase() !== FRASE_CONFIRMACAO
                        }
                        className="botao botao-primario"
                        style={{
                          background: "var(--status-critico)",
                          borderColor: "var(--status-critico)",
                        }}
                      >
                        {excluindo
                          ? "Excluindo…"
                          : `Excluir ${selecionados.size} selecionado(s)`}
                      </button>
                    </div>
                  ) : null}
                </>
              ) : null}

              {candidatos.comDados.length > 0 ? (
                <div
                  className="rounded-lg p-2 mt-3 text-xs"
                  style={{
                    background: "color-mix(in srgb, var(--status-atencao) 10%, var(--superficie))",
                    border: "1px solid color-mix(in srgb, var(--status-atencao) 35%, transparent)",
                  }}
                >
                  <strong>
                    {candidatos.comDados.length} condomínio(s) criado(s) nesse período já
                    têm dado vinculado
                  </strong>{" "}
                  — não entram na exclusão em lote. Se algum for mesmo fantasma, revise e
                  exclua individualmente na lista acima:
                  <ul className="mt-1 space-y-0.5">
                    {candidatos.comDados.map((c) => (
                      <li key={c.id}>
                        {c.nome} — {c.boletins} boletim(ns), {c.ocorrencias} ocorrência(s),{" "}
                        {c.planos} plano(s), {c.acessos} usuário(s) vinculado(s)
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {candidatos.alterados.length > 0 ? (
                <div
                  className="rounded-lg p-2 mt-3 text-xs"
                  style={{
                    background: "color-mix(in srgb, var(--status-atencao) 10%, var(--superficie))",
                    border: "1px solid color-mix(in srgb, var(--status-atencao) 35%, transparent)",
                  }}
                >
                  <strong>
                    {candidatos.alterados.length} condomínio(s) já existente(s) foram
                    ALTERADOS nesse período
                  </strong>{" "}
                  (não criados agora — já existiam antes). Se um destes não devia ter sido
                  tocado, os valores antigos não ficam gravados em nenhum lugar — confira e
                  corrija manualmente pelo "editar", na lista acima:
                  <ul className="mt-1 space-y-0.5">
                    {candidatos.alterados.map((c) => (
                      <li key={c.id}>{c.nome}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}

      {resultado ? (
        <div className="mt-3">
          <p
            className="text-sm rounded-lg px-3 py-2 mb-2"
            style={{
              color: "var(--status-bom-texto)",
              background: "color-mix(in srgb, var(--status-bom) 10%, var(--superficie))",
              border: "1px solid color-mix(in srgb, var(--status-bom) 30%, transparent)",
            }}
          >
            {resultado.excluidos} condomínio(s) excluído(s).
          </p>
          {resultado.ignorados.length > 0 ? (
            <p className="text-xs mb-2" style={{ color: "var(--status-atencao)" }}>
              {resultado.ignorados.length} não foram excluídos por já terem recebido dado
              entre a prévia e a confirmação: {resultado.ignorados.map((i) => i.nome).join(", ")}.
            </p>
          ) : null}
          <button type="button" onClick={recomecar} className="botao botao-secundario">
            Procurar de novo
          </button>
        </div>
      ) : null}
    </div>
  );
}
