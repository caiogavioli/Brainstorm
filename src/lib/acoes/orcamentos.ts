"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { orcamentoSchema, primeiraMensagem } from "@/lib/validacao";
import { somarLinhas, totalLinhaCentavos } from "@/lib/dinheiro";
import { gerarToken, proximoNumero } from "@/lib/orcamentos/numero";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

/**
 * Estados em que o orçamento ainda pode ser editado livremente.
 *
 * Depois de enviado, o documento saiu das nossas mãos: o cliente tem um PDF e
 * um link. Reescrever os valores por baixo faria a tela dizer uma coisa e o
 * e-mail dele outra — e a divergência só apareceria na hora de cobrar. Mudança
 * em orçamento enviado é versão nova, que a fase 4 vai tratar.
 */
const EDITAVEIS = ["RASCUNHO"] as const;

function calcular(
  itens: { quantidade: number; valorUnitario: number }[],
  descontoCentavos: number,
) {
  const linhas = itens.map((i) => ({
    quantidadeMilesimos: i.quantidade,
    valorUnitarioCentavos: i.valorUnitario,
  }));
  const subtotal = somarLinhas(linhas);
  // O desconto nunca leva o total abaixo de zero: um orçamento negativo é
  // sempre erro de digitação, e gravá-lo espalharia o erro para o painel.
  const desconto = Math.min(descontoCentavos, subtotal);
  return { subtotal, desconto, total: subtotal - desconto };
}

/** Data de validade a partir de hoje, ao meio-dia UTC (ver src/lib/datas.ts). */
function validadeEm(dias: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + dias);
  d.setUTCHours(12, 0, 0, 0);
  return d;
}

export async function criarOrcamentoAction(payload: unknown): Promise<ResultadoAcao> {
  const sessao = await exigirAdmin();

  const parse = orcamentoSchema.safeParse(payload);
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const { itens, desconto, validadeDias, ...dados } = parse.data;

  const cliente = await prisma.cliente.findFirst({
    where: { id: dados.clienteId, ativo: true },
    select: { id: true },
  });
  if (!cliente) {
    return { ok: false, erro: "Cliente inválido ou inativo. Recarregue a página." };
  }

  const valores = calcular(itens, desconto);

  try {
    // A numeração precisa da trava consultiva, e a trava vive na transação.
    const orcamento = await prisma.$transaction(async (tx) => {
      const numero = await proximoNumero(tx);
      return tx.orcamento.create({
        data: {
          ...dados,
          numero,
          token: gerarToken(),
          subtotalCentavos: valores.subtotal,
          descontoCentavos: valores.desconto,
          totalCentavos: valores.total,
          validoAte: validadeEm(validadeDias),
          criadoPorId: sessao.usuarioId,
          itens: {
            create: itens.map((item, ordem) => ({
              ordem,
              servicoCatalogoId: item.servicoCatalogoId,
              descricao: item.descricao,
              detalhe: item.detalhe,
              unidade: item.unidade,
              quantidadeMilesimos: item.quantidade,
              valorUnitarioCentavos: item.valorUnitario,
              totalCentavos: totalLinhaCentavos(item.quantidade, item.valorUnitario),
            })),
          },
        },
        select: { id: true, numero: true },
      });
    });

    revalidatePath("/orcamentos");
    return {
      ok: true,
      id: orcamento.id,
      mensagem: `Orçamento ${orcamento.numero} criado.`,
    };
  } catch (erro) {
    console.error("Falha ao criar orçamento:", erro);
    return { ok: false, erro: "Não foi possível criar o orçamento." };
  }
}

export async function atualizarOrcamentoAction(payload: unknown): Promise<ResultadoAcao> {
  await exigirAdmin();

  const id = Number((payload as { id?: unknown } | null)?.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, erro: "Orçamento inválido." };
  }

  const atual = await prisma.orcamento.findUnique({
    where: { id },
    select: { status: true, numero: true },
  });
  if (!atual) return { ok: false, erro: "Orçamento não encontrado." };

  if (!EDITAVEIS.includes(atual.status as (typeof EDITAVEIS)[number])) {
    return {
      ok: false,
      erro: `O orçamento ${atual.numero} já foi enviado e não pode mais ser alterado. Para mudar os valores, gere uma nova versão.`,
    };
  }

  const parse = orcamentoSchema.safeParse(payload);
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const { itens, desconto, validadeDias, ...dados } = parse.data;

  const cliente = await prisma.cliente.findFirst({
    where: { id: dados.clienteId, ativo: true },
    select: { id: true },
  });
  if (!cliente) {
    return { ok: false, erro: "Cliente inválido ou inativo. Recarregue a página." };
  }

  const valores = calcular(itens, desconto);

  try {
    // Itens apagados e regravados: enquanto o orçamento é rascunho ninguém
    // aponta para uma linha dele, e casar item a item exigiria ids no
    // formulário para ganhar nada.
    await prisma.$transaction([
      prisma.orcamentoItem.deleteMany({ where: { orcamentoId: id } }),
      prisma.orcamento.update({
        where: { id },
        data: {
          ...dados,
          subtotalCentavos: valores.subtotal,
          descontoCentavos: valores.desconto,
          totalCentavos: valores.total,
          validoAte: validadeEm(validadeDias),
          itens: {
            create: itens.map((item, ordem) => ({
              ordem,
              servicoCatalogoId: item.servicoCatalogoId,
              descricao: item.descricao,
              detalhe: item.detalhe,
              unidade: item.unidade,
              quantidadeMilesimos: item.quantidade,
              valorUnitarioCentavos: item.valorUnitario,
              totalCentavos: totalLinhaCentavos(item.quantidade, item.valorUnitario),
            })),
          },
        },
      }),
    ]);
  } catch (erro) {
    console.error("Falha ao atualizar orçamento:", erro);
    return { ok: false, erro: "Não foi possível salvar o orçamento." };
  }

  revalidatePath("/orcamentos");
  revalidatePath(`/orcamentos/${id}`);
  return { ok: true, id, mensagem: `Orçamento ${atual.numero} salvo.` };
}

/**
 * Exclui um orçamento. Só rascunho — depois de enviado, o documento existe do
 * lado do cliente e apagá-lo aqui só destruiria a nossa metade da história.
 */
export async function excluirOrcamentoAction(id: number): Promise<ResultadoAcao> {
  await exigirAdmin();

  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    select: { numero: true, status: true },
  });
  if (!orcamento) return { ok: false, erro: "Orçamento não encontrado." };

  if (orcamento.status !== "RASCUNHO") {
    return {
      ok: false,
      erro: `O orçamento ${orcamento.numero} já saiu daqui e não pode ser apagado.`,
    };
  }

  await prisma.orcamento.delete({ where: { id } });

  revalidatePath("/orcamentos");
  return { ok: true, mensagem: `Orçamento ${orcamento.numero} excluído.` };
}

/**
 * Carrega um modelo para preencher o editor.
 *
 * Devolve os dados crus para o cliente montar as linhas — os valores só serão
 * gravados quando o orçamento for salvo, então nada aqui altera o banco.
 */
export async function carregarModeloAction(modeloId: number) {
  await exigirAdmin();

  const modelo = await prisma.modeloOrcamento.findFirst({
    where: { id: modeloId, ativo: true },
    include: { itens: { orderBy: { ordem: "asc" } } },
  });
  if (!modelo) return null;

  return {
    condicoesPagamento: modelo.condicoesPagamento,
    prazoExecucao: modelo.prazoExecucao,
    observacoes: modelo.observacoes,
    validadeDias: modelo.validadeDias,
    itens: modelo.itens.map((i) => ({
      servicoCatalogoId: i.servicoCatalogoId,
      descricao: i.descricao,
      detalhe: i.detalhe,
      unidade: i.unidade,
      quantidadeMilesimos: i.quantidadeMilesimos,
      valorUnitarioCentavos: i.valorUnitarioCentavos,
    })),
  };
}
