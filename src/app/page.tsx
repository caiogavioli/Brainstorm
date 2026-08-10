import Link from "next/link";

import { prisma } from "@/lib/db";
import { dataReferenciaDe } from "@/lib/datas";
import { WizardBoletim } from "@/components/boletim/wizard";

export const metadata = {
  title: "Boletim Diário de Operações",
  description: "Preenchimento do boletim diário de operações do condomínio.",
};

// Depende do catálogo e da lista de condomínios, que mudam sem novo deploy.
export const dynamic = "force-dynamic";

/**
 * Formulário público do boletim — a porta de entrada do gerente predial.
 *
 * Sem login de propósito: o gerente abre o link no celular e já cai nas
 * perguntas. Ele se identifica digitando o nome, e escolhe o condomínio numa
 * lista que o administrador mantém em /condominios.
 *
 * O painel (dashboard, ocorrências, planos, cadastros) continua exigindo login.
 */
export default async function PaginaBoletimPublico() {
  const [condominios, itens] = await Promise.all([
    prisma.condominio.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.checklistItem.findMany({
      where: { ativo: true },
      orderBy: [{ grupoOrdem: "asc" }, { ordem: "asc" }],
      select: { id: true, codigo: true, nome: true, grupo: true },
    }),
  ]);

  const hoje = dataReferenciaDe();

  // Boletins recentes, só para avisar antes do envio que o dia já foi lançado.
  const desde = new Date();
  desde.setDate(desde.getDate() - 30);
  const lancados = await prisma.boletim.findMany({
    where: { dataRegistro: { gte: desde } },
    select: { condominioId: true, dataReferencia: true },
  });
  const boletimExistente: Record<number, string[]> = {};
  for (const b of lancados) {
    (boletimExistente[b.condominioId] ??= []).push(b.dataReferencia);
  }

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-30"
        style={{
          background: "var(--superficie)",
          borderBottom: "1px solid var(--borda)",
        }}
      >
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex h-14 items-center gap-2">
            <span
              className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-white text-xs font-bold"
              style={{ background: "var(--serie-1)" }}
              aria-hidden
            >
              BD
            </span>
            <span className="font-semibold">Boletim Diário</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 pb-16">
        {condominios.length === 0 ? (
          <div className="card card-pad text-center">
            <h1 className="text-lg font-bold mb-2">Nenhum condomínio cadastrado</h1>
            <p className="text-sm mb-4" style={{ color: "var(--tinta-2)" }}>
              O administrador precisa cadastrar os condomínios antes que o
              boletim possa ser preenchido.
            </p>
            <Link href="/login" className="botao botao-secundario">
              Área do administrador
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h1 className="text-xl font-bold">Boletim Diário de Operações</h1>
              <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
                Preencha ao final da ronda — leva cerca de 2 minutos. Tudo já vem
                marcado como <strong>Conforme</strong>: toque apenas onde houver
                falha.
              </p>
            </div>

            <WizardBoletim
              condominios={condominios}
              itens={itens}
              dataInicial={hoje}
              condominioInicial={null}
              boletimExistente={boletimExistente}
              modoPublico
            />
          </>
        )}

        <p className="mt-8 text-center text-xs" style={{ color: "var(--tinta-3)" }}>
          <Link href="/login" className="underline">
            Área do administrador
          </Link>
        </p>
      </main>
    </div>
  );
}
