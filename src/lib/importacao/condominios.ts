/**
 * Formato de uma linha de condomínio vinda do CSV, e sua validação.
 *
 * Fica fora de qualquer arquivo "server-only" de propósito: o componente do
 * cliente usa este mesmo esquema para a prévia instantânea, antes de qualquer
 * ida ao servidor. A validação de verdade — a que decide o que é gravado —
 * roda de novo no servidor, com este mesmo esquema; a do cliente é só
 * feedback rápido, nunca a fonte da decisão.
 */

import { z } from "zod";

import type { LinhaCsv } from "@/lib/importacao-csv";

const textoOuNulo = (v: string) => (v.trim() === "" ? null : v.trim());

function paraBooleano(v: string, padrao: boolean): boolean {
  const s = v.trim().toLowerCase();
  if (s === "") return padrao;
  if (["sim", "s", "true", "1", "ativo", "yes"].includes(s)) return true;
  if (["nao", "não", "n", "false", "0", "inativo", "no"].includes(s)) return false;
  return padrao;
}

export const linhaCondominioSchema = z
  .object({
    nome: z.string(),
    endereco: z.string().optional().default(""),
    gerente_responsavel: z.string().optional().default(""),
    telefone: z.string().optional().default(""),
    email: z.string().optional().default(""),
    ativo: z.string().optional().default(""),
  })
  .transform((v) => ({
    nome: v.nome.trim(),
    endereco: textoOuNulo(v.endereco),
    gerenteResponsavel: textoOuNulo(v.gerente_responsavel),
    telefone: textoOuNulo(v.telefone),
    email: textoOuNulo(v.email),
    ativo: paraBooleano(v.ativo, true),
  }))
  .refine((v) => v.nome.length >= 2, {
    message: "Nome do condomínio é obrigatório (mínimo 2 caracteres).",
    path: ["nome"],
  })
  .refine((v) => v.email === null || z.string().email().safeParse(v.email).success, {
    message: "E-mail inválido.",
    path: ["email"],
  });

export type CondominioImportado = z.infer<typeof linhaCondominioSchema>;

/** Cabeçalhos aceitos, na ordem do modelo de planilha em `/modelos`. */
export const CABECALHO_CONDOMINIOS = [
  "nome",
  "endereco",
  "gerente_responsavel",
  "telefone",
  "email",
  "ativo",
] as const;

export function validarLinhaCondominio(
  linha: LinhaCsv,
): { ok: true; dados: CondominioImportado } | { ok: false; erro: string } {
  const resultado = linhaCondominioSchema.safeParse(linha);
  if (!resultado.success) {
    return { ok: false, erro: resultado.error.issues[0]?.message ?? "Linha inválida." };
  }
  return { ok: true, dados: resultado.data };
}
