import Link from "next/link";

import { configuracaoDisponivel } from "./acoes";
import { FormularioSetup } from "./formulario";
import { LogoCompleta } from "@/components/logo";

export const metadata = { title: "Configuração inicial — Gestão de Condomínios" };

// Sem isto, o Next pré-renderiza esta página durante o build: o HTML congelaria
// o estado do momento da compilação (quando SETUP_TOKEN ainda não existe e o
// banco sequer foi consultado) e a tela nunca sairia de "desativada". Precisa
// ser avaliada a cada requisição, porque depende de variável de ambiente de
// runtime e da contagem de administradores no banco.
export const dynamic = "force-dynamic";

export default async function PaginaConfiguracaoInicial() {
  const disponivel = await configuracaoDisponivel();

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            <LogoCompleta tamanho={72} />
          </div>
          <h1 className="text-xl font-bold">Configuração inicial</h1>
          <p className="text-sm mt-1" style={{ color: "var(--tinta-2)" }}>
            Criação do primeiro administrador do sistema
          </p>
        </div>

        <div className="card card-pad">
          {disponivel.ok ? (
            <FormularioSetup />
          ) : disponivel.motivo === "JA_CONFIGURADO" ? (
            <div className="text-center space-y-3">
              <p className="text-sm">
                Este sistema <strong>já foi configurado</strong> e possui um
                administrador ativo. Esta tela não pode mais ser usada.
              </p>
              <p className="text-xs" style={{ color: "var(--tinta-3)" }}>
                Esqueceu a senha? Outro administrador pode redefini-la em
                <strong> Usuários</strong>. Se você é o único, redefina pelo
                terminal com <code>npm run producao:init</code>.
              </p>
              <Link href="/login" className="botao botao-primario w-full">
                Ir para o login
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm">
                A configuração inicial está <strong>desativada</strong>: a
                variável de ambiente <code>SETUP_TOKEN</code> não está definida.
              </p>
              <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
                Defina <code>SETUP_TOKEN</code> nas variáveis de ambiente do seu
                projeto (na Vercel: <em>Settings → Environment Variables</em>),
                publique novamente e recarregue esta página.
              </p>
              <Link href="/login" className="botao botao-secundario w-full">
                Voltar ao login
              </Link>
            </div>
          )}
        </div>

        {disponivel.ok ? (
          <p
            className="mt-4 text-center text-xs leading-relaxed"
            style={{ color: "var(--tinta-3)" }}
          >
            Depois de criar o administrador, esta tela se fecha sozinha. Você
            pode então remover a variável <code>SETUP_TOKEN</code>.
          </p>
        ) : null}
      </div>
    </main>
  );
}
