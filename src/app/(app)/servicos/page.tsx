import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import {
  FormularioServico,
  ListaServicos,
  type ServicoEditavel,
} from "@/components/servicos/catalogo";
import { PainelModelos } from "@/components/servicos/modelos";

export const metadata = { title: "Catálogo — Gestão de Condomínios" };

export default async function PaginaServicos() {
  await exigirAdmin();

  const [servicos, modelos] = await Promise.all([
    prisma.servicoCatalogo.findMany({
      orderBy: [{ ativo: "desc" }, { categoria: "asc" }, { ordem: "asc" }, { nome: "asc" }],
      include: { _count: { select: { itensModelo: true } } },
    }),
    prisma.modeloOrcamento.findMany({
      orderBy: [{ ativo: "desc" }, { nome: "asc" }],
      include: { itens: { orderBy: { ordem: "asc" } } },
    }),
  ]);

  const lista: ServicoEditavel[] = servicos.map((s) => ({
    id: s.id,
    codigo: s.codigo,
    nome: s.nome,
    descricao: s.descricao,
    categoria: s.categoria,
    unidade: s.unidade,
    valorPadraoCentavos: s.valorPadraoCentavos,
    ordem: s.ordem,
    ativo: s.ativo,
    usadoEmModelos: s._count.itensModelo,
  }));

  const categorias = [...new Set(servicos.map((s) => s.categoria))].sort();

  // Só serviços ativos entram no seletor do modelo: um item aposentado não
  // deveria voltar por um clique distraído numa lista longa.
  const catalogoAtivo = servicos
    .filter((s) => s.ativo)
    .map((s) => ({
      id: s.id,
      nome: s.nome,
      descricao: s.descricao,
      unidade: s.unidade,
      valorPadraoCentavos: s.valorPadraoCentavos,
      categoria: s.categoria,
    }));

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Catálogo e modelos</h1>
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          O <strong>catálogo</strong> guarda cada serviço que você vende, com
          descrição e preço. O <strong>modelo</strong> junta vários deles num
          orçamento pronto. É o que faz dois orçamentos do mesmo tipo saírem
          iguais.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6 order-2 lg:order-1">
          <section>
            <h2 className="font-semibold mb-2">Serviços do catálogo</h2>
            <ListaServicos servicos={lista} categorias={categorias} />
          </section>

          <section>
            <h2 className="font-semibold mb-2">Modelos de orçamento</h2>
            <PainelModelos
              modelos={modelos.map((m) => ({
                id: m.id,
                nome: m.nome,
                descricao: m.descricao,
                condicoesPagamento: m.condicoesPagamento,
                prazoExecucao: m.prazoExecucao,
                observacoes: m.observacoes,
                validadeDias: m.validadeDias,
                ativo: m.ativo,
                itens: m.itens.map((i) => ({
                  servicoCatalogoId: i.servicoCatalogoId,
                  descricao: i.descricao,
                  detalhe: i.detalhe,
                  unidade: i.unidade,
                  quantidadeMilesimos: i.quantidadeMilesimos,
                  valorUnitarioCentavos: i.valorUnitarioCentavos,
                })),
              }))}
              catalogo={catalogoAtivo}
            />
          </section>
        </div>

        <aside className="order-1 lg:order-2">
          <div className="card card-pad">
            <h2 className="font-semibold mb-3">Novo serviço</h2>
            <FormularioServico categorias={categorias} />
          </div>
        </aside>
      </div>
    </div>
  );
}
