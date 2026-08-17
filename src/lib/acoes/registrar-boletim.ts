import "server-only";

import type { Prisma, PrismaClient, SituacaoItem } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  dataEscolhidaParaDate,
  dataReferenciaParaDate,
  formatarDataReferencia,
} from "@/lib/datas";
import { GRUPO_EQUIPES } from "@/lib/checklist";
import {
  montarResumoWhatsApp,
  type OcorrenciaResumo,
} from "@/lib/resumo-whatsapp";
import type { EntradaBoletim } from "@/lib/validacao";

/**
 * Gravação do boletim — o mesmo caminho para o lançamento e para a correção
 * pelo admin. As regras de negócio ficam aqui uma vez só; cada porta de entrada
 * cuida apenas da sua autenticação.
 */

export type ResultadoRegistro = {
  id: number;
  abertas: number;
  reincidentes: number;
  /** Texto pronto para colar no grupo de WhatsApp. */
  resumo: string;
};

export type OpcoesRegistro = {
  dados: EntradaBoletim;
  /** Nome de quem preencheu, para exibição no boletim e no resumo. */
  preenchidoPor: string | null;
  /** Usuário logado, quando o lançamento vem do painel. */
  usuarioId: number | null;
  /**
   * Correção pelo admin: mantém no registro o nome de quem preencheu de fato.
   * Sem isso, arrumar um erro de digitação apagaria a autoria da ronda e
   * carimbaria o administrador no lugar do gerente que esteve no prédio.
   */
  manterAutoria?: boolean;
};

export async function registrarBoletim({
  dados,
  preenchidoPor,
  usuarioId,
  manterAutoria = false,
}: OpcoesRegistro): Promise<ResultadoRegistro> {
  // O catálogo é a fonte da criticidade — o cliente não tem voz nisso.
  const [catalogo, condominio] = await Promise.all([
    prisma.checklistItem.findMany({
      where: { id: { in: dados.itens.map((i) => i.checklistItemId) }, ativo: true },
      select: {
        id: true,
        nome: true,
        grupo: true,
        ordem: true,
        criticidadePadrao: true,
      },
    }),
    prisma.condominio.findUnique({
      where: { id: dados.condominioId },
      select: { nome: true },
    }),
  ]);
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
    // Alimenta o resumo de WhatsApp com os mesmos dados que foram gravados.
    const paraResumo: OcorrenciaResumo[] = [];

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
        select: {
          id: true,
          descricao: true,
          criticidade: true,
          status: true,
          previsaoFinalizacao: true,
          dataAbertura: true,
        },
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
        /*
         * A reincidência não descarta o que a pessoa escreveu agora.
         *
         * Continua sendo UMA ocorrência — a regra de não duplicar plano de ação
         * vale. Mas quem preencheu classificou o risco e escreveu um plano
         * olhando para o problema hoje, e essa leitura é mais recente que a de
         * dias atrás. Ignorá-la seria pedir informação para jogar fora, o que
         * ensina a equipe a preencher por preencher.
         *
         * Um campo deixado em branco não apaga o que já existia.
         */
        await tx.ocorrencia.update({
          where: { id: emAberto.id },
          data: {
            ultimaRecorrenciaEm: abertura,
            totalRecorrencias: { increment: 1 },
            ...(item.criticidade ? { criticidade: item.criticidade } : {}),
            ...(item.planoAcao ? { planoAcao: item.planoAcao } : {}),
            ...(item.previsaoFinalizacao
              ? { previsaoFinalizacao: dataEscolhidaParaDate(item.previsaoFinalizacao) }
              : {}),
          },
        });
        await tx.ocorrenciaLog.create({
          data: {
            ocorrenciaId: emAberto.id,
            usuarioId,
            mensagem:
              `Problema ainda presente no boletim de ${formatarDataReferencia(dados.dataReferencia)}, enviado por ${autor}.` +
              (item.observacao ? ` "${item.observacao}"` : "") +
              (item.criticidade ? ` Risco reavaliado como ${item.criticidade}.` : "") +
              (item.planoAcao ? ` Plano de ação atualizado: "${item.planoAcao}"` : "") +
              (item.previsaoFinalizacao
                ? ` Conclusão estimada para ${formatarDataReferencia(item.previsaoFinalizacao)}.`
                : ""),
          },
        });
        paraResumo.push({
          setor: catalogoItem.nome,
          descricao: item.observacao?.trim() || emAberto.descricao,
          planoAcao: item.planoAcao,
          criticidade: item.criticidade ?? emAberto.criticidade,
          status: emAberto.status,
          previsaoFinalizacao: item.previsaoFinalizacao
            ? dataEscolhidaParaDate(item.previsaoFinalizacao)
            : emAberto.previsaoFinalizacao,
          reincidente: true,
          desde: emAberto.dataAbertura,
        });
        reincidentes++;
        continue;
      }

      /*
       * O prazo vem de quem preencheu — ou não vem.
       *
       * O sistema NÃO calcula data de conclusão. Um prazo gerado
       * automaticamente parece compromisso sem que ninguém o tenha assumido:
       * enche a matriz de risco de atrasos que não são de ninguém e treina
       * todo mundo a ignorar o indicador. Campo vazio se lê como "ainda sem
       * prazo", que é a verdade quando ninguém definiu um.
       */
      const previsao = item.previsaoFinalizacao
        ? dataEscolhidaParaDate(item.previsaoFinalizacao)
        : null;

      // A criticidade do catálogo é sugestão; quem esteve no local decide.
      const criticidade = item.criticidade ?? catalogoItem.criticidadePadrao;

      const ocorrencia = await tx.ocorrencia.create({
        data: {
          condominioId: dados.condominioId,
          checklistItemId: item.checklistItemId,
          descricao,
          planoAcao: item.planoAcao ?? null,
          criticidade,
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

      paraResumo.push({
        setor: catalogoItem.nome,
        descricao,
        planoAcao: item.planoAcao,
        criticidade: ocorrencia.criticidade,
        status: ocorrencia.status,
        previsaoFinalizacao: ocorrencia.previsaoFinalizacao,
      });

      await tx.ocorrenciaLog.create({
        data: {
          ocorrenciaId: ocorrencia.id,
          usuarioId,
          mensagem:
            `Ocorrência aberta pelo boletim de ${formatarDataReferencia(dados.dataReferencia)}, enviado por ${autor}. ` +
            `Criticidade ${criticidade}${item.criticidade ? " informada por quem preencheu" : " sugerida pelo catálogo"}. ` +
            (previsao
              ? `Conclusão estimada para ${formatarDataReferencia(item.previsaoFinalizacao!)}.`
              : "Sem prazo definido."),
        },
      });
    }

    const resumo = montarResumoWhatsApp({
      condominio: condominio?.nome ?? "Condomínio",
      dataReferencia: dados.dataReferencia,
      preenchidoPor: autoria,
      observacoes: dados.observacoes,
      itens: itens.map((i) => {
        const c = porId.get(i.checklistItemId)!;
        return {
          nome: c.nome,
          grupo: c.grupo,
          ordem: c.ordem,
          situacao: i.situacao as SituacaoItem,
          observacao: i.observacao,
        };
      }),
      // Críticas primeiro: é o que precisa ser lido antes de rolar a mensagem.
      ocorrencias: paraResumo.sort((a, b) =>
        ORDEM_CRITICIDADE[b.criticidade] - ORDEM_CRITICIDADE[a.criticidade],
      ),
    });

    return { id: boletim.id, abertas, reincidentes, resumo };
  });
}

const ORDEM_CRITICIDADE = { ALTA: 3, MEDIA: 2, BAIXA: 1 } as const;

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
