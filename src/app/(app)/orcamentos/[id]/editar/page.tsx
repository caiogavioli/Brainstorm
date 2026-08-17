import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { EditorOrcamento } from "@/components/orcamentos/editor";

export const metadata = { title: "Editar orçamento — Gestão de Condomínios" };

/** Quantos dias de validade o orçamento tem, contados de hoje. */
function diasRestantes(validoAte: Date | null): number {
  if (!validoAte) return 15;
  const dias = Math.ceil((validoAte.getTime() - Date.now()) / 86_400_000);
  return Math.min(365, Math.max(1, dias));
}

export default async function PaginaEditarOrcamento({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirAdmin();

  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({
    where: { id: Number(id) },
    include: { itens: { orderBy: { ordem: "asc" } } },
  });
  if (!orcamento) notFound();

  // A trava de verdade está na Server Action; esta só evita mostrar um
  // formulário que não teria como salvar.
  if (orcamento.status !== "RASCUNHO") redirect(`/orcamentos/${orcamento.id}`);

  const [clientes, modelos, catalogo] = await Promise.all([
    prisma.cliente.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, contato: true },
    }),
    prisma.modeloOrcamento.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.servicoCatalogo.findMany({
      where: { ativo: true },
      orderBy: [{ categoria: "asc" }, { ordem: "asc" }, { nome: "asc" }],
      select: {
        id: true,
        nome: true,
        descricao: true,
        unidade: true,
        valorPadraoCentavos: true,
        categoria: true,
      },
    }),
  ]);

  return (
    <div>
      <div className="mb-4">
        <Link
          href={`/orcamentos/${orcamento.id}`}
          className="text-xs font-semibold underline"
          style={{ color: "var(--serie-1)" }}
        >
          ← Orçamento {orcamento.numero}
        </Link>
        <h1 className="text-xl font-bold mt-1 num">Editar {orcamento.numero}</h1>
      </div>

      <EditorOrcamento
        orcamento={{
          id: orcamento.id,
          clienteId: orcamento.clienteId,
          titulo: orcamento.titulo,
          condicoesPagamento: orcamento.condicoesPagamento,
          prazoExecucao: orcamento.prazoExecucao,
          observacoes: orcamento.observacoes,
          descontoCentavos: orcamento.descontoCentavos,
          validadeDias: diasRestantes(orcamento.validoAte),
          itens: orcamento.itens.map((i) => ({
            servicoCatalogoId: i.servicoCatalogoId,
            descricao: i.descricao,
            detalhe: i.detalhe,
            unidade: i.unidade,
            quantidadeMilesimos: i.quantidadeMilesimos,
            valorUnitarioCentavos: i.valorUnitarioCentavos,
          })),
        }}
        clientes={clientes}
        modelos={modelos}
        catalogo={catalogo}
      />
    </div>
  );
}
