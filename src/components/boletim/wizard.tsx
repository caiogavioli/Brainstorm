"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SituacaoItem, StatusGeralDia } from "@prisma/client";

import { GRUPOS } from "@/lib/checklist";
import { STATUS_DIA_LABEL } from "@/lib/labels";
import { formatarDataReferencia } from "@/lib/datas";
import { salvarBoletimAction } from "@/lib/acoes/boletim";

type ItemChecklist = {
  id: number;
  codigo: string;
  nome: string;
  grupo: string;
};

type Condominio = { id: number; nome: string };

type Resposta = {
  situacao: SituacaoItem;
  observacao: string;
};

const SITUACOES: { valor: SituacaoItem; rotulo: string; curto: string }[] = [
  { valor: "CONFORME", rotulo: "Conforme", curto: "OK" },
  { valor: "NAO_CONFORME", rotulo: "Não Conforme", curto: "Falha" },
  { valor: "NAO_APLICAVEL", rotulo: "N/A", curto: "N/A" },
];

export function WizardBoletim({
  condominios,
  itens,
  dataInicial,
  condominioInicial,
  boletimExistente,
}: {
  condominios: Condominio[];
  itens: ItemChecklist[];
  dataInicial: string;
  condominioInicial: number | null;
  /** Datas que já possuem boletim, por condomínio — para avisar de substituição. */
  boletimExistente: Record<number, string[]>;
}) {
  const router = useRouter();
  const [enviando, iniciarEnvio] = useTransition();

  const [etapa, setEtapa] = useState(0);
  const [condominioId, setCondominioId] = useState<number>(
    condominioInicial ?? condominios[0]?.id ?? 0,
  );
  const [dataReferencia, setDataReferencia] = useState(dataInicial);
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  // Todos os itens começam "Conforme": o gestor só interage onde há falha.
  const [respostas, setRespostas] = useState<Record<number, Resposta>>(() =>
    Object.fromEntries(
      itens.map((i) => [
        i.id,
        { situacao: "CONFORME" as SituacaoItem, observacao: "" },
      ]),
    ),
  );

  const itensPorGrupo = useMemo(() => {
    const mapa = new Map<string, ItemChecklist[]>();
    for (const grupo of GRUPOS) mapa.set(grupo.codigo, []);
    for (const item of itens) mapa.get(item.grupo)?.push(item);
    return mapa;
  }, [itens]);

  const naoConformes = useMemo(
    () =>
      itens.filter((i) => respostas[i.id]?.situacao === "NAO_CONFORME"),
    [itens, respostas],
  );

  // O status do dia é sugerido pelo checklist, mas o gestor pode sobrepor.
  const statusSugerido: StatusGeralDia =
    naoConformes.length === 0
      ? "EM_CONFORMIDADE"
      : naoConformes.length >= 3
        ? "OCORRENCIA_CRITICA"
        : "OCORRENCIA_PONTUAL";
  const [statusManual, setStatusManual] = useState<StatusGeralDia | null>(null);
  const statusGeral = statusManual ?? statusSugerido;

  const jaExiste = (boletimExistente[condominioId] ?? []).includes(dataReferencia);

  // Etapas: 0 = identificação, 1..4 = grupos, 5 = equipe/resumo.
  const TOTAL_ETAPAS = GRUPOS.length + 2;
  const ultimaEtapa = etapa === TOTAL_ETAPAS - 1;

  function alterarResposta(itemId: number, mudanca: Partial<Resposta>) {
    setRespostas((atual) => ({ ...atual, [itemId]: { ...atual[itemId], ...mudanca } }));
  }

  function marcarGrupoConforme(grupo: string) {
    const doGrupo = itensPorGrupo.get(grupo) ?? [];
    setRespostas((atual) => {
      const copia = { ...atual };
      for (const item of doGrupo) {
        copia[item.id] = { ...copia[item.id], situacao: "CONFORME", observacao: "" };
      }
      return copia;
    });
  }

  function avancar() {
    setErro(null);
    if (etapa === 0 && !condominioId) {
      setErro("Selecione o condomínio.");
      return;
    }
    setEtapa((e) => Math.min(e + 1, TOTAL_ETAPAS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function voltar() {
    setErro(null);
    setEtapa((e) => Math.max(e - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function enviar() {
    setErro(null);

    // Uma falha sem descrição vira uma ocorrência sem contexto — bloqueia aqui.
    const semDescricao = naoConformes.find(
      (i) => (respostas[i.id]?.observacao ?? "").trim().length < 5,
    );
    if (semDescricao) {
      setErro(
        `Descreva o problema em "${semDescricao.nome}" — a descrição vira a ocorrência.`,
      );
      return;
    }
    iniciarEnvio(async () => {
      const resultado = await salvarBoletimAction({
        condominioId,
        dataReferencia,
        statusGeral,
        observacoes,
        itens: itens.map((i) => ({
          checklistItemId: i.id,
          situacao: respostas[i.id].situacao,
          observacao: respostas[i.id].observacao,
        })),
      });

      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.push(`/boletim/${resultado.id}?criado=1`);
      router.refresh();
    });
  }

  const grupoAtual = etapa >= 1 && etapa <= GRUPOS.length ? GRUPOS[etapa - 1] : null;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progresso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">
            {etapa === 0
              ? "Identificação"
              : grupoAtual
                ? grupoAtual.titulo
                : "Fechamento"}
          </span>
          <span className="text-xs num" style={{ color: "var(--tinta-3)" }}>
            Etapa {etapa + 1} de {TOTAL_ETAPAS}
          </span>
        </div>
        <div
          className="flex gap-1"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_ETAPAS}
          aria-valuenow={etapa + 1}
          aria-label="Progresso do boletim"
        >
          {Array.from({ length: TOTAL_ETAPAS }, (_, i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{
                background: i <= etapa ? "var(--serie-1)" : "var(--grade)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="card card-pad">
        {/* Etapa 0 — identificação */}
        {etapa === 0 ? (
          <div className="space-y-4">
            <div>
              <label className="rotulo" htmlFor="condominio">
                Condomínio
              </label>
              <select
                id="condominio"
                className="campo"
                value={condominioId}
                onChange={(e) => setCondominioId(Number(e.target.value))}
              >
                {condominios.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="rotulo" htmlFor="data">
                Data de referência
              </label>
              <input
                id="data"
                type="date"
                className="campo"
                value={dataReferencia}
                onChange={(e) => setDataReferencia(e.target.value)}
              />
            </div>

            {jaExiste ? (
              <p
                className="text-sm rounded-lg px-3 py-2"
                style={{
                  color: "color-mix(in srgb, var(--status-atencao) 70%, var(--tinta))",
                  background:
                    "color-mix(in srgb, var(--status-atencao) 12%, var(--superficie))",
                  border:
                    "1px solid color-mix(in srgb, var(--status-atencao) 35%, transparent)",
                }}
              >
                <strong>Atenção:</strong> já existe boletim para{" "}
                {formatarDataReferencia(dataReferencia)} neste condomínio. Enviar
                novamente substitui o registro e as ocorrências geradas por ele.
              </p>
            ) : null}

            <div
              className="rounded-lg px-3 py-3 text-sm leading-relaxed"
              style={{ background: "var(--superficie-2)", color: "var(--tinta-2)" }}
            >
              Todos os {itens.length} itens já vêm marcados como{" "}
              <strong>Conforme</strong>. Toque apenas onde houver falha — cada item
              marcado como <strong>Não Conforme</strong> abre uma ocorrência
              automaticamente.
            </div>
          </div>
        ) : null}

        {/* Etapas 1..4 — grupos do checklist */}
        {grupoAtual ? (
          <div>
            <p className="text-sm mb-3" style={{ color: "var(--tinta-2)" }}>
              {grupoAtual.descricao}
            </p>
            <button
              type="button"
              onClick={() => marcarGrupoConforme(grupoAtual.codigo)}
              className="botao botao-secundario w-full mb-3"
              style={{ minHeight: "2.5rem" }}
            >
              Marcar tudo como Conforme
            </button>

            <ul className="space-y-2">
              {(itensPorGrupo.get(grupoAtual.codigo) ?? []).map((item) => {
                const resposta = respostas[item.id];
                const falha = resposta.situacao === "NAO_CONFORME";
                return (
                  <li
                    key={item.id}
                    className="rounded-xl p-3"
                    style={{
                      border: falha
                        ? "1px solid color-mix(in srgb, var(--status-critico) 45%, transparent)"
                        : "1px solid var(--grade)",
                      background: falha
                        ? "color-mix(in srgb, var(--status-critico) 6%, var(--superficie))"
                        : "var(--superficie)",
                    }}
                  >
                    <div className="font-medium text-sm mb-2">{item.nome}</div>

                    <div
                      className="grid grid-cols-3 gap-1"
                      role="radiogroup"
                      aria-label={`Situação de ${item.nome}`}
                    >
                      {SITUACOES.map((s) => {
                        const selecionado = resposta.situacao === s.valor;
                        return (
                          <button
                            key={s.valor}
                            type="button"
                            role="radio"
                            aria-checked={selecionado}
                            onClick={() =>
                              alterarResposta(item.id, { situacao: s.valor })
                            }
                            className="rounded-lg px-2 py-2 text-xs font-semibold transition-colors"
                            style={{
                              minHeight: "2.5rem",
                              border: `1px solid ${
                                selecionado ? "transparent" : "var(--borda-forte)"
                              }`,
                              background: selecionado
                                ? s.valor === "NAO_CONFORME"
                                  ? "var(--status-critico)"
                                  : s.valor === "CONFORME"
                                    ? "var(--status-bom)"
                                    : "var(--tinta-3)"
                                : "var(--superficie)",
                              color: selecionado ? "#ffffff" : "var(--tinta-2)",
                            }}
                          >
                            {s.rotulo}
                          </button>
                        );
                      })}
                    </div>

                    {falha ? (
                      <div className="mt-3 space-y-2">
                        <div>
                          <label
                            className="rotulo"
                            htmlFor={`obs-${item.id}`}
                            style={{ marginBottom: "0.25rem" }}
                          >
                            O que aconteceu?
                          </label>
                          <textarea
                            id={`obs-${item.id}`}
                            className="campo"
                            style={{ minHeight: "4.5rem" }}
                            placeholder="Ex.: elevador social 02 parado entre o 7º e o 8º andar."
                            value={resposta.observacao}
                            onChange={(e) =>
                              alterarResposta(item.id, { observacao: e.target.value })
                            }
                          />
                        </div>

                        <p
                          className="text-xs"
                          style={{ color: "var(--tinta-3)" }}
                        >
                          A criticidade e o prazo são definidos automaticamente
                          pela natureza do item.
                        </p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {/* Última etapa — equipe, status e revisão */}
        {ultimaEtapa ? (
          <div className="space-y-5">
            <div>
              <span className="rotulo">Status geral do dia</span>
              <div className="space-y-2">
                {(
                  [
                    "EM_CONFORMIDADE",
                    "OCORRENCIA_PONTUAL",
                    "OCORRENCIA_CRITICA",
                  ] as StatusGeralDia[]
                ).map((s, indice) => {
                  const selecionado = statusGeral === s;
                  const cor = [
                    "var(--ordinal-1)",
                    "var(--ordinal-2)",
                    "var(--ordinal-3)",
                  ][indice];
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={selecionado}
                      onClick={() => setStatusManual(s)}
                      className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold flex items-center gap-3"
                      style={{
                        minHeight: "2.75rem",
                        border: `1px solid ${selecionado ? cor : "var(--borda-forte)"}`,
                        background: selecionado
                          ? "color-mix(in srgb, var(--serie-1) 10%, var(--superficie))"
                          : "var(--superficie)",
                        color: "var(--tinta)",
                      }}
                    >
                      <span
                        aria-hidden
                        className="h-3 w-3 flex-none rounded-full"
                        style={{ background: cor }}
                      />
                      {STATUS_DIA_LABEL[s]}
                      {s === statusSugerido ? (
                        <span
                          className="ml-auto text-xs font-medium"
                          style={{ color: "var(--tinta-3)" }}
                        >
                          sugerido
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="rotulo" htmlFor="observacoes">
                Observações gerais do dia (opcional)
              </label>
              <textarea
                id="observacoes"
                className="campo"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Registros complementares, visitas, entregas, comunicados…"
              />
            </div>

            {/* Revisão */}
            <div
              className="rounded-xl p-3"
              style={{ background: "var(--superficie-2)" }}
            >
              <div className="titulo-secao mb-2">Revisão</div>
              <dl className="text-sm space-y-1" style={{ color: "var(--tinta-2)" }}>
                <div className="flex justify-between gap-3">
                  <dt>Condomínio</dt>
                  <dd className="font-medium text-right" style={{ color: "var(--tinta)" }}>
                    {condominios.find((c) => c.id === condominioId)?.nome ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Data</dt>
                  <dd className="font-medium num" style={{ color: "var(--tinta)" }}>
                    {formatarDataReferencia(dataReferencia)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Itens não conformes</dt>
                  <dd className="font-medium num" style={{ color: "var(--tinta)" }}>
                    {naoConformes.length}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Ocorrências a abrir</dt>
                  <dd className="font-medium num" style={{ color: "var(--tinta)" }}>
                    {naoConformes.length}
                  </dd>
                </div>
              </dl>

              {naoConformes.length > 0 ? (
                <ul className="mt-3 space-y-1 text-sm">
                  {naoConformes.map((i) => (
                    <li key={i.id} className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
                        style={{ background: "var(--status-critico)" }}
                      />
                      <span>
                        <strong>{i.nome}</strong>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        ) : null}

        {erro ? (
          <p
            role="alert"
            className="mt-4 text-sm rounded-lg px-3 py-2"
            style={{
              color: "var(--status-critico-texto)",
              background: "color-mix(in srgb, var(--status-critico) 10%, var(--superficie))",
              border: "1px solid color-mix(in srgb, var(--status-critico) 30%, transparent)",
            }}
          >
            {erro}
          </p>
        ) : null}
      </div>

      {/* Barra de navegação do wizard — fica acessível com o polegar. */}
      <div className="mt-4 flex gap-2">
        {etapa > 0 ? (
          <button type="button" onClick={voltar} className="botao botao-secundario flex-1">
            Voltar
          </button>
        ) : null}
        {ultimaEtapa ? (
          <button
            type="button"
            onClick={enviar}
            disabled={enviando}
            className="botao botao-primario flex-[2]"
          >
            {enviando ? "Enviando…" : "Enviar boletim"}
          </button>
        ) : (
          <button type="button" onClick={avancar} className="botao botao-primario flex-[2]">
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}
