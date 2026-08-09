"use client";

import { useState } from "react";

import { FormularioPlano, type PlanoExistente } from "@/components/planos/formulario";

/** Botão + área expansível para criar um novo plano sem sair da lista. */
export function NovoPlano({
  condominios,
}: {
  condominios: { id: number; nome: string }[];
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="sem-impressao">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="botao botao-primario"
        aria-expanded={aberto}
      >
        {aberto ? "Fechar" : "+ Novo plano"}
      </button>

      {aberto ? (
        <div className="card card-pad mt-3">
          <h2 className="font-semibold mb-3">Novo plano de ação</h2>
          <FormularioPlano
            condominios={condominios}
            aoConcluir={() => setAberto(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

/** Linha expansível de edição na lista de planos. */
export function EditarPlano({
  condominios,
  plano,
}: {
  condominios: { id: number; nome: string }[];
  plano: PlanoExistente;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="text-xs font-semibold underline sem-impressao"
        style={{ color: "var(--serie-1)" }}
        aria-expanded={aberto}
      >
        {aberto ? "Fechar" : "Editar"}
      </button>

      {aberto ? (
        <div
          className="mt-3 rounded-xl p-3 sem-impressao"
          style={{ background: "var(--superficie-2)" }}
        >
          <FormularioPlano
            condominios={condominios}
            plano={plano}
            aoConcluir={() => setAberto(false)}
          />
        </div>
      ) : null}
    </>
  );
}
