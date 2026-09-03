import "server-only";

import type { Criticidade, StatusOcorrencia } from "@prisma/client";

import { prisma } from "@/lib/db";
import { dataReferenciaDe } from "@/lib/datas";

/**
 * Ocorrências ainda em aberto, por condomínio, para o boletim do dia carregá-las.
 *
 * Quem preenche não deveria precisar lembrar de cabeça o que ficou pendente
 * ontem. Enquanto a ocorrência não é dada como concluída, ela reaparece no
 * boletim seguinte — e o preenchedor só diz se continua ou se foi resolvida.
 */

export type Pendencia = {
  ocorrenciaId: number;
  /** null nas ocorrências avulsas, que não saíram de um item do checklist. */
  checklistItemId: number | null;
  setor: string;
  descricao: string;
  criticidade: Criticidade;
  status: StatusOcorrencia;
  planoAcao: string | null;
  /** "YYYY-MM-DD" ou "" — formato do campo de data do wizard. */
  previsaoFinalizacao: string;
  /** "YYYY-MM-DD" da abertura, para a tela dizer há quanto tempo se arrasta. */
  desde: string;
  totalRecorrencias: number;
};

/**
 * Indexado por condomínio porque o wizard troca de prédio sem recarregar a
 * página: os dois precisam vir juntos do servidor, ou a lista ficaria a de
 * outro condomínio.
 */
export type PendenciasPorCondominio = Record<number, Pendencia[]>;

export async function pendenciasAbertas(
  condominioIds: number[],
): Promise<PendenciasPorCondominio> {
  if (condominioIds.length === 0) return {};

  const abertas = await prisma.ocorrencia.findMany({
    where: {
      condominioId: { in: condominioIds },
      status: { in: ["PENDENTE", "EM_ANDAMENTO"] },
    },
    orderBy: [{ criticidade: "desc" }, { dataAbertura: "asc" }],
    select: {
      id: true,
      condominioId: true,
      checklistItemId: true,
      setorLivre: true,
      descricao: true,
      criticidade: true,
      status: true,
      planoAcao: true,
      previsaoFinalizacao: true,
      dataAbertura: true,
      totalRecorrencias: true,
      checklistItem: { select: { nome: true } },
    },
  });

  const mapa: PendenciasPorCondominio = {};
  for (const o of abertas) {
    (mapa[o.condominioId] ??= []).push({
      ocorrenciaId: o.id,
      checklistItemId: o.checklistItemId,
      setor: o.checklistItem?.nome ?? o.setorLivre ?? "Ocorrência avulsa",
      descricao: o.descricao,
      criticidade: o.criticidade,
      status: o.status,
      planoAcao: o.planoAcao,
      // `previsaoFinalizacao` é gravada ao meio-dia UTC (ver dataEscolhidaParaDate
      // em @/lib/datas) só para sobreviver a um corte ingênuo como este — em
      // qualquer fuso do mundo ainda é o mesmo dia. `dataAbertura`, por ser o
      // instante real do lançamento, não tem essa folga: cortar em UTC faz
      // qualquer boletim preenchido entre 21h e 23h59 em Brasília (UTC-3)
      // aparecer aberto no dia seguinte. Por isso passa pelo fuso de operação.
      previsaoFinalizacao: o.previsaoFinalizacao
        ? o.previsaoFinalizacao.toISOString().slice(0, 10)
        : "",
      desde: dataReferenciaDe(o.dataAbertura),
      totalRecorrencias: o.totalRecorrencias,
    });
  }
  return mapa;
}
