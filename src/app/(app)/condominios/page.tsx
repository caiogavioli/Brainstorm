import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { formatarData } from "@/lib/datas";
import { FormularioCondominio } from "@/components/condominios/formulario";

export const metadata = { title: "Condomínios — Gestão de Condomínios" };

export default async function PaginaCondominios() {
  await exigirAdmin();

  const condominios = await prisma.condominio.findMany({
    orderBy: { nome: "asc" },
    include: {
      _count: { select: { boletins: true, ocorrencias: true, planos: true } },
    },
  });

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Condomínios</h1>
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          Cadastro base. Cada novo condomínio já entra no dashboard e no boletim
          sem qualquer configuração adicional.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-2 order-2 lg:order-1">
          {condominios.map((c) => (
            <div key={c.id} className="card card-pad">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="font-semibold">{c.nome}</div>
                  <div className="text-xs" style={{ color: "var(--tinta-3)" }}>
                    {c.endereco ?? "Endereço não informado"}
                  </div>
                </div>
                <span className={c.ativo ? "badge badge-ok" : "badge badge-neutral"}>
                  {c.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>

              <dl
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3"
                style={{ color: "var(--tinta-2)" }}
              >
                <div>
                  <dt className="titulo-secao">Responsável</dt>
                  <dd>{c.gerenteResponsavel ?? "—"}</dd>
                </div>
                <div>
                  <dt className="titulo-secao">Telefone</dt>
                  <dd className="num">{c.telefone ?? "—"}</dd>
                </div>
                <div>
                  <dt className="titulo-secao">E-mail</dt>
                  <dd className="truncate">{c.email ?? "—"}</dd>
                </div>
                <div>
                  <dt className="titulo-secao">Cadastro</dt>
                  <dd className="num">{formatarData(c.criadoEm)}</dd>
                </div>
              </dl>

              <div className="flex gap-4 text-xs num" style={{ color: "var(--tinta-3)" }}>
                <span>{c._count.boletins} boletins</span>
                <span>{c._count.ocorrencias} ocorrências</span>
                <span>{c._count.planos} planos</span>
              </div>
            </div>
          ))}
        </div>

        <aside className="order-1 lg:order-2">
          <div className="card card-pad">
            <h2 className="font-semibold mb-3">Cadastrar condomínio</h2>
            <FormularioCondominio />
          </div>
        </aside>
      </div>
    </div>
  );
}
