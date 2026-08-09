import { prisma } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { PAPEL_LABEL } from "@/lib/labels";
import { formatarData } from "@/lib/datas";
import {
  EditarUsuario,
  FormularioNovoUsuario,
} from "@/components/usuarios/formularios";

export const metadata = { title: "Usuários — Gestão de Condomínios" };

export default async function PaginaUsuarios() {
  await exigirAdmin();

  const [usuarios, condominios] = await Promise.all([
    prisma.usuario.findMany({
      orderBy: [{ papel: "asc" }, { nome: "asc" }],
      include: {
        acessos: { select: { condominioId: true } },
        _count: { select: { boletinsCriados: true } },
      },
    }),
    prisma.condominio.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
  ]);

  const nomePorId = new Map(condominios.map((c) => [c.id, c.nome]));

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Usuários</h1>
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          Crie o acesso dos gerentes prediais e defina quais condomínios cada
          um enxerga.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-2 order-2 lg:order-1">
          {usuarios.map((u) => (
            <div key={u.id} className="card card-pad">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="font-semibold">{u.nome}</div>
                  <div className="text-xs truncate" style={{ color: "var(--tinta-3)" }}>
                    {u.email}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={u.papel === "ADMIN" ? "badge badge-info" : "badge"}>
                    {PAPEL_LABEL[u.papel]}
                  </span>
                  <span className={u.ativo ? "badge badge-ok" : "badge badge-danger"}>
                    {u.ativo ? "Ativo" : "Bloqueado"}
                  </span>
                </div>
              </div>

              <div className="text-sm mb-2" style={{ color: "var(--tinta-2)" }}>
                {u.papel === "ADMIN" ? (
                  <span style={{ color: "var(--tinta-3)" }}>
                    Enxerga todos os condomínios.
                  </span>
                ) : u.acessos.length === 0 ? (
                  <span style={{ color: "var(--status-critico-texto)" }}>
                    ▲ Sem condomínio vinculado — não conseguirá lançar boletins.
                  </span>
                ) : (
                  u.acessos
                    .map((a) => nomePorId.get(a.condominioId) ?? `#${a.condominioId}`)
                    .join(" · ")
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="num" style={{ color: "var(--tinta-3)" }}>
                  {u._count.boletinsCriados} boletim(ns) lançado(s)
                </span>
                <span className="num" style={{ color: "var(--tinta-3)" }}>
                  desde {formatarData(u.criadoEm)}
                </span>
                <EditarUsuario
                  condominios={condominios}
                  usuario={{
                    id: u.id,
                    nome: u.nome,
                    email: u.email,
                    papel: u.papel,
                    ativo: u.ativo,
                    condominios: u.acessos.map((a) => a.condominioId),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <aside className="order-1 lg:order-2">
          <div className="card card-pad">
            <h2 className="font-semibold mb-3">Novo usuário</h2>
            <FormularioNovoUsuario condominios={condominios} />
          </div>
        </aside>
      </div>
    </div>
  );
}
