"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { exigirAdmin, hashSenha } from "@/lib/auth";
import { primeiraMensagem } from "@/lib/validacao";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

const SENHA_MINIMA = 8;

const usuarioSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do usuário."),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  senha: z
    .string()
    .min(SENHA_MINIMA, `A senha precisa ter ao menos ${SENHA_MINIMA} caracteres.`),
  papel: z.enum(["ADMIN", "GESTOR"]),
  condominios: z.array(z.coerce.number().int().positive()),
});

function lerCondominios(formData: FormData): number[] {
  return formData
    .getAll("condominios")
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0);
}

/**
 * Cria um usuário e vincula os condomínios que ele poderá operar.
 * Só ADMIN pode chamar — é a ação que concede acesso ao sistema.
 */
export async function criarUsuarioAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const parse = usuarioSchema.safeParse({
    nome: formData.get("nome") ?? "",
    email: formData.get("email") ?? "",
    senha: formData.get("senha") ?? "",
    papel: formData.get("papel"),
    condominios: lerCondominios(formData),
  });
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const dados = parse.data;

  // Um gerente sem condomínio vinculado entraria em um sistema vazio.
  if (dados.papel === "GESTOR" && dados.condominios.length === 0) {
    return {
      ok: false,
      erro: "Selecione ao menos um condomínio para o usuário.",
    };
  }

  if (await prisma.usuario.findUnique({ where: { email: dados.email } })) {
    return { ok: false, erro: "Já existe um usuário com este e-mail." };
  }

  // Só vincula condomínios que existem de fato.
  const validos = await prisma.condominio.findMany({
    where: { id: { in: dados.condominios } },
    select: { id: true },
  });

  const usuario = await prisma.usuario.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senhaHash: await hashSenha(dados.senha),
      papel: dados.papel,
      acessos: { create: validos.map((c) => ({ condominioId: c.id })) },
    },
  });

  revalidatePath("/usuarios");
  return { ok: true, id: usuario.id, mensagem: `Usuário ${dados.email} criado.` };
}

/** Atualiza nome, e-mail, papel e condomínios de um usuário existente. */
export async function atualizarUsuarioAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await exigirAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { ok: false, erro: "Usuário inválido." };

  const identidade = usuarioSchema
    .pick({ nome: true, email: true })
    .safeParse({
      nome: formData.get("nome") ?? "",
      email: formData.get("email") ?? "",
    });
  if (!identidade.success) {
    return { ok: false, erro: primeiraMensagem(identidade.error) };
  }

  const papel = formData.get("papel") === "ADMIN" ? "ADMIN" : "GESTOR";
  const condominios = lerCondominios(formData);
  const ativo = formData.get("ativo") !== null;

  const alvo = await prisma.usuario.findUnique({ where: { id }, select: { papel: true } });
  if (!alvo) return { ok: false, erro: "Usuário não encontrado." };

  // O e-mail é o login: um duplicado deixaria dois usuários disputando a mesma
  // credencial, então barra antes de tentar o update.
  const jaUsado = await prisma.usuario.findUnique({
    where: { email: identidade.data.email },
    select: { id: true },
  });
  if (jaUsado && jaUsado.id !== id) {
    return { ok: false, erro: "Já existe outro usuário com este e-mail." };
  }

  if (papel === "GESTOR" && condominios.length === 0) {
    return { ok: false, erro: "Selecione ao menos um condomínio para o usuário." };
  }

  // Trava de segurança: impede que o último admin ativo se rebaixe ou se
  // desative e deixe o sistema sem ninguém capaz de administrar.
  const perdeAdmin = alvo.papel === "ADMIN" && (papel !== "ADMIN" || !ativo);
  if (perdeAdmin) {
    const outrosAdmins = await prisma.usuario.count({
      where: { papel: "ADMIN", ativo: true, id: { not: id } },
    });
    if (outrosAdmins === 0) {
      return {
        ok: false,
        erro: "Este é o único administrador ativo. Promova outro antes de alterá-lo.",
      };
    }
  }
  if (id === sessao.usuarioId && !ativo) {
    return { ok: false, erro: "Você não pode desativar o próprio usuário." };
  }

  const validos = await prisma.condominio.findMany({
    where: { id: { in: condominios } },
    select: { id: true },
  });

  await prisma.$transaction([
    prisma.usuario.update({
      where: { id },
      data: {
        nome: identidade.data.nome,
        email: identidade.data.email,
        papel,
        ativo,
      },
    }),
    prisma.usuarioCondominio.deleteMany({ where: { usuarioId: id } }),
    prisma.usuarioCondominio.createMany({
      data: validos.map((c) => ({ usuarioId: id, condominioId: c.id })),
    }),
  ]);

  revalidatePath("/usuarios");
  return { ok: true, mensagem: "Usuário atualizado." };
}

/** Define uma nova senha para um usuário (o admin não vê a senha antiga). */
export async function redefinirSenhaAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  await exigirAdmin();

  const id = Number(formData.get("id"));
  const senha = String(formData.get("senha") ?? "");

  if (!Number.isInteger(id) || id <= 0) return { ok: false, erro: "Usuário inválido." };
  if (senha.length < SENHA_MINIMA) {
    return {
      ok: false,
      erro: `A senha precisa ter ao menos ${SENHA_MINIMA} caracteres.`,
    };
  }

  const usuario = await prisma.usuario.findUnique({ where: { id }, select: { email: true } });
  if (!usuario) return { ok: false, erro: "Usuário não encontrado." };

  await prisma.usuario.update({
    where: { id },
    data: { senhaHash: await hashSenha(senha) },
  });

  revalidatePath("/usuarios");
  return { ok: true, mensagem: `Senha de ${usuario.email} redefinida.` };
}

/**
 * Exclui um usuário. As travas existem para que ninguém consiga se trancar
 * para fora do próprio sistema: não dá para apagar a si mesmo, nem o último
 * administrador ativo.
 *
 * Boletins e ocorrências lançados por ele permanecem — as chaves são
 * `SetNull`, então o histórico não some junto com a conta.
 */
export async function excluirUsuarioAction(id: number): Promise<ResultadoAcao> {
  const sessao = await exigirAdmin();

  if (id === sessao.usuarioId) {
    return { ok: false, erro: "Você não pode excluir o próprio usuário." };
  }

  const alvo = await prisma.usuario.findUnique({
    where: { id },
    select: { email: true, papel: true, ativo: true },
  });
  if (!alvo) return { ok: false, erro: "Usuário não encontrado." };

  if (alvo.papel === "ADMIN" && alvo.ativo) {
    const outrosAdmins = await prisma.usuario.count({
      where: { papel: "ADMIN", ativo: true, id: { not: id } },
    });
    if (outrosAdmins === 0) {
      return {
        ok: false,
        erro: "Este é o único administrador ativo. Promova outro antes de excluí-lo.",
      };
    }
  }

  await prisma.usuario.delete({ where: { id } });

  revalidatePath("/usuarios");
  return { ok: true, mensagem: `Usuário ${alvo.email} excluído.` };
}
