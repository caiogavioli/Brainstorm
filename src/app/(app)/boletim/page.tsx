import Link from "next/link";

import { prisma } from "@/lib/db";
import { condominiosDaSessao, exigirSessao, filtroCondominio } from "@/lib/auth";
import { dataReferenciaDe } from "@/lib/datas";
import { FiltrosGlobais } from "@/components/filtros";
import { ListaBoletins } from "@/components/boletim/lista-selecionavel";

export const metadata = { title: "Boletins — Gestão de Condomínios" };

const DATA = /^\d{4}-\d{2}-\d{2}$/;

export default async function PaginaBoletins({
  searchParams,
}: {
  searchParams: Promise<{ condominio?: string; de?: string; ate?: string }>;
}) {
  const sessao = await exigirSessao();
  const params = await searchParams;

  const condominios = await condominiosDaSessao(sessao);

  const condominioFiltro = params.condominio ? Number(params.condominio) : null;
  const de = DATA.test(params.de ?? "") ? params.de! : "";
  const ate = DATA.test(params.ate ?? "") ? params.ate! : "";

  // O recorte é por `dataReferencia` — o dia a que o boletim se refere — e não
  // pelo instante em que a linha foi gravada. É a data que a lista mostra na
  // coluna "Data", e é a única imune a fuso: quem preenche às 21h30 o boletim
  // de hoje não pode vê-lo cair no dia seguinte.
  const where = {
    ...filtroCondominio(sessao, condominioFiltro),
    ...(de || ate
      ? {
          dataReferencia: {
            ...(de ? { gte: de } : {}),
            ...(ate ? { lte: ate } : {}),
          },
        }
      : {}),
  };

  const boletins = await prisma.boletim.findMany({
    where,
    orderBy: [{ dataReferencia: "desc" }, { id: "desc" }],
    take: 100,
    include: {
      condominio: { select: { nome: true } },
      criadoPor: { select: { nome: true } },
      _count: { select: { ocorrencias: true, recorrencias: true } },
    },
  });

  // Excluir em lote é ação de administrador — a mesma trava que já valia para
  // excluir um boletim só, na página de detalhe.
  const podeExcluir = sessao.papel === "ADMIN";

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
        rotuloPeriodo="Data do boletim"
        hoje={dataReferenciaDe()}
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
        <ListaBoletins
          podeExcluir={podeExcluir}
          boletins={boletins.map((b) => ({
            id: b.id,
            dataReferencia: b.dataReferencia,
            condominioNome: b.condominio.nome,
            statusGeral: b.statusGeral,
            houveFaltas: b.houveFaltas,
            qtdeFaltas: b.qtdeFaltas,
            setoresFaltas: b.setoresFaltas,
            preenchidoPor: b.preenchidoPor,
            criadoPorNome: b.criadoPor?.nome ?? null,
            dataRegistro: b.dataRegistro,
            ocorrencias: b._count.ocorrencias,
            recorrencias: b._count.recorrencias,
          }))}
        />
      )}
    </div>
  );
}
