"use server";

import { revalidatePath } from "next/cache";
import type { Criticidade, Prisma, SituacaoItem } from "@prisma/client";

import { prisma } from "@/lib/db";
import { exigirSessao, podeAcessarCondominio } from "@/lib/auth";
import { boletimSchema, primeiraMensagem } from "@/lib/validacao";
import { dataReferenciaParaDate } from "@/lib/datas";

export type ResultadoAcao =
  | { ok: true; id?: number; mensagem?: string }
  | { ok: false; erro: string };

/** SLA padrão, em dias, por criticidade da ocorrência. */
const PRAZO_POR_CRITICIDADE: Record<Criticidade, number> = {
  ALTA: 3,
  MEDIA: 7,
  BAIXA: 15,
};

/**
 * Grava o boletim do dia e abre automaticamente uma ocorrência para cada
 * item marcado como "Não Conforme".
 *
 * Regras:
 * - 1 boletim por condomínio por dia (`dataReferencia`). Reenviar o mesmo dia
 *   substitui o boletim anterior e as ocorrências que ele havia gerado — as
 *   ocorrências avulsas ou já editadas no painel não são tocadas.
 * - Tudo roda em uma transação: ou o boletim e suas ocorrências entram juntos,
 *   ou nada entra.
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

  // Só aceita itens que existem e estão ativos no catálogo.
  const itensValidos = await prisma.checklistItem.findMany({
    where: { id: { in: dados.itens.map((i) => i.checklistItemId) }, ativo: true },
    select: { id: true },
  });
  const idsValidos = new Set(itensValidos.map((i) => i.id));
  const itens = dados.itens.filter((i) => idsValidos.has(i.checklistItemId));
  if (itens.length === 0) {
    return { ok: false, erro: "Nenhum item de checklist válido foi enviado." };
  }

  const dataRegistro = new Date();

  try {
    const boletimId = await prisma.$transaction(async (tx) => {
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
        // Remove apenas as ocorrências que este boletim havia gerado.
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
          houveFaltas: dados.houveFaltas,
          qtdeFaltas: dados.houveFaltas ? dados.qtdeFaltas : 0,
          setoresFaltas: dados.houveFaltas ? dados.setoresFaltas : null,
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

      const abertura = dataReferenciaParaDate(dados.dataReferencia);

      for (const item of itens) {
        if (item.situacao !== "NAO_CONFORME") continue;

        const boletimItem = boletim.itens.find(
          (bi) => bi.checklistItemId === item.checklistItemId,
        );
        if (!boletimItem) continue;

        const previsao = new Date(abertura);
        previsao.setUTCDate(
          previsao.getUTCDate() + PRAZO_POR_CRITICIDADE[item.criticidade],
        );

        const ocorrencia = await tx.ocorrencia.create({
          data: {
            condominioId: dados.condominioId,
            checklistItemId: item.checklistItemId,
            descricao:
              item.observacao ??
              "Não conformidade registrada no boletim diário (sem descrição informada).",
            criticidade: item.criticidade,
            status: "PENDENTE",
            previsaoFinalizacao: previsao,
            dataAbertura: dataRegistro,
            origem: "BOLETIM",
            boletimId: boletim.id,
            boletimItemId: boletimItem.id,
            abertaPorId: sessao.usuarioId,
          },
        });

        await tx.ocorrenciaLog.create({
          data: {
            ocorrenciaId: ocorrencia.id,
            usuarioId: sessao.usuarioId,
            mensagem: `Ocorrência aberta automaticamente pelo boletim de ${dados.dataReferencia}.`,
          },
        });
      }

      return boletim.id;
    });

    revalidatePath("/boletim");
    revalidatePath("/ocorrencias");
    revalidatePath("/dashboard");

    return { ok: true, id: boletimId, mensagem: "Boletim registrado com sucesso." };
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

/** Remove um boletim e as ocorrências que ele originou. Somente ADMIN. */
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

  await prisma.$transaction([
    prisma.ocorrencia.deleteMany({ where: { boletimId: id, origem: "BOLETIM" } }),
    prisma.boletim.delete({ where: { id } }),
  ]);

  revalidatePath("/boletim");
  revalidatePath("/dashboard");
  return { ok: true, mensagem: "Boletim excluído." };
}
