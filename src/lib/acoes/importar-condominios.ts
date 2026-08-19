"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { validarLinhaCondominio } from "@/lib/importacao/condominios";
import type { LinhaCsv } from "@/lib/importacao-csv";

export type LinhaResultadoCondominio = {
  linha: number;
  nome: string;
  ok: boolean;
  acao?: "criado" | "atualizado";
  erro?: string;
};

export type ResultadoImportacaoCondominios = {
  resultados: LinhaResultadoCondominio[];
  criados: number;
  atualizados: number;
  comErro: number;
};

/**
 * Importa condomínios em lote, um por linha do CSV.
 *
 * O cliente já filtrou e validou as linhas para a prévia, mas isso é só
 * conveniência: aqui tudo é validado de novo, porque é o servidor quem decide
 * o que é gravado — nunca o que o cliente diz que já validou.
 *
 * Casamento por nome (exato, sem acento nem caixa não importam aqui: é
 * comparação direta, igual ao `prisma/seed.ts`) decide entre criar e
 * atualizar. Reenviar a mesma planilha depois é seguro: atualiza os campos,
 * não duplica a linha.
 */
export async function importarCondominiosAction(
  linhas: LinhaCsv[],
): Promise<ResultadoImportacaoCondominios> {
  await exigirAdmin();

  const resultados: LinhaResultadoCondominio[] = [];
  let criados = 0;
  let atualizados = 0;

  for (const [indice, linha] of linhas.entries()) {
    const numeroLinha = indice + 2; // +1 pelo cabeçalho, +1 porque a planilha começa em 1
    const validacao = validarLinhaCondominio(linha);

    if (!validacao.ok) {
      resultados.push({
        linha: numeroLinha,
        nome: linha.nome ?? "",
        ok: false,
        erro: validacao.erro,
      });
      continue;
    }

    const dados = validacao.dados;
    const existente = await prisma.condominio.findFirst({
      where: { nome: dados.nome },
      select: { id: true },
    });

    if (existente) {
      await prisma.condominio.update({ where: { id: existente.id }, data: dados });
      atualizados++;
      resultados.push({ linha: numeroLinha, nome: dados.nome, ok: true, acao: "atualizado" });
    } else {
      await prisma.condominio.create({ data: dados });
      criados++;
      resultados.push({ linha: numeroLinha, nome: dados.nome, ok: true, acao: "criado" });
    }
  }

  if (criados > 0 || atualizados > 0) {
    revalidatePath("/condominios");
    revalidatePath("/dashboard");
  }

  return {
    resultados,
    criados,
    atualizados,
    comErro: resultados.filter((r) => !r.ok).length,
  };
}
