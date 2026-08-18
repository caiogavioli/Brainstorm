import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { exigirAdmin, podeAcessarCondominio } from "@/lib/auth";
import { formatarDataReferencia } from "@/lib/datas";
import { WizardBoletim, type ValoresIniciais } from "@/components/boletim/wizard";

export const metadata = { title: "Corrigir boletim — Gestão de Condomínios" };

/**
 * Correção de um boletim já enviado. Só ADMIN — quem preencheu corrige o próprio
 * lançamento reenviando o dia pelo wizard.
 *
 * Salvar reaproveita `corrigirBoletimAction`, que substitui o boletim do mesmo
 * condomínio/data, refaz as ocorrências que ele havia originado e preserva a
 * autoria original.
 */
export default async function PaginaEditarBoletim({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sessao = await exigirAdmin();
  const { id } = await params;

  const boletimId = Number(id);
  if (!Number.isInteger(boletimId) || boletimId <= 0) notFound();

  const [boletim, itens] = await Promise.all([
    prisma.boletim.findUnique({
      where: { id: boletimId },
      include: {
        condominio: { select: { id: true, nome: true } },
        itens: {
          select: { id: true, checklistItemId: true, situacao: true, observacao: true },
        },
        ocorrencias: {
          select: {
            boletimItemId: true,
            descricao: true,
            criticidade: true,
            planoAcao: true,
            previsaoFinalizacao: true,
          },
        },
        // As recorrências que ESTE boletim registrou em ocorrências antigas.
        // Sem elas, salvar a correção apagaria o registro de que o problema
        // continuava naquele dia — e, pior, abriria uma ocorrência nova no
        // lugar, partindo o histórico do mesmo problema em dois.
        recorrencias: {
          select: {
            ocorrenciaId: true,
            observacao: true,
            ocorrencia: {
              select: {
                checklistItemId: true,
                descricao: true,
                criticidade: true,
                planoAcao: true,
                previsaoFinalizacao: true,
              },
            },
          },
        },
      },
    }),
    prisma.checklistItem.findMany({
      where: { ativo: true },
      orderBy: [{ grupoOrdem: "asc" }, { ordem: "asc" }],
      select: { id: true, codigo: true, nome: true, grupo: true },
    }),
  ]);

  if (!boletim || !podeAcessarCondominio(sessao, boletim.condominioId)) notFound();

  const paraInput = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
  let sequencia = 0;

  const valoresIniciais: ValoresIniciais = {
    respostas: Object.fromEntries(
      boletim.itens.map((i) => {
        // Um item pode ter gerado VÁRIAS ocorrências, e ainda ter reencontrado
        // problemas antigos. A correção precisa começar exatamente do que está
        // gravado — as duas listas, na ordem.
        const proprias = boletim.ocorrencias
          .filter((x) => x.boletimItemId === i.id)
          .map((o) => {
            sequencia += 1;
            return {
              chave: `edicao-${sequencia}`,
              descricao: o.descricao,
              criticidade: o.criticidade,
              planoAcao: o.planoAcao ?? "",
              previsaoFinalizacao: paraInput(o.previsaoFinalizacao),
              origemPendencia: null,
            };
          });

        const reencontradas = boletim.recorrencias
          .filter((r) => r.ocorrencia.checklistItemId === i.checklistItemId)
          .map((r) => {
            sequencia += 1;
            return {
              chave: `edicao-${sequencia}`,
              descricao: r.observacao ?? r.ocorrencia.descricao,
              criticidade: r.ocorrencia.criticidade,
              planoAcao: r.ocorrencia.planoAcao ?? "",
              previsaoFinalizacao: paraInput(r.ocorrencia.previsaoFinalizacao),
              origemPendencia: r.ocorrenciaId,
            };
          });

        return [
          i.checklistItemId,
          { situacao: i.situacao, ocorrencias: [...proprias, ...reencontradas] },
        ];
      }),
    ),
    observacoes: boletim.observacoes ?? "",
    statusGeral: boletim.statusGeral,
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Corrigir boletim</h1>
          <p className="text-sm num" style={{ color: "var(--tinta-2)" }}>
            {boletim.condominio.nome} ·{" "}
            {formatarDataReferencia(boletim.dataReferencia)}
            {boletim.preenchidoPor ? ` · enviado por ${boletim.preenchidoPor}` : ""}
          </p>
        </div>
        <Link href={`/boletim/${boletim.id}`} className="botao botao-secundario">
          Cancelar
        </Link>
      </div>

      <WizardBoletim
        condominios={[{ id: boletim.condominio.id, nome: boletim.condominio.nome }]}
        itens={itens}
        dataInicial={boletim.dataReferencia}
        condominioInicial={boletim.condominio.id}
        boletimExistente={{}}
        modoEdicao
        valoresIniciais={valoresIniciais}
      />
    </div>
  );
}
