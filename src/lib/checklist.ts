/**
 * Catálogo dos itens do Boletim Diário, organizados nos 4 grupos do wizard.
 *
 * Esta lista é a fonte de verdade usada pelo seed para popular a tabela
 * `ChecklistItem`. Para incluir um item novo, acrescente aqui e rode
 * `npm run db:seed` — o seed faz upsert por `codigo` e não duplica registros.
 */

import type { GrupoChecklist } from "@prisma/client";

export type ItemCatalogo = {
  codigo: string;
  nome: string;
  grupo: GrupoChecklist;
  ordem: number;
};

export const GRUPOS: {
  chave: GrupoChecklist;
  titulo: string;
  descricao: string;
}[] = [
  {
    chave: "QUADRO_OPERACIONAL",
    titulo: "Quadro Operacional",
    descricao: "Equipes e serviços presentes no dia",
  },
  {
    chave: "ELETRICA_HIDRAULICA_REFRIGERACAO",
    titulo: "Elétrica / Hidráulica / Refrigeração",
    descricao: "Instalações e sistemas prediais",
  },
  {
    chave: "SISTEMAS",
    titulo: "Sistemas",
    descricao: "Automação, conectividade e transporte vertical",
  },
  {
    chave: "SEGURANCA",
    titulo: "Segurança",
    descricao: "Monitoramento, acesso, incêndio e emergência",
  },
];

export const GRUPO_LABEL: Record<GrupoChecklist, string> = {
  QUADRO_OPERACIONAL: "Quadro Operacional",
  ELETRICA_HIDRAULICA_REFRIGERACAO: "Elétrica / Hidráulica / Refrigeração",
  SISTEMAS: "Sistemas",
  SEGURANCA: "Segurança",
};

export const CATALOGO_CHECKLIST: ItemCatalogo[] = [
  // Grupo 1 — Quadro Operacional
  { codigo: "manutencao-predial", nome: "Manutenção Predial", grupo: "QUADRO_OPERACIONAL", ordem: 1 },
  { codigo: "automacao-predial", nome: "Automação Predial", grupo: "QUADRO_OPERACIONAL", ordem: 2 },
  { codigo: "climatizacao", nome: "Climatização", grupo: "QUADRO_OPERACIONAL", ordem: 3 },
  { codigo: "higienizacao", nome: "Higienização", grupo: "QUADRO_OPERACIONAL", ordem: 4 },
  { codigo: "jardinagem", nome: "Jardinagem", grupo: "QUADRO_OPERACIONAL", ordem: 5 },
  { codigo: "seguranca-equipe", nome: "Segurança", grupo: "QUADRO_OPERACIONAL", ordem: 6 },
  { codigo: "bombeiro", nome: "Bombeiro", grupo: "QUADRO_OPERACIONAL", ordem: 7 },
  { codigo: "administracao", nome: "Administração", grupo: "QUADRO_OPERACIONAL", ordem: 8 },

  // Grupo 2 — Elétrica / Hidráulica / Refrigeração
  { codigo: "distribuicao-eletrica", nome: "Sist. de Distribuição Elétrica", grupo: "ELETRICA_HIDRAULICA_REFRIGERACAO", ordem: 1 },
  { codigo: "central-geracao", nome: "Central de Geração", grupo: "ELETRICA_HIDRAULICA_REFRIGERACAO", ordem: 2 },
  { codigo: "nobreak", nome: "Nobreak", grupo: "ELETRICA_HIDRAULICA_REFRIGERACAO", ordem: 3 },
  { codigo: "abastecimento-agua", nome: "Sist. de Abastecimento de Água", grupo: "ELETRICA_HIDRAULICA_REFRIGERACAO", ordem: 4 },
  { codigo: "bombas", nome: "Bombas (Recalque / Reuso / SPK)", grupo: "ELETRICA_HIDRAULICA_REFRIGERACAO", ordem: 5 },
  { codigo: "sistema-refrigeracao", nome: "Sistema de Refrigeração", grupo: "ELETRICA_HIDRAULICA_REFRIGERACAO", ordem: 6 },
  { codigo: "aquecimento-agua", nome: "Sistema de Aquecimento de Água", grupo: "ELETRICA_HIDRAULICA_REFRIGERACAO", ordem: 7 },

  // Grupo 3 — Sistemas
  { codigo: "automacao-controle", nome: "Automação e Controle", grupo: "SISTEMAS", ordem: 1 },
  { codigo: "internet", nome: "Sistema de Internet", grupo: "SISTEMAS", ordem: 2 },
  { codigo: "elevadores", nome: "Elevadores", grupo: "SISTEMAS", ordem: 3 },
  { codigo: "interfonia", nome: "Central de Interfonia", grupo: "SISTEMAS", ordem: 4 },

  // Grupo 4 — Segurança
  { codigo: "monitoramento", nome: "Sistema de Monitoramento", grupo: "SEGURANCA", ordem: 1 },
  { codigo: "controle-acesso", nome: "Controle de Acesso", grupo: "SEGURANCA", ordem: 2 },
  { codigo: "alarme-perimetral", nome: "Alarme Perimetral", grupo: "SEGURANCA", ordem: 3 },
  { codigo: "deteccao-incendio", nome: "Sistema de Detecção e Alarme de Incêndio", grupo: "SEGURANCA", ordem: 4 },
  { codigo: "saidas-emergencia", nome: "Saídas de Emergência", grupo: "SEGURANCA", ordem: 5 },
  { codigo: "iluminacao-emergencia", nome: "Iluminação de Emergência", grupo: "SEGURANCA", ordem: 6 },
  { codigo: "portas-acesso", nome: "Portas de Acesso", grupo: "SEGURANCA", ordem: 7 },
  { codigo: "obras", nome: "Obras", grupo: "SEGURANCA", ordem: 8 },
];
