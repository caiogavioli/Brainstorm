import { redirect } from "next/navigation";

import { sessaoAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Raiz do sistema.
 *
 * Aqui morava o formulário público do boletim, aberto sem login. Ele saiu
 * porque quem preenche passou a precisar acompanhar as próprias ocorrências, e
 * "as suas ocorrências" não existe sem saber quem é quem: no formulário aberto
 * a identificação era um nome digitado, que não liga o registro a ninguém.
 *
 * Quem já entrou vai para a sua tela inicial; quem não entrou, para o login.
 */
export default async function PaginaRaiz() {
  const sessao = await sessaoAtual();
  if (!sessao) redirect("/login");
  redirect(sessao.papel === "ADMIN" ? "/dashboard" : "/inicio");
}
