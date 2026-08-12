import type { Prisma, StatusOcorrencia } from "@prisma/client";

import { prisma } from "@/lib/db";
import { condominiosDaSessao, exigirSessao, filtroCondominio } from "@/lib/auth";
import {
  dataReferenciaDe,
  diasAteSLA,
  formatarData,
  inicioDoDiaLocal,
  paraInputDate,
  somarDias,
} from "@/lib/datas";
import {
  CRITICIDADE_CLASSE,
  CRITICIDADE_LABEL,
  STATUS_OCORRENCIA_CLASSE,
  STATUS_OCORRENCIA_LABEL,
} from "@/lib/labels";
import { FiltrosGlobais } from "@/components/filtros";
import { MarcadorSLA } from "@/components/marcador-sla";
import { EditarPlano, NovoPlano } from "@/components/planos/painel";

export const metadata = { title: "Planos de ação — Gestão de Condomínios" };

const STATUS_VALIDOS: StatusOcorrencia[] = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"];
const DATA = /^\d{4}-\d{2}-\d{2}$/;

export default async function PaginaPlanos({
  searchParams,
}: {
  searchParams: Promise<{
    condominio?: string;
    status?: string;
    de?: string;
    ate?: string;
  }>;
}) {
  const sessao = await exigirSessao();
  const params = await searchParams;

  const condominios = await condominiosDaSessao(sessao);

  const condominioFiltro = params.condominio ? Number(params.condominio) : null;
  const status = STATUS_VALIDOS.includes(params.status as StatusOcorrencia)
    ? (params.status as StatusOcorrencia)
    : null;
  const de = DATA.test(params.de ?? "") ? params.de! : "";
  const ate = DATA.test(params.ate ?? "") ? params.ate! : "";

  // Aqui a data que interessa é a previsão de finalização — "o que vence nas
  // próximas duas semanas" é a pergunta que se faz a um plano de ação, não
  // quando ele foi cadastrado. Por isso o intervalo nasce vazio: com ele
  // preenchido, planos sem previsão somem da lista, e sumir é uma decisão que
  // tem que ser do usuário.
  const where: Prisma.PlanoAcaoWhereInput = {
    ...filtroCondominio(sessao, condominioFiltro),
    ...(status ? { status } : {}),
    ...(de || ate
      ? {
          previsaoFinalizacao: {
            ...(de ? { gte: inicioDoDiaLocal(de) } : {}),
            ...(ate ? { lt: inicioDoDiaLocal(somarDias(ate, 1)) } : {}),
          },
        }
      : {}),
  };

  const planos = await prisma.planoAcao.findMany({
    where,
    orderBy: [{ status: "asc" }, { criticidade: "desc" }, { previsaoFinalizacao: "asc" }],
    include: { condominio: { select: { nome: true } } },
  });

  const listaCondominios = condominios.map((c) => ({ id: c.id, nome: c.nome }));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Planos de Ação</h1>
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            Projetos de longo prazo e melhorias operacionais.
          </p>
        </div>
        <NovoPlano condominios={listaCondominios} />
      </div>

      <FiltrosGlobais
        condominios={listaCondominios}
        rotuloPeriodo="Previsão"
        ajudaPeriodo="Com um intervalo de previsão preenchido, planos sem data prevista ficam de fora da lista."
        hoje={dataReferenciaDe()}
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
        ]}
      />

      {planos.length === 0 ? (
        <div className="card card-pad text-center">
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            Nenhum plano de ação cadastrado com os filtros atuais.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {planos.map((p) => (
            <li key={p.id} className="card card-pad">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{p.local}</div>
                  <div className="text-xs" style={{ color: "var(--tinta-3)" }}>
                    {p.condominio.nome} · criado em{" "}
                    <span className="num">{formatarData(p.dataCriacao)}</span>
                    {p.responsavel ? ` · ${p.responsavel}` : ""}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={CRITICIDADE_CLASSE[p.criticidade]}>
                    {CRITICIDADE_LABEL[p.criticidade]}
                  </span>
                  <span className={STATUS_OCORRENCIA_CLASSE[p.status]}>
                    {STATUS_OCORRENCIA_LABEL[p.status]}
                  </span>
                </div>
              </div>

              <p className="text-sm mb-2" style={{ color: "var(--tinta-2)" }}>
                {p.descricao}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="num" style={{ color: "var(--tinta-3)" }}>
                  Previsão: {formatarData(p.previsaoFinalizacao)}
                </span>
                <MarcadorSLA
                  dias={diasAteSLA(p.previsaoFinalizacao)}
                  concluida={p.status === "CONCLUIDO"}
                />
                <EditarPlano
                  condominios={listaCondominios}
                  plano={{
                    id: p.id,
                    condominioId: p.condominioId,
                    local: p.local,
                    descricao: p.descricao,
                    criticidade: p.criticidade,
                    status: p.status,
                    previsaoFinalizacao: paraInputDate(p.previsaoFinalizacao),
                    responsavel: p.responsavel ?? "",
                    observacoes: p.observacoes ?? "",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
