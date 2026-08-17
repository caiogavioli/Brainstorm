import Link from "next/link";
import type { Prisma, StatusOrcamento } from "@prisma/client";

import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { formatarData } from "@/lib/datas";
import { formatarMoeda } from "@/lib/dinheiro";
import {
  STATUS_ORCAMENTO_AJUDA,
  STATUS_ORCAMENTO_CLASSE,
  STATUS_ORCAMENTO_LABEL,
} from "@/lib/labels";

export const metadata = { title: "Orçamentos — Gestão de Condomínios" };

const STATUS_VALIDOS: StatusOrcamento[] = [
  "RASCUNHO",
  "ENVIADO",
  "VISUALIZADO",
  "ACEITO",
  "RECUSADO",
  "AJUSTE_SOLICITADO",
  "EXPIRADO",
];

/** Estados em que o negócio ainda está de pé — nem ganho, nem perdido. */
const EM_ABERTO: StatusOrcamento[] = [
  "ENVIADO",
  "VISUALIZADO",
  "AJUSTE_SOLICITADO",
];

export default async function PaginaOrcamentos({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; cliente?: string }>;
}) {
  await exigirAdmin();

  const filtros = await searchParams;
  const status = STATUS_VALIDOS.includes(filtros.status as StatusOrcamento)
    ? (filtros.status as StatusOrcamento)
    : null;
  const clienteId = Number(filtros.cliente) > 0 ? Number(filtros.cliente) : null;

  const where: Prisma.OrcamentoWhereInput = {
    ...(status ? { status } : {}),
    ...(clienteId ? { clienteId } : {}),
  };

  const [orcamentos, clientes, porStatus] = await Promise.all([
    prisma.orcamento.findMany({
      where,
      orderBy: { criadoEm: "desc" },
      take: 100,
      include: { cliente: { select: { nome: true } } },
    }),
    prisma.cliente.findMany({
      where: { orcamentos: { some: {} } },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    // Agregado sobre a base inteira, sem os filtros da tela: os indicadores
    // respondem "como está o funil", e um funil que muda de tamanho conforme o
    // filtro selecionado não responde nada.
    prisma.orcamento.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { totalCentavos: true },
    }),
  ]);

  const contagem = (lista: StatusOrcamento[]) =>
    porStatus
      .filter((g) => lista.includes(g.status))
      .reduce(
        (acc, g) => ({
          quantidade: acc.quantidade + g._count._all,
          valor: acc.valor + (g._sum.totalCentavos ?? 0),
        }),
        { quantidade: 0, valor: 0 },
      );

  const aberto = contagem(EM_ABERTO);
  const ganho = contagem(["ACEITO"]);
  const perdido = contagem(["RECUSADO"]);
  const rascunho = contagem(["RASCUNHO"]);

  // Taxa de aceite entre os que foram decididos. Contar os que ainda estão em
  // aberto no denominador afundaria a taxa sem que nada tivesse dado errado.
  const decididos = ganho.quantidade + perdido.quantidade;
  const taxaAceite = decididos > 0 ? Math.round((ganho.quantidade / decididos) * 100) : null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Orçamentos</h1>
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            O que foi proposto, para quem, e em que pé está.
          </p>
        </div>
        <Link href="/orcamentos/novo" className="botao botao-primario">
          + Novo orçamento
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Indicador
          rotulo="Em aberto"
          valor={formatarMoeda(aberto.valor)}
          apoio={`${aberto.quantidade} orçamento(s)`}
        />
        <Indicador
          rotulo="Ganho"
          valor={formatarMoeda(ganho.valor)}
          apoio={`${ganho.quantidade} aceito(s)`}
          cor="var(--status-bom-texto)"
        />
        <Indicador
          rotulo="Taxa de aceite"
          valor={taxaAceite === null ? "—" : `${taxaAceite}%`}
          apoio={
            decididos === 0 ? "nenhum decidido ainda" : `entre ${decididos} decidido(s)`
          }
        />
        <Indicador
          rotulo="Rascunhos"
          valor={String(rascunho.quantidade)}
          apoio="ainda não enviados"
        />
      </div>

      <form className="card card-pad mb-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label className="rotulo" htmlFor="filtro-status">
            Situação
          </label>
          <select id="filtro-status" name="status" className="campo" defaultValue={status ?? ""}>
            <option value="">Todas</option>
            {STATUS_VALIDOS.map((s) => (
              <option key={s} value={s}>
                {STATUS_ORCAMENTO_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rotulo" htmlFor="filtro-cliente">
            Cliente
          </label>
          <select
            id="filtro-cliente"
            name="cliente"
            className="campo"
            defaultValue={clienteId ?? ""}
          >
            <option value="">Todos</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="botao botao-secundario">
          Filtrar
        </button>
      </form>

      {orcamentos.length === 0 ? (
        <div className="card card-pad">
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            {status || clienteId
              ? "Nenhum orçamento com esses filtros."
              : "Nenhum orçamento ainda. Crie o primeiro — se você já montou um modelo no catálogo, ele preenche quase tudo sozinho."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {orcamentos.map((o) => (
            <Link
              key={o.id}
              href={`/orcamentos/${o.id}`}
              className="card card-pad block"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="num font-semibold" style={{ color: "var(--serie-1)" }}>
                      {o.numero}
                      {o.versao > 1 ? ` v${o.versao}` : ""}
                    </span>
                    <span className={STATUS_ORCAMENTO_CLASSE[o.status]}>
                      {STATUS_ORCAMENTO_LABEL[o.status]}
                    </span>
                  </div>
                  <div className="font-semibold mt-0.5">{o.titulo}</div>
                  <div className="text-xs" style={{ color: "var(--tinta-3)" }}>
                    {o.cliente.nome} · criado em {formatarData(o.criadoEm)}
                    {o.validoAte ? ` · vale até ${formatarData(o.validoAte)}` : ""}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-semibold num">{formatarMoeda(o.totalCentavos)}</div>
                  <div className="text-xs" style={{ color: "var(--tinta-3)" }}>
                    {STATUS_ORCAMENTO_AJUDA[o.status]}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Indicador({
  rotulo,
  valor,
  apoio,
  cor,
}: {
  rotulo: string;
  valor: string;
  apoio: string;
  cor?: string;
}) {
  return (
    <div className="card card-pad">
      <div className="titulo-secao">{rotulo}</div>
      <div className="text-lg font-bold num mt-1" style={cor ? { color: cor } : undefined}>
        {valor}
      </div>
      <div className="text-xs num" style={{ color: "var(--tinta-3)" }}>
        {apoio}
      </div>
    </div>
  );
}
