/**
 * Sincroniza o catálogo do checklist com `src/lib/checklist.ts`.
 *
 * Roda no build, a cada publicação. O catálogo é **dado obrigatório do
 * sistema** — sem ele o boletim não tem o que perguntar —, então não pode
 * depender de alguém lembrar de rodar um comando à mão depois do deploy.
 *
 * É idempotente e não destrói histórico:
 *  - itens novos são criados;
 *  - itens existentes têm nome, grupo, ordem e criticidade atualizados;
 *  - itens que saíram do catálogo são **desativados**, nunca apagados, para
 *    que boletins antigos continuem legíveis e o dashboard não perca dados.
 */

import { PrismaClient } from "@prisma/client";

import { CATALOGO_CHECKLIST, GRUPOS } from "../src/lib/checklist";

const prisma = new PrismaClient();

const ORDEM_GRUPO = Object.fromEntries(GRUPOS.map((g) => [g.codigo, g.ordem]));

export async function sincronizarCatalogo(cliente: PrismaClient = prisma) {
  let criados = 0;
  let atualizados = 0;

  for (const item of CATALOGO_CHECKLIST) {
    const dados = {
      nome: item.nome,
      grupo: item.grupo,
      grupoOrdem: ORDEM_GRUPO[item.grupo] ?? 99,
      ordem: item.ordem,
      criticidadePadrao: item.criticidadePadrao,
      ativo: true,
    };

    const existente = await cliente.checklistItem.findUnique({
      where: { codigo: item.codigo },
      select: { id: true },
    });

    if (existente) {
      await cliente.checklistItem.update({ where: { codigo: item.codigo }, data: dados });
      atualizados++;
    } else {
      await cliente.checklistItem.create({ data: { codigo: item.codigo, ...dados } });
      criados++;
    }
  }

  const codigos = CATALOGO_CHECKLIST.map((i) => i.codigo);
  const { count: desativados } = await cliente.checklistItem.updateMany({
    where: { codigo: { notIn: codigos }, ativo: true },
    data: { ativo: false },
  });

  return { criados, atualizados, desativados, total: CATALOGO_CHECKLIST.length };
}

// Execução direta (build e linha de comando).
if (process.argv[1]?.includes("sincronizar-catalogo")) {
  sincronizarCatalogo()
    .then((r) => {
      console.log(
        `✔ Catálogo: ${r.total} itens (${r.criados} novos, ${r.atualizados} atualizados, ${r.desativados} desativados)`,
      );
    })
    .catch((e) => {
      console.error("✖ Falha ao sincronizar o catálogo:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
