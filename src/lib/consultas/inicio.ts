import "server-only";

import { prisma } from "@/lib/db";
import { type Sessao, escopoCondominios } from "@/lib/auth";
import { dataReferenciaDe, diasAteSLA } from "@/lib/datas";

/**
 * Dados da tela inicial de quem preenche o boletim.
 *
 * A pergunta que essa tela responde não é "como foi o mês" — é "o que está
 * aberto no meu prédio e o que eu faço agora". Por isso ela carrega o backlog
 * inteiro em aberto (e não o do período), ordenado por urgência, mais o estado
 * do boletim de hoje.
 */

export type OcorrenciaDestaque = {
  id: number;
  condominio: string;
  setor: string;
  descricao: string;
  criticidade: "ALTA" | "MEDIA" | "BAIXA";
  status: "PENDENTE" | "EM_ANDAMENTO";
  previsaoFinalizacao: Date | null;
  diasAteSLA: number | null;
  planoAcao: string | null;
  totalRecorrencias: number;
};

export type PendenciaBoletim = {
  condominioId: number;
  nome: string;
  enviadoHoje: boolean;
};

/**
 * Peso de urgência. Menor vem primeiro.
 *
 * Atraso vence criticidade de propósito: uma ocorrência Baixa que estourou o
 * prazo combinado é uma promessa quebrada, e some da vista se ficar atrás de
 * toda ocorrência Alta ainda dentro do prazo.
 *
 * Já "sem prazo" NÃO é uma faixa de urgência própria, e essa distinção importa
 * neste sistema: como ele nunca inventa data de conclusão, ficar sem prazo é
 * comum e não quer dizer "pode esperar" — quer dizer que ninguém se
 * comprometeu com uma data. Jogar tudo que não tem prazo para o fim faria uma
 * ocorrência Alta recém-aberta aparecer atrás de uma Baixa que vence daqui a
 * três meses. Sem prazo divide a faixa com "no prazo", e a criticidade decide;
 * o desempate por data deixa quem tem prazo marcado na frente.
 */
function urgencia(dias: number | null, criticidade: string): number {
  const porCriticidade = criticidade === "ALTA" ? 0 : criticidade === "MEDIA" ? 1 : 2;
  if (dias !== null && dias < 0) return 0 + porCriticidade; // atrasada
  if (dias !== null && dias <= 3) return 10 + porCriticidade; // vence logo
  return 20 + porCriticidade;
}

export async function carregarInicio(sessao: Sessao) {
  const escopo = escopoCondominios(sessao);
  const recorte = escopo ? { condominioId: { in: escopo } } : {};
  const hoje = dataReferenciaDe();

  const [abertas, condominios, boletinsDeHoje] = await Promise.all([
    prisma.ocorrencia.findMany({
      where: { ...recorte, status: { in: ["PENDENTE", "EM_ANDAMENTO"] } },
      include: {
        condominio: { select: { nome: true } },
        checklistItem: { select: { nome: true } },
      },
    }),
    prisma.condominio.findMany({
      where: { ativo: true, ...(escopo ? { id: { in: escopo } } : {}) },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.boletim.findMany({
      where: { ...recorte, dataReferencia: hoje },
      select: { condominioId: true },
    }),
  ]);

  const enviados = new Set(boletinsDeHoje.map((b) => b.condominioId));

  const ocorrencias: OcorrenciaDestaque[] = abertas
    .map((o) => ({
      id: o.id,
      condominio: o.condominio.nome,
      setor: o.checklistItem?.nome ?? o.setorLivre ?? "—",
      descricao: o.descricao,
      criticidade: o.criticidade,
      status: o.status as "PENDENTE" | "EM_ANDAMENTO",
      previsaoFinalizacao: o.previsaoFinalizacao,
      diasAteSLA: diasAteSLA(o.previsaoFinalizacao),
      planoAcao: o.planoAcao,
      totalRecorrencias: o.totalRecorrencias,
    }))
    .sort(
      (a, b) =>
        urgencia(a.diasAteSLA, a.criticidade) - urgencia(b.diasAteSLA, b.criticidade) ||
        (a.previsaoFinalizacao?.getTime() ?? Infinity) -
          (b.previsaoFinalizacao?.getTime() ?? Infinity) ||
        a.id - b.id,
    );

  const pendencias: PendenciaBoletim[] = condominios.map((c) => ({
    condominioId: c.id,
    nome: c.nome,
    enviadoHoje: enviados.has(c.id),
  }));

  return {
    hoje,
    ocorrencias,
    pendencias,
    resumo: {
      total: ocorrencias.length,
      atrasadas: ocorrencias.filter((o) => (o.diasAteSLA ?? 1) < 0).length,
      venceEmBreve: ocorrencias.filter(
        (o) => o.diasAteSLA !== null && o.diasAteSLA >= 0 && o.diasAteSLA <= 3,
      ).length,
      semPlano: ocorrencias.filter((o) => !o.planoAcao?.trim()).length,
    },
  };
}
