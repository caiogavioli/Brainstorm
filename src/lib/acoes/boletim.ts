"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { exigirSessao, podeAcessarCondominio, sessaoAtual } from "@/lib/auth";
import { boletimSchema, primeiraMensagem } from "@/lib/validacao";
import { registrarBoletim, resumoDoRegistro } from "@/lib/acoes/registrar-boletim";

export type ResultadoAcao =
  | { ok: true; id?: number; mensagem?: string; resumo?: string }
  | { ok: false; erro: string };

function revalidarTudo(id?: number) {
  revalidatePath("/boletim");
  revalidatePath("/ocorrencias");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/boletim/${id}`);
}

function tratarErro(erro: unknown): ResultadoAcao {
  console.error("Falha ao salvar boletim:", erro);
  const conhecido = erro as Prisma.PrismaClientKnownRequestError;
  if (conhecido?.code === "P2002") {
    return { ok: false, erro: "Já existe um boletim para este condomínio nesta data." };
  }
  return { ok: false, erro: "Não foi possível salvar o boletim. Tente novamente." };
}

/*
 * Aqui existia `enviarBoletimPublicoAction`, o envio sem login.
 *
 * Ela foi removida junto com o formulário público, e não apenas escondida da
 * tela: uma Server Action continua alcançável pelo seu identificador mesmo sem
 * nenhum botão apontando para ela. Deixar a função no arquivo seria manter uma
 * porta de escrita sem autenticação, fechada só por não estar desenhada.
 */

/**
 * Lançamento pelo painel, com usuário logado. Reenviar o mesmo dia substitui o
 * boletim — quem tem login pode corrigir o próprio registro.
 */
export async function salvarBoletimAction(payload: unknown): Promise<ResultadoAcao> {
  const sessao = await exigirSessao();

  const parse = boletimSchema.safeParse(payload);
  if (!parse.success) {
    return { ok: false, erro: primeiraMensagem(parse.error) };
  }
  const dados = parse.data;

  if (!podeAcessarCondominio(sessao, dados.condominioId)) {
    return { ok: false, erro: "Sem permissão para lançar boletim neste condomínio." };
  }

  try {
    const resultado = await registrarBoletim({
      dados,
      preenchidoPor: sessao.nome,
      usuarioId: sessao.usuarioId,
    });
    revalidarTudo(resultado.id);
    return {
      ok: true,
      id: resultado.id,
      mensagem: resumoDoRegistro(resultado),
      resumo: resultado.resumo,
    };
  } catch (erro) {
    return tratarErro(erro);
  }
}

/**
 * Correção de um boletim já enviado. Somente ADMIN.
 *
 * Difere de `salvarBoletimAction` em um ponto que importa: o nome de quem
 * preencheu é preservado. Quem corrige uma resposta errada não assume a autoria
 * da ronda — fica registrado como quem editou, em `criadoPorId`.
 */
export async function corrigirBoletimAction(payload: unknown): Promise<ResultadoAcao> {
  const sessao = await sessaoAtual();
  if (sessao?.papel !== "ADMIN") {
    return { ok: false, erro: "Apenas administradores podem corrigir boletins." };
  }

  const parse = boletimSchema.safeParse(payload);
  if (!parse.success) {
    return { ok: false, erro: primeiraMensagem(parse.error) };
  }
  const dados = parse.data;

  if (!podeAcessarCondominio(sessao, dados.condominioId)) {
    return { ok: false, erro: "Sem permissão para corrigir boletim neste condomínio." };
  }

  try {
    const resultado = await registrarBoletim({
      dados,
      preenchidoPor: sessao.nome,
      usuarioId: sessao.usuarioId,
      manterAutoria: true,
    });
    revalidarTudo(resultado.id);
    return {
      ok: true,
      id: resultado.id,
      mensagem: resumoDoRegistro(resultado),
      resumo: resultado.resumo,
    };
  } catch (erro) {
    return tratarErro(erro);
  }
}

/** Remove um boletim e o que ele originou. Somente ADMIN. */
export async function excluirBoletimAction(id: number): Promise<ResultadoAcao> {
  const sessao = await sessaoAtual();
  if (sessao?.papel !== "ADMIN") {
    return { ok: false, erro: "Apenas administradores podem excluir boletins." };
  }

  const boletim = await prisma.boletim.findUnique({
    where: { id },
    select: { condominioId: true },
  });
  if (!boletim) return { ok: false, erro: "Boletim não encontrado." };

  await prisma.$transaction(async (tx) => {
    const recorrencias = await tx.ocorrenciaRecorrencia.findMany({
      where: { boletimId: id },
      select: { ocorrenciaId: true },
    });
    for (const r of recorrencias) {
      await tx.ocorrencia.update({
        where: { id: r.ocorrenciaId },
        data: { totalRecorrencias: { decrement: 1 } },
      });
    }
    await tx.ocorrencia.deleteMany({ where: { boletimId: id, origem: "BOLETIM" } });
    await tx.boletim.delete({ where: { id } });
  });

  revalidarTudo();
  return { ok: true, mensagem: "Boletim excluído." };
}
