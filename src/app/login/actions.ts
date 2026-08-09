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
  // Gestor local cai direto no boletim; admin, no dashboard.
  redirect(sessao?.papel === "ADMIN" ? "/dashboard" : "/boletim");
}

export async function sairAction(): Promise<void> {
  await encerrarSessao();
  redirect("/login");
}
