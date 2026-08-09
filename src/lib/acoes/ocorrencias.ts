"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { exigirSessao, podeAcessarCondominio, type Sessao } from "@/lib/auth";
import {
  atualizacaoOcorrenciaSchema,
  ocorrenciaSchema,
  primeiraMensagem,
} from "@/lib/validacao";
import { CRITICIDADE_LABEL, STATUS_OCORRENCIA_LABEL } from "@/lib/labels";
import { salvarImagens } from "@/lib/armazenamento";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

/** Garante que a sessão pode mexer na ocorrência informada. */
async function carregarOcorrenciaComPermissao(sessao: Sessao, id: number) {
  const ocorrencia = await prisma.ocorrencia.findUnique({
    where: { id },
    select: { id: true, condominioId: true, status: true, criticidade: true, previsaoFinalizacao: true, planoAcao: true },
  });
  if (!ocorrencia) return null;
  if (!podeAcessarCondominio(sessao, ocorrencia.condominioId)) return null;
  return ocorrencia;
}

/** Cria uma ocorrência avulsa (não originada de boletim). */
export async function criarOcorrenciaAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await exigirSessao();

  const parse = ocorrenciaSchema.safeParse({
    condominioId: formData.get("condominioId"),
    checklistItemId: formData.get("checklistItemId") || null,
    setorLivre: formData.get("setorLivre") ?? "",
    descricao: formData.get("descricao") ?? "",
    planoAcao: formData.get("planoAcao") ?? "",
    criticidade: formData.get("criticidade"),
    status: formData.get("status"),
    previsaoFinalizacao: formData.get("previsaoFinalizacao") ?? "",
  });
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const dados = parse.data;

  if (!podeAcessarCondominio(sessao, dados.condominioId)) {
    return { ok: false, erro: "Sem permissão para este condomínio." };
  }
  if (!dados.checklistItemId && !dados.setorLivre) {
    return { ok: false, erro: "Informe o setor/equipamento da ocorrência." };
  }

  const fotos = await salvarImagens(formData.getAll("fotos") as File[]);

  const ocorrencia = await prisma.ocorrencia.create({
    data: {
      condominioId: dados.condominioId,
      checklistItemId: dados.checklistItemId,
      setorLivre: dados.setorLivre,
      descricao: dados.descricao,
      planoAcao: dados.planoAcao,
      criticidade: dados.criticidade,
      status: dados.status,
      previsaoFinalizacao: dados.previsaoFinalizacao
        ? new Date(`${dados.previsaoFinalizacao}T12:00:00.000Z`)
        : null,
      dataConclusao: dados.status === "CONCLUIDO" ? new Date() : null,
      origem: "AVULSA",
      abertaPorId: sessao.usuarioId,
      fotos: { create: fotos },
      historico: {
        create: {
          usuarioId: sessao.usuarioId,
          mensagem: `Ocorrência avulsa aberta por ${sessao.nome}.`,
        },
      },
    },
  });

  revalidatePath("/ocorrencias");
  revalidatePath("/dashboard");
  return { ok: true, id: ocorrencia.id, mensagem: "Ocorrência registrada." };
}

/**
 * Atualiza status, criticidade, SLA e plano de ação, registrando cada mudança
 * no histórico da ocorrência.
 */
export async function atualizarOcorrenciaAction(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  const sessao = await exigirSessao();

  const parse = atualizacaoOcorrenciaSchema.safeParse({
    id: formData.get("id"),
    planoAcao: formData.get("planoAcao") ?? "",
    criticidade: formData.get("criticidade"),
    status: formData.get("status"),
    previsaoFinalizacao: formData.get("previsaoFinalizacao") ?? "",
    comentario: formData.get("comentario") ?? "",
  });
  if (!parse.success) return { ok: false, erro: primeiraMensagem(parse.error) };
  const dados = parse.data;

  const atual = await carregarOcorrenciaComPermissao(sessao, dados.id);
  if (!atual) return { ok: false, erro: "Ocorrência não encontrada ou sem permissão." };

  const novaPrevisao = dados.previsaoFinalizacao
    ? new Date(`${dados.previsaoFinalizacao}T12:00:00.000Z`)
    : null;

  const logs: { campo: string; antes: string; depois: string; mensagem: string }[] = [];

  if (atual.status !== dados.status) {
    logs.push({
      campo: "status",
      antes: atual.status,
      depois: dados.status,
      mensagem: `Status alterado de "${STATUS_OCORRENCIA_LABEL[atual.status]}" para "${STATUS_OCORRENCIA_LABEL[dados.status]}".`,
    });
  }
  if (atual.criticidade !== dados.criticidade) {
    logs.push({
      campo: "criticidade",
      antes: atual.criticidade,
      depois: dados.criticidade,
      mensagem: `Criticidade alterada de "${CRITICIDADE_LABEL[atual.criticidade]}" para "${CRITICIDADE_LABEL[dados.criticidade]}".`,
    });
  }
  const previsaoAntes = atual.previsaoFinalizacao?.toISOString().slice(0, 10) ?? "";
  const previsaoDepois = dados.previsaoFinalizacao ?? "";
  if (previsaoAntes !== previsaoDepois) {
    logs.push({
      campo: "previsaoFinalizacao",
      antes: previsaoAntes,
      depois: previsaoDepois,
      mensagem: `Previsão de finalização alterada para ${previsaoDepois || "sem prazo"}.`,
    });
  }
  if ((atual.planoAcao ?? "") !== (dados.planoAcao ?? "")) {
    logs.push({
      campo: "planoAcao",
      antes: atual.planoAcao ?? "",
      depois: dados.planoAcao ?? "",
      mensagem: "Plano de ação atualizado.",
    });
  }

  const fotos = await salvarImagens(formData.getAll("fotos") as File[]);

  await prisma.$transaction(async (tx) => {
    await tx.ocorrencia.update({
      where: { id: dados.id },
      data: {
        planoAcao: dados.planoAcao,
        criticidade: dados.criticidade,
        status: dados.status,
        previsaoFinalizacao: novaPrevisao,
        // Marca a conclusão ao entrar em CONCLUIDO e limpa se for reaberta.
        dataConclusao:
          dados.status === "CONCLUIDO"
            ? atual.status === "CONCLUIDO"
              ? undefined
              : new Date()
            : null,
      },
    });

    for (const log of logs) {
      await tx.ocorrenciaLog.create({
        data: {
          ocorrenciaId: dados.id,
          usuarioId: sessao.usuarioId,
          mensagem: log.mensagem,
          campo: log.campo,
          valorAntes: log.antes,
          valorDepois: log.depois,
        },
      });
    }

    if (dados.comentario) {
      await tx.ocorrenciaLog.create({
        data: {
          ocorrenciaId: dados.id,
          usuarioId: sessao.usuarioId,
          mensagem: dados.comentario,
        },
      });
    }

    if (fotos.length > 0) {
      await tx.ocorrenciaFoto.createMany({
        data: fotos.map((f) => ({ ...f, ocorrenciaId: dados.id })),
      });
      await tx.ocorrenciaLog.create({
        data: {
          ocorrenciaId: dados.id,
          usuarioId: sessao.usuarioId,
          mensagem: `${fotos.length} foto(s) anexada(s).`,
        },
      });
    }
  });

  revalidatePath("/ocorrencias");
  revalidatePath(`/ocorrencias/${dados.id}`);
  revalidatePath("/dashboard");
  return { ok: true, mensagem: "Ocorrência atualizada." };
}

/** Atalho usado nas listas para concluir uma ocorrência em um clique. */
export async function concluirOcorrenciaAction(id: number): Promise<ResultadoAcao> {
  const sessao = await exigirSessao();
  const atual = await carregarOcorrenciaComPermissao(sessao, id);
  if (!atual) return { ok: false, erro: "Ocorrência não encontrada ou sem permissão." };
  if (atual.status === "CONCLUIDO") return { ok: true, mensagem: "Já estava concluída." };

  await prisma.$transaction([
    prisma.ocorrencia.update({
      where: { id },
      data: { status: "CONCLUIDO", dataConclusao: new Date() },
    }),
    prisma.ocorrenciaLog.create({
      data: {
        ocorrenciaId: id,
        usuarioId: sessao.usuarioId,
        mensagem: `Concluída por ${sessao.nome}.`,
        campo: "status",
        valorAntes: atual.status,
        valorDepois: "CONCLUIDO",
      },
    }),
  ]);

  revalidatePath("/ocorrencias");
  revalidatePath(`/ocorrencias/${id}`);
  revalidatePath("/dashboard");
  return { ok: true, mensagem: "Ocorrência concluída." };
}
