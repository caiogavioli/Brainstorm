"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { exigirAdmin, exigirSessao, podeAcessarCondominio } from "@/lib/auth";
import { condominioSchema, planoAcaoSchema, primeiraMensagem } from "@/lib/validacao";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

function paraData(valor: string | null): Date | null {
  return valor ? new Date(`${valor}T12:00:00.000Z`) : null;
}

function lerPlano(formData: FormData) {
  return planoAcaoSchema.safeParse({
    condominioId: formData.get("condominioId"),
    local: formData.get("local") ?? "",
    descricao: formData.get("descricao") ?? "",
    criticidade: formData.get("criticidade"),
    status: formData.get("status"),
    previsaoFinalizacao: formData.get("previsaoFinalizacao") ?? "",
    responsavel: formData.get("responsavel") ?? "",
    observacoes: formData.get("observacoes") ?? "",
  });
}

export async function criarPlanoAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await exigirSessao();
  const parse = lerPlano(formData);
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const dados = parse.data;

  if (!podeAcessarCondominio(sessao, dados.condominioId)) {
    return { ok: false, erro: "Sem permissão para este condomínio." };
  }

  const plano = await prisma.planoAcao.create({
    data: {
      condominioId: dados.condominioId,
      local: dados.local,
      descricao: dados.descricao,
      criticidade: dados.criticidade,
      status: dados.status,
      previsaoFinalizacao: paraData(dados.previsaoFinalizacao),
      dataConclusao: dados.status === "CONCLUIDO" ? new Date() : null,
      responsavel: dados.responsavel,
      observacoes: dados.observacoes,
    },
  });

  revalidatePath("/planos");
  revalidatePath("/dashboard");
  return { ok: true, id: plano.id, mensagem: "Plano de ação criado." };
}

export async function atualizarPlanoAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await exigirSessao();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { ok: false, erro: "Plano inválido." };

  const atual = await prisma.planoAcao.findUnique({
    where: { id },
    select: { condominioId: true, status: true, dataConclusao: true },
  });
  if (!atual || !podeAcessarCondominio(sessao, atual.condominioId)) {
    return { ok: false, erro: "Plano não encontrado ou sem permissão." };
  }

  const parse = lerPlano(formData);
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const dados = parse.data;

  if (!podeAcessarCondominio(sessao, dados.condominioId)) {
    return { ok: false, erro: "Sem permissão para este condomínio." };
  }

  await prisma.planoAcao.update({
    where: { id },
    data: {
      condominioId: dados.condominioId,
      local: dados.local,
      descricao: dados.descricao,
      criticidade: dados.criticidade,
      status: dados.status,
      previsaoFinalizacao: paraData(dados.previsaoFinalizacao),
      dataConclusao:
        dados.status === "CONCLUIDO" ? (atual.dataConclusao ?? new Date()) : null,
      responsavel: dados.responsavel,
      observacoes: dados.observacoes,
    },
  });

  revalidatePath("/planos");
  revalidatePath("/dashboard");
  return { ok: true, mensagem: "Plano atualizado." };
}

export async function excluirPlanoAction(id: number): Promise<ResultadoAcao> {
  const sessao = await exigirSessao();
  const atual = await prisma.planoAcao.findUnique({
    where: { id },
    select: { condominioId: true },
  });
  if (!atual || !podeAcessarCondominio(sessao, atual.condominioId)) {
    return { ok: false, erro: "Plano não encontrado ou sem permissão." };
  }

  await prisma.planoAcao.delete({ where: { id } });
  revalidatePath("/planos");
  revalidatePath("/dashboard");
  return { ok: true, mensagem: "Plano excluído." };
}

// ---------------------------------------------------------------------------
// Condomínios (somente ADMIN)
// ---------------------------------------------------------------------------

function lerCondominio(formData: FormData) {
  return condominioSchema.safeParse({
    nome: formData.get("nome") ?? "",
    endereco: formData.get("endereco") ?? "",
    gerenteResponsavel: formData.get("gerenteResponsavel") ?? "",
    telefone: formData.get("telefone") ?? "",
    email: formData.get("email") ?? "",
    ativo: formData.get("ativo") !== null,
  });
}

/**
 * Contagem do que seria perdido ao excluir um condomínio. A exclusão cascateia
 * para boletins, ocorrências e planos, então a interface mostra o tamanho do
 * estrago antes de perguntar.
 */
export async function resumoExclusaoCondominioAction(id: number) {
  await exigirAdmin();
  const [boletins, ocorrencias, planos, acessos] = await Promise.all([
    prisma.boletim.count({ where: { condominioId: id } }),
    prisma.ocorrencia.count({ where: { condominioId: id } }),
    prisma.planoAcao.count({ where: { condominioId: id } }),
    prisma.usuarioCondominio.count({ where: { condominioId: id } }),
  ]);
  return { boletins, ocorrencias, planos, acessos };
}

/** Exclui o condomínio e tudo que depende dele. Irreversível. */
export async function excluirCondominioAction(
  id: number,
  confirmacao: string,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const condominio = await prisma.condominio.findUnique({
    where: { id },
    select: { nome: true },
  });
  if (!condominio) return { ok: false, erro: "Condomínio não encontrado." };

  // Digitar o nome é a trava: impede exclusão por clique errado numa lista.
  if (confirmacao.trim().toLowerCase() !== condominio.nome.trim().toLowerCase()) {
    return {
      ok: false,
      erro: `Para excluir, digite exatamente o nome do condomínio: ${condominio.nome}`,
    };
  }

  await prisma.condominio.delete({ where: { id } });

  revalidatePath("/condominios");
  revalidatePath("/boletim");
  revalidatePath("/ocorrencias");
  revalidatePath("/dashboard");
  revalidatePath("/");
  return { ok: true, mensagem: `Condomínio "${condominio.nome}" excluído.` };
}

/** Liga/desliga o condomínio sem apagar histórico. */
export async function alternarCondominioAction(
  id: number,
  ativo: boolean,
): Promise<ResultadoAcao> {
  await exigirAdmin();
  const condominio = await prisma.condominio.findUnique({
    where: { id },
    select: { nome: true },
  });
  if (!condominio) return { ok: false, erro: "Condomínio não encontrado." };

  await prisma.condominio.update({ where: { id }, data: { ativo } });

  revalidatePath("/condominios");
  revalidatePath("/dashboard");
  revalidatePath("/");
  return {
    ok: true,
    mensagem: ativo
      ? `"${condominio.nome}" reativado — volta a aparecer no formulário.`
      : `"${condominio.nome}" desativado — some do formulário, histórico preservado.`,
  };
}

export async function salvarCondominioAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const parse = lerCondominio(formData);
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const dados = parse.data;

  const idBruto = formData.get("id");
  const id = idBruto ? Number(idBruto) : null;

  if (id) {
    await prisma.condominio.update({ where: { id }, data: dados });
  } else {
    await prisma.condominio.create({ data: dados });
  }

  revalidatePath("/condominios");
  revalidatePath("/dashboard");
  return { ok: true, mensagem: id ? "Condomínio atualizado." : "Condomínio cadastrado." };
}
