import { redirect } from "next/navigation";

import { sessaoAtual } from "@/lib/auth";
import { FormularioLogin } from "./formulario";
import { LogoCompleta } from "@/components/logo";

export const metadata = { title: "Entrar — Gestão de Condomínios" };

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ configurado?: string }>;
}) {
  const { configurado } = await searchParams;
  const sessao = await sessaoAtual();
  if (sessao) redirect(sessao.papel === "ADMIN" ? "/dashboard" : "/boletim");

  const mostrarCredenciais =
    process.env.NODE_ENV !== "production" ||
    process.env.MOSTRAR_CREDENCIAIS_DEMO === "true";

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            <LogoCompleta tamanho={72} />
          </div>
          <h1 className="text-xl font-bold">Boletim Informativo Diário</h1>
          <p className="text-sm mt-1" style={{ color: "var(--tinta-2)" }}>
            Gestão operacional de condomínios
          </p>
        </div>

        {configurado ? (
          <div
            className="mb-4 rounded-xl px-4 py-3 text-sm"
            role="status"
            style={{
              color: "var(--status-bom-texto)",
              background: "color-mix(in srgb, var(--status-bom) 10%, var(--superficie))",
              border: "1px solid color-mix(in srgb, var(--status-bom) 32%, transparent)",
            }}
          >
            <strong>Administrador criado.</strong> Entre com o e-mail e a senha
            que você acabou de definir.
          </div>
        ) : null}

        <div className="card card-pad">
          <FormularioLogin />
        </div>

        {/* As credenciais de demonstração só aparecem fora de produção — em um
            ambiente publicado, exibi-las seria entregar o acesso a qualquer
            visitante. Para mostrá-las em uma demo publicada, defina
            MOSTRAR_CREDENCIAIS_DEMO=true. */}
        {mostrarCredenciais ? (
          <p
            className="mt-4 text-center text-xs leading-relaxed"
            style={{ color: "var(--tinta-3)" }}
          >
            Ambiente de demonstração:
            <br />
            <strong>sindico@condominios.com.br</strong> (administrador)
            <br />
            <strong>gestor.atrium@condominios.com.br</strong> (gerente predial)
            <br />
            senha: <strong>condominio123</strong>
          </p>
        ) : null}
      </div>
    </main>
  );
}
