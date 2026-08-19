"use server";

import { revalidatePath } from "next/cache";

import type { Papel } from "@prisma/client";

import { prisma } from "@/lib/db";
import { exigirAdmin, hashSenha } from "@/lib/auth";
import { resolverCondominios, validarLinhaUsuario } from "@/lib/importacao/usuarios";
import { gerarSenhaAleatoria } from "@/lib/senha-aleatoria";
import type { LinhaCsv } from "@/lib/importacao-csv";

export type LinhaResultadoUsuario = {
  linha: number;
  nome: string;
  email: string;
  ok: boolean;
  /** "criado" nunca reaparece: um e-mail já cadastrado é pulado, não alterado. */
  acao?: "criado" | "ja_existe";
  erro?: string;
  /**
   * Só presente quando a planilha não trouxe senha e uma foi gerada agora.
   * Existe UMA VEZ, nesta resposta — não fica gravada em lugar nenhum além do
   * hash no banco. Depois desta tela, ninguém mais consegue vê-la.
   */
  senhaGerada?: string;
};

export type ResultadoImportacaoUsuarios = {
  resultados: LinhaResultadoUsuario[];
  criados: number;
  jaExistiam: number;
  comErro: number;
};

/**
 * Importa usuários em lote, um por linha do CSV.
 *
 * Diferente da importação de condomínios, um e-mail que já existe é PULADO,
 * não atualizado — silenciosamente redefinir a senha de alguém a partir de
 * uma planilha reenviada seria fácil demais de fazer sem querer. Trocar senha
 * de quem já tem conta continua sendo o botão "Redefinir senha" em /usuarios,
 * uma ação deliberada.
 */
export async function importarUsuariosAction(
  linhas: LinhaCsv[],
): Promise<ResultadoImportacaoUsuarios> {
  await exigirAdmin();

  const condominios = await prisma.condominio.findMany({ select: { id: true, nome: true } });
  const emailsExistentes = new Set(
    (await prisma.usuario.findMany({ select: { email: true } })).map((u) => u.email),
  );

  const resultados: LinhaResultadoUsuario[] = [];
  let criados = 0;
  let jaExistiam = 0;

  for (const [indice, linha] of linhas.entries()) {
    const numeroLinha = indice + 2;
    const validacao = validarLinhaUsuario(linha);

    if (!validacao.ok) {
      resultados.push({
        linha: numeroLinha,
        nome: linha.nome ?? "",
        email: linha.email ?? "",
        ok: false,
        erro: validacao.erro,
      });
      continue;
    }

    const dados = validacao.dados;

    if (emailsExistentes.has(dados.email)) {
      jaExistiam++;
      resultados.push({
        linha: numeroLinha,
        nome: dados.nome,
        email: dados.email,
        ok: true,
        acao: "ja_existe",
      });
      continue;
    }

    const condominiosResolvidos = resolverCondominios(dados.condominiosNomes, condominios);
    if (!condominiosResolvidos.ok) {
      resultados.push({
        linha: numeroLinha,
        nome: dados.nome,
        email: dados.email,
        ok: false,
        erro: `Condomínio(s) não encontrado(s): ${condominiosResolvidos.naoEncontrados.join(", ")}. Importe os condomínios primeiro, ou corrija o nome.`,
      });
      continue;
    }

    const senhaEmTexto = dados.senha ?? gerarSenhaAleatoria();

    const usuario = await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senhaHash: await hashSenha(senhaEmTexto),
        // O refine do esquema já garante "ADMIN" | "GESTOR" em tempo de
        // execução; o tipo de `papel` só não carrega essa restrição porque o
        // Zod não estreita o tipo através de `.refine()`.
        papel: dados.papel as Papel,
        acessos: { create: condominiosResolvidos.ids.map((id) => ({ condominioId: id })) },
      },
    });
    // Evita que a mesma planilha, se tiver o e-mail repetido em duas linhas,
    // crie duas contas: a segunda ocorrência já encontra a primeira aqui.
    emailsExistentes.add(dados.email);
    criados++;

    resultados.push({
      linha: numeroLinha,
      nome: usuario.nome,
      email: usuario.email,
      ok: true,
      acao: "criado",
      ...(dados.senha === null ? { senhaGerada: senhaEmTexto } : {}),
    });
  }

  if (criados > 0) revalidatePath("/usuarios");

  return {
    resultados,
    criados,
    jaExistiam,
    comErro: resultados.filter((r) => !r.ok).length,
  };
}
