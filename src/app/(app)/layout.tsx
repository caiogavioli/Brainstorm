import { exigirSessao } from "@/lib/auth";
import { PAPEL_LABEL } from "@/lib/labels";
import { Navegacao, type ItemNav } from "@/components/navegacao";
import { sairAction } from "@/app/login/actions";

// O admin não leva "Início" na barra: a home dele é o dashboard, e a barra
// inferior do celular com sete abas fica com alvos de 50px. A tela continua
// acessível por /inicio para quem quiser ver o que o preenchedor vê.
const NAV_ADMIN: ItemNav[] = [
  { href: "/dashboard", rotulo: "Dashboard", icone: "▦" },
  { href: "/boletim", rotulo: "Boletins", icone: "☑" },
  { href: "/ocorrencias", rotulo: "Ocorrências", icone: "⚑" },
  { href: "/planos", rotulo: "Planos", icone: "◷" },
  { href: "/condominios", rotulo: "Condomínios", icone: "⌂" },
  { href: "/usuarios", rotulo: "Usuários", icone: "☺" },
];

const NAV_GESTOR: ItemNav[] = [
  { href: "/inicio", rotulo: "Início", icone: "⌂" },
  { href: "/boletim", rotulo: "Boletins", icone: "☑" },
  { href: "/ocorrencias", rotulo: "Ocorrências", icone: "⚑" },
  { href: "/planos", rotulo: "Planos", icone: "◷" },
];

export default async function LayoutApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await exigirSessao();
  const itens = sessao.papel === "ADMIN" ? NAV_ADMIN : NAV_GESTOR;

  return (
    <div className="min-h-screen">
      <Navegacao
        itens={itens}
        usuario={sessao.nome}
        papel={PAPEL_LABEL[sessao.papel]}
        aoSair={sairAction}
      />
      {/* pb extra reserva espaço para a barra inferior do celular. */}
      <main className="mx-auto max-w-7xl px-4 py-5 pb-24 md:pb-8">{children}</main>
    </div>
  );
}
