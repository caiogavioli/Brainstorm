/**
 * Inicializa um banco de PRODUÇÃO.
 *
 * Diferente de `npm run db:seed`, este script não cria nenhum dado de
 * demonstração — nem condomínios de exemplo, nem boletins fictícios, nem
 * usuários com senha pública. Ele faz só o mínimo para o sistema funcionar:
 *
 *   1. popula o catálogo de itens do checklist (dado obrigatório do sistema);
 *   2. cria o primeiro usuário administrador, com a senha que você definir.
 *
 * É seguro rodar de novo: o catálogo é atualizado por `codigo` e o admin, se já
 * existir, tem apenas a senha redefinida (útil se você a esquecer).
 *
 * Uso:
 *   ADMIN_EMAIL=voce@empresa.com ADMIN_SENHA='umaSenhaForte' \
 *   ADMIN_NOME='Seu Nome' npm run producao:init
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { CATALOGO_CHECKLIST } from "../src/lib/checklist";

const prisma = new PrismaClient();

const SENHA_MINIMA = 10;

function exigirVariavel(nome: string): string {
  const valor = process.env[nome];
  if (!valor || !valor.trim()) {
    console.error(`\n✖ A variável ${nome} é obrigatória.\n`);
    console.error("Exemplo:");
    console.error(
      "  ADMIN_EMAIL=voce@empresa.com ADMIN_SENHA='umaSenhaForte' \\",
    );
    console.error("  ADMIN_NOME='Seu Nome' npm run producao:init\n");
    process.exit(1);
  }
  return valor.trim();
}

async function main() {
  const email = exigirVariavel("ADMIN_EMAIL").toLowerCase();
  const senha = exigirVariavel("ADMIN_SENHA");
  const nome = process.env.ADMIN_NOME?.trim() || "Administrador";

  if (senha.length < SENHA_MINIMA) {
    console.error(
      `\n✖ A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.\n`,
    );
    process.exit(1);
  }

  console.log("Inicializando banco de produção...\n");

  for (const item of CATALOGO_CHECKLIST) {
    await prisma.checklistItem.upsert({
      where: { codigo: item.codigo },
      update: { nome: item.nome, grupo: item.grupo, ordem: item.ordem, ativo: true },
      create: item,
    });
  }
  console.log(`✔ Catálogo de checklist: ${CATALOGO_CHECKLIST.length} itens`);

  const senhaHash = await bcrypt.hash(senha, 10);
  const existente = await prisma.usuario.findUnique({ where: { email } });

  await prisma.usuario.upsert({
    where: { email },
    update: { senhaHash, papel: "ADMIN", ativo: true },
    create: { nome, email, senhaHash, papel: "ADMIN" },
  });

  console.log(
    existente
      ? `✔ Administrador ${email} já existia — senha redefinida.`
      : `✔ Administrador criado: ${email}`,
  );

  const condominios = await prisma.condominio.count();
  console.log(`\nCondomínios cadastrados: ${condominios}`);
  if (condominios === 0) {
    console.log(
      "Próximo passo: entre no sistema e cadastre seus condomínios em /condominios.",
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
