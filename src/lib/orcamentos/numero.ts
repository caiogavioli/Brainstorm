import "server-only";

import { randomBytes } from "node:crypto";

import type { Prisma } from "@prisma/client";

import { FUSO_OPERACAO } from "@/lib/datas";

/**
 * Número do orçamento e token do link público.
 */

/** Ano corrente no fuso de operação — não no fuso do servidor. */
function anoAtual(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO_OPERACAO,
    year: "numeric",
  }).format(new Date());
}

/**
 * Trava consultiva do Postgres, presa à transação.
 *
 * Duas abas abertas ao mesmo tempo é o caso comum, não o exótico: sem trava,
 * as duas leem o mesmo "último número", as duas calculam o mesmo próximo, e a
 * segunda gravação estoura no índice único — o orçamento se perde depois de a
 * pessoa ter digitado tudo.
 *
 * `pg_advisory_xact_lock` é liberada sozinha no fim da transação, inclusive se
 * ela abortar. Não há trava vazada para limpar depois.
 */
const CHAVE_TRAVA_NUMERO = 8_270_001;

/**
 * Próximo número do ano, no formato "2026-0007".
 *
 * Reinicia a cada ano de propósito: é assim que se lê um orçamento pelo número
 * sem precisar de contexto ("o sete deste ano"). O sufixo tem 4 dígitos, o que
 * ordena corretamente em texto até o milésimo orçamento do ano; passando disso,
 * ele cresce sozinho e só perde o alinhamento visual.
 *
 * Precisa rodar **dentro** de uma transação — a trava depende disso.
 */
export async function proximoNumero(tx: Prisma.TransactionClient): Promise<string> {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${CHAVE_TRAVA_NUMERO}::bigint)`;

  const ano = anoAtual();
  const prefixo = `${ano}-`;

  // O maior número do ano, em ordem alfabética decrescente. Com sufixo de
  // largura fixa, a ordem de texto é a ordem numérica.
  const ultimo = await tx.orcamento.findFirst({
    where: { numero: { startsWith: prefixo } },
    orderBy: { numero: "desc" },
    select: { numero: true },
  });

  const sequencial = ultimo ? Number(ultimo.numero.slice(prefixo.length)) + 1 : 1;

  return `${prefixo}${String(sequencial).padStart(4, "0")}`;
}

/**
 * Token do link público: 32 bytes aleatórios em base64url (43 caracteres).
 *
 * É a única credencial da página do cliente — quem tem o link, vê o orçamento.
 * Por isso vem de `randomBytes` e não de `Math.random`, que é previsível e
 * jamais deve ser usado para algo que protege acesso.
 *
 * 256 bits de entropia tornam a adivinhação por tentativa impossível na
 * prática, e `base64url` mantém o token seguro dentro de uma URL sem escape.
 */
export function gerarToken(): string {
  return randomBytes(32).toString("base64url");
}
