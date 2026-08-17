import "server-only";

import { prisma } from "@/lib/db";
import type { DadosPdf } from "@/lib/orcamentos/pdf";

/**
 * Dados da empresa que emite o orçamento, vindos do ambiente.
 *
 * Ambiente e não banco: são cinco campos que mudam de ano em ano, e uma tela de
 * configuração para eles seria mais código para manter do que valor entregue.
 * Se um dia o sistema atender mais de uma empresa, isso vira tabela.
 */
export function dadosDaEmpresa() {
  return {
    nome: process.env.EMPRESA_NOME || "Sua Empresa",
    documento: process.env.EMPRESA_DOCUMENTO || null,
    endereco: process.env.EMPRESA_ENDERECO || null,
    telefone: process.env.EMPRESA_TELEFONE || null,
    email: process.env.EMPRESA_EMAIL || process.env.EMAIL_REMETENTE || null,
  };
}

/**
 * Endereço público do sistema, sem barra no fim.
 *
 * `APP_URL` é o valor autoritativo. O `VERCEL_URL` entra como reserva porque a
 * Vercel o injeta sozinha em cada implantação — sem ele, um ambiente de
 * pré-visualização geraria links apontando para produção.
 */
export function urlBase(): string | null {
  const explicita = process.env.APP_URL?.trim();
  if (explicita) return explicita.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return null;
}

/** Link do orçamento para o cliente, ou `null` se o endereço não foi configurado. */
export function linkPublico(token: string): string | null {
  const base = urlBase();
  return base ? `${base}/o/${token}` : null;
}

export async function orcamentoCompleto(id: number) {
  return prisma.orcamento.findUnique({
    where: { id },
    include: {
      cliente: true,
      criadoPor: { select: { nome: true } },
      itens: { orderBy: { ordem: "asc" } },
    },
  });
}

type OrcamentoCompleto = NonNullable<Awaited<ReturnType<typeof orcamentoCompleto>>>;

/** Traduz o registro do banco para o formato que o gerador de PDF espera. */
export function paraDadosPdf(orcamento: OrcamentoCompleto): DadosPdf {
  return {
    numero: orcamento.numero,
    versao: orcamento.versao,
    titulo: orcamento.titulo,
    criadoEm: orcamento.criadoEm,
    validoAte: orcamento.validoAte,
    subtotalCentavos: orcamento.subtotalCentavos,
    descontoCentavos: orcamento.descontoCentavos,
    totalCentavos: orcamento.totalCentavos,
    condicoesPagamento: orcamento.condicoesPagamento,
    prazoExecucao: orcamento.prazoExecucao,
    observacoes: orcamento.observacoes,
    // Rascunho não ganha link no PDF: ele ainda não foi enviado, e imprimir o
    // convite para "aceitar" num documento que é só um ensaio convida o cliente
    // a aceitar algo que você ainda estava escrevendo.
    linkPublico: orcamento.status === "RASCUNHO" ? null : linkPublico(orcamento.token),
    cliente: {
      nome: orcamento.cliente.nome,
      contato: orcamento.cliente.contato,
      email: orcamento.cliente.email,
      telefone: orcamento.cliente.telefone,
      documento: orcamento.cliente.documento,
      endereco: orcamento.cliente.endereco,
    },
    itens: orcamento.itens.map((i) => ({
      descricao: i.descricao,
      detalhe: i.detalhe,
      unidade: i.unidade,
      quantidadeMilesimos: i.quantidadeMilesimos,
      valorUnitarioCentavos: i.valorUnitarioCentavos,
      totalCentavos: i.totalCentavos,
    })),
    empresa: dadosDaEmpresa(),
  };
}
