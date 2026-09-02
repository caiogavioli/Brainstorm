import Link from "next/link";

import { condominiosDaSessao, escopoCondominios, exigirAdmin, filtroCondominio } from "@/lib/auth";
import { carregarDashboard } from "@/lib/consultas/dashboard";
import { prisma } from "@/lib/db";
import {
  dataReferenciaDe,
  diasAteSLA,
  formatarData,
  inicioDoDiaLocal,
  primeiroDiaDoMes,
  rotuloIntervalo,
  somarDias,
  ultimoDiaDoMes,
} from "@/lib/datas";
import { diasUteisEntre, periodoAnteriorEquivalente } from "@/lib/dias-uteis";
import {
  CRITICIDADE_CLASSE,
  CRITICIDADE_LABEL,
  STATUS_OCORRENCIA_CLASSE,
  STATUS_OCORRENCIA_LABEL,
} from "@/lib/labels";
import { FiltrosGlobais } from "@/components/filtros";
import { CartaoKPI } from "@/components/dashboard/kpi";
import { QuadroPreenchimento, type LinhaQuadro } from "@/components/dashboard/quadro-preenchimento";
import { MarcadorSLA } from "@/components/marcador-sla";
import {
  BarraConformidade,
  GraficoCondominios,
  GraficoHistoricoMensal,
  GraficoLinhaTempo,
  GraficoPlanos,
  GraficoSetores,
  type LinhaCondominio,
} from "@/components/dashboard/graficos";
import { ComparativoPeriodoAnterior, type ItemComparativo } from "@/components/relatorio-executivo/comparativo";
import { BotaoImprimir } from "@/components/relatorio-executivo/botao-imprimir";

export const metadata = { title: "Relatório Executivo — Gestão de Condomínios" };

const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;

const ROTULO_FAIXA: Record<string, string> = {
  ATRASADA: "Atrasada",
  VENCE_3_DIAS: "Vence em ≤3d",
  NO_PRAZO: "No prazo",
  SEM_PRAZO: "Sem prazo",
};

function pct(valor: number): string {
  return valor.toFixed(valor >= 10 ? 0 : 1).replace(".", ",");
}

export default async function PaginaRelatorioExecutivo({
  searchParams,
}: {
  searchParams: Promise<{ condominio?: string; de?: string; ate?: string }>;
}) {
  const sessao = await exigirAdmin();
  const params = await searchParams;

  const condominios = await condominiosDaSessao(sessao);
  const condominioId = params.condominio ? Number(params.condominio) : null;

  // Padrão: o mês anterior completo — o ritmo natural de um relatório
  // executivo, diferente do dashboard operacional (que abre em "hoje").
  const hoje = dataReferenciaDe();
  const mesPassadoInicio = primeiroDiaDoMes(somarDias(primeiroDiaDoMes(hoje), -1));
  const mesPassadoFim = ultimoDiaDoMes(mesPassadoInicio);
  const de = DATA_RE.test(params.de ?? "") ? params.de! : mesPassadoInicio;
  const ateBruto = DATA_RE.test(params.ate ?? "") ? params.ate! : mesPassadoFim;
  const ate = ateBruto < de ? de : ateBruto;

  const anterior = periodoAnteriorEquivalente(de, ate);

  const [dados, dadosAnterior, ocorrenciasPeriodo] = await Promise.all([
    carregarDashboard({ condominioId, de, ate, escopo: escopoCondominios(sessao) }),
    carregarDashboard({
      condominioId,
      de: anterior.de,
      ate: anterior.ate,
      escopo: escopoCondominios(sessao),
    }),
    prisma.ocorrencia.findMany({
      where: {
        ...filtroCondominio(sessao, condominioId),
        dataAbertura: { gte: inicioDoDiaLocal(de), lt: inicioDoDiaLocal(somarDias(ate, 1)) },
      },
      orderBy: [{ dataAbertura: "asc" }],
      include: {
        condominio: { select: { nome: true } },
        checklistItem: { select: { nome: true } },
      },
    }),
  ]);

  const nomeCondominio = condominioId
    ? (condominios.find((c) => c.id === condominioId)?.nome ?? "Condomínio")
    : "Todos os condomínios";

  const { kpis } = dados;

  // ---- Correção de dias úteis (ver lib/dias-uteis.ts) --------------------
  const nDiasUteis = diasUteisEntre(de, ate).length;
  const nDiasUteisAnterior = diasUteisEntre(anterior.de, anterior.ate).length;
  const condominiosNoEscopo = condominioId ? 1 : condominios.length;

  const boletinsEsperadosUteis = condominiosNoEscopo * nDiasUteis;
  const coberturaUtil =
    boletinsEsperadosUteis > 0
      ? Math.min((kpis.totalBoletins / boletinsEsperadosUteis) * 100, 100)
      : 0;

  const boletinsEsperadosUteisAnterior = condominiosNoEscopo * nDiasUteisAnterior;
  const coberturaUtilAnterior =
    boletinsEsperadosUteisAnterior > 0
      ? Math.min((dadosAnterior.kpis.totalBoletins / boletinsEsperadosUteisAnterior) * 100, 100)
      : 0;

  const quadroCorrigido: LinhaQuadro[] = dados.quadroPreenchimento.map((l) => {
    const coberturaPct = nDiasUteis > 0 ? (l.diasPreenchidos / nDiasUteis) * 100 : 100;
    const luz: LinhaQuadro["luz"] =
      coberturaPct >= 100 ? "VERDE" : coberturaPct >= 70 ? "AMARELA" : "VERMELHA";
    return { ...l, diasEsperados: nDiasUteis, luz };
  });

  const porCondominioCorrigido: LinhaCondominio[] = dados.porCondominio.map((c) => ({
    ...c,
    boletinsEsperados: nDiasUteis,
    cobertura: nDiasUteis > 0 ? Math.min((c.boletins / nDiasUteis) * 100, 100) : null,
  }));

  const itensComparativo: ItemComparativo[] = [
    {
      rotulo: "Cobertura de boletim",
      atual: coberturaUtil,
      anterior: coberturaUtilAnterior,
      formatar: (v) => `${pct(v)}%`,
      direcao: "up",
    },
    {
      rotulo: "Conformidade dos dias",
      atual: kpis.percentualConformidade,
      anterior: dadosAnterior.kpis.percentualConformidade,
      formatar: (v) => `${pct(v)}%`,
      direcao: "up",
    },
    {
      rotulo: "Ocorrências abertas",
      atual: kpis.abertasNoMes,
      anterior: dadosAnterior.kpis.abertasNoMes,
      formatar: (v) => String(Math.round(v)),
      direcao: "down",
    },
    {
      rotulo: "Críticas",
      atual: kpis.criticasNoMes,
      anterior: dadosAnterior.kpis.criticasNoMes,
      formatar: (v) => String(Math.round(v)),
      direcao: "down",
    },
  ];

  return (
    <div className="pagina-relatorio-executivo">
      {/* Impressão em retrato, escopada a esta página — não mexe no
          @media print (mínimo) que já existe em globals.css nem afeta
          nenhuma outra página. table-layout: fixed + quebra de texto porque
          a área útil do retrato é estreita (~733px) e as tabelas desta
          página têm muitas colunas — sem isso, texto vaza da página. */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm 8mm; }
          .pagina-relatorio-executivo table.tabela {
            table-layout: fixed;
            font-size: 8.5px;
          }
          .pagina-relatorio-executivo table.tabela th,
          .pagina-relatorio-executivo table.tabela td {
            white-space: normal !important;
            overflow-wrap: break-word;
            word-break: break-word;
            padding: 4px 5px;
          }
          .pagina-relatorio-executivo .card { break-inside: avoid; }
          .pagina-relatorio-executivo .grid-cols-2 { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="titulo-secao mb-1">Relatório executivo</p>
          <h1 className="text-xl font-bold">Boletim Diário de Operações — Condomínios</h1>
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            {nomeCondominio} · {dados.periodo.rotulo}
          </p>
        </div>
        <BotaoImprimir />
      </div>

      <FiltrosGlobais
        condominios={condominios.map((c) => ({ id: c.id, nome: c.nome }))}
        dePadrao={de}
        atePadrao={ate}
        hoje={hoje}
      />

      {/* ------------------------------------------------------------ KPIs -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <CartaoKPI
          rotulo="Cobertura de boletim"
          valor={pct(coberturaUtil)}
          unidade="%"
          nota={`${kpis.totalBoletins} de ${boletinsEsperadosUteis} boletins esperados em ${nDiasUteis} dias úteis (fim de semana não conta).`}
          destaque={coberturaUtil < 70 ? "alerta" : null}
        />
        <CartaoKPI
          rotulo="Dias em conformidade"
          valor={pct(kpis.percentualConformidade)}
          unidade="%"
          nota={`${kpis.diasConformes} de ${kpis.totalBoletins} boletins do período em que a ronda não encontrou nada novo.`}
          destaque={kpis.percentualConformidade >= 80 ? "bom" : null}
        />
        <CartaoKPI
          rotulo="Ocorrências no período"
          valor={`${kpis.abertasNoMes} / ${kpis.concluidasNoMes}`}
          nota={`Abertas / concluídas. Saldo ${
            kpis.abertasNoMes - kpis.concluidasNoMes >= 0 ? "+" : ""
          }${kpis.abertasNoMes - kpis.concluidasNoMes} no período.`}
        />
        <CartaoKPI
          rotulo="Taxa de críticas"
          valor={pct(kpis.taxaCriticas)}
          unidade="%"
          nota={`${kpis.criticasNoMes} ocorrência(s) de criticidade Alta entre as ${kpis.abertasNoMes} abertas.`}
          destaque={kpis.taxaCriticas >= 30 ? "alerta" : null}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <CartaoKPI
          rotulo="Em aberto (backlog)"
          valor={kpis.emAberto}
          nota="Pendentes + em andamento, de todos os períodos — não é um corte do mês."
        />
        <CartaoKPI
          rotulo="SLA estourado"
          valor={kpis.atrasadas}
          nota="Ocorrências em aberto com previsão de finalização vencida."
          destaque={kpis.atrasadas > 0 ? "alerta" : "bom"}
        />
        <CartaoKPI
          rotulo="Faltas registradas"
          valor={kpis.totalFaltas}
          nota={`${kpis.boletinsComFalta} dia(s) com falta reportada na equipe.`}
          destaque={kpis.boletinsComFalta > 0 ? "alerta" : null}
        />
        <CartaoKPI
          rotulo="Planos de ação"
          valor={dados.totalPlanos}
          nota="Projetos de longo prazo cadastrados no filtro atual."
        />
      </div>

      <ComparativoPeriodoAnterior
        rotuloAnterior={rotuloIntervalo(anterior.de, anterior.ate)}
        temDadoAnterior={dadosAnterior.kpis.totalBoletins > 0}
        itens={itensComparativo}
      />

      {/* Quadro de preenchimento: semáforo por cobertura de dias úteis —
          100% verde, 70-99% amarelo, abaixo de 70% vermelho. */}
      <QuadroPreenchimento
        linhas={quadroCorrigido}
        rotuloPeriodo={dados.periodo.rotulo}
        diasAnalisados={dados.periodo.diasDecorridos}
      />

      {/* --------------------------------------------------------- Gráficos -- */}
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <section className="card card-pad">
          <h2 className="font-semibold mb-1">Ocorrências por setor</h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Top 10 sistemas e áreas que mais geraram registros em {dados.periodo.rotulo}.
          </p>
          <GraficoSetores dados={dados.porSetor} />
        </section>

        <section className="card card-pad">
          <h2 className="font-semibold mb-1">
            Volume {dados.linhaDoTempo.agregadaPorMes ? "mensal" : "diário"} de ocorrências
          </h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            {dados.linhaDoTempo.agregadaPorMes
              ? "Aberturas mês a mês — o intervalo escolhido é longo demais para ler dia a dia."
              : "Aberturas dia a dia — revela concentrações e sazonalidade."}
          </p>
          <GraficoLinhaTempo dados={dados.linhaDoTempo.pontos} />
        </section>

        <section className="card card-pad">
          <h2 className="font-semibold mb-1">Conformidade dos dias</h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Como os {kpis.totalBoletins} boletins do período foram classificados.
          </p>
          <BarraConformidade dados={dados.distribuicaoStatusDia} />
        </section>

        <section className="card card-pad">
          <h2 className="font-semibold mb-1">Abertas x concluídas</h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Últimos 6 meses — a linha concluída abaixo da aberta significa backlog crescendo.
          </p>
          <GraficoHistoricoMensal dados={dados.historicoMensal} />
        </section>
      </div>

      {/* ------------------------------------------- Condomínio x boletim/ocor. */}
      <section className="card card-pad mb-4">
        <h2 className="font-semibold mb-1">Condomínios · boletins e ocorrências</h2>
        <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
          Cobertura recalculada sobre {nDiasUteis} dias úteis do período (sábado, domingo e
          feriado não contam).
        </p>

        <GraficoCondominios dados={porCondominioCorrigido.slice(0, 15)} />

        <div className="tabela-rolagem mt-4">
          <table className="tabela">
            <thead>
              <tr>
                <th>Condomínio</th>
                <th className="text-right">Boletins</th>
                <th className="text-right">Cobertura</th>
                <th className="text-right">Dias conformes</th>
                <th className="text-right">Ocorrências</th>
                <th className="text-right">Críticas</th>
                <th className="text-right">Em aberto</th>
                <th className="text-right">Atrasadas</th>
              </tr>
            </thead>
            <tbody>
              {porCondominioCorrigido.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ color: "var(--tinta-3)" }}>
                    Nenhum condomínio no filtro atual.
                  </td>
                </tr>
              ) : (
                porCondominioCorrigido.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.nome}
                      {!c.ativo ? <span className="badge badge-neutral ml-2">Inativo</span> : null}
                    </td>
                    <td className="text-right num">
                      {c.boletins}
                      <span style={{ color: "var(--tinta-3)" }}> / {c.boletinsEsperados}</span>
                    </td>
                    <td className="text-right num">
                      {c.cobertura === null ? (
                        <span style={{ color: "var(--tinta-3)" }}>—</span>
                      ) : (
                        <span
                          className="font-semibold"
                          style={
                            c.cobertura < 70 ? { color: "var(--status-critico-texto)" } : undefined
                          }
                        >
                          {c.cobertura < 70 ? "▲ " : ""}
                          {pct(c.cobertura)}%
                        </span>
                      )}
                    </td>
                    <td className="text-right num">{c.diasConformes}</td>
                    <td className="text-right num">{c.ocorrencias}</td>
                    <td className="text-right num">{c.criticas}</td>
                    <td className="text-right num">{c.emAberto}</td>
                    <td className="text-right num">
                      {c.atrasadas > 0 ? (
                        <span className="font-semibold" style={{ color: "var(--status-critico-texto)" }}>
                          ▲ {c.atrasadas}
                        </span>
                      ) : (
                        <span style={{ color: "var(--tinta-3)" }}>0</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------------------------------------------- Matriz de risco */}
      <section className="card card-pad mb-4">
        <h2 className="font-semibold mb-1">Matriz de risco — SLA x criticidade</h2>
        <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
          Backlog em aberto (pendentes e em andamento) de todo o histórico, cruzado com a
          previsão de finalização — não é um corte do período do relatório.
        </p>
        <div className="tabela-rolagem">
          <table className="tabela">
            <thead>
              <tr>
                <th>Criticidade</th>
                <th className="text-right">{ROTULO_FAIXA.ATRASADA}</th>
                <th className="text-right">{ROTULO_FAIXA.VENCE_3_DIAS}</th>
                <th className="text-right">{ROTULO_FAIXA.NO_PRAZO}</th>
                <th className="text-right">{ROTULO_FAIXA.SEM_PRAZO}</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {dados.matrizRisco.map((linha) => (
                <tr key={linha.criticidade}>
                  <td>
                    <span className={CRITICIDADE_CLASSE[linha.criticidade]}>
                      {CRITICIDADE_LABEL[linha.criticidade]}
                    </span>
                  </td>
                  {(["ATRASADA", "VENCE_3_DIAS", "NO_PRAZO", "SEM_PRAZO"] as const).map((faixa) => {
                    const valor = linha.celulas[faixa];
                    const emRisco = faixa === "ATRASADA" && valor > 0;
                    return (
                      <td key={faixa} className="text-right num">
                        <span
                          className="inline-block rounded px-2 py-0.5 font-semibold"
                          style={
                            emRisco
                              ? {
                                  color: "var(--status-critico-texto)",
                                  background: "color-mix(in srgb, var(--status-critico) 14%, transparent)",
                                }
                              : valor === 0
                                ? { color: "var(--tinta-3)" }
                                : { color: "var(--tinta)" }
                          }
                        >
                          {emRisco ? "▲ " : ""}
                          {valor}
                        </span>
                      </td>
                    );
                  })}
                  <td className="text-right num font-bold">{linha.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------------------------------------ Fila de prioridade */}
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem] mb-4">
        <section className="card card-pad">
          <h2 className="font-semibold mb-1">Fila de prioridade</h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Ocorrências <strong>pendentes</strong> de criticidade Alta ou Média, ordenadas por
            prazo — backlog atual, não um corte do período.
          </p>

          {dados.filaPrioridade.length === 0 ? (
            <div
              className="flex h-24 items-center justify-center rounded-lg text-sm"
              style={{ background: "var(--superficie-2)", color: "var(--tinta-3)" }}
            >
              Nenhuma ocorrência pendente de alta ou média criticidade. ✓
            </div>
          ) : (
            <div className="tabela-rolagem">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Setor</th>
                    <th>Condomínio</th>
                    <th>Criticidade</th>
                    <th>Previsão</th>
                    <th>Prazo</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.filaPrioridade.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <div className="font-semibold">{o.setor}</div>
                        <div className="text-xs line-clamp-1" style={{ color: "var(--tinta-3)" }}>
                          {o.descricao}
                        </div>
                      </td>
                      <td>{o.condominio}</td>
                      <td>
                        <span className={CRITICIDADE_CLASSE[o.criticidade]}>
                          {CRITICIDADE_LABEL[o.criticidade]}
                        </span>
                      </td>
                      <td className="num whitespace-nowrap">{formatarData(o.previsaoFinalizacao)}</td>
                      <td>
                        <MarcadorSLA dias={diasAteSLA(o.previsaoFinalizacao)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="card card-pad">
          <h2 className="font-semibold mb-1">Planos de ação</h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Distribuição por status.
          </p>
          <GraficoPlanos
            dados={dados.planosPorStatus.map((p) => ({
              status: STATUS_OCORRENCIA_LABEL[p.status],
              total: p.total,
            }))}
          />
        </aside>
      </div>

      {/* ------------------------------------------------- Ocorrências do período */}
      <section className="card card-pad mb-4">
        <h2 className="font-semibold mb-1">Ocorrências avaliadas — {dados.periodo.rotulo}</h2>
        <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
          Todo item aberto no período ({ocorrenciasPeriodo.length}), com condomínio, setor e
          desfecho.
        </p>
        {ocorrenciasPeriodo.length === 0 ? (
          <div
            className="flex h-24 items-center justify-center rounded-lg text-sm"
            style={{ background: "var(--superficie-2)", color: "var(--tinta-3)" }}
          >
            Nenhuma ocorrência aberta no período.
          </div>
        ) : (
          <div className="tabela-rolagem">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Abertura</th>
                  <th>Condomínio</th>
                  <th>Setor</th>
                  <th>Descrição</th>
                  <th>Criticidade</th>
                  <th>Status</th>
                  <th>Conclusão</th>
                </tr>
              </thead>
              <tbody>
                {ocorrenciasPeriodo.map((o) => (
                  <tr key={o.id}>
                    <td className="num whitespace-nowrap">{formatarData(o.dataAbertura)}</td>
                    <td>{o.condominio.nome}</td>
                    <td>{o.checklistItem?.nome ?? o.setorLivre ?? "—"}</td>
                    <td className="max-w-xs">
                      <span className="line-clamp-2">{o.descricao}</span>
                    </td>
                    <td>
                      <span className={CRITICIDADE_CLASSE[o.criticidade]}>
                        {CRITICIDADE_LABEL[o.criticidade]}
                      </span>
                    </td>
                    <td>
                      <span className={STATUS_OCORRENCIA_CLASSE[o.status]}>
                        {STATUS_OCORRENCIA_LABEL[o.status]}
                      </span>
                    </td>
                    <td className="num whitespace-nowrap">
                      {o.dataConclusao ? formatarData(o.dataConclusao) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs sem-impressao" style={{ color: "var(--tinta-3)" }}>
        Veja também o{" "}
        <Link href="/dashboard" style={{ color: "var(--serie-1)" }}>
          dashboard gerencial
        </Link>{" "}
        para acompanhamento do dia a dia.
      </p>
    </div>
  );
}
