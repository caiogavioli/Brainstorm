"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Criticidade, SituacaoItem, StatusGeralDia } from "@prisma/client";

import { GRUPOS } from "@/lib/checklist";
import { CRITICIDADE_CLASSE, CRITICIDADE_LABEL, STATUS_DIA_LABEL } from "@/lib/labels";
import { formatarDataReferencia } from "@/lib/datas";
import { corrigirBoletimAction, salvarBoletimAction } from "@/lib/acoes/boletim";
import type { Pendencia, PendenciasPorCondominio } from "@/lib/consultas/pendencias";

type ItemChecklist = {
  id: number;
  codigo: string;
  nome: string;
  grupo: string;
};

type Condominio = { id: number; nome: string };

/**
 * Uma ocorrência dentro de um item do checklist.
 *
 * O mesmo item pode ter várias: "falta na equipe de segurança" pode ser o líder
 * e o vigilante de piso — dois problemas, com responsáveis, planos e prazos
 * próprios, que só cabiam num registro quando o modelo obrigava.
 */
export type OcorrenciaResposta = {
  /** Chave local estável, só para o React distinguir as linhas da lista. */
  chave: string;
  descricao: string;
  /** Preenchidos na etapa de revisão. */
  criticidade: Criticidade | "";
  planoAcao: string;
  previsaoFinalizacao: string;
  /**
   * Id da ocorrência que arrastou este problema para dentro do boletim de hoje.
   *
   * Serve para duas coisas: separar na revisão o que a ronda encontrou agora do
   * que já vinha de trás, e dizer ao servidor em QUAL ocorrência registrar a
   * recorrência — deduzir pelo item deixou de funcionar quando um item passou a
   * comportar vários problemas.
   */
  origemPendencia: number | null;
};

type Resposta = {
  situacao: SituacaoItem;
  ocorrencias: OcorrenciaResposta[];
};

const RESPOSTA_LIMPA: Resposta = { situacao: "CONFORME", ocorrencias: [] };

let contadorChave = 0;
function novaOcorrencia(inicial?: Partial<OcorrenciaResposta>): OcorrenciaResposta {
  contadorChave += 1;
  return {
    chave: `oc-${contadorChave}`,
    descricao: "",
    criticidade: "",
    planoAcao: "",
    previsaoFinalizacao: "",
    origemPendencia: null,
    ...inicial,
  };
}

/** O que o preenchedor decidiu sobre uma pendência de dias anteriores. */
type DecisaoPendencia = "CONTINUA" | "RESOLVIDA";

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
  pendencias = {},
  modoEdicao = false,
  valoresIniciais,
}: {
  condominios: Condominio[];
  itens: ItemChecklist[];
  dataInicial: string;
  condominioInicial: number | null;
  /** Datas que já possuem boletim, por condomínio — para avisar de substituição. */
  boletimExistente: Record<number, string[]>;
  /**
   * Ocorrências ainda em aberto, por condomínio. Vêm todas de uma vez porque o
   * wizard troca de prédio sem recarregar a página.
   */
  pendencias?: PendenciasPorCondominio;
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
  const [observacoes, setObservacoes] = useState(valoresIniciais?.observacoes ?? "");
  const [erro, setErro] = useState<string | null>(null);

  // Todos os itens começam "Conforme": o gestor só interage onde há falha.
  // Na edição, começam como foram gravados.
  const [respostas, setRespostas] = useState<Record<number, Resposta>>(() =>
    Object.fromEntries(
      itens.map((i) => [
        i.id,
        valoresIniciais?.respostas[i.id] ?? { ...RESPOSTA_LIMPA },
      ]),
    ),
  );

  /*
   * Pendências do condomínio selecionado, carregadas para dentro do boletim.
   *
   * Na correção de um boletim antigo elas não aparecem: o admin está arrumando
   * o registro de um dia que já passou, e fechar hoje uma ocorrência a partir
   * daquela tela dataria a conclusão no dia errado.
   */
  const pendenciasDoCondominio = useMemo(
    () => (modoEdicao ? [] : (pendencias[condominioId] ?? [])),
    [pendencias, condominioId, modoEdicao],
  );
  const [decisoes, setDecisoes] = useState<Record<number, DecisaoPendencia>>({});

  /*
   * Toda pendência entra como "continua em aberto" — é o estado verdadeiro até
   * alguém dizer o contrário. O item correspondente do checklist já nasce como
   * não conforme, com risco, plano e prazo que a ocorrência trazia: sem isso, a
   * pessoa teria que redigitar todo dia o que já está registrado.
   */
  useEffect(() => {
    /*
     * Na correção este efeito não tem o que fazer — e fazia estrago: a limpeza
     * abaixo remove as linhas vindas de pendência, que na tela de correção são
     * justamente as recorrências reconstruídas do boletim gravado. Sair cedo
     * preserva o que a página carregou.
     */
    if (modoEdicao) return;

    setDecisoes(
      Object.fromEntries(
        pendenciasDoCondominio.map((p) => [p.ocorrenciaId, "CONTINUA" as const]),
      ),
    );
    setRespostas((atual) => {
      const copia = { ...atual };
      // Limpa o que veio de pendências de outro condomínio antes de aplicar as
      // deste, senão trocar de prédio deixaria marcações órfãs.
      for (const chave of Object.keys(copia)) {
        const id = Number(chave);
        const restantes = copia[id].ocorrencias.filter((o) => o.origemPendencia === null);
        if (restantes.length !== copia[id].ocorrencias.length) {
          copia[id] = {
            situacao: restantes.length === 0 ? "CONFORME" : copia[id].situacao,
            ocorrencias: restantes,
          };
        }
      }
      // Várias pendências podem cair no mesmo item — e é justamente esse o
      // caso que o modelo antigo não sabia representar.
      for (const p of pendenciasDoCondominio) {
        if (p.checklistItemId === null || !copia[p.checklistItemId]) continue;
        const atualDoItem = copia[p.checklistItemId];
        copia[p.checklistItemId] = {
          situacao: "NAO_CONFORME",
          ocorrencias: [
            ...atualDoItem.ocorrencias,
            novaOcorrencia({
              descricao: p.descricao,
              criticidade: p.criticidade,
              planoAcao: p.planoAcao ?? "",
              previsaoFinalizacao: p.previsaoFinalizacao,
              origemPendencia: p.ocorrenciaId,
            }),
          ],
        };
      }
      return copia;
    });
  }, [pendenciasDoCondominio, modoEdicao]);

  function decidirPendencia(p: Pendencia, decisao: DecisaoPendencia) {
    setDecisoes((atual) => ({ ...atual, [p.ocorrenciaId]: decisao }));
    if (p.checklistItemId === null) return;

    setRespostas((atual) => {
      const item = atual[p.checklistItemId!];
      if (!item) return atual;

      // Mexe só na linha desta pendência: o item pode carregar outras, e
      // resolver uma não pode apagar as vizinhas.
      const semEsta = item.ocorrencias.filter((o) => o.origemPendencia !== p.ocorrenciaId);
      const ocorrencias =
        decisao === "CONTINUA"
          ? [
              ...semEsta,
              novaOcorrencia({
                descricao: p.descricao,
                criticidade: p.criticidade,
                planoAcao: p.planoAcao ?? "",
                previsaoFinalizacao: p.previsaoFinalizacao,
                origemPendencia: p.ocorrenciaId,
              }),
            ]
          : semEsta;

      return {
        ...atual,
        [p.checklistItemId!]: {
          situacao: ocorrencias.length === 0 ? "CONFORME" : "NAO_CONFORME",
          ocorrencias,
        },
      };
    });
  }

  const itensPorGrupo = useMemo(() => {
    const mapa = new Map<string, ItemChecklist[]>();
    for (const grupo of GRUPOS) mapa.set(grupo.codigo, []);
    for (const item of itens) mapa.get(item.grupo)?.push(item);
    return mapa;
  }, [itens]);

  const naoConformes = useMemo(
    () => itens.filter((i) => respostas[i.id]?.situacao === "NAO_CONFORME"),
    [itens, respostas],
  );

  const [statusManual, setStatusManual] = useState<StatusGeralDia | null>(
    valoresIniciais?.statusGeral ?? null,
  );

  // Na edição o boletim do dia é justamente este — avisar que "já existe" só
  // confundiria quem veio corrigi-lo.
  const jaExiste =
    !modoEdicao && (boletimExistente[condominioId] ?? []).includes(dataReferencia);

  /*
   * Etapas: identificação → pendências (quando há) → grupos → fechamento.
   *
   * As pendências vêm logo depois da identificação, antes do checklist, porque
   * saber o que já está aberto muda a ronda: a pessoa passa no elevador
   * sabendo que ele está na lista.
   */
  const etapas = useMemo(
    () => [
      "IDENTIFICACAO",
      ...(pendenciasDoCondominio.length > 0 ? ["PENDENCIAS"] : []),
      ...GRUPOS.map((g) => g.codigo),
      "FECHAMENTO",
    ],
    [pendenciasDoCondominio],
  );
  const TOTAL_ETAPAS = etapas.length;
  const etapaAtual = etapas[etapa] ?? "FECHAMENTO";
  const ultimaEtapa = etapa === TOTAL_ETAPAS - 1;
  const grupoAtual = GRUPOS.find((g) => g.codigo === etapaAtual) ?? null;

  /*
   * A revisão trabalha com pares (item, ocorrência), não com itens.
   *
   * Desde que um item comporta vários problemas, "as não conformidades" deixou
   * de ser a lista de itens: cada ocorrência tem risco, plano e prazo próprios
   * e precisa da sua própria caixa.
   */
  const linhas = naoConformes.flatMap((item) =>
    (respostas[item.id]?.ocorrencias ?? []).map((oc) => ({ item, oc })),
  );
  const novasNaoConformes = linhas.filter((l) => l.oc.origemPendencia === null);
  const emAcompanhamento = linhas.filter((l) => l.oc.origemPendencia !== null);
  const resolvidasAgora = pendenciasDoCondominio.filter(
    (p) => decisoes[p.ocorrenciaId] === "RESOLVIDA",
  ).length;

  /*
   * O status do dia é sugerido pelo que a RONDA DE HOJE encontrou — não pelo
   * tamanho do backlog.
   *
   * Se as pendências antigas contassem, um prédio com oito problemas em aberto
   * nasceria "ocorrência crítica" todo santo dia e o indicador de conformidade
   * ficaria travado em zero até o último deles ser fechado. O indicador
   * deixaria de distinguir o dia bom do dia ruim, que é a única coisa que ele
   * serve para fazer. O acúmulo tem indicadores próprios — backlog, SLA
   * estourado e o quadro de pendências desta tela.
   *
   * Continua sendo sugestão: quem preencheu pode marcar o dia como crítico
   * porque o elevador segue parado, e é uma escolha legítima.
   */
  const statusSugerido: StatusGeralDia =
    novasNaoConformes.length === 0
      ? "EM_CONFORMIDADE"
      : novasNaoConformes.length >= 3
        ? "OCORRENCIA_CRITICA"
        : "OCORRENCIA_PONTUAL";
  const statusGeral = statusManual ?? statusSugerido;

  function alterarSituacao(itemId: number, situacao: SituacaoItem) {
    setRespostas((atual) => {
      const anterior = atual[itemId];
      return {
        ...atual,
        [itemId]: {
          situacao,
          // Marcar falha abre a primeira ocorrência; sair da falha limpa a
          // lista, inclusive o que veio de dias anteriores — dizer "conforme"
          // hoje é dizer que a ronda não encontrou o problema hoje.
          ocorrencias:
            situacao === "NAO_CONFORME"
              ? anterior.ocorrencias.length > 0
                ? anterior.ocorrencias
                : [novaOcorrencia()]
              : [],
        },
      };
    });
  }

  function alterarOcorrencia(
    itemId: number,
    chave: string,
    mudanca: Partial<OcorrenciaResposta>,
  ) {
    setRespostas((atual) => ({
      ...atual,
      [itemId]: {
        ...atual[itemId],
        ocorrencias: atual[itemId].ocorrencias.map((o) =>
          o.chave === chave ? { ...o, ...mudanca } : o,
        ),
      },
    }));
  }

  function adicionarOcorrencia(itemId: number) {
    setRespostas((atual) => ({
      ...atual,
      [itemId]: {
        ...atual[itemId],
        ocorrencias: [...atual[itemId].ocorrencias, novaOcorrencia()],
      },
    }));
  }

  function removerOcorrencia(itemId: number, chave: string) {
    setRespostas((atual) => {
      const restantes = atual[itemId].ocorrencias.filter((o) => o.chave !== chave);
      return {
        ...atual,
        [itemId]: {
          // Sem nenhuma ocorrência o item deixa de ser uma falha: manter
          // "não conforme" sem problema descrito produziria um item vazio.
          situacao: restantes.length === 0 ? "CONFORME" : atual[itemId].situacao,
          ocorrencias: restantes,
        },
      };
    });
  }

  function marcarGrupoConforme(grupo: string) {
    const doGrupo = itensPorGrupo.get(grupo) ?? [];
    setRespostas((atual) => {
      const copia = { ...atual };
      for (const item of doGrupo) {
        // "Tudo conforme" é sobre o que a ronda viu agora. Um problema que veio
        // de dias anteriores só sai daqui se a pessoa disser que foi resolvido,
        // na etapa de pendências — e não por um atalho de preenchimento.
        const daPendencia = copia[item.id].ocorrencias.filter(
          (o) => o.origemPendencia !== null,
        );
        copia[item.id] =
          daPendencia.length > 0
            ? { situacao: "NAO_CONFORME", ocorrencias: daPendencia }
            : { ...RESPOSTA_LIMPA };
      }
      return copia;
    });
  }

  function avancar() {
    setErro(null);
    if (etapaAtual === "IDENTIFICACAO") {
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
    // A validação percorre ocorrência por ocorrência: com várias no mesmo item,
    // checar só a primeira deixaria as outras passarem vazias.
    const posicao = (l: (typeof linhas)[number]) => {
      const total = respostas[l.item.id].ocorrencias.length;
      if (total < 2) return `"${l.item.nome}"`;
      const indice = respostas[l.item.id].ocorrencias.findIndex(
        (o) => o.chave === l.oc.chave,
      );
      return `a ${indice + 1}ª ocorrência de "${l.item.nome}"`;
    };

    const semDescricao = linhas.find((l) => l.oc.descricao.trim().length < 5);
    if (semDescricao) {
      setErro(
        `Descreva o problema em ${posicao(semDescricao)} — a descrição vira a ocorrência.`,
      );
      return;
    }

    // Risco e plano são obrigatórios; o prazo, não. Uma ocorrência sem risco não
    // entra na fila de prioridade, e sem plano ninguém sabe o que fazer com ela.
    // Já o prazo pode legitimamente não existir ainda — e forçar um seria o
    // mesmo que o sistema inventar a data.
    const semRisco = linhas.find((l) => !l.oc.criticidade);
    if (semRisco) {
      setErro(`Classifique o risco de ${posicao(semRisco)} na revisão.`);
      return;
    }
    const semPlano = linhas.find((l) => l.oc.planoAcao.trim().length < 5);
    if (semPlano) {
      setErro(`Informe o plano de ação de ${posicao(semPlano)} na revisão.`);
      return;
    }
    iniciarEnvio(async () => {
      /*
       * Só conta como resolvida a pendência que NÃO voltou como ocorrência
       * deste boletim. Se a pessoa disse "resolvido" e depois apontou de novo o
       * mesmo problema, ela está dizendo que ele continua — e fechar a
       * ocorrência ali abriria uma nova amanhã, partindo o histórico em dois.
       */
      const aindaApontadas = new Set(
        Object.values(respostas)
          .flatMap((r) => r.ocorrencias)
          .map((o) => o.origemPendencia)
          .filter((id): id is number => id !== null),
      );
      const pendenciasResolvidas = pendenciasDoCondominio
        .filter((p) => decisoes[p.ocorrenciaId] === "RESOLVIDA")
        .filter((p) => !aindaApontadas.has(p.ocorrenciaId))
        .map((p) => p.ocorrenciaId);

      const payload = {
        condominioId,
        dataReferencia,
        statusGeral,
        observacoes,
        pendenciasResolvidas,
        itens: itens.map((i) => {
          const r = respostas[i.id];
          const naoConforme = r.situacao === "NAO_CONFORME";
          return {
            checklistItemId: i.id,
            situacao: r.situacao,
            // Item conforme não leva ocorrência nenhuma.
            ocorrencias: naoConforme
              ? r.ocorrencias.map((o) => ({
                  descricao: o.descricao,
                  criticidade: o.criticidade || undefined,
                  planoAcao: o.planoAcao,
                  previsaoFinalizacao: o.previsaoFinalizacao || undefined,
                  origemPendencia: o.origemPendencia,
                  // Sinaliza o que já vinha de trás: sem isso, uma falta de
                  // equipe em aberto seria recontada todo dia em "faltas".
                  continuacao: o.origemPendencia !== null,
                }))
              : [],
          };
        }),
      };

      const resultado = modoEdicao
        ? await corrigirBoletimAction(payload)
        : await salvarBoletimAction(payload);

      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }

      router.push(`/boletim/${resultado.id}?${modoEdicao ? "corrigido" : "criado"}=1`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progresso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">
            {etapaAtual === "IDENTIFICACAO"
              ? "Identificação"
              : etapaAtual === "PENDENCIAS"
                ? "Pendências de dias anteriores"
                : (grupoAtual?.titulo ?? "Fechamento")}
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
        {/* Identificação */}
        {etapaAtual === "IDENTIFICACAO" ? (
          <div className="space-y-4">
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
                <strong>Atenção:</strong> já existe boletim para{" "}
                {formatarDataReferencia(dataReferencia)} neste condomínio. Enviar
                novamente substitui o registro e as ocorrências geradas por ele.
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

        {/* Pendências arrastadas dos dias anteriores */}
        {etapaAtual === "PENDENCIAS" ? (
          <div>
            <p className="text-sm mb-1" style={{ color: "var(--tinta-2)" }}>
              Estes problemas continuam em aberto de dias anteriores. Diga o que
              aconteceu com cada um — é assim que eles saem da lista.
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--tinta-3)" }}>
              Enquanto não forem concluídos, reaparecem aqui todo dia. Os que
              continuam já entram no boletim de hoje com o risco e o plano que
              você registrou antes; dá para ajustar na revisão, no fim.
            </p>

            <ul className="space-y-3">
              {pendenciasDoCondominio.map((p) => {
                const decisao = decisoes[p.ocorrenciaId] ?? "CONTINUA";
                const resolvida = decisao === "RESOLVIDA";
                return (
                  <li
                    key={p.ocorrenciaId}
                    className="rounded-xl p-3"
                    style={{
                      border: `1px solid ${
                        resolvida
                          ? "color-mix(in srgb, var(--status-bom) 40%, transparent)"
                          : "color-mix(in srgb, var(--status-atencao) 45%, transparent)"
                      }`,
                      background: resolvida
                        ? "color-mix(in srgb, var(--status-bom) 6%, var(--superficie))"
                        : "color-mix(in srgb, var(--status-atencao) 7%, var(--superficie))",
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{p.setor}</span>
                      <span className={CRITICIDADE_CLASSE[p.criticidade]}>
                        {CRITICIDADE_LABEL[p.criticidade]}
                      </span>
                      {p.totalRecorrencias > 0 ? (
                        <span className="badge badge-neutral">
                          {p.totalRecorrencias + 1}ª aparição
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm mb-1" style={{ color: "var(--tinta-2)" }}>
                      {p.descricao}
                    </p>
                    <p
                      className="text-xs mb-3 num"
                      style={{ color: "var(--tinta-3)" }}
                    >
                      Aberta em {formatarDataReferencia(p.desde)}
                      {p.previsaoFinalizacao
                        ? ` · previsão ${formatarDataReferencia(p.previsaoFinalizacao)}`
                        : " · sem prazo"}
                    </p>

                    <div
                      className="grid grid-cols-2 gap-1"
                      role="radiogroup"
                      aria-label={`Situação de ${p.setor}`}
                    >
                      {(
                        [
                          { valor: "CONTINUA" as const, rotulo: "Continua em aberto" },
                          { valor: "RESOLVIDA" as const, rotulo: "Resolvida" },
                        ]
                      ).map((opcao) => {
                        const marcado = decisao === opcao.valor;
                        const cor =
                          opcao.valor === "RESOLVIDA"
                            ? "var(--status-bom)"
                            : "var(--status-atencao)";
                        return (
                          <button
                            key={opcao.valor}
                            type="button"
                            role="radio"
                            aria-checked={marcado}
                            onClick={() => decidirPendencia(p, opcao.valor)}
                            className="rounded-lg px-2 py-2 text-xs font-semibold"
                            style={{
                              minHeight: "2.75rem",
                              border: `1px solid ${marcado ? "transparent" : "var(--borda-forte)"}`,
                              background: marcado ? cor : "var(--superficie)",
                              color: marcado
                                ? opcao.valor === "RESOLVIDA"
                                  ? "#ffffff"
                                  : "#0b0b0b"
                                : "var(--tinta-2)",
                            }}
                          >
                            {opcao.rotulo}
                          </button>
                        );
                      })}
                    </div>

                    {resolvida ? (
                      <p className="mt-2 text-xs" style={{ color: "var(--tinta-3)" }}>
                        Será dada como concluída em{" "}
                        <span className="num">
                          {formatarDataReferencia(dataReferencia)}
                        </span>
                        , a data deste boletim.
                      </p>
                    ) : p.checklistItemId === null ? (
                      <p className="mt-2 text-xs" style={{ color: "var(--tinta-3)" }}>
                        Ocorrência avulsa, fora do checklist — segue em
                        acompanhamento e volta a aparecer amanhã.
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {/* Grupos do checklist */}
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
                            onClick={() => alterarSituacao(item.id, s.valor)}
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
                        {/* Uma lista, e não um campo: o mesmo item pode ter mais
                            de um problema — "falta na equipe de segurança" pode
                            ser o líder e o vigilante de piso. */}
                        {resposta.ocorrencias.map((oc, indice) => (
                          <div key={oc.chave}>
                            <div className="flex items-center justify-between gap-2">
                              <label
                                className="rotulo"
                                htmlFor={`obs-${item.id}-${oc.chave}`}
                                style={{ marginBottom: "0.25rem" }}
                              >
                                {resposta.ocorrencias.length > 1
                                  ? `Ocorrência ${indice + 1}`
                                  : "O que aconteceu?"}
                              </label>
                              {resposta.ocorrencias.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => removerOcorrencia(item.id, oc.chave)}
                                  className="text-xs underline"
                                  style={{
                                    color: "var(--tinta-3)",
                                    minHeight: "1.75rem",
                                  }}
                                  aria-label={`Remover ocorrência ${indice + 1} de ${item.nome}`}
                                >
                                  remover
                                </button>
                              ) : null}
                            </div>
                            <textarea
                              id={`obs-${item.id}-${oc.chave}`}
                              className="campo"
                              style={{ minHeight: "4.5rem" }}
                              placeholder="Ex.: elevador social 02 parado entre o 7º e o 8º andar."
                              value={oc.descricao}
                              onChange={(e) =>
                                alterarOcorrencia(item.id, oc.chave, {
                                  descricao: e.target.value,
                                })
                              }
                            />
                            {oc.origemPendencia !== null ? (
                              <p
                                className="mt-1 text-xs"
                                style={{ color: "var(--tinta-3)" }}
                              >
                                Continua de dias anteriores.
                              </p>
                            ) : null}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => adicionarOcorrencia(item.id)}
                          className="botao botao-secundario w-full"
                          style={{ minHeight: "2.5rem", fontSize: "0.8125rem" }}
                        >
                          + Adicionar outra ocorrência
                        </button>

                        <p className="text-xs" style={{ color: "var(--tinta-3)" }}>
                          O risco, o plano de ação e o prazo de cada uma são
                          preenchidos na revisão, no fim do boletim.
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
              {emAcompanhamento.length > 0 ? (
                <p className="text-xs mb-2" style={{ color: "var(--tinta-3)" }}>
                  A sugestão olha só o que a ronda de hoje encontrou. As{" "}
                  {emAcompanhamento.length} pendência(s) que vêm de trás continuam
                  registradas e no acompanhamento, mas não classificam o dia — se
                  classificassem, todo dia seria crítico enquanto elas existissem.
                </p>
              ) : null}
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
                  <dt>Não conformidades novas</dt>
                  <dd className="font-medium num" style={{ color: "var(--tinta)" }}>
                    {novasNaoConformes.length}
                  </dd>
                </div>
                {emAcompanhamento.length > 0 ? (
                  <div className="flex justify-between gap-3">
                    <dt>Continuam de dias anteriores</dt>
                    <dd className="font-medium num" style={{ color: "var(--tinta)" }}>
                      {emAcompanhamento.length}
                    </dd>
                  </div>
                ) : null}
                {resolvidasAgora > 0 ? (
                  <div className="flex justify-between gap-3">
                    <dt>Pendências concluídas hoje</dt>
                    <dd
                      className="font-medium num"
                      style={{ color: "var(--status-bom-texto)" }}
                    >
                      {resolvidasAgora}
                    </dd>
                  </div>
                ) : null}
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
                  {emAcompanhamento.length > 0 ? (
                    <>
                      {" "}
                      Os que vêm de dias anteriores já chegam preenchidos: só mexa
                      se alguma coisa mudou.
                    </>
                  ) : null}
                </p>

                <ul className="space-y-3">
                  {[...novasNaoConformes, ...emAcompanhamento].map(({ item, oc }) => {
                    const daPendencia = oc.origemPendencia !== null;
                    const total = respostas[item.id].ocorrencias.length;
                    const indice = respostas[item.id].ocorrencias.findIndex(
                      (o) => o.chave === oc.chave,
                    );
                    return (
                      <li
                        key={oc.chave}
                        className="rounded-xl p-3"
                        style={{
                          border: `1px solid color-mix(in srgb, ${
                            daPendencia
                              ? "var(--status-atencao) 45%"
                              : "var(--status-critico) 40%"
                          }, transparent)`,
                          background: `color-mix(in srgb, ${
                            daPendencia
                              ? "var(--status-atencao) 6%"
                              : "var(--status-critico) 5%"
                          }, var(--superficie))`,
                        }}
                      >
                        {daPendencia ? (
                          <div
                            className="text-xs font-semibold mb-1"
                            style={{ color: "var(--tinta-3)" }}
                          >
                            Continua de dias anteriores
                          </div>
                        ) : null}
                        <div className="font-semibold text-sm mb-1">
                          {item.nome}
                          {/* Com várias no mesmo item, o nome sozinho não diz de
                              qual delas é esta caixa. */}
                          {total > 1 ? (
                            <span
                              className="ml-2 text-xs font-medium"
                              style={{ color: "var(--tinta-3)" }}
                            >
                              ocorrência {indice + 1} de {total}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs mb-3" style={{ color: "var(--tinta-2)" }}>
                          {oc.descricao}
                        </p>

                        <div className="mb-3">
                          <span className="rotulo">Risco</span>
                          <div
                            className="grid grid-cols-3 gap-1"
                            role="radiogroup"
                            aria-label={`Risco de ${item.nome}${total > 1 ? ` — ocorrência ${indice + 1}` : ""}`}
                          >
                            {CRITICIDADES.map((c, posicao) => {
                              const marcado = oc.criticidade === c.valor;
                              // Rampa de um matiz: risco é escala, não categoria.
                              const cor = [
                                "var(--ordinal-1)",
                                "var(--ordinal-2)",
                                "var(--ordinal-3)",
                              ][posicao];
                              return (
                                <button
                                  key={c.valor}
                                  type="button"
                                  role="radio"
                                  aria-checked={marcado}
                                  onClick={() =>
                                    alterarOcorrencia(item.id, oc.chave, {
                                      criticidade: c.valor,
                                    })
                                  }
                                  className="rounded-lg px-2 py-2 text-xs font-semibold"
                                  style={{
                                    minHeight: "2.5rem",
                                    border: `1px solid ${marcado ? "transparent" : "var(--borda-forte)"}`,
                                    background: marcado ? cor : "var(--superficie)",
                                    color: marcado
                                      ? posicao === 0
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
                          <label className="rotulo" htmlFor={`plano-${oc.chave}`}>
                            Plano de ação
                          </label>
                          <textarea
                            id={`plano-${oc.chave}`}
                            className="campo"
                            style={{ minHeight: "4rem" }}
                            placeholder="O que será feito para resolver."
                            value={oc.planoAcao}
                            onChange={(e) =>
                              alterarOcorrencia(item.id, oc.chave, {
                                planoAcao: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="rotulo" htmlFor={`prazo-${oc.chave}`}>
                            Conclusão estimada (opcional)
                          </label>
                          <input
                            id={`prazo-${oc.chave}`}
                            type="date"
                            className="campo"
                            value={oc.previsaoFinalizacao}
                            onChange={(e) =>
                              alterarOcorrencia(item.id, oc.chave, {
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
