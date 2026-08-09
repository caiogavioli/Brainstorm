import { prisma } from "@/lib/db";
import { condominiosDaSessao, exigirSessao } from "@/lib/auth";
import { FormularioNovaOcorrencia } from "@/components/ocorrencias/formulario-nova";

export const metadata = { title: "Nova ocorrência — Gestão de Condomínios" };

export default async function PaginaNovaOcorrencia() {
  const sessao = await exigirSessao();

  const [condominios, itens] = await Promise.all([
    condominiosDaSessao(sessao),
    prisma.checklistItem.findMany({
      where: { ativo: true },
      orderBy: [{ grupo: "asc" }, { ordem: "asc" }],
      select: { id: true, nome: true, grupo: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold mb-1">Nova ocorrência</h1>
      <p className="text-sm mb-4" style={{ color: "var(--tinta-2)" }}>
        Use para registros avulsos. Não conformidades do boletim diário já geram
        ocorrência automaticamente.
      </p>
      <FormularioNovaOcorrencia
        condominios={condominios.map((c) => ({ id: c.id, nome: c.nome }))}
        itens={itens}
      />
    </div>
  );
}
