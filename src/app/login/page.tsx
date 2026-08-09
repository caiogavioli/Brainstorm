import { redirect } from "next/navigation";

import { sessaoAtual } from "@/lib/auth";
import { FormularioLogin } from "./formulario";

export const metadata = { title: "Entrar — Gestão de Condomínios" };

export default async function PaginaLogin() {
  const sessao = await sessaoAtual();
  if (sessao) redirect(sessao.papel === "ADMIN" ? "/dashboard" : "/boletim");

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg font-bold"
            style={{ background: "var(--serie-1)" }}
            aria-hidden
          >
            BD
          </div>
          <h1 className="text-xl font-bold">Boletim Diário de Operações</h1>
          <p className="text-sm mt-1" style={{ color: "var(--tinta-2)" }}>
            Gestão operacional de condomínios
          </p>
        </div>

        <div className="card card-pad">
          <FormularioLogin />
        </div>

        <p
          className="mt-4 text-center text-xs leading-relaxed"
          style={{ color: "var(--tinta-3)" }}
        >
          Ambiente de demonstração:
          <br />
          <strong>sindico@condominios.com.br</strong> (administrador)
          <br />
          <strong>gestor.atrium@condominios.com.br</strong> (gestor local)
          <br />
          senha: <strong>condominio123</strong>
        </p>
      </div>
    </main>
  );
}
