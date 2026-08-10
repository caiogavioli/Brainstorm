"use server";

import { revalidatePath } from "next/cache";
import type { Prisma, SituacaoItem } from "@prisma/client";

import { prisma } from "@/lib/db";
import { exigirSessao, podeAcessarCondominio } from "@/lib/auth";
import { boletimSchema, primeiraMensagem } from "@/lib/validacao";
import { dataReferenciaParaDate, formatarDataReferencia } from "@/lib/datas";
import { GRUPO_EQUIPES, PRAZO_POR_CRITICIDADE } from "@/lib/checklist";

export type ResultadoAcao =
  | { ok: true; id?: number; mensagem?: string }
  | { ok: false; erro: string };

/**
 * Grava o boletim do dia e cuida das ocorrências dele.
 *
 * Regras:
 *
 * - **1 boletim por condomínio por dia** (`dataReferencia`). Reenviar o mesmo
 *   dia substitui o registro e desfaz o que aquele boletim havia causado.
 *
 * - **Um problema, uma ocorrência.** Se o item já tem ocorrência em aberto no
 *   condomínio, o boletim de hoje NÃO abre outra: registra uma recorrência na
 *   existente. Sem isso, uma infiltração que dura duas semanas viraria catorze
 *   ocorrências e catorze planos de ação para o mesmo problema.
 *
 * - **A criticidade vem do catálogo**, não do formulário. Quem preenche relata
 *   o fato; a gravidade e o prazo são atributos do assunto.
 *
 * - **Faltas são derivadas** dos itens do grupo de equipes marcados como não
 *   conformes — não existe pergunta separada de faltas.
 */
export async function salvarBoletimAction(
  payload: unknown,
): Promise<ResultadoAcao> {
  const sessao = await exigirSessao();

  const parse = boletimSchema.safeParse(payload);
  if (!parse.success) {
    return { ok: false, erro: primeiraMensagem(parse.error) };
  }
  const dados = parse.data;

  if (!podeAcessarCondominio(sessao, dados.condominioId)) {
    return { ok: false, erro: "Sem permissão para lançar boletim neste condomínio." };
  }

  // Só aceita itens que existem e estão ativos, e é daqui que sai a
  // criticidade — o cliente não tem voz nisso.
  const catalogo = await prisma.checklistItem.findMany({
    where: { id: { in: dados.itens.map((i) => i.checklistItemId) }, ativo: true },
    select: { id: true, nome: true, grupo: true, criticidadePadrao: true },
  });
  const porId = new Map(catalogo.map((i) => [i.id, i]));

  const itens = dados.itens.filter((i) => porId.has(i.checklistItemId));
  if (itens.length === 0) {
    return { ok: false, erro: "Nenhum item de checklist válido foi enviado." };
  }

  const naoConformes = itens.filter((i) => i.situacao === "NAO_CONFORME");

  // Faltas: derivadas dos itens do grupo de equipes.
  const equipesComFalta = naoConformes
    .map((i) => porId.get(i.checklistItemId)!)
    .filter((c) => c.grupo === GRUPO_EQUIPES);

  const dataRegistro = new Date();
  const abertura = dataReferenciaParaDate(dados.dataReferencia);

  try {
    const resumo = await prisma.$transaction(async (tx) => {
      const existente = await tx.boletim.findUnique({
        where: {
          condominioId_dataReferencia: {
            condominioId: dados.condominioId,
            dataReferencia: dados.dataReferencia,
          },
        },
        select: { id: true },
      });

      if (existente) {
        // Desfaz só o que este boletim havia causado: as ocorrências que ele
        // abriu e as recorrências que ele registrou em ocorrências de outros
        // dias. Ocorrências avulsas ou de outros boletins não são tocadas.
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
        await tx.ocorrenciaRecorrencia.deleteMany({
          where: { boletimId: existente.id },
        });
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
          criadoPorId: sessao.usuarioId,
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

      for (const item of naoConformes) {
        const catalogoItem = porId.get(item.checklistItemId)!;
        const boletimItem = boletim.itens.find(
          (bi) => bi.checklistItemId === item.checklistItemId,
        );
        if (!boletimItem) continue;

        const descricao =
          item.observacao ??
          `Não conformidade registrada em ${catalogoItem.nome} no boletim diário.`;

        // Já existe esse mesmo problema em aberto neste condomínio?
        const emAberto = await tx.ocorrencia.findFirst({
          where: {
            condominioId: dados.condominioId,
            checklistItemId: item.checklistItemId,
            status: { in: ["PENDENTE", "EM_ANDAMENTO"] },
          },
          orderBy: { dataAbertura: "asc" },
          select: { id: true, totalRecorrencias: true },
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
              usuarioId: sessao.usuarioId,
              mensagem: `Problema ainda presente no boletim de ${formatarDataReferencia(dados.dataReferencia)}.${
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
            abertaPorId: sessao.usuarioId,
          },
        });
        abertas++;

        await tx.ocorrenciaLog.create({
          data: {
            ocorrenciaId: ocorrencia.id,
            usuarioId: sessao.usuarioId,
            mensagem: `Ocorrência aberta pelo boletim de ${formatarDataReferencia(dados.dataReferencia)}. Criticidade ${catalogoItem.criticidadePadrao} definida pelo catálogo do item.`,
          },
        });
      }

      return { id: boletim.id, abertas, reincidentes };
    });

    revalidatePath("/boletim");
    revalidatePath("/ocorrencias");
    revalidatePath("/dashboard");

    const partes: string[] = [];
    if (resumo.abertas > 0) partes.push(`${resumo.abertas} ocorrência(s) aberta(s)`);
    if (resumo.reincidentes > 0) {
      partes.push(`${resumo.reincidentes} já em aberto (nada duplicado)`);
    }

    return {
      ok: true,
      id: resumo.id,
      mensagem:
        partes.length > 0
          ? `Boletim registrado — ${partes.join(", ")}.`
          : "Boletim registrado. Nenhuma não conformidade.",
    };
  } catch (erro) {
    console.error("Falha ao salvar boletim:", erro);
    const conhecido = erro as Prisma.PrismaClientKnownRequestError;
    if (conhecido?.code === "P2002") {
      return {
        ok: false,
        erro: "Já existe um boletim para este condomínio nesta data.",
      };
    }
    return { ok: false, erro: "Não foi possível salvar o boletim. Tente novamente." };
  }
}

/** Remove um boletim e o que ele originou. Somente ADMIN. */
export async function excluirBoletimAction(id: number): Promise<ResultadoAcao> {
  const sessao = await exigirSessao();
  if (sessao.papel !== "ADMIN") {
    return { ok: false, erro: "Apenas administradores podem excluir boletins." };
  }

  const boletim = await prisma.boletim.findUnique({
    where: { id },
    select: { condominioId: true },
  });
  if (!boletim) return { ok: false, erro: "Boletim não encontrado." };

  await prisma.$transaction(async (tx) => {
    const recorrencias = await tx.ocorrenciaRecorrencia.findMany({
      where: { boletimId: id },
      select: { ocorrenciaId: true },
    });
    for (const r of recorrencias) {
      await tx.ocorrencia.update({
        where: { id: r.ocorrenciaId },
        data: { totalRecorrencias: { decrement: 1 } },
      });
    }
    await tx.ocorrencia.deleteMany({ where: { boletimId: id, origem: "BOLETIM" } });
    await tx.boletim.delete({ where: { id } });
  });

  revalidatePath("/boletim");
  revalidatePath("/dashboard");
  return { ok: true, mensagem: "Boletim excluído." };
}
