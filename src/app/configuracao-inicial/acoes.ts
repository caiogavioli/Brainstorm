"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { hashSenha } from "@/lib/auth";
import { CATALOGO_CHECKLIST } from "@/lib/checklist";
import { primeiraMensagem } from "@/lib/validacao";

/**
 * Configuração inicial — cria o primeiro administrador sem precisar de
 * terminal, logo após o primeiro deploy.
 *
 * A tela só funciona com DUAS condições verdadeiras ao mesmo tempo:
 *
 *   1. `SETUP_TOKEN` está definido no ambiente e confere com o que foi digitado;
 *   2. ainda não existe nenhum administrador ativo no banco.
 *
 * A segunda condição fecha a janela para sempre assim que o primeiro admin é
 * criado — mesmo que a variável fique esquecida no ambiente. A primeira protege
 * a janela enquanto ela está aberta, para que ninguém que descubra a URL do site
 * recém-publicado crie o admin antes do dono.
 */

export type EstadoSetup = { erro?: string };

const setupSchema = z.object({
  token: z.string().min(1, "Informe o token de configuração."),
  nome: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  senha: z.string().min(10, "A senha precisa ter ao menos 10 caracteres."),
  confirmacao: z.string(),
});

/** Comparação em tempo constante, para não vazar o token por diferença de tempo. */
function tokensConferem(informado: string, esperado: string): boolean {
  if (informado.length !== esperado.length) return false;
  let diferenca = 0;
  for (let i = 0; i < informado.length; i++) {
    diferenca |= informado.charCodeAt(i) ^ esperado.charCodeAt(i);
  }
  return diferenca === 0;
}

export async function configuracaoDisponivel(): Promise<
  { ok: true } | { ok: false; motivo: "SEM_TOKEN" | "JA_CONFIGURADO" }
> {
  if (!process.env.SETUP_TOKEN) return { ok: false, motivo: "SEM_TOKEN" };

  const admins = await prisma.usuario.count({
    where: { papel: "ADMIN", ativo: true },
  });
  if (admins > 0) return { ok: false, motivo: "JA_CONFIGURADO" };

  return { ok: true };
}

export async function concluirConfiguracaoAction(
  _anterior: EstadoSetup,
  formData: FormData,
): Promise<EstadoSetup> {
  const esperado = process.env.SETUP_TOKEN;
  if (!esperado) {
    return { erro: "A configuração inicial está desativada neste ambiente." };
  }

  const parse = setupSchema.safeParse({
    token: formData.get("token") ?? "",
    nome: formData.get("nome") ?? "",
    email: formData.get("email") ?? "",
    senha: formData.get("senha") ?? "",
    confirmacao: formData.get("confirmacao") ?? "",
  });
  if (!parse.success) return { erro: primeiraMensagem(parse.error) };
  const dados = parse.data;

  if (dados.senha !== dados.confirmacao) {
    return { erro: "As senhas não conferem." };
  }
  if (!tokensConferem(dados.token, esperado)) {
    return { erro: "Token de configuração inválido." };
  }

  // Revalidado aqui, e não só na tela: entre carregar a página e enviar o
  // formulário, outra pessoa pode ter concluído a configuração.
  const admins = await prisma.usuario.count({
    where: { papel: "ADMIN", ativo: true },
  });
  if (admins > 0) {
    return { erro: "Este sistema já foi configurado. Use a tela de login." };
  }

  if (await prisma.usuario.findUnique({ where: { email: dados.email } })) {
    return { erro: "Já existe um usuário com este e-mail." };
  }

  await prisma.$transaction(async (tx) => {
    // O catálogo do checklist é dado obrigatório do sistema, não demonstração.
    for (const item of CATALOGO_CHECKLIST) {
      await tx.checklistItem.upsert({
        where: { codigo: item.codigo },
        update: { nome: item.nome, grupo: item.grupo, ordem: item.ordem, ativo: true },
        create: item,
      });
    }

    await tx.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senhaHash: await hashSenha(dados.senha),
        papel: "ADMIN",
      },
    });
  });

  redirect("/login?configurado=1");
}
