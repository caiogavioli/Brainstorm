import { redirect } from "next/navigation";

import { sessaoAtual } from "@/lib/auth";

export default async function Raiz() {
  const sessao = await sessaoAtual();
  if (!sessao) redirect("/login");
  redirect(sessao.papel === "ADMIN" ? "/dashboard" : "/boletim");
}
