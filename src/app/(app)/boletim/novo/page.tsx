import Link from "next/link";

import { prisma } from "@/lib/db";
import { condominiosDaSessao, exigirSessao } from "@/lib/auth";
import { dataReferenciaDe } from "@/lib/datas";
import { WizardBoletim } from "@/components/boletim/wizard";

export const metadata = { title: "Novo boletim — Gestão de Condomínios" };

export default async function PaginaNovoBoletim({
  searchParams,
}: {
  searchParams: Promise<{ condominio?: string }>;
}) {
  const sessao = await exigirSessao();
  const params = await searchParams;

  const [condominios, itens] = await Promise.all([
    condominiosDaSessao(sessao),
    prisma.checklistItem.findMany({
      where: { ativo: true },
      orderBy: [{ grupo: "asc" }, { ordem: "asc" }],
      select: { id: true, codigo: true, nome: true, grupo: true },
    }),
  ]);

  if (condominios.length === 0) {
    return (
      <div className="card card-pad text-center">
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          Nenhum condomínio vinculado ao seu usuário. Peça ao administrador para
          liberar o acesso.
        </p>
      </div>
    );
  }

  // Últimos 30 dias já lançados — o wizard avisa antes de substituir.
  const desde = new Date();
  desde.setDate(desde.getDate() - 30);
  const lancados = await prisma.boletim.findMany({
    where: {
      condominioId: { in: condominios.map((c) => c.id) },
      dataRegistro: { gte: desde },
    },
    select: { condominioId: true, dataReferencia: true },
  });

  const boletimExistente: Record<number, string[]> = {};
  for (const b of lancados) {
    (boletimExistente[b.condominioId] ??= []).push(b.dataReferencia);
  }

  const preSelecionado = params.condominio ? Number(params.condominio) : null;
  const condominioInicial =
    preSelecionado && condominios.some((c) => c.id === preSelecionado)
      ? preSelecionado
      : null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Boletim Informativo Diário</h1>
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            Preencha por etapas — leva cerca de 2 minutos.
          </p>
        </div>
        <Link href="/boletim" className="botao botao-secundario">
          Cancelar
        </Link>
      </div>

      <WizardBoletim
        condominios={condominios.map((c) => ({ id: c.id, nome: c.nome }))}
        itens={itens}
        dataInicial={dataReferenciaDe()}
        condominioInicial={condominioInicial}
        boletimExistente={boletimExistente}
      />
    </div>
  );
}
