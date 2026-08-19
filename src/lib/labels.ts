/**
 * Rótulos em português e metadados visuais dos enums do domínio.
 * Centralizado para que formulários, listas e dashboard falem a mesma língua.
 */

import type {
  Criticidade,
  Papel,
  SituacaoItem,
  StatusGeralDia,
  StatusOcorrencia,
} from "@prisma/client";

export const STATUS_DIA_LABEL: Record<StatusGeralDia, string> = {
  EM_CONFORMIDADE: "Em Conformidade",
  OCORRENCIA_PONTUAL: "Ocorrência Pontual",
  OCORRENCIA_CRITICA: "Ocorrência Crítica",
};

export const SITUACAO_LABEL: Record<SituacaoItem, string> = {
  CONFORME: "Conforme",
  NAO_CONFORME: "Não Conforme",
  NAO_APLICAVEL: "N/A",
};

export const CRITICIDADE_LABEL: Record<Criticidade, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
};

export const STATUS_OCORRENCIA_LABEL: Record<StatusOcorrencia, string> = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDO: "Concluído",
};

export const PAPEL_LABEL: Record<Papel, string> = {
  ADMIN: "Administrador",
  GESTOR: "Usuário",
};

/** Classes Tailwind para "badges" — usam tokens do design system em globals.css. */
export const STATUS_DIA_CLASSE: Record<StatusGeralDia, string> = {
  EM_CONFORMIDADE: "badge badge-ok",
  OCORRENCIA_PONTUAL: "badge badge-warn",
  OCORRENCIA_CRITICA: "badge badge-danger",
};

export const CRITICIDADE_CLASSE: Record<Criticidade, string> = {
  BAIXA: "badge badge-info",
  MEDIA: "badge badge-warn",
  ALTA: "badge badge-danger",
};

export const STATUS_OCORRENCIA_CLASSE: Record<StatusOcorrencia, string> = {
  PENDENTE: "badge badge-danger",
  EM_ANDAMENTO: "badge badge-warn",
  CONCLUIDO: "badge badge-ok",
};

export const SITUACAO_CLASSE: Record<SituacaoItem, string> = {
  CONFORME: "badge badge-ok",
  NAO_CONFORME: "badge badge-danger",
  NAO_APLICAVEL: "badge badge-neutral",
};
