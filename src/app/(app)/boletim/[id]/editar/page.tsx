import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { exigirAdmin, podeAcessarCondominio } from "@/lib/auth";
import { formatarDataReferencia } from "@/lib/datas";
import { WizardBoletim, type ValoresIniciais } from "@/components/boletim/wizard";

export const metadata = { title: "Corrigir boletim — Gestão de Condomínios" };

/**
 * Correção de um boletim já enviado. Só ADMIN: o formulário público não
 * sobrescreve nada, então esta é a única porta para arrumar o registro de um dia.
 *
 * Salvar reaproveita `salvarBoletimAction`, que substitui o boletim do mesmo
 * condomínio/data e refaz as ocorrências que ele havia originado.
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
          select: { checklistItemId: true, situacao: true, observacao: true },
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
      boletim.itens.map((i) => [
        i.checklistItemId,
        { situacao: i.situacao, observacao: i.observacao ?? "" },
      ]),
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
