"use server";

import { redirect } from "next/navigation";

import { autenticar, encerrarSessao, sessaoAtual } from "@/lib/auth";

export type EstadoLogin = { erro?: string };

export async function entrarAction(
  _anterior: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "");
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { erro: "Informe e-mail e senha." };
  }

  const resultado = await autenticar(email, senha);
  if (!resultado.ok) {
    return { erro: resultado.erro };
  }

  const sessao = await sessaoAtual();
  // Admin abre no dashboard; quem preenche, na tela que mostra as ocorrências
  // em aberto e o botão do boletim de hoje.
  redirect(sessao?.papel === "ADMIN" ? "/dashboard" : "/inicio");
}

export async function sairAction(): Promise<void> {
  await encerrarSessao();
  redirect("/login");
}
