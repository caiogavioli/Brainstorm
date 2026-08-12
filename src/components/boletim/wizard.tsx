"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Criticidade, SituacaoItem, StatusGeralDia } from "@prisma/client";

import { GRUPOS } from "@/lib/checklist";
import { STATUS_DIA_LABEL } from "@/lib/labels";
import { formatarDataReferencia } from "@/lib/datas";
import { ResumoWhatsApp } from "@/components/boletim/resumo";
import {
  corrigirBoletimAction,
  enviarBoletimPublicoAction,
  salvarBoletimAction,
} from "@/lib/acoes/boletim";

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
  /** Preenchidos só quando o item é não conforme, na etapa de revisão. */
  criticidade: Criticidade | "";
  planoAcao: string;
  previsaoFinalizacao: string;
};

const CRITICIDADES: { valor: Criticidade; rotulo: string }[] = [
  { valor: "BAIXA", rotulo: "Baixo" },
  { valor: "MEDIA", rotulo: "Médio" },
  { valor: "ALTA", rotulo: "Alto" },
];

const SITUACOES: { valor: SituacaoItem; rotulo: string; curto: string }[] = [
  { valor: "CONFORME", rotulo: "Conforme", curto: "OK" },
  { valor: "NAO_CONFORME", rotulo: "Não Conforme", curto: "Falha" },
  { valor: "NAO_APLICAVEL", rotulo: "N/A", curto: "N/A" },
];

/** Respostas já gravadas, quando o admin abre um boletim para corrigir. */
export type ValoresIniciais = {
  respostas: Record<number, Resposta>;
  observacoes: string;
  statusGeral: StatusGeralDia;
};

export function WizardBoletim({
  condominios,
  itens,
  dataInicial,
  condominioInicial,
  boletimExistente,
  modoPublico = false,
  modoEdicao = false,
  valoresIniciais,
}: {
  condominios: Condominio[];
  itens: ItemChecklist[];
  dataInicial: string;
  condominioInicial: number | null;
  /** Datas que já possuem boletim, por condomínio — para avisar de substituição. */
  boletimExistente: Record<number, string[]>;
  /** Formulário aberto, sem login: pede o nome e não sobrescreve o dia. */
  modoPublico?: boolean;
  /**
   * Correção de um boletim existente pelo admin. Condomínio e data ficam
   * travados: mudá-los criaria um segundo boletim em vez de corrigir este.
   */
  modoEdicao?: boolean;
  valoresIniciais?: ValoresIniciais;
}) {
  const router = useRouter();
  const [enviando, iniciarEnvio] = useTransition();

  const [etapa, setEtapa] = useState(0);
  const [condominioId, setCondominioId] = useState<number>(
    condominioInicial ?? condominios[0]?.id ?? 0,
  );
  const [dataReferencia, setDataReferencia] = useState(dataInicial);
  const [preenchidoPor, setPreenchidoPor] = useState("");
  const [observacoes, setObservacoes] = useState(valoresIniciais?.observacoes ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState<string | null>(null);
  const [resumo, setResumo] = useState<string | null>(null);

  // Todos os itens começam "Conforme": o gestor só interage onde há falha.
  // Na edição, começam como foram gravados.
  const [respostas, setRespostas] = useState<Record<number, Resposta>>(() =>
    Object.fromEntries(
      itens.map((i) => [
        i.id,
        valoresIniciais?.respostas[i.id] ?? {
          situacao: "CONFORME" as SituacaoItem,
          observacao: "",
          criticidade: "" as const,
          planoAcao: "",
          previsaoFinalizacao: "",
        },
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
  const [statusManual, setStatusManual] = useState<StatusGeralDia | null>(
    valoresIniciais?.statusGeral ?? null,
  );
  const statusGeral = statusManual ?? statusSugerido;

  // Na edição o boletim do dia é justamente este — avisar que "já existe" só
  // confundiria quem veio corrigi-lo.
  const jaExiste =
    !modoEdicao && (boletimExistente[condominioId] ?? []).includes(dataReferencia);

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
        copia[item.id] = {
          ...copia[item.id],
          situacao: "CONFORME",
          observacao: "",
          criticidade: "",
          planoAcao: "",
          previsaoFinalizacao: "",
        };
      }
      return copia;
    });
  }

  function avancar() {
    setErro(null);
    if (etapa === 0) {
      if (modoPublico && preenchidoPor.trim().length < 3) {
        setErro("Informe seu nome para identificar quem está preenchendo.");
        return;
      }
      if (!condominioId) {
        setErro("Selecione o condomínio.");
        return;
      }
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

    // Risco e plano são obrigatórios; o prazo, não. Uma ocorrência sem risco não
    // entra na fila de prioridade, e sem plano ninguém sabe o que fazer com ela.
    // Já o prazo pode legitimamente não existir ainda — e forçar um seria o
    // mesmo que o sistema inventar a data.
    const semRisco = naoConformes.find((i) => !respostas[i.id]?.criticidade);
    if (semRisco) {
      setErro(`Classifique o risco de "${semRisco.nome}" na revisão.`);
      return;
    }
    const semPlano = naoConformes.find(
      (i) => (respostas[i.id]?.planoAcao ?? "").trim().length < 5,
    );
    if (semPlano) {
      setErro(`Informe o plano de ação de "${semPlano.nome}" na revisão.`);
      return;
    }
    iniciarEnvio(async () => {
      const payload = {
        condominioId,
        dataReferencia,
        statusGeral,
        observacoes,
        preenchidoPor: preenchidoPor.trim(),
        itens: itens.map((i) => {
          const r = respostas[i.id];
          const naoConforme = r.situacao === "NAO_CONFORME";
          return {
            checklistItemId: i.id,
            situacao: r.situacao,
            observacao: r.observacao,
            // Risco, plano e prazo só fazem sentido onde houve falha.
            criticidade: naoConforme && r.criticidade ? r.criticidade : undefined,
            planoAcao: naoConforme ? r.planoAcao : "",
            previsaoFinalizacao:
              naoConforme && r.previsaoFinalizacao ? r.previsaoFinalizacao : undefined,
          };
        }),
      };

      const resultado = modoPublico
        ? await enviarBoletimPublicoAction(payload)
        : modoEdicao
          ? await corrigirBoletimAction(payload)
          : await salvarBoletimAction(payload);

      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }

      if (modoPublico) {
        // Sem login não há painel para onde levar: a confirmação acontece aqui.
        setEnviado(resultado.mensagem ?? "Boletim registrado.");
        setResumo(resultado.resumo ?? null);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push(`/boletim/${resultado.id}?${modoEdicao ? "corrigido" : "criado"}=1`);
      router.refresh();
    });
  }

  const grupoAtual = etapa >= 1 && etapa <= GRUPOS.length ? GRUPOS[etapa - 1] : null;

  if (enviado) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="card card-pad text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
            style={{
              background: "color-mix(in srgb, var(--status-bom) 15%, var(--superficie))",
              color: "var(--status-bom-texto)",
            }}
            aria-hidden
          >
            ✓
          </div>
          <h2 className="text-xl font-bold mb-2">Boletim enviado</h2>
          <p className="text-sm mb-1" style={{ color: "var(--tinta-2)" }}>
            {enviado}
          </p>
          <p className="text-sm mb-5 num" style={{ color: "var(--tinta-3)" }}>
            {condominios.find((c) => c.id === condominioId)?.nome} ·{" "}
            {formatarDataReferencia(dataReferencia)} · {preenchidoPor}
          </p>
          <button
            type="button"
            className="botao botao-primario w-full"
            onClick={() => {
              // Novo boletim mantendo o nome de quem preenche — o mesmo gerente
              // costuma lançar vários prédios em sequência.
              setRespostas(
                Object.fromEntries(
                  itens.map((i) => [
                    i.id,
                    {
                      situacao: "CONFORME" as SituacaoItem,
                      observacao: "",
                      criticidade: "" as const,
                      planoAcao: "",
                      previsaoFinalizacao: "",
                    },
                  ]),
                ),
              );
              setObservacoes("");
              setStatusManual(null);
              setEnviado(null);
              setResumo(null);
              setEtapa(0);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Lançar outro boletim
          </button>
        </div>

        {resumo ? <ResumoWhatsApp texto={resumo} /> : null}
      </div>
    );
  }

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
            {modoPublico ? (
              <div>
                <label className="rotulo" htmlFor="preenchidoPor">
                  Seu nome
                </label>
                <input
                  id="preenchidoPor"
                  className="campo"
                  value={preenchidoPor}
                  onChange={(e) => setPreenchidoPor(e.target.value)}
                  placeholder="Nome de quem está preenchendo"
                  autoComplete="name"
                  autoCapitalize="words"
                />
                <p className="mt-1 text-xs" style={{ color: "var(--tinta-3)" }}>
                  Fica registrado no boletim para identificar quem lançou.
                </p>
              </div>
            ) : null}

            <div>
              <label className="rotulo" htmlFor="condominio">
                Condomínio
              </label>
              <select
                id="condominio"
                className="campo"
                value={condominioId}
                disabled={modoEdicao}
                onChange={(e) => setCondominioId(Number(e.target.value))}
              >
                {condominios.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              {modoPublico ? (
                <p className="mt-1 text-xs" style={{ color: "var(--tinta-3)" }}>
                  Não achou o seu? O administrador cadastra novos condomínios no
                  painel.
                </p>
              ) : null}
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
                disabled={modoEdicao}
                onChange={(e) => setDataReferencia(e.target.value)}
              />
              {modoEdicao ? (
                <p className="mt-1 text-xs" style={{ color: "var(--tinta-3)" }}>
                  Condomínio e data não mudam na correção — alterá-los criaria um
                  segundo boletim em vez de corrigir este.
                </p>
              ) : null}
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
                {modoPublico ? (
                  <>
                    <strong>Já existe boletim</strong> para{" "}
                    {formatarDataReferencia(dataReferencia)} neste condomínio. O
                    envio será recusado — escolha outra data ou peça ao
                    administrador para corrigir o registro do dia.
                  </>
                ) : (
                  <>
                    <strong>Atenção:</strong> já existe boletim para{" "}
                    {formatarDataReferencia(dataReferencia)} neste condomínio.
                    Enviar novamente substitui o registro e as ocorrências
                    geradas por ele.
                  </>
                )}
              </p>
            ) : null}

            <div
              className="rounded-lg px-3 py-3 text-sm leading-relaxed"
              style={{ background: "var(--superficie-2)", color: "var(--tinta-2)" }}
            >
              {modoEdicao ? (
                <>
                  As respostas abaixo são as que foram enviadas. Ao salvar, as
                  ocorrências que <strong>este</strong> boletim havia aberto são
                  refeitas a partir das novas respostas — ocorrências de outros dias
                  não são tocadas.
                </>
              ) : (
                <>
                  Todos os {itens.length} itens já vêm marcados como{" "}
                  <strong>Conforme</strong>. Toque apenas onde houver falha — cada
                  item marcado como <strong>Não Conforme</strong> abre uma ocorrência
                  automaticamente.
                </>
              )}
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

              {naoConformes.length === 0 ? (
                <p className="mt-3 text-sm" style={{ color: "var(--tinta-3)" }}>
                  Nenhuma não conformidade. Nada a tratar.
                </p>
              ) : null}
            </div>

            {naoConformes.length > 0 ? (
              <div>
                <div className="titulo-secao mb-1">Tratamento das não conformidades</div>
                <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
                  Cada item abaixo vira uma ocorrência. Classifique o risco e diga o
                  que será feito — quem esteve no local é quem sabe o tamanho do
                  problema.
                </p>

                <ul className="space-y-3">
                  {naoConformes.map((item) => {
                    const r = respostas[item.id];
                    return (
                      <li
                        key={item.id}
                        className="rounded-xl p-3"
                        style={{
                          border:
                            "1px solid color-mix(in srgb, var(--status-critico) 40%, transparent)",
                          background:
                            "color-mix(in srgb, var(--status-critico) 5%, var(--superficie))",
                        }}
                      >
                        <div className="font-semibold text-sm mb-1">{item.nome}</div>
                        <p className="text-xs mb-3" style={{ color: "var(--tinta-2)" }}>
                          {r.observacao}
                        </p>

                        <div className="mb-3">
                          <span className="rotulo">Risco</span>
                          <div
                            className="grid grid-cols-3 gap-1"
                            role="radiogroup"
                            aria-label={`Risco de ${item.nome}`}
                          >
                            {CRITICIDADES.map((c, indice) => {
                              const marcado = r.criticidade === c.valor;
                              // Rampa de um matiz: risco é escala, não categoria.
                              const cor = [
                                "var(--ordinal-1)",
                                "var(--ordinal-2)",
                                "var(--ordinal-3)",
                              ][indice];
                              return (
                                <button
                                  key={c.valor}
                                  type="button"
                                  role="radio"
                                  aria-checked={marcado}
                                  onClick={() =>
                                    alterarResposta(item.id, { criticidade: c.valor })
                                  }
                                  className="rounded-lg px-2 py-2 text-xs font-semibold"
                                  style={{
                                    minHeight: "2.5rem",
                                    border: `1px solid ${marcado ? "transparent" : "var(--borda-forte)"}`,
                                    background: marcado ? cor : "var(--superficie)",
                                    color: marcado
                                      ? indice === 0
                                        ? "#0b0b0b"
                                        : "#ffffff"
                                      : "var(--tinta-2)",
                                  }}
                                >
                                  {c.rotulo}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="rotulo" htmlFor={`plano-${item.id}`}>
                            Plano de ação
                          </label>
                          <textarea
                            id={`plano-${item.id}`}
                            className="campo"
                            style={{ minHeight: "4rem" }}
                            placeholder="O que será feito para resolver."
                            value={r.planoAcao}
                            onChange={(e) =>
                              alterarResposta(item.id, { planoAcao: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <label className="rotulo" htmlFor={`prazo-${item.id}`}>
                            Conclusão estimada (opcional)
                          </label>
                          <input
                            id={`prazo-${item.id}`}
                            type="date"
                            className="campo"
                            value={r.previsaoFinalizacao}
                            onChange={(e) =>
                              alterarResposta(item.id, {
                                previsaoFinalizacao: e.target.value,
                              })
                            }
                          />
                          <p className="mt-1 text-xs" style={{ color: "var(--tinta-3)" }}>
                            Deixe em branco se ainda não há prazo. O sistema não
                            preenche data nenhuma por conta própria.
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
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
            {enviando
              ? "Salvando…"
              : modoEdicao
                ? "Salvar correção"
                : "Enviar boletim"}
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
