/**
 * Formato de uma linha de usuário vinda do CSV, e sua validação.
 *
 * Mesma divisão de responsabilidade do arquivo irmão em `condominios.ts`: o
 * esquema roda no cliente para a prévia e de novo no servidor antes de gravar.
 * A diferença aqui é que uma linha também depende de dado externo — os
 * condomínios cadastrados —, por isso a resolução dos nomes fica numa função
 * separada, chamada com a lista de condomínios que cada lado já tem à mão (a
 * página carrega do banco; o servidor consulta de novo, sem confiar na lista
 * que o cliente enviou).
 */

import { z } from "zod";

import type { LinhaCsv } from "@/lib/importacao-csv";

const SENHA_MINIMA = 8;

export const linhaUsuarioSchema = z
  .object({
    nome: z.string(),
    email: z.string(),
    senha: z.string().optional().default(""),
    papel: z.string(),
    condominios: z.string().optional().default(""),
  })
  .transform((v) => ({
    nome: v.nome.trim(),
    email: v.email.trim().toLowerCase(),
    // Em branco não é erro: o servidor gera uma senha aleatória e a devolve
    // uma única vez, para o admin copiar e repassar.
    senha: v.senha.trim() === "" ? null : v.senha.trim(),
    papel: v.papel.trim().toUpperCase(),
    // ";" e não "," — nomes de condomínio podem ter vírgula (endereço embutido
    // no nome, por exemplo), e um CSV já usa vírgula para separar colunas.
    condominiosNomes: v.condominios
      .split(";")
      .map((n) => n.trim())
      .filter((n) => n.length > 0),
  }))
  .refine((v) => v.nome.length >= 2, {
    message: "Nome do usuário é obrigatório.",
    path: ["nome"],
  })
  .refine((v) => z.string().email().safeParse(v.email).success, {
    message: "E-mail inválido.",
    path: ["email"],
  })
  .refine((v) => v.senha === null || v.senha.length >= SENHA_MINIMA, {
    message: `Senha muito curta (mínimo ${SENHA_MINIMA} caracteres) — deixe em branco para gerar uma automaticamente.`,
    path: ["senha"],
  })
  .refine((v) => v.papel === "ADMIN" || v.papel === "GESTOR", {
    message: 'Papel precisa ser "ADMIN" ou "GESTOR".',
    path: ["papel"],
  })
  .refine((v) => v.papel === "ADMIN" || v.condominiosNomes.length > 0, {
    message: "Usuário precisa de ao menos um condomínio (separe vários com ;).",
    path: ["condominios"],
  });

export type UsuarioImportado = z.infer<typeof linhaUsuarioSchema>;

export const CABECALHO_USUARIOS = ["nome", "email", "senha", "papel", "condominios"] as const;

export function validarLinhaUsuario(
  linha: LinhaCsv,
): { ok: true; dados: UsuarioImportado } | { ok: false; erro: string } {
  const resultado = linhaUsuarioSchema.safeParse(linha);
  if (!resultado.success) {
    return { ok: false, erro: resultado.error.issues[0]?.message ?? "Linha inválida." };
  }
  return { ok: true, dados: resultado.data };
}

/**
 * Troca os nomes de condomínio (como a planilha escreveu) pelos ids no banco.
 *
 * Comparação sem acento e sem caixa: é o mesmo padrão de erro que travaria
 * alguém tentando digitar "Ed. Central" quando o cadastro tem "Edifício
 * Central" — perto demais para forçar exatidão, longe demais para adivinhar.
 */
export function chaveComparacaoNome(nome: string): string {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function resolverCondominios(
  nomes: string[],
  condominios: { id: number; nome: string }[],
): { ok: true; ids: number[] } | { ok: false; naoEncontrados: string[] } {
  const porChave = new Map(condominios.map((c) => [chaveComparacaoNome(c.nome), c.id]));
  const ids: number[] = [];
  const naoEncontrados: string[] = [];

  for (const nome of nomes) {
    const id = porChave.get(chaveComparacaoNome(nome));
    if (id === undefined) naoEncontrados.push(nome);
    else ids.push(id);
  }

  return naoEncontrados.length > 0 ? { ok: false, naoEncontrados } : { ok: true, ids };
}
