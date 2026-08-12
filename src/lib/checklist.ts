/**
 * Catálogo do Boletim Informativo Diário.
 *
 * Três regras que moldam esta lista:
 *
 * 1. **Um assunto, um item.** Nada é perguntado duas vezes. O efetivo das
 *    equipes é o Grupo 1 e só ali; o estado físico das áreas é o Grupo 9. Por
 *    isso os itens do Grupo 1 se chamam "Equipe de ...": deixa explícito que
 *    ali se fala de gente, não de instalação.
 *
 * 2. **Falta de pessoal é um item do checklist**, não uma pergunta separada no
 *    fim do formulário. Marcar "Equipe de Limpeza" como não conforme já é o
 *    registro da falta — o sistema deriva daí os indicadores de ausência.
 *
 * 3. **A criticidade é do item, não de quem preenche.** Cada item nasce com a
 *    gravidade que o assunto tem (um alarme de incêndio é sempre Alta;
 *    jardinagem é sempre Baixa), de modo que dois gerentes relatando a mesma
 *    falha produzam o mesmo prazo e a mesma prioridade.
 *
 * A ordem dos grupos segue o percurso de uma ronda: quem está trabalhando →
 * o que alimenta o prédio (energia, água, ar) → como se circula → o que
 * protege → o que conecta → como está conservado → o que está em obra.
 */

import type { Criticidade } from "@prisma/client";

export type GrupoChecklist = {
  codigo: string;
  titulo: string;
  descricao: string;
  ordem: number;
};

export type ItemCatalogo = {
  codigo: string;
  nome: string;
  grupo: string;
  ordem: number;
  criticidadePadrao: Criticidade;
};

export const GRUPOS: GrupoChecklist[] = [
  {
    codigo: "EQUIPES",
    titulo: "Equipes",
    descricao: "Efetivo presente no dia. Marque quem está com falta ou desfalque.",
    ordem: 1,
  },
  {
    codigo: "ELETRICA",
    titulo: "Elétrica e Energia",
    descricao: "Alimentação, geração e proteção elétrica.",
    ordem: 2,
  },
  {
    codigo: "HIDRAULICA",
    titulo: "Hidráulica e Água",
    descricao: "Abastecimento, recalque, esgoto e vazamentos.",
    ordem: 3,
  },
  {
    codigo: "CLIMATIZACAO",
    titulo: "Climatização e Exaustão",
    descricao: "Refrigeração, torres e renovação de ar.",
    ordem: 4,
  },
  {
    codigo: "TRANSPORTE",
    titulo: "Transporte Vertical",
    descricao: "Elevadores e equipamentos de circulação.",
    ordem: 5,
  },
  {
    codigo: "INCENDIO",
    titulo: "Segurança contra Incêndio",
    descricao: "Detecção, combate e rotas de fuga.",
    ordem: 6,
  },
  {
    codigo: "PATRIMONIAL",
    titulo: "Segurança Patrimonial",
    descricao: "Monitoramento, acesso e barreiras físicas.",
    ordem: 7,
  },
  {
    codigo: "AUTOMACAO",
    titulo: "Automação e Comunicação",
    descricao: "Controle predial, rede e comunicação interna.",
    ordem: 8,
  },
  {
    codigo: "AREAS",
    titulo: "Áreas Comuns e Conservação",
    descricao: "Estado físico e limpeza dos espaços de uso comum.",
    ordem: 9,
  },
  {
    codigo: "OBRAS",
    titulo: "Obras, Terceiros e Documentação",
    descricao: "Intervenções em curso, prestadores no local e licenças.",
    ordem: 10,
  },
];

export const GRUPO_LABEL: Record<string, string> = Object.fromEntries(
  GRUPOS.map((g) => [g.codigo, g.titulo]),
);

export function grupoPorCodigo(codigo: string): GrupoChecklist | undefined {
  return GRUPOS.find((g) => g.codigo === codigo);
}

export const CATALOGO_CHECKLIST: ItemCatalogo[] = [
  // ------------------------------------------------- 1. Equipes (efetivo) --
  // Não conforme aqui = falta ou desfalque naquele setor.
  { codigo: "equipe-manutencao", nome: "Equipe de Manutenção Predial", grupo: "EQUIPES", ordem: 1, criticidadePadrao: "MEDIA" },
  { codigo: "equipe-climatizacao", nome: "Equipe de Climatização", grupo: "EQUIPES", ordem: 2, criticidadePadrao: "MEDIA" },
  { codigo: "equipe-limpeza", nome: "Equipe de Limpeza e Conservação", grupo: "EQUIPES", ordem: 3, criticidadePadrao: "MEDIA" },
  { codigo: "equipe-jardinagem", nome: "Equipe de Jardinagem", grupo: "EQUIPES", ordem: 4, criticidadePadrao: "BAIXA" },
  { codigo: "equipe-seguranca", nome: "Equipe de Segurança e Portaria", grupo: "EQUIPES", ordem: 5, criticidadePadrao: "ALTA" },
  { codigo: "equipe-bombeiro", nome: "Bombeiro Civil", grupo: "EQUIPES", ordem: 6, criticidadePadrao: "ALTA" },
  { codigo: "equipe-administracao", nome: "Equipe de Administração", grupo: "EQUIPES", ordem: 7, criticidadePadrao: "MEDIA" },

  // --------------------------------------------------- 2. Elétrica e Energia
  { codigo: "distribuicao-eletrica", nome: "Quadros e Distribuição Elétrica", grupo: "ELETRICA", ordem: 1, criticidadePadrao: "ALTA" },
  { codigo: "subestacao", nome: "Subestação / Cabine Primária", grupo: "ELETRICA", ordem: 2, criticidadePadrao: "ALTA" },
  { codigo: "grupo-gerador", nome: "Grupo Gerador", grupo: "ELETRICA", ordem: 3, criticidadePadrao: "ALTA" },
  { codigo: "nobreak", nome: "Nobreak / UPS", grupo: "ELETRICA", ordem: 4, criticidadePadrao: "MEDIA" },
  { codigo: "iluminacao-comum", nome: "Iluminação das Áreas Comuns", grupo: "ELETRICA", ordem: 5, criticidadePadrao: "BAIXA" },
  { codigo: "spda", nome: "SPDA e Aterramento", grupo: "ELETRICA", ordem: 6, criticidadePadrao: "MEDIA" },

  // ---------------------------------------------------- 3. Hidráulica e Água
  { codigo: "reservatorios", nome: "Reservatórios e Abastecimento", grupo: "HIDRAULICA", ordem: 1, criticidadePadrao: "ALTA" },
  { codigo: "bombas-recalque", nome: "Bombas de Recalque", grupo: "HIDRAULICA", ordem: 2, criticidadePadrao: "ALTA" },
  { codigo: "reuso-pluvial", nome: "Reuso e Águas Pluviais", grupo: "HIDRAULICA", ordem: 3, criticidadePadrao: "BAIXA" },
  { codigo: "esgoto-drenagem", nome: "Esgoto e Drenagem", grupo: "HIDRAULICA", ordem: 4, criticidadePadrao: "MEDIA" },
  { codigo: "aquecimento-agua", nome: "Aquecimento de Água", grupo: "HIDRAULICA", ordem: 5, criticidadePadrao: "MEDIA" },
  { codigo: "vazamentos", nome: "Vazamentos e Infiltrações", grupo: "HIDRAULICA", ordem: 6, criticidadePadrao: "MEDIA" },

  // ----------------------------------------------- 4. Climatização e Exaustão
  { codigo: "refrigeracao", nome: "Sistema de Refrigeração (Chiller / VRF / Self)", grupo: "CLIMATIZACAO", ordem: 1, criticidadePadrao: "MEDIA" },
  { codigo: "torres-resfriamento", nome: "Torres de Resfriamento", grupo: "CLIMATIZACAO", ordem: 2, criticidadePadrao: "MEDIA" },
  { codigo: "ventilacao-exaustao", nome: "Ventilação e Exaustão Mecânica", grupo: "CLIMATIZACAO", ordem: 3, criticidadePadrao: "MEDIA" },

  // ---------------------------------------------------- 5. Transporte Vertical
  { codigo: "elevadores", nome: "Elevadores", grupo: "TRANSPORTE", ordem: 1, criticidadePadrao: "ALTA" },
  { codigo: "escadas-rolantes", nome: "Escadas Rolantes e Plataformas", grupo: "TRANSPORTE", ordem: 2, criticidadePadrao: "MEDIA" },

  // ---------------------------------------------- 6. Segurança contra Incêndio
  // Tudo aqui é Alta por definição: envolve risco de vida e exigência legal.
  { codigo: "deteccao-incendio", nome: "Detecção e Alarme de Incêndio", grupo: "INCENDIO", ordem: 1, criticidadePadrao: "ALTA" },
  { codigo: "combate-incendio", nome: "Combate a Incêndio (hidrantes, sprinklers, extintores)", grupo: "INCENDIO", ordem: 2, criticidadePadrao: "ALTA" },
  { codigo: "iluminacao-emergencia", nome: "Iluminação de Emergência", grupo: "INCENDIO", ordem: 3, criticidadePadrao: "ALTA" },
  { codigo: "saidas-emergencia", nome: "Saídas de Emergência e Sinalização", grupo: "INCENDIO", ordem: 4, criticidadePadrao: "ALTA" },
  { codigo: "pressurizacao-escadas", nome: "Pressurização de Escadas", grupo: "INCENDIO", ordem: 5, criticidadePadrao: "ALTA" },

  // ------------------------------------------------- 7. Segurança Patrimonial
  { codigo: "cftv", nome: "CFTV e Monitoramento", grupo: "PATRIMONIAL", ordem: 1, criticidadePadrao: "MEDIA" },
  { codigo: "controle-acesso", nome: "Controle de Acesso", grupo: "PATRIMONIAL", ordem: 2, criticidadePadrao: "MEDIA" },
  { codigo: "alarme-perimetral", nome: "Alarme Perimetral", grupo: "PATRIMONIAL", ordem: 3, criticidadePadrao: "MEDIA" },
  { codigo: "portaria-recepcao", nome: "Portaria e Recepção", grupo: "PATRIMONIAL", ordem: 4, criticidadePadrao: "MEDIA" },
  { codigo: "portas-portoes", nome: "Portas e Portões Automáticos", grupo: "PATRIMONIAL", ordem: 5, criticidadePadrao: "MEDIA" },

  // ----------------------------------------------- 8. Automação e Comunicação
  { codigo: "automacao-predial", nome: "Automação Predial (BMS)", grupo: "AUTOMACAO", ordem: 1, criticidadePadrao: "MEDIA" },
  { codigo: "rede-internet", nome: "Rede e Internet", grupo: "AUTOMACAO", ordem: 2, criticidadePadrao: "MEDIA" },
  { codigo: "interfonia", nome: "Interfonia", grupo: "AUTOMACAO", ordem: 3, criticidadePadrao: "MEDIA" },
  { codigo: "sonorizacao", nome: "Sonorização e Comunicados", grupo: "AUTOMACAO", ordem: 4, criticidadePadrao: "BAIXA" },

  // -------------------------------------------- 9. Áreas Comuns e Conservação
  { codigo: "hall-circulacoes", nome: "Hall, Recepção e Circulações", grupo: "AREAS", ordem: 1, criticidadePadrao: "BAIXA" },
  { codigo: "estacionamento", nome: "Estacionamento e Garagens", grupo: "AREAS", ordem: 2, criticidadePadrao: "MEDIA" },
  { codigo: "areas-lazer", nome: "Auditório", grupo: "AREAS", ordem: 3, criticidadePadrao: "BAIXA" },
  { codigo: "jardins-externas", nome: "Jardins e Áreas Externas", grupo: "AREAS", ordem: 4, criticidadePadrao: "BAIXA" },
  { codigo: "fachada-cobertura", nome: "Fachada e Cobertura", grupo: "AREAS", ordem: 5, criticidadePadrao: "MEDIA" },
  { codigo: "residuos", nome: "Resíduos e Coleta de Lixo", grupo: "AREAS", ordem: 6, criticidadePadrao: "MEDIA" },

  // ------------------------------------ 10. Obras, Terceiros e Documentação
  { codigo: "obras-reformas", nome: "Obras e Reformas em Andamento", grupo: "OBRAS", ordem: 1, criticidadePadrao: "MEDIA" },
  { codigo: "prestadores", nome: "Prestadores e Fornecedores no Local", grupo: "OBRAS", ordem: 2, criticidadePadrao: "BAIXA" },
  { codigo: "documentacao-licencas", nome: "Documentação e Licenças (AVCB, laudos)", grupo: "OBRAS", ordem: 3, criticidadePadrao: "ALTA" },
];

/** Grupo cujos itens representam efetivo de pessoal — origem das faltas. */
export const GRUPO_EQUIPES = "EQUIPES";


