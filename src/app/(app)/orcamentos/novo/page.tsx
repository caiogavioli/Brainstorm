import Link from "next/link";

import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { EditorOrcamento } from "@/components/orcamentos/editor";

export const metadata = { title: "Novo orçamento — Gestão de Condomínios" };

export default async function PaginaNovoOrcamento() {
  await exigirAdmin();

  const [clientes, modelos, catalogo] = await Promise.all([
    prisma.cliente.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, contato: true },
    }),
    prisma.modeloOrcamento.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.servicoCatalogo.findMany({
      where: { ativo: true },
      orderBy: [{ categoria: "asc" }, { ordem: "asc" }, { nome: "asc" }],
      select: {
        id: true,
        nome: true,
        descricao: true,
        unidade: true,
        valorPadraoCentavos: true,
        categoria: true,
      },
    }),
  ]);

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/orcamentos"
          className="text-xs font-semibold underline"
          style={{ color: "var(--serie-1)" }}
        >
          ← Orçamentos
        </Link>
        <h1 className="text-xl font-bold mt-1">Novo orçamento</h1>
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          Nasce como rascunho. O número e o link do cliente são gerados ao salvar.
        </p>
      </div>

      {clientes.length === 0 ? (
        <div className="card card-pad">
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            Você ainda não tem clientes ativos.{" "}
            <Link href="/clientes" className="underline" style={{ color: "var(--serie-1)" }}>
              Cadastre um cliente
            </Link>{" "}
            antes de montar o orçamento.
          </p>
        </div>
      ) : (
        <EditorOrcamento clientes={clientes} modelos={modelos} catalogo={catalogo} />
      )}
    </div>
  );
}
