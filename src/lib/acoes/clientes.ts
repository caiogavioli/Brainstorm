"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { clienteSchema, primeiraMensagem } from "@/lib/validacao";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

// O módulo comercial é do administrador. O gerente predial preenche boletim e
// acompanha ocorrências do prédio dele; preço de proposta não é assunto dele.

function lerCliente(formData: FormData) {
  return clienteSchema.safeParse({
    nome: formData.get("nome") ?? "",
    contato: formData.get("contato") ?? "",
    email: formData.get("email") ?? "",
    telefone: formData.get("telefone") ?? "",
    documento: formData.get("documento") ?? "",
    endereco: formData.get("endereco") ?? "",
    observacoes: formData.get("observacoes") ?? "",
    ativo: formData.get("ativo") !== null,
  });
}

export async function salvarClienteAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const parse = lerCliente(formData);
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const dados = parse.data;

  const idBruto = formData.get("id");
  const id = idBruto ? Number(idBruto) : null;

  try {
    const cliente = id
      ? await prisma.cliente.update({ where: { id }, data: dados })
      : await prisma.cliente.create({ data: dados });

    revalidatePath("/clientes");
    return {
      ok: true,
      id: cliente.id,
      mensagem: id ? "Cliente atualizado." : "Cliente cadastrado.",
    };
  } catch (erro) {
    // O e-mail é único no banco. Em vez de devolver o erro cru do Prisma, dizer
    // de quem é o cadastro que já ocupa o endereço — é essa informação que
    // permite decidir entre editar o existente ou usar outro e-mail.
    const conhecido = erro as Prisma.PrismaClientKnownRequestError;
    if (conhecido?.code === "P2002") {
      const existente = await prisma.cliente.findUnique({
        where: { email: dados.email },
        select: { nome: true, ativo: true },
      });
      return {
        ok: false,
        erro: existente
          ? `O e-mail ${dados.email} já está no cadastro de "${existente.nome}"${
              existente.ativo ? "" : " (inativo)"
            }.`
          : `O e-mail ${dados.email} já está em uso.`,
      };
    }
    console.error("Falha ao salvar cliente:", erro);
    return { ok: false, erro: "Não foi possível salvar o cliente." };
  }
}

/** Liga/desliga o cliente sem apagar histórico. */
export async function alternarClienteAction(
  id: number,
  ativo: boolean,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const cliente = await prisma.cliente.findUnique({
    where: { id },
    select: { nome: true },
  });
  if (!cliente) return { ok: false, erro: "Cliente não encontrado." };

  await prisma.cliente.update({ where: { id }, data: { ativo } });

  revalidatePath("/clientes");
  return {
    ok: true,
    mensagem: ativo
      ? `"${cliente.nome}" reativado — volta a aparecer na hora de orçar.`
      : `"${cliente.nome}" desativado — some da lista, cadastro preservado.`,
  };
}

/**
 * Exclusão definitiva, com o nome digitado como trava.
 *
 * Mesma barreira usada em condomínios: numa lista, a exclusão fica a um clique
 * errado de distância, e digitar o nome obriga a olhar para qual linha é.
 */
export async function excluirClienteAction(
  id: number,
  confirmacao: string,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const cliente = await prisma.cliente.findUnique({
    where: { id },
    select: { nome: true, _count: { select: { orcamentos: true } } },
  });
  if (!cliente) return { ok: false, erro: "Cliente não encontrado." };

  // Cliente com orçamento não é excluído, é desativado. Apagá-lo levaria junto
  // o histórico comercial — quanto foi orçado, o que foi aceito, o que foi
  // recusado — e é justamente esse histórico que responde se vale a pena
  // insistir nele no ano que vem.
  if (cliente._count.orcamentos > 0) {
    return {
      ok: false,
      erro: `"${cliente.nome}" tem ${cliente._count.orcamentos} orçamento(s) no histórico. Desative-o em vez de excluir.`,
    };
  }

  if (confirmacao.trim().toLowerCase() !== cliente.nome.trim().toLowerCase()) {
    return {
      ok: false,
      erro: `Para excluir, digite exatamente o nome do cliente: ${cliente.nome}`,
    };
  }

  await prisma.cliente.delete({ where: { id } });

  revalidatePath("/clientes");
  return { ok: true, mensagem: `Cliente "${cliente.nome}" excluído.` };
}
