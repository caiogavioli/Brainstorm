import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { formatarData } from "@/lib/datas";
import { FormularioCliente } from "@/components/clientes/formulario";
import { AcoesCliente } from "@/components/clientes/painel";

export const metadata = { title: "Clientes — Gestão de Condomínios" };

export default async function PaginaClientes() {
  await exigirAdmin();

  const clientes = await prisma.cliente.findMany({
    // Ativos primeiro: é neles que se mexe. Os inativos ficam no fim, visíveis
    // para reativar, sem competir por atenção com quem está em negociação.
    orderBy: [{ ativo: "desc" }, { nome: "asc" }],
  });

  const ativos = clientes.filter((c) => c.ativo).length;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Clientes</h1>
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          Quem recebe os orçamentos. Independente do cadastro de condomínios — o
          cliente pode ser um prédio que você administra ou alguém que ainda não é.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-2 order-2 lg:order-1">
          {clientes.length === 0 ? (
            <div className="card card-pad">
              <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
                Nenhum cliente cadastrado ainda. Use o formulário ao lado para
                cadastrar o primeiro.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs num" style={{ color: "var(--tinta-3)" }}>
                {clientes.length} cadastrado(s) · {ativos} ativo(s)
              </p>

              {clientes.map((c) => (
                <div key={c.id} className="card card-pad">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="font-semibold">{c.nome}</div>
                      <div className="text-xs" style={{ color: "var(--tinta-3)" }}>
                        {c.contato ? `A/C ${c.contato}` : "Sem pessoa de contato"}
                      </div>
                    </div>
                    <span className={c.ativo ? "badge badge-ok" : "badge badge-neutral"}>
                      {c.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <dl
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-1"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    <div className="min-w-0">
                      <dt className="titulo-secao">E-mail</dt>
                      <dd className="truncate">{c.email}</dd>
                    </div>
                    <div>
                      <dt className="titulo-secao">Telefone</dt>
                      <dd className="num">{c.telefone ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="titulo-secao">CNPJ / CPF</dt>
                      <dd className="num truncate">{c.documento ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="titulo-secao">Cadastro</dt>
                      <dd className="num">{formatarData(c.criadoEm)}</dd>
                    </div>
                  </dl>

                  {c.endereco ? (
                    <p className="text-xs" style={{ color: "var(--tinta-3)" }}>
                      {c.endereco}
                    </p>
                  ) : null}

                  {c.observacoes ? (
                    <p
                      className="text-xs mt-2 rounded-lg px-2 py-1.5"
                      style={{
                        color: "var(--tinta-2)",
                        background: "var(--superficie-2)",
                      }}
                    >
                      {c.observacoes}
                    </p>
                  ) : null}

                  <AcoesCliente
                    cliente={{
                      id: c.id,
                      nome: c.nome,
                      contato: c.contato,
                      email: c.email,
                      telefone: c.telefone,
                      documento: c.documento,
                      endereco: c.endereco,
                      observacoes: c.observacoes,
                      ativo: c.ativo,
                    }}
                  />
                </div>
              ))}
            </>
          )}
        </div>

        <aside className="order-1 lg:order-2">
          <div className="card card-pad">
            <h2 className="font-semibold mb-3">Cadastrar cliente</h2>
            <FormularioCliente />
          </div>
        </aside>
      </div>
    </div>
  );
}
