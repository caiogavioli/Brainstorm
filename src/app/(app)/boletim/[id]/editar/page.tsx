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
            criticidade: true,
            planoAcao: true,
            previsaoFinalizacao: true,
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

  const valoresIniciais: ValoresIniciais = {
    respostas: Object.fromEntries(
      boletim.itens.map((i) => {
        // A ocorrência que este item gerou traz o tratamento que foi dado a ele
        // — risco, plano e prazo — para a correção começar do que já existe.
        const o = boletim.ocorrencias.find((x) => x.boletimItemId === i.id);
        return [
          i.checklistItemId,
          {
            situacao: i.situacao,
            observacao: i.observacao ?? "",
            criticidade: o?.criticidade ?? ("" as const),
            planoAcao: o?.planoAcao ?? "",
            previsaoFinalizacao: o?.previsaoFinalizacao
              ? o.previsaoFinalizacao.toISOString().slice(0, 10)
              : "",
            // A correção reescreve um dia que já passou; carregar pendências de
            // hoje ali dataria a conclusão no dia errado. Nada vem de pendência.
            origemPendencia: null,
          },
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
