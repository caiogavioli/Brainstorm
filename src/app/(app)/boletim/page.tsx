import Link from "next/link";

import { prisma } from "@/lib/db";
import { condominiosDaSessao, exigirSessao, filtroCondominio } from "@/lib/auth";
import { formatarDataReferencia, formatarDataHora, intervaloDoMes } from "@/lib/datas";
import { STATUS_DIA_CLASSE, STATUS_DIA_LABEL } from "@/lib/labels";
import { FiltrosGlobais } from "@/components/filtros";

export const metadata = { title: "Boletins — Gestão de Condomínios" };

export default async function PaginaBoletins({
  searchParams,
}: {
  searchParams: Promise<{ condominio?: string; mes?: string }>;
}) {
  const sessao = await exigirSessao();
  const params = await searchParams;

  const condominios = await condominiosDaSessao(sessao);

  const condominioFiltro = params.condominio ? Number(params.condominio) : null;
  const mes = params.mes ?? "";

  const where = {
    ...filtroCondominio(sessao, condominioFiltro),
    ...(mes
      ? (() => {
          const { inicio, fim } = intervaloDoMes(mes);
          return { dataRegistro: { gte: inicio, lt: fim } };
        })()
      : {}),
  };

  const boletins = await prisma.boletim.findMany({
    where,
    orderBy: [{ dataReferencia: "desc" }, { id: "desc" }],
    take: 100,
    include: {
      condominio: { select: { nome: true } },
      criadoPor: { select: { nome: true } },
      _count: { select: { ocorrencias: true } },
    },
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Boletins Diários</h1>
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            {boletins.length} registro(s) — os 100 mais recentes do filtro.
          </p>
        </div>
        <Link href="/boletim/novo" className="botao botao-primario sem-impressao">
          + Novo boletim
        </Link>
      </div>

      <FiltrosGlobais
        condominios={condominios.map((c) => ({ id: c.id, nome: c.nome }))}
      />

      {boletins.length === 0 ? (
        <div className="card card-pad text-center">
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            Nenhum boletim encontrado com os filtros atuais.
          </p>
          <Link href="/boletim/novo" className="botao botao-primario mt-3">
            Lançar o primeiro boletim
          </Link>
        </div>
      ) : (
        <>
          {/* Cartões no celular */}
          <ul className="space-y-2 md:hidden">
            {boletins.map((b) => (
              <li key={b.id}>
                <Link href={`/boletim/${b.id}`} className="card card-pad block">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-semibold text-sm">{b.condominio.nome}</div>
                      <div className="text-xs num" style={{ color: "var(--tinta-3)" }}>
                        {formatarDataReferencia(b.dataReferencia)}
                      </div>
                    </div>
                    <span className={STATUS_DIA_CLASSE[b.statusGeral]}>
                      {STATUS_DIA_LABEL[b.statusGeral]}
                    </span>
                  </div>
                  <div
                    className="flex gap-4 text-xs"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    <span className="num">
                      {b._count.ocorrencias} ocorrência(s)
                    </span>
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
                      <td className="num">
                        <Link
                          href={`/boletim/${b.id}`}
                          className="font-semibold"
                          style={{ color: "var(--serie-1)" }}
                        >
                          {formatarDataReferencia(b.dataReferencia)}
                        </Link>
                      </td>
                      <td>{b.condominio.nome}</td>
                      <td>
                        <span className={STATUS_DIA_CLASSE[b.statusGeral]}>
                          {STATUS_DIA_LABEL[b.statusGeral]}
                        </span>
                      </td>
                      <td className="num">{b._count.ocorrencias}</td>
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
                      <td>{b.criadoPor?.nome ?? "—"}</td>
                      <td className="num">{formatarDataHora(b.dataRegistro)}</td>
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
