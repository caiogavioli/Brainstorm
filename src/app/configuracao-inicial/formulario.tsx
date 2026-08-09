"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { concluirConfiguracaoAction, type EstadoSetup } from "./acoes";

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario w-full" disabled={pending}>
      {pending ? "Criando…" : "Criar administrador"}
    </button>
  );
}

export function FormularioSetup() {
  const [estado, acao] = useActionState<EstadoSetup, FormData>(
    concluirConfiguracaoAction,
    {},
  );

  return (
    <form action={acao} className="space-y-4">
      <div>
        <label className="rotulo" htmlFor="token">
          Token de configuração
        </label>
        <input
          id="token"
          name="token"
          type="password"
          className="campo"
          required
          autoComplete="off"
          placeholder="o valor de SETUP_TOKEN"
        />
        <p className="mt-1 text-xs" style={{ color: "var(--tinta-3)" }}>
          É o mesmo valor que você definiu na variável de ambiente
          <code> SETUP_TOKEN</code>.
        </p>
      </div>

      <div>
        <label className="rotulo" htmlFor="nome">
          Seu nome
        </label>
        <input id="nome" name="nome" className="campo" required />
      </div>

      <div>
        <label className="rotulo" htmlFor="email">
          Seu e-mail (será o login)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          autoComplete="username"
          className="campo"
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
          minLength={10}
          autoComplete="new-password"
          required
          placeholder="mínimo 10 caracteres"
        />
      </div>

      <div>
        <label className="rotulo" htmlFor="confirmacao">
          Confirme a senha
        </label>
        <input
          id="confirmacao"
          name="confirmacao"
          type="password"
          className="campo"
          minLength={10}
          autoComplete="new-password"
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

      <Botao />
    </form>
  );
}
