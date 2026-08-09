"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { entrarAction, type EstadoLogin } from "./actions";

function BotaoEntrar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario w-full" disabled={pending}>
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export function FormularioLogin() {
  const [estado, acao] = useActionState<EstadoLogin, FormData>(entrarAction, {});

  return (
    <form action={acao} className="space-y-4">
      <div>
        <label className="rotulo" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="campo"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          placeholder="voce@condominios.com.br"
          required
        />
      </div>

      <div>
        <label className="rotulo" htmlFor="senha">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          className="campo"
          autoComplete="current-password"
          required
        />
      </div>

      {estado.erro ? (
        <p
          role="alert"
          className="text-sm rounded-lg px-3 py-2"
          style={{
            color: "var(--status-critico-texto)",
            background: "color-mix(in srgb, var(--status-critico) 10%, var(--superficie))",
            border: "1px solid color-mix(in srgb, var(--status-critico) 30%, transparent)",
          }}
        >
          {estado.erro}
        </p>
      ) : null}

      <BotaoEntrar />
    </form>
  );
}
