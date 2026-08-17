import { exigirSessao } from "@/lib/auth";
import { PAPEL_LABEL } from "@/lib/labels";
import { Navegacao, type ItemNav } from "@/components/navegacao";
import { sairAction } from "@/app/login/actions";

// Os três últimos são o módulo comercial (orçamentos). Ele fica só para ADMIN:
// o gerente predial preenche boletim e acompanha o prédio dele, e preço de
// proposta não é assunto dele.
const NAV_ADMIN: ItemNav[] = [
  { href: "/dashboard", rotulo: "Dashboard", icone: "▦" },
  { href: "/boletim", rotulo: "Boletins", icone: "☑" },
  { href: "/ocorrencias", rotulo: "Ocorrências", icone: "⚑" },
  { href: "/planos", rotulo: "Planos", icone: "◷" },
  { href: "/condominios", rotulo: "Condomínios", icone: "⌂" },
  { href: "/usuarios", rotulo: "Usuários", icone: "☺" },
  { href: "/orcamentos", rotulo: "Orçamentos", icone: "◈" },
  { href: "/clientes", rotulo: "Clientes", icone: "◑" },
  { href: "/servicos", rotulo: "Catálogo", icone: "≡" },
];

const NAV_GESTOR: ItemNav[] = [
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
