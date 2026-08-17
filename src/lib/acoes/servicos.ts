"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import {
  modeloOrcamentoSchema,
  primeiraMensagem,
  servicoCatalogoSchema,
} from "@/lib/validacao";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

// ---------------------------------------------------------------------------
// Catálogo de serviços
// ---------------------------------------------------------------------------

/**
 * "Limpeza de Caixa d'Água" -> "limpeza-de-caixa-d-agua".
 *
 * O código é o identificador estável do serviço: é por ele que se cruza
 * "quanto já orcei de manutenção elétrica" mesmo depois de o nome ter sido
 * reescrito. Por isso ele nasce do nome mas nunca mais o acompanha.
 */
function gerarSlug(nome: string): string {
  return (
    nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // tira os acentos que o NFD separou
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "servico"
  );
}

/** Slug livre no catálogo, acrescentando "-2", "-3"… quando já existir. */
async function slugDisponivel(nome: string): Promise<string> {
  const base = gerarSlug(nome);
  const parecidos = await prisma.servicoCatalogo.findMany({
    where: { codigo: { startsWith: base } },
    select: { codigo: true },
  });

  const tomados = new Set(parecidos.map((s) => s.codigo));
  if (!tomados.has(base)) return base;

  for (let n = 2; n < 1000; n++) {
    const tentativa = `${base}-${n}`;
    if (!tomados.has(tentativa)) return tentativa;
  }
  // Inalcançável na prática; evita devolver um código repetido em silêncio.
  throw new Error("Não foi possível gerar um código único para o serviço.");
}

function lerServico(formData: FormData) {
  return servicoCatalogoSchema.safeParse({
    nome: formData.get("nome") ?? "",
    descricao: formData.get("descricao") ?? "",
    categoria: formData.get("categoria") ?? "",
    unidade: formData.get("unidade") ?? "",
    valorPadrao: formData.get("valorPadrao") ?? "",
    ordem: formData.get("ordem") || 0,
    ativo: formData.get("ativo") !== null,
  });
}

export async function salvarServicoAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const parse = lerServico(formData);
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const { valorPadrao, ...resto } = parse.data;

  const idBruto = formData.get("id");
  const id = idBruto ? Number(idBruto) : null;

  try {
    if (id) {
      // O `codigo` não é regerado na edição: ele é a identidade do serviço, e
      // trocá-lo quebraria a ligação com os orçamentos que já o usaram.
      await prisma.servicoCatalogo.update({
        where: { id },
        data: { ...resto, valorPadraoCentavos: valorPadrao },
      });
    } else {
      await prisma.servicoCatalogo.create({
        data: {
          ...resto,
          codigo: await slugDisponivel(resto.nome),
          valorPadraoCentavos: valorPadrao,
        },
      });
    }
  } catch (erro) {
    console.error("Falha ao salvar serviço:", erro);
    return { ok: false, erro: "Não foi possível salvar o serviço." };
  }

  revalidatePath("/servicos");
  return { ok: true, mensagem: id ? "Serviço atualizado." : "Serviço cadastrado." };
}

export async function alternarServicoAction(
  id: number,
  ativo: boolean,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const servico = await prisma.servicoCatalogo.findUnique({
    where: { id },
    select: { nome: true },
  });
  if (!servico) return { ok: false, erro: "Serviço não encontrado." };

  await prisma.servicoCatalogo.update({ where: { id }, data: { ativo } });

  revalidatePath("/servicos");
  return {
    ok: true,
    mensagem: ativo
      ? `"${servico.nome}" reativado.`
      : `"${servico.nome}" desativado — não aparece mais ao montar orçamento.`,
  };
}

/**
 * Exclusão de serviço. Diferente de cliente e condomínio, aqui a trava não é
 * digitar o nome: um serviço usado por modelos não é excluído, é desativado.
 *
 * Excluir quebraria a origem das linhas dos modelos (viram `servicoCatalogoId`
 * nulo) e, na fase 2, a rastreabilidade dos orçamentos já enviados. Desativar
 * resolve o caso real — "não vendo mais isso" — sem perder o passado.
 */
export async function excluirServicoAction(id: number): Promise<ResultadoAcao> {
  await exigirAdmin();

  const servico = await prisma.servicoCatalogo.findUnique({
    where: { id },
    select: { nome: true, _count: { select: { itensModelo: true } } },
  });
  if (!servico) return { ok: false, erro: "Serviço não encontrado." };

  if (servico._count.itensModelo > 0) {
    return {
      ok: false,
      erro: `"${servico.nome}" é usado por ${servico._count.itensModelo} item(ns) de modelo. Desative-o em vez de excluir.`,
    };
  }

  await prisma.servicoCatalogo.delete({ where: { id } });

  revalidatePath("/servicos");
  return { ok: true, mensagem: `Serviço "${servico.nome}" excluído.` };
}

// ---------------------------------------------------------------------------
// Modelos de orçamento
// ---------------------------------------------------------------------------

/**
 * Cria ou atualiza um modelo junto com todos os seus itens.
 *
 * Recebe um objeto e não um `FormData` porque a lista de itens é dinâmica —
 * mesmo caminho que o wizard do boletim já usa.
 *
 * Na edição, os itens são apagados e regravados dentro de uma transação. É a
 * escolha certa aqui: o modelo é um rascunho reutilizável, ninguém aponta para
 * uma linha dele, e casar item a item exigiria ids no formulário para ganhar
 * nada. Um orçamento emitido nunca será tratado assim.
 */
export async function salvarModeloAction(payload: unknown): Promise<ResultadoAcao> {
  await exigirAdmin();

  const parse = modeloOrcamentoSchema.safeParse(payload);
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const { itens, ...modelo } = parse.data;

  const idBruto = (payload as { id?: unknown } | null)?.id;
  const id = Number(idBruto) > 0 ? Number(idBruto) : null;

  const linhas = itens.map((item, indice) => ({
    ordem: indice,
    servicoCatalogoId: item.servicoCatalogoId,
    descricao: item.descricao,
    detalhe: item.detalhe,
    unidade: item.unidade,
    quantidadeMilesimos: item.quantidade,
    valorUnitarioCentavos: item.valorUnitario,
  }));

  try {
    if (id) {
      const existe = await prisma.modeloOrcamento.count({ where: { id } });
      if (existe === 0) return { ok: false, erro: "Modelo não encontrado." };

      await prisma.$transaction([
        prisma.modeloOrcamentoItem.deleteMany({ where: { modeloId: id } }),
        prisma.modeloOrcamento.update({
          where: { id },
          data: { ...modelo, itens: { create: linhas } },
        }),
      ]);

      revalidatePath("/servicos");
      return { ok: true, id, mensagem: "Modelo atualizado." };
    }

    const criado = await prisma.modeloOrcamento.create({
      data: { ...modelo, itens: { create: linhas } },
      select: { id: true },
    });

    revalidatePath("/servicos");
    return { ok: true, id: criado.id, mensagem: "Modelo criado." };
  } catch (erro) {
    console.error("Falha ao salvar modelo de orçamento:", erro);
    return { ok: false, erro: "Não foi possível salvar o modelo." };
  }
}

export async function alternarModeloAction(
  id: number,
  ativo: boolean,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const modelo = await prisma.modeloOrcamento.findUnique({
    where: { id },
    select: { nome: true },
  });
  if (!modelo) return { ok: false, erro: "Modelo não encontrado." };

  await prisma.modeloOrcamento.update({ where: { id }, data: { ativo } });

  revalidatePath("/servicos");
  return {
    ok: true,
    mensagem: ativo ? `"${modelo.nome}" reativado.` : `"${modelo.nome}" desativado.`,
  };
}

/** Exclui o modelo e seus itens (cascata no banco). */
export async function excluirModeloAction(id: number): Promise<ResultadoAcao> {
  await exigirAdmin();

  const modelo = await prisma.modeloOrcamento.findUnique({
    where: { id },
    select: { nome: true },
  });
  if (!modelo) return { ok: false, erro: "Modelo não encontrado." };

  await prisma.modeloOrcamento.delete({ where: { id } });

  revalidatePath("/servicos");
  return { ok: true, mensagem: `Modelo "${modelo.nome}" excluído.` };
}
