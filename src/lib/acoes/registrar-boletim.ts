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
  /** Pendências de dias anteriores que o preenchedor deu por concluídas. */
  resolvidas: number;
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
  // Falta é evento do dia. Uma ausência que se arrasta já está contabilizada na
  // ocorrência aberta; recontá-la a cada boletim inflaria "faltas registradas"
  // em uma por dia até alguém fechar a ocorrência.
  const equipesComFalta = naoConformes
    // Só conta a falta que a ronda encontrou HOJE. Uma ausência que se arrasta
    // já está contabilizada na ocorrência aberta; recontá-la a cada boletim
    // inflaria "faltas registradas" em uma por dia até alguém fechá-la.
    .flatMap((i) =>
      i.ocorrencias.filter((o) => !o.continuacao).map(() => porId.get(i.checklistItemId)!),
    )
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
            // A anotação do item passa a ser o apanhado das suas ocorrências —
            // é o que as telas de leitura mostram numa linha só.
            observacao:
              i.ocorrencias
                .map((o) => o.descricao?.trim())
                .filter(Boolean)
                .join(" · ") || null,
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

      /*
       * Um item não conforme pode trazer VÁRIAS ocorrências.
       *
       * Cada entrada da lista é um problema com vida própria: "falta na equipe
       * de segurança" pode ser o líder e o vigilante de piso, com planos e
       * prazos diferentes. Espremer os dois numa descrição só apagaria a
       * possibilidade de fechar um antes do outro.
       */
      for (const entrada of item.ocorrencias) {
        const descricao =
          entrada.descricao ??
          `Não conformidade registrada em ${catalogoItem.nome} no boletim diário.`;

        /*
         * Recorrência agora é por identidade, não por dedução.
         *
         * Antes o servidor procurava "alguma ocorrência aberta neste item" e
         * assumia que era a mesma. Com vários problemas por item essa dedução
         * passaria a errar: o segundo problema do dia seria confundido com o
         * primeiro. Quem sabe qual é qual é a etapa de pendências, que devolve
         * o id exato em `origemPendencia`.
         */
        const emAberto = entrada.origemPendencia
          ? await tx.ocorrencia.findFirst({
              where: {
                id: entrada.origemPendencia,
                condominioId: dados.condominioId,
                status: { in: ["PENDENTE", "EM_ANDAMENTO"] },
              },
              select: {
                id: true,
                descricao: true,
                criticidade: true,
                status: true,
                previsaoFinalizacao: true,
                dataAbertura: true,
              },
            })
          : null;

        if (emAberto) {
          await tx.ocorrenciaRecorrencia.create({
            data: {
              ocorrenciaId: emAberto.id,
              boletimId: boletim.id,
              dataReferencia: dados.dataReferencia,
              observacao: entrada.descricao,
            },
          });
          /*
           * A reincidência não descarta o que a pessoa escreveu agora.
           *
           * Continua sendo UMA ocorrência — a regra de não duplicar plano de
           * ação vale. Mas quem preencheu classificou o risco e escreveu um
           * plano olhando para o problema hoje, e essa leitura é mais recente
           * que a de dias atrás. Ignorá-la seria pedir informação para jogar
           * fora, o que ensina a equipe a preencher por preencher.
           *
           * Um campo deixado em branco não apaga o que já existia.
           */
          await tx.ocorrencia.update({
            where: { id: emAberto.id },
            data: {
              ultimaRecorrenciaEm: abertura,
              totalRecorrencias: { increment: 1 },
              ...(entrada.criticidade ? { criticidade: entrada.criticidade } : {}),
              ...(entrada.planoAcao ? { planoAcao: entrada.planoAcao } : {}),
              ...(entrada.previsaoFinalizacao
                ? {
                    previsaoFinalizacao: dataEscolhidaParaDate(
                      entrada.previsaoFinalizacao,
                    ),
                  }
                : {}),
            },
          });
          await tx.ocorrenciaLog.create({
            data: {
              ocorrenciaId: emAberto.id,
              usuarioId,
              mensagem:
                `Problema ainda presente no boletim de ${formatarDataReferencia(dados.dataReferencia)}, enviado por ${autor}.` +
                (entrada.descricao ? ` "${entrada.descricao}"` : "") +
                (entrada.criticidade
                  ? ` Risco reavaliado como ${entrada.criticidade}.`
                  : "") +
                (entrada.planoAcao
                  ? ` Plano de ação atualizado: "${entrada.planoAcao}"`
                  : "") +
                (entrada.previsaoFinalizacao
                  ? ` Conclusão estimada para ${formatarDataReferencia(entrada.previsaoFinalizacao)}.`
                  : ""),
            },
          });
          paraResumo.push({
            setor: catalogoItem.nome,
            descricao: entrada.descricao?.trim() || emAberto.descricao,
            planoAcao: entrada.planoAcao,
            criticidade: entrada.criticidade ?? emAberto.criticidade,
            status: emAberto.status,
            previsaoFinalizacao: entrada.previsaoFinalizacao
              ? dataEscolhidaParaDate(entrada.previsaoFinalizacao)
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
        const previsao = entrada.previsaoFinalizacao
          ? dataEscolhidaParaDate(entrada.previsaoFinalizacao)
          : null;

        // A criticidade do catálogo é sugestão; quem esteve no local decide.
        const criticidade = entrada.criticidade ?? catalogoItem.criticidadePadrao;

        const ocorrencia = await tx.ocorrencia.create({
          data: {
            condominioId: dados.condominioId,
            checklistItemId: item.checklistItemId,
            descricao,
            planoAcao: entrada.planoAcao ?? null,
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
          planoAcao: entrada.planoAcao,
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
              `Criticidade ${criticidade}${entrada.criticidade ? " informada por quem preencheu" : " sugerida pelo catálogo"}. ` +
              (previsao
                ? `Conclusão estimada para ${formatarDataReferencia(entrada.previsaoFinalizacao!)}.`
                : "Sem prazo definido."),
          },
        });
      }
    }

    /*
     * Pendências dadas como resolvidas hoje.
     *
     * O filtro por `condominioId` não é zelo excessivo: o id vem do cliente, e
     * sem ele bastaria trocar um número no envio para fechar a ocorrência de
     * outro prédio. O filtro por status também importa — reenviar o mesmo dia
     * não pode reescrever a data de conclusão de algo já concluído.
     */
    let resolvidas = 0;
    if (dados.pendenciasResolvidas.length > 0) {
      const alvos = await tx.ocorrencia.findMany({
        where: {
          id: { in: dados.pendenciasResolvidas },
          condominioId: dados.condominioId,
          status: { in: ["PENDENTE", "EM_ANDAMENTO"] },
        },
        select: { id: true, descricao: true },
      });

      for (const alvo of alvos) {
        await tx.ocorrencia.update({
          where: { id: alvo.id },
          data: { status: "CONCLUIDO", dataConclusao: abertura },
        });
        await tx.ocorrenciaLog.create({
          data: {
            ocorrenciaId: alvo.id,
            usuarioId,
            mensagem:
              `Concluída no boletim de ${formatarDataReferencia(dados.dataReferencia)}, ` +
              `enviado por ${autor}.`,
          },
        });
      }
      resolvidas = alvos.length;
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
          observacao:
            i.ocorrencias
              .map((o) => o.descricao?.trim())
              .filter(Boolean)
              .join(" · ") || null,
        };
      }),
      // Críticas primeiro: é o que precisa ser lido antes de rolar a mensagem.
      ocorrencias: paraResumo.sort((a, b) =>
        ORDEM_CRITICIDADE[b.criticidade] - ORDEM_CRITICIDADE[a.criticidade],
      ),
    });

    return { id: boletim.id, abertas, reincidentes, resolvidas, resumo };
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
  if (r.resolvidas > 0) partes.push(`${r.resolvidas} pendência(s) concluída(s)`);
  return partes.length > 0
    ? `Boletim registrado — ${partes.join(" · ")}.`
    : "Boletim registrado. Nenhuma não conformidade.";
}

export type { PrismaClient };
