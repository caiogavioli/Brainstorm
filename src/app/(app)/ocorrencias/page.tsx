import Link from "next/link";
import type { Criticidade, Prisma, StatusOcorrencia } from "@prisma/client";

import { prisma } from "@/lib/db";
import { condominiosDaSessao, exigirSessao, filtroCondominio } from "@/lib/auth";
import {
  dataReferenciaDe,
  diasAteSLA,
  formatarData,
  intervaloDoMes,
} from "@/lib/datas";
import {
  CRITICIDADE_CLASSE,
  CRITICIDADE_LABEL,
  STATUS_OCORRENCIA_CLASSE,
  STATUS_OCORRENCIA_LABEL,
} from "@/lib/labels";
import { FiltrosGlobais } from "@/components/filtros";
import { MarcadorSLA } from "@/components/marcador-sla";

export const metadata = { title: "Ocorrências — Gestão de Condomínios" };

const STATUS_VALIDOS: StatusOcorrencia[] = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"];
const CRITICIDADES_VALIDAS: Criticidade[] = ["BAIXA", "MEDIA", "ALTA"];

/** Faixas de SLA — os mesmos recortes usados na matriz de risco do dashboard. */
const FAIXAS_SLA = {
  ATRASADA: "Atrasada",
  VENCE_3_DIAS: "Vence em ≤3 dias",
  NO_PRAZO: "No prazo",
  SEM_PRAZO: "Sem prazo",
} as const;
type FaixaSLA = keyof typeof FAIXAS_SLA;

/**
 * Traduz uma faixa de SLA em cláusula Prisma. Só faz sentido para ocorrências
 * em aberto, então a faixa também restringe o status.
 */
function filtroSLA(faixa: FaixaSLA): Prisma.OcorrenciaWhereInput {
  const hoje = new Date(`${dataReferenciaDe()}T00:00:00.000Z`);
  const emTresDias = new Date(hoje.getTime() + 4 * 86_400_000); // fim do 3º dia

  const emAberto: Prisma.OcorrenciaWhereInput = {
    status: { in: ["PENDENTE", "EM_ANDAMENTO"] },
  };

  switch (faixa) {
    case "ATRASADA":
      return { ...emAberto, previsaoFinalizacao: { lt: hoje } };
    case "VENCE_3_DIAS":
      return {
        ...emAberto,
        previsaoFinalizacao: { gte: hoje, lt: emTresDias },
      };
    case "NO_PRAZO":
      return { ...emAberto, previsaoFinalizacao: { gte: emTresDias } };
    case "SEM_PRAZO":
      return { ...emAberto, previsaoFinalizacao: null };
  }
}

export default async function PaginaOcorrencias({
  searchParams,
}: {
  searchParams: Promise<{
    condominio?: string;
    mes?: string;
    status?: string;
    criticidade?: string;
    sla?: string;
  }>;
}) {
  const sessao = await exigirSessao();
  const params = await searchParams;

  const condominios = await condominiosDaSessao(sessao);

  const condominioFiltro = params.condominio ? Number(params.condominio) : null;
  const status = STATUS_VALIDOS.includes(params.status as StatusOcorrencia)
    ? (params.status as StatusOcorrencia)
    : null;
  const criticidade = CRITICIDADES_VALIDAS.includes(params.criticidade as Criticidade)
    ? (params.criticidade as Criticidade)
    : null;
  const sla =
    params.sla && params.sla in FAIXAS_SLA ? (params.sla as FaixaSLA) : null;

  const where: Prisma.OcorrenciaWhereInput = {
    ...filtroCondominio(sessao, condominioFiltro),
    ...(status ? { status } : {}),
    ...(criticidade ? { criticidade } : {}),
    // A faixa de SLA já restringe o status para "em aberto"; quando o usuário
    // também escolheu um status, o dele prevalece na chave `status` acima.
    ...(sla ? filtroSLA(sla) : {}),
    ...(sla && status ? { status } : {}),
    ...(params.mes
      ? (() => {
          const { inicio, fim } = intervaloDoMes(params.mes!);
          return { dataAbertura: { gte: inicio, lt: fim } };
        })()
      : {}),
  };

  const [ocorrencias, contagens] = await Promise.all([
    prisma.ocorrencia.findMany({
      where,
      orderBy: [{ status: "asc" }, { criticidade: "desc" }, { previsaoFinalizacao: "asc" }],
      take: 200,
      include: {
        condominio: { select: { nome: true } },
        checklistItem: { select: { nome: true } },
        _count: { select: { fotos: true } },
      },
    }),
    prisma.ocorrencia.groupBy({
      by: ["status"],
      where: filtroCondominio(sessao, condominioFiltro),
      _count: { _all: true },
    }),
  ]);

  const porStatus = Object.fromEntries(
    contagens.map((c) => [c.status, c._count._all]),
  ) as Record<StatusOcorrencia, number | undefined>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Ocorrências</h1>
          <p className="text-sm num" style={{ color: "var(--tinta-2)" }}>
            {porStatus.PENDENTE ?? 0} pendentes · {porStatus.EM_ANDAMENTO ?? 0} em
            andamento · {porStatus.CONCLUIDO ?? 0} concluídas
          </p>
        </div>
        <Link href="/ocorrencias/nova" className="botao botao-primario sem-impressao">
          + Nova ocorrência
        </Link>
      </div>

      <FiltrosGlobais
        condominios={condominios.map((c) => ({ id: c.id, nome: c.nome }))}
        extras={[
          {
            nome: "status",
            rotulo: "Status",
            opcoes: [
              { valor: "", rotulo: "Todos" },
              ...STATUS_VALIDOS.map((s) => ({
                valor: s,
                rotulo: STATUS_OCORRENCIA_LABEL[s],
              })),
            ],
          },
          {
            nome: "criticidade",
            rotulo: "Criticidade",
            opcoes: [
              { valor: "", rotulo: "Todas" },
              ...CRITICIDADES_VALIDAS.map((c) => ({
                valor: c,
                rotulo: CRITICIDADE_LABEL[c],
              })),
            ],
          },
          {
            nome: "sla",
            rotulo: "Prazo (SLA)",
            opcoes: [
              { valor: "", rotulo: "Todos" },
              ...(Object.keys(FAIXAS_SLA) as FaixaSLA[]).map((f) => ({
                valor: f,
                rotulo: FAIXAS_SLA[f],
              })),
            ],
          },
        ]}
      />

      {ocorrencias.length === 0 ? (
        <div className="card card-pad text-center">
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            Nenhuma ocorrência encontrada com os filtros atuais.
          </p>
        </div>
      ) : (
        <>
          {/* Cartões no celular */}
          <ul className="space-y-2 md:hidden">
            {ocorrencias.map((o) => (
              <li key={o.id}>
                <Link href={`/ocorrencias/${o.id}`} className="card card-pad block">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-semibold text-sm min-w-0">
                      {o.checklistItem?.nome ?? o.setorLivre ?? "—"}
                    </div>
                    <span className={`${CRITICIDADE_CLASSE[o.criticidade]} flex-none`}>
                      {CRITICIDADE_LABEL[o.criticidade]}
                    </span>
                  </div>
                  <p
                    className="text-xs mb-2 line-clamp-2"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    {o.descricao}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={STATUS_OCORRENCIA_CLASSE[o.status]}>
                      {STATUS_OCORRENCIA_LABEL[o.status]}
                    </span>
                    <span style={{ color: "var(--tinta-3)" }}>{o.condominio.nome}</span>
                    <MarcadorSLA
                      dias={diasAteSLA(o.previsaoFinalizacao)}
                      concluida={o.status === "CONCLUIDO"}
                    />
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
                    <th>Abertura</th>
                    <th>Condomínio</th>
                    <th>Setor / Equipamento</th>
                    <th>Descrição</th>
                    <th>Criticidade</th>
                    <th>Status</th>
                    <th>SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {ocorrencias.map((o) => (
                    <tr key={o.id}>
                      <td className="num">{formatarData(o.dataAbertura)}</td>
                      <td>{o.condominio.nome}</td>
                      <td>
                        <Link
                          href={`/ocorrencias/${o.id}`}
                          className="font-semibold"
                          style={{ color: "var(--serie-1)" }}
                        >
                          {o.checklistItem?.nome ?? o.setorLivre ?? "—"}
                        </Link>
                        {o._count.fotos > 0 ? (
                          <span className="ml-2 text-xs" style={{ color: "var(--tinta-3)" }}>
                            📎 {o._count.fotos}
                          </span>
                        ) : null}
                      </td>
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
                        {formatarData(o.previsaoFinalizacao)}
                        <div className="mt-1">
                          <MarcadorSLA
                            dias={diasAteSLA(o.previsaoFinalizacao)}
                            concluida={o.status === "CONCLUIDO"}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
