/**
 * Monta o resumo do boletim no formato que já circula nos grupos de WhatsApp.
 *
 * O texto imita o modelo em uso hoje — ícone por item, grupos em maiúsculas,
 * bloco de ocorrências separado por linhas — porque quem lê do outro lado já
 * está acostumado com ele. O que muda é a origem: em vez de alguém digitar 47
 * linhas no celular, o texto sai pronto do checklist que acabou de ser enviado.
 *
 * Formatação do WhatsApp: *negrito* e _itálico_. Nada de markdown de verdade,
 * então cabeçalhos são só maiúsculas em negrito.
 *
 * Sem dependência de servidor: o mesmo arquivo roda na Server Action que grava
 * o boletim e no componente que exibe o resultado.
 */

import type { Criticidade, SituacaoItem, StatusOcorrencia } from "@prisma/client";

import { GRUPOS } from "@/lib/checklist";
import { CRITICIDADE_LABEL, STATUS_OCORRENCIA_LABEL } from "@/lib/labels";
import { formatarData, formatarDataReferencia } from "@/lib/datas";

/** Ícone por situação — a mesma convenção do modelo antigo. */
export const ICONE_SITUACAO: Record<SituacaoItem, string> = {
  CONFORME: "✅",
  NAO_CONFORME: "⚠️",
  NAO_APLICAVEL: "➖",
};

const SEPARADOR = "------------------------------------------";

export type ItemResumo = {
  nome: string;
  grupo: string;
  ordem: number;
  situacao: SituacaoItem;
  observacao?: string | null;
};

export type OcorrenciaResumo = {
  setor: string;
  descricao: string;
  planoAcao?: string | null;
  criticidade: Criticidade;
  status: StatusOcorrencia;
  previsaoFinalizacao: Date | null;
  observacoes?: string | null;
  /** Problema que já vinha de outro dia — não abriu ocorrência nova. */
  reincidente?: boolean;
  /** Data de abertura, quando reincidente. */
  desde?: Date | null;
};

export type EntradaResumo = {
  condominio: string;
  dataReferencia: string;
  preenchidoPor?: string | null;
  observacoes?: string | null;
  itens: ItemResumo[];
  ocorrencias: OcorrenciaResumo[];
};

export function montarResumoWhatsApp(dados: EntradaResumo): string {
  const linhas: string[] = [];

  linhas.push(`*BOLETIM INFORMATIVO DIÁRIO — ${formatarDataReferencia(dados.dataReferencia)}*`);
  linhas.push(dados.condominio);

  // ------------------------------------------------------------ checklist --
  for (const grupo of GRUPOS) {
    const doGrupo = dados.itens
      .filter((i) => i.grupo === grupo.codigo)
      .sort((a, b) => a.ordem - b.ordem);
    if (doGrupo.length === 0) continue;

    linhas.push("");
    linhas.push(`*${grupo.titulo.toUpperCase()}*`);
    for (const item of doGrupo) {
      linhas.push(`${ICONE_SITUACAO[item.situacao]} ${item.nome}`);
    }
  }

  // ---------------------------------------------------------- ocorrências --
  linhas.push("");
  linhas.push(SEPARADOR);
  linhas.push("*OCORRÊNCIAS*");
  linhas.push(SEPARADOR);

  if (dados.ocorrencias.length === 0) {
    linhas.push("✅ Nenhuma ocorrência registrada no dia.");
    linhas.push(SEPARADOR);
  } else {
    for (const o of dados.ocorrencias) {
      linhas.push(`*Setor:* ${o.setor}`);
      linhas.push(`*Descrição:* ${o.descricao}`);
      if (o.planoAcao?.trim()) {
        linhas.push(`*Plano de Ação:* ${o.planoAcao.trim()}`);
      }
      linhas.push(`*Criticidade:* ${CRITICIDADE_LABEL[o.criticidade]}`);
      linhas.push(`*Status:* ${STATUS_OCORRENCIA_LABEL[o.status]}`);
      if (o.previsaoFinalizacao) {
        linhas.push(`*Previsão:* ${formatarData(o.previsaoFinalizacao)}`);
      }
      if (o.reincidente) {
        linhas.push(
          `*Reincidência:* problema em aberto${o.desde ? ` desde ${formatarData(o.desde)}` : ""}`,
        );
      }
      if (o.observacoes?.trim()) {
        linhas.push(`*Obs:* ${o.observacoes.trim()}`);
      }
      linhas.push(SEPARADOR);
    }
  }

  // -------------------------------------------------------------- rodapé ---
  if (dados.observacoes?.trim()) {
    linhas.push("");
    linhas.push(`*OBSERVAÇÕES GERAIS*`);
    linhas.push(dados.observacoes.trim());
  }

  if (dados.preenchidoPor?.trim()) {
    linhas.push("");
    linhas.push(`_Preenchido por ${dados.preenchidoPor.trim()}_`);
  }

  return linhas.join("\n");
}
