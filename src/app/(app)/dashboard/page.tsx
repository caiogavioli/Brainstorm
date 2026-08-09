import Link from "next/link";

import { condominiosDaSessao, escopoCondominios, exigirAdmin } from "@/lib/auth";
import { carregarDashboard } from "@/lib/consultas/dashboard";
import { formatarData, diasAteSLA, mesReferenciaAtual } from "@/lib/datas";
import {
  CRITICIDADE_CLASSE,
  CRITICIDADE_LABEL,
  STATUS_OCORRENCIA_LABEL,
} from "@/lib/labels";
import { FiltrosGlobais } from "@/components/filtros";
import { CartaoKPI } from "@/components/dashboard/kpi";
import { MarcadorSLA } from "@/components/marcador-sla";
import {
  BarraConformidade,
  GraficoHistoricoMensal,
  GraficoLinhaTempo,
  GraficoPlanos,
  GraficoSetores,
} from "@/components/dashboard/graficos";

export const metadata = { title: "Dashboard — Gestão de Condomínios" };

const ROTULO_FAIXA: Record<string, string> = {
  ATRASADA: "Atrasada",
  VENCE_3_DIAS: "Vence em ≤3d",
  NO_PRAZO: "No prazo",
  SEM_PRAZO: "Sem prazo",
};

function pct(valor: number): string {
  return valor.toFixed(valor >= 10 ? 0 : 1).replace(".", ",");
}

export default async function PaginaDashboard({
  searchParams,
}: {
  searchParams: Promise<{ condominio?: string; mes?: string }>;
}) {
  const sessao = await exigirAdmin();
  const params = await searchParams;

  const condominios = await condominiosDaSessao(sessao);
  const condominioId = params.condominio ? Number(params.condominio) : null;
  const mes = /^\d{4}-\d{2}$/.test(params.mes ?? "")
    ? params.mes!
    : mesReferenciaAtual();

  const dados = await carregarDashboard({
    condominioId,
    mes,
    escopo: escopoCondominios(sessao),
  });

  const nomeCondominio = condominioId
    ? (condominios.find((c) => c.id === condominioId)?.nome ?? "Condomínio")
    : "Todos os condomínios";

  const { kpis } = dados;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Dashboard Gerencial</h1>
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          {nomeCondominio} · {dados.periodo.rotulo}
        </p>
      </div>

      <FiltrosGlobais
        condominios={condominios.map((c) => ({ id: c.id, nome: c.nome }))}
        mesPadrao={mes}
      />

      {/* ------------------------------------------------------------ KPIs -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <CartaoKPI
          rotulo="Dias em conformidade"
          valor={pct(kpis.percentualConformidade)}
          unidade="%"
          nota={`${kpis.diasConformes} de ${kpis.totalBoletins} boletins do mês sem nenhuma não conformidade.`}
          destaque={kpis.percentualConformidade >= 80 ? "bom" : null}
        />
        <CartaoKPI
          rotulo="Ocorrências no mês"
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
        <CartaoKPI
          rotulo="Faltas registradas"
          valor={kpis.totalFaltas}
          nota={`${kpis.boletinsComFalta} dia(s) com falta reportada na equipe.`}
          destaque={kpis.boletinsComFalta > 0 ? "alerta" : null}
        />
      </div>

      {/* Linha secundária: saúde do backlog e cobertura do preenchimento. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <CartaoKPI
          rotulo="Em aberto (backlog)"
          valor={kpis.emAberto}
          nota="Pendentes + em andamento, de todos os períodos."
        />
        <CartaoKPI
          rotulo="SLA estourado"
          valor={kpis.atrasadas}
          nota="Ocorrências em aberto com previsão de finalização vencida."
          destaque={kpis.atrasadas > 0 ? "alerta" : "bom"}
        />
        <CartaoKPI
          rotulo="Cobertura do boletim"
          valor={pct(kpis.coberturaBoletins)}
          unidade="%"
          nota={`${kpis.totalBoletins} de ${kpis.boletinsEsperados} boletins esperados até hoje. Conformidade só é confiável com cobertura alta.`}
          destaque={kpis.coberturaBoletins < 70 ? "alerta" : null}
        />
        <CartaoKPI
          rotulo="Planos de ação"
          valor={dados.totalPlanos}
          nota="Projetos de longo prazo cadastrados no filtro atual."
        />
      </div>

      {/* --------------------------------------------------------- Gráficos -- */}
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <section className="card card-pad">
          <h2 className="font-semibold mb-1">Ocorrências por setor</h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Top 10 sistemas e áreas que mais geraram registros em{" "}
            {dados.periodo.rotulo}.
          </p>
          <GraficoSetores dados={dados.porSetor} />
        </section>

        <section className="card card-pad">
          <h2 className="font-semibold mb-1">Volume diário de ocorrências</h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Aberturas dia a dia — revela concentrações e sazonalidade.
          </p>
          <GraficoLinhaTempo dados={dados.linhaDoTempo} />
        </section>

        <section className="card card-pad">
          <h2 className="font-semibold mb-1">Conformidade dos dias</h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Como os {kpis.totalBoletins} boletins do mês foram classificados.
          </p>
          <BarraConformidade dados={dados.distribuicaoStatusDia} />
        </section>

        <section className="card card-pad">
          <h2 className="font-semibold mb-1">Abertas x concluídas</h2>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Últimos 6 meses — a linha concluída abaixo da aberta significa
            backlog crescendo.
          </p>
          <GraficoHistoricoMensal dados={dados.historicoMensal} />
        </section>
      </div>

      {/* ---------------------------------------------------- Matriz de risco */}
      <section className="card card-pad mb-4">
        <h2 className="font-semibold mb-1">Matriz de risco — SLA x criticidade</h2>
        <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
          Ocorrências em aberto (pendentes e em andamento) cruzadas com a
          previsão de finalização. Cada célula é um link para a lista filtrada.
        </p>
        <div className="tabela-rolagem">
          <table className="tabela">
            <thead>
              <tr>
                <th>Criticidade</th>
                <th className="text-right">Atrasada</th>
                <th className="text-right">Vence em ≤3d</th>
                <th className="text-right">No prazo</th>
                <th className="text-right">Sem prazo</th>
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
                  {(["ATRASADA", "VENCE_3_DIAS", "NO_PRAZO", "SEM_PRAZO"] as const).map(
                    (faixa) => {
                      const valor = linha.celulas[faixa];
                      const emRisco = faixa === "ATRASADA" && valor > 0;
                      const rotulo = `${CRITICIDADE_LABEL[linha.criticidade]} · ${ROTULO_FAIXA[faixa]}`;

                      const conteudo = (
                        <span
                          className="inline-block rounded px-2 py-0.5 font-semibold"
                          style={
                            emRisco
                              ? {
                                  color: "var(--status-critico-texto)",
                                  background:
                                    "color-mix(in srgb, var(--status-critico) 14%, transparent)",
                                }
                              : valor === 0
                                ? { color: "var(--tinta-3)" }
                                : { color: "var(--tinta)" }
                          }
                        >
                          {emRisco ? "▲ " : ""}
                          {valor}
                        </span>
                      );

                      return (
                        <td key={faixa} className="text-right num">
                          {valor === 0 ? (
                            conteudo
                          ) : (
                            <Link
                              href={`/ocorrencias?criticidade=${linha.criticidade}&sla=${faixa}${
                                condominioId ? `&condominio=${condominioId}` : ""
                              }`}
                              title={`Ver ocorrências — ${rotulo}`}
                            >
                              {conteudo}
                            </Link>
                          )}
                        </td>
                      );
                    },
                  )}
                  <td className="text-right num font-bold">{linha.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------------------------------------ Fila de prioridade */}
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <section className="card card-pad">
          <div className="flex items-center justify-between gap-3 mb-1">
            <h2 className="font-semibold">Fila de prioridade</h2>
            <Link
              href="/ocorrencias?status=PENDENTE"
              className="text-xs font-semibold underline sem-impressao"
              style={{ color: "var(--serie-1)" }}
            >
              Ver todas
            </Link>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
            Ocorrências <strong>pendentes</strong> de criticidade Alta ou Média,
            ordenadas por prazo.
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
                        <Link
                          href={`/ocorrencias/${o.id}`}
                          className="font-semibold"
                          style={{ color: "var(--serie-1)" }}
                        >
                          {o.setor}
                        </Link>
                        <div
                          className="text-xs line-clamp-1"
                          style={{ color: "var(--tinta-3)" }}
                        >
                          {o.descricao}
                        </div>
                      </td>
                      <td>{o.condominio}</td>
                      <td>
                        <span className={CRITICIDADE_CLASSE[o.criticidade]}>
                          {CRITICIDADE_LABEL[o.criticidade]}
                        </span>
                      </td>
                      <td className="num whitespace-nowrap">
                        {formatarData(o.previsaoFinalizacao)}
                      </td>
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
          <Link
            href="/planos"
            className="botao botao-secundario w-full mt-3 sem-impressao"
          >
            Gerenciar planos
          </Link>
        </aside>
      </div>
    </div>
  );
}
