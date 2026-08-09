"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { salvarCondominioAction } from "@/lib/acoes/planos";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario w-full" disabled={pending}>
      {pending ? "Salvando…" : "Cadastrar"}
    </button>
  );
}

export function FormularioCondominio() {
  const router = useRouter();
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    salvarCondominioAction,
    null,
  );
  const [chaveReset, setChaveReset] = useState(0);

  useEffect(() => {
    if (estado?.ok) {
      router.refresh();
      setChaveReset((k) => k + 1);
    }
  }, [estado, router]);

  return (
    <form action={acao} key={chaveReset} className="space-y-3">
      <div>
        <label className="rotulo" htmlFor="nome">
          Nome
        </label>
        <input id="nome" name="nome" className="campo" required />
      </div>
      <div>
        <label className="rotulo" htmlFor="endereco">
          Endereço
        </label>
        <input id="endereco" name="endereco" className="campo" />
      </div>
      <div>
        <label className="rotulo" htmlFor="gerenteResponsavel">
          Gerente / Responsável
        </label>
        <input id="gerenteResponsavel" name="gerenteResponsavel" className="campo" />
      </div>
      <div>
        <label className="rotulo" htmlFor="telefone">
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          inputMode="tel"
          className="campo"
        />
      </div>
      <div>
        <label className="rotulo" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          className="campo"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="ativo" defaultChecked className="h-4 w-4" />
        Ativo
      </label>

      {estado ? (
        <p
          role="status"
          className="text-sm rounded-lg px-3 py-2"
          style={
            estado.ok
              ? {
                  color: "var(--status-bom-texto)",
                  background: "color-mix(in srgb, var(--status-bom) 10%, var(--superficie))",
                  border: "1px solid color-mix(in srgb, var(--status-bom) 30%, transparent)",
                }
              : {
                  color: "var(--status-critico-texto)",
                  background:
                    "color-mix(in srgb, var(--status-critico) 10%, var(--superficie))",
                  border:
                    "1px solid color-mix(in srgb, var(--status-critico) 30%, transparent)",
                }
          }
        >
          {estado.ok ? estado.mensagem : estado.erro}
        </p>
      ) : null}

      <BotaoSalvar />
    </form>
  );
}
