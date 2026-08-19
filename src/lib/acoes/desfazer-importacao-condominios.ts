"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";

/**
 * Desfazer uma importação por planilha feita no lugar errado.
 *
 * Não existe "importação #42" gravada em lugar nenhum — o que existe é
 * `criadoEm`. Uma importação em lote cria várias linhas quase no mesmo
 * instante, então "tudo criado depois de tal hora" é o critério.
 *
 * Duas redes de segurança, e nenhuma das duas é opcional:
 *
 * - Só entra na exclusão em lote quem não tem NADA vinculado (boletim,
 *   ocorrência, plano, acesso de usuário). Um condomínio criado por engano na
 *   janela de tempo, mas que já recebeu um boletim de verdade nesse meio
 *   tempo, precisa de uma decisão humana — vai para a lista "com dados", não
 *   para a exclusão automática.
 * - Um condomínio que já existia e só teve `atualizadoEm` tocado na janela
 *   (não `criadoEm`) não é fantasma — é um condomínio real que a importação
 *   errada pode ter sobrescrito. Aparece separado, como aviso, nunca como
 *   candidato a exclusão: apagá-lo apagaria um condomínio de verdade.
 */

export type CandidatoExclusao = {
  id: number;
  nome: string;
  email: string | null;
  criadoEm: Date;
};

export type CandidatosExclusaoEmLote = {
  elegiveis: CandidatoExclusao[];
  comDados: (CandidatoExclusao & {
    boletins: number;
    ocorrencias: number;
    planos: number;
    acessos: number;
  })[];
  alterados: CandidatoExclusao[];
};

export async function candidatosExclusaoEmLoteAction(
  desdeIso: string,
): Promise<CandidatosExclusaoEmLote> {
  await exigirAdmin();

  const desde = new Date(desdeIso);
  if (Number.isNaN(desde.getTime())) {
    throw new Error("Data inválida.");
  }

  const [criadosNoPeriodo, alteradosNoPeriodo] = await Promise.all([
    prisma.condominio.findMany({
      where: { criadoEm: { gte: desde } },
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
        _count: { select: { boletins: true, ocorrencias: true, planos: true, acessos: true } },
      },
    }),
    // Existia antes da janela, mas foi mexido dentro dela.
    prisma.condominio.findMany({
      where: { atualizadoEm: { gte: desde }, criadoEm: { lt: desde } },
      orderBy: { atualizadoEm: "desc" },
      select: { id: true, nome: true, email: true, criadoEm: true },
    }),
  ]);

  const semNadaVinculado = (c: (typeof criadosNoPeriodo)[number]) =>
    c._count.boletins === 0 &&
    c._count.ocorrencias === 0 &&
    c._count.planos === 0 &&
    c._count.acessos === 0;

  const elegiveis = criadosNoPeriodo
    .filter(semNadaVinculado)
    .map((c) => ({ id: c.id, nome: c.nome, email: c.email, criadoEm: c.criadoEm }));

  const comDados = criadosNoPeriodo
    .filter((c) => !semNadaVinculado(c))
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      email: c.email,
      criadoEm: c.criadoEm,
      boletins: c._count.boletins,
      ocorrencias: c._count.ocorrencias,
      planos: c._count.planos,
      acessos: c._count.acessos,
    }));

  return { elegiveis, comDados, alterados: alteradosNoPeriodo };
}

/**
 * Exclui em lote, mas só os ids que — checados de novo agora, não na hora da
 * prévia — continuam sem nada vinculado. O tempo entre a prévia e o clique em
 * confirmar é tempo o bastante para alguém ter usado um desses condomínios.
 */
export async function excluirCondominiosEmLoteAction(
  ids: number[],
): Promise<{ excluidos: number; ignorados: { id: number; nome: string }[] }> {
  await exigirAdmin();
  if (ids.length === 0) return { excluidos: 0, ignorados: [] };

  const atuais = await prisma.condominio.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      nome: true,
      _count: { select: { boletins: true, ocorrencias: true, planos: true, acessos: true } },
    },
  });

  const seguros = atuais.filter(
    (c) =>
      c._count.boletins === 0 &&
      c._count.ocorrencias === 0 &&
      c._count.planos === 0 &&
      c._count.acessos === 0,
  );
  const idsSeguros = new Set(seguros.map((c) => c.id));
  const ignorados = atuais
    .filter((c) => !idsSeguros.has(c.id))
    .map((c) => ({ id: c.id, nome: c.nome }));

  if (idsSeguros.size > 0) {
    await prisma.condominio.deleteMany({ where: { id: { in: [...idsSeguros] } } });
  }

  revalidatePath("/condominios");
  revalidatePath("/boletim");
  revalidatePath("/dashboard");
  revalidatePath("/");

  return { excluidos: idsSeguros.size, ignorados };
}
