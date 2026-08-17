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
  StatusOrcamento,
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
  GESTOR: "Gerente predial",
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

// ---------------------------------------------------------------------------
// Orçamentos
// ---------------------------------------------------------------------------

export const STATUS_ORCAMENTO_LABEL: Record<StatusOrcamento, string> = {
  RASCUNHO: "Rascunho",
  ENVIADO: "Enviado",
  VISUALIZADO: "Visualizado",
  ACEITO: "Aceito",
  RECUSADO: "Recusado",
  AJUSTE_SOLICITADO: "Ajuste solicitado",
  EXPIRADO: "Expirado",
};

/**
 * Cor de cada estado. A leitura é comercial, não de gravidade:
 * verde é dinheiro fechado, vermelho é negócio perdido, amarelo é bola na sua
 * mão, azul é bola na mão do cliente.
 */
export const STATUS_ORCAMENTO_CLASSE: Record<StatusOrcamento, string> = {
  RASCUNHO: "badge badge-neutral",
  ENVIADO: "badge badge-info",
  VISUALIZADO: "badge badge-info",
  ACEITO: "badge badge-ok",
  RECUSADO: "badge badge-danger",
  AJUSTE_SOLICITADO: "badge badge-warn",
  EXPIRADO: "badge badge-neutral",
};

/** O que cada estado significa em uma frase, para legenda e tela vazia. */
export const STATUS_ORCAMENTO_AJUDA: Record<StatusOrcamento, string> = {
  RASCUNHO: "Ainda não saiu daqui — pode editar à vontade.",
  ENVIADO: "Foi para o cliente, que ainda não abriu o link.",
  VISUALIZADO: "O cliente abriu, mas não respondeu.",
  ACEITO: "O cliente aceitou.",
  RECUSADO: "O cliente recusou.",
  AJUSTE_SOLICITADO: "O cliente pediu mudança — a bola está com você.",
  EXPIRADO: "Passou da validade sem resposta.",
};
