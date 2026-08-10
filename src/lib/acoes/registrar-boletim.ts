import "server-only";

import type { Prisma, PrismaClient, SituacaoItem } from "@prisma/client";

import { prisma } from "@/lib/db";
import { dataReferenciaParaDate, formatarDataReferencia } from "@/lib/datas";
import { GRUPO_EQUIPES, PRAZO_POR_CRITICIDADE } from "@/lib/checklist";
import type { EntradaBoletim } from "@/lib/validacao";

/**
 * Gravação do boletim — o mesmo caminho para o formulário público e para o
 * lançamento pelo painel. As regras de negócio ficam aqui uma vez só; cada
 * porta de entrada cuida apenas da sua autenticação.
 */

export type ResultadoRegistro = {
  id: number;
  abertas: number;
  reincidentes: number;
};

export type OpcoesRegistro = {
  dados: EntradaBoletim;
  /** Nome digitado por quem preencheu (formulário público). */
  preenchidoPor: string | null;
  /** Usuário logado, quando o lançamento vem do painel. */
  usuarioId: number | null;
  /**
   * Se `false`, um boletim já existente para aquele condomínio/dia é um erro em
   * vez de ser substituído. O formulário público usa `false`: sem login, deixar
   * sobrescrever permitiria que um envio acidental (ou de má-fé) apagasse o
   * boletim legítimo do dia.
   */
  permitirSubstituir: boolean;
  /**
   * Correção pelo admin: mantém no registro o nome de quem preencheu de fato.
   * Sem isso, arrumar um erro de digitação apagaria a autoria da ronda e
   * carimbaria o administrador no lugar do gerente que esteve no prédio.
   */
  manterAutoria?: boolean;
};

export class BoletimJaExisteError extends Error {
  constructor(dataReferencia: string) {
    super(
      `Já existe um boletim enviado para este condomínio em ${formatarDataReferencia(dataReferencia)}. Para corrigi-lo, peça ao administrador.`,
    );
    this.name = "BoletimJaExisteError";
  }
}

export async function registrarBoletim({
  dados,
  preenchidoPor,
  usuarioId,
  permitirSubstituir,
  manterAutoria = false,
}: OpcoesRegistro): Promise<ResultadoRegistro> {
  // O catálogo é a fonte da criticidade — o cliente não tem voz nisso.
  const catalogo = await prisma.checklistItem.findMany({
    where: { id: { in: dados.itens.map((i) => i.checklistItemId) }, ativo: true },
    select: { id: true, nome: true, grupo: true, criticidadePadrao: true },
  });
  const porId = new Map(catalogo.map((i) => [i.id, i]));

  const itens = dados.itens.filter((i) => porId.has(i.checklistItemId));
  if (itens.length === 0) {
    throw new Error("Nenhum item de checklist válido foi enviado.");
  }

  const naoConformes = itens.filter((i) => i.situacao === "NAO_CONFORME");
  const equipesComFalta = naoConformes
    .map((i) => porId.get(i.checklistItemId)!)
    .filter((c) => c.grupo === GRUPO_EQUIPES);

  const dataRegistro = new Date();
  const abertura = dataReferenciaParaDate(dados.dataReferencia);

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const existente = await tx.boletim.findUnique({
      where: {
        condominioId_dataReferencia: {
          condominioId: dados.condominioId,
          dataReferencia: dados.dataReferencia,
        },
      },
      select: { id: true, preenchidoPor: true },
    });

    // Na correção, a autoria é a do boletim original, não a de quem corrige.
    const autoria =
      manterAutoria && existente?.preenchidoPor ? existente.preenchidoPor : preenchidoPor;

    if (existente) {
      if (!permitirSubstituir) throw new BoletimJaExisteError(dados.dataReferencia);

      // Desfaz só o que este boletim havia causado.
      const recorrenciasAntigas = await tx.ocorrenciaRecorrencia.findMany({
        where: { boletimId: existente.id },
        select: { ocorrenciaId: true },
      });
      for (const r of recorrenciasAntigas) {
        await tx.ocorrencia.update({
          where: { id: r.ocorrenciaId },
          data: { totalRecorrencias: { decrement: 1 } },
        });
      }
      await tx.ocorrenciaRecorrencia.deleteMany({ where: { boletimId: existente.id } });
      await tx.ocorrencia.deleteMany({
        where: { boletimId: existente.id, origem: "BOLETIM" },
      });
      await tx.boletimItem.deleteMany({ where: { boletimId: existente.id } });
      await tx.boletim.delete({ where: { id: existente.id } });
    }

    const boletim = await tx.boletim.create({
      data: {
        condominioId: dados.condominioId,
        dataRegistro,
        dataReferencia: dados.dataReferencia,
        statusGeral: dados.statusGeral,
        houveFaltas: equipesComFalta.length > 0,
        qtdeFaltas: equipesComFalta.length,
        setoresFaltas:
          equipesComFalta.length > 0
            ? equipesComFalta.map((c) => c.nome).join(", ")
            : null,
        observacoes: dados.observacoes,
        preenchidoPor: autoria,
        criadoPorId: usuarioId,
        itens: {
          create: itens.map((i) => ({
            checklistItemId: i.checklistItemId,
            situacao: i.situacao as SituacaoItem,
            observacao: i.observacao,
          })),
        },
      },
      include: { itens: true },
    });

    let abertas = 0;
    let reincidentes = 0;
    const autor = autoria ?? "painel administrativo";

    for (const item of naoConformes) {
      const catalogoItem = porId.get(item.checklistItemId)!;
      const boletimItem = boletim.itens.find(
        (bi) => bi.checklistItemId === item.checklistItemId,
      );
      if (!boletimItem) continue;

      const descricao =
        item.observacao ??
        `Não conformidade registrada em ${catalogoItem.nome} no boletim diário.`;

      // Um problema já em aberto não vira ocorrência nova: vira recorrência.
      const emAberto = await tx.ocorrencia.findFirst({
        where: {
          condominioId: dados.condominioId,
          checklistItemId: item.checklistItemId,
          status: { in: ["PENDENTE", "EM_ANDAMENTO"] },
        },
        orderBy: { dataAbertura: "asc" },
        select: { id: true },
      });

      if (emAberto) {
        await tx.ocorrenciaRecorrencia.create({
          data: {
            ocorrenciaId: emAberto.id,
            boletimId: boletim.id,
            dataReferencia: dados.dataReferencia,
            observacao: item.observacao,
          },
        });
        await tx.ocorrencia.update({
          where: { id: emAberto.id },
          data: {
            ultimaRecorrenciaEm: abertura,
            totalRecorrencias: { increment: 1 },
          },
        });
        await tx.ocorrenciaLog.create({
          data: {
            ocorrenciaId: emAberto.id,
            usuarioId,
            mensagem: `Problema ainda presente no boletim de ${formatarDataReferencia(dados.dataReferencia)}, enviado por ${autor}.${
              item.observacao ? ` "${item.observacao}"` : ""
            }`,
          },
        });
        reincidentes++;
        continue;
      }

      const previsao = new Date(abertura);
      previsao.setUTCDate(
        previsao.getUTCDate() + PRAZO_POR_CRITICIDADE[catalogoItem.criticidadePadrao],
      );

      const ocorrencia = await tx.ocorrencia.create({
        data: {
          condominioId: dados.condominioId,
          checklistItemId: item.checklistItemId,
          descricao,
          criticidade: catalogoItem.criticidadePadrao,
          status: "PENDENTE",
          previsaoFinalizacao: previsao,
          dataAbertura: dataRegistro,
          origem: "BOLETIM",
          boletimId: boletim.id,
          boletimItemId: boletimItem.id,
          abertaPorId: usuarioId,
        },
      });
      abertas++;

      await tx.ocorrenciaLog.create({
        data: {
          ocorrenciaId: ocorrencia.id,
          usuarioId,
          mensagem: `Ocorrência aberta pelo boletim de ${formatarDataReferencia(dados.dataReferencia)}, enviado por ${autor}. Criticidade ${catalogoItem.criticidadePadrao} definida pelo catálogo do item.`,
        },
      });
    }

    return { id: boletim.id, abertas, reincidentes };
  });
}

/** Frase de confirmação, usada nos dois fluxos. */
export function resumoDoRegistro(r: ResultadoRegistro): string {
  const partes: string[] = [];
  if (r.abertas > 0) partes.push(`${r.abertas} ocorrência(s) aberta(s)`);
  if (r.reincidentes > 0) {
    partes.push(`${r.reincidentes} problema(s) já em aberto — nada foi duplicado`);
  }
  return partes.length > 0
    ? `Boletim registrado — ${partes.join(" · ")}.`
    : "Boletim registrado. Nenhuma não conformidade.";
}

export type { PrismaClient };
