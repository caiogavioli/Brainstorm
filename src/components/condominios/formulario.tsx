"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { salvarCondominioAction } from "@/lib/acoes/planos";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

function BotaoSalvar({ rotulo }: { rotulo: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario w-full" disabled={pending}>
      {pending ? "Salvando…" : rotulo}
    </button>
  );
}

export type CondominioEditavel = {
  id: number;
  nome: string;
  endereco: string | null;
  gerenteResponsavel: string | null;
  telefone: string | null;
  email: string | null;
  ativo: boolean;
};

/**
 * Mesmo formulário para cadastrar e para editar. Com `condominio`, envia o `id`
 * escondido e a Server Action faz update em vez de create.
 */
export function FormularioCondominio({
  condominio,
  aoSalvar,
}: {
  condominio?: CondominioEditavel;
  aoSalvar?: () => void;
} = {}) {
  const router = useRouter();
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    salvarCondominioAction,
    null,
  );
  const [chaveReset, setChaveReset] = useState(0);
  const edicao = condominio != null;
  // Sufixo nos ids: a página pode ter vários destes formulários abertos ao mesmo
  // tempo, e `htmlFor` duplicado quebra o clique no rótulo.
  const s = edicao ? `-${condominio.id}` : "";

  useEffect(() => {
    if (estado?.ok) {
      router.refresh();
      if (edicao) aoSalvar?.();
      else setChaveReset((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, router]);

  return (
    <form action={acao} key={chaveReset} className="space-y-3">
      {edicao ? <input type="hidden" name="id" value={condominio.id} /> : null}
      <div>
        <label className="rotulo" htmlFor={`nome${s}`}>
          Nome
        </label>
        <input
          id={`nome${s}`}
          name="nome"
          className="campo"
          required
          defaultValue={condominio?.nome ?? ""}
        />
      </div>
      <div>
        <label className="rotulo" htmlFor={`endereco${s}`}>
          Endereço
        </label>
        <input
          id={`endereco${s}`}
          name="endereco"
          className="campo"
          defaultValue={condominio?.endereco ?? ""}
        />
      </div>
      <div>
        <label className="rotulo" htmlFor={`gerenteResponsavel${s}`}>
          Gerente / Responsável
        </label>
        <input
          id={`gerenteResponsavel${s}`}
          name="gerenteResponsavel"
          className="campo"
          defaultValue={condominio?.gerenteResponsavel ?? ""}
        />
      </div>
      <div>
        <label className="rotulo" htmlFor={`telefone${s}`}>
          Telefone
        </label>
        <input
          id={`telefone${s}`}
          name="telefone"
          type="tel"
          inputMode="tel"
          className="campo"
          defaultValue={condominio?.telefone ?? ""}
        />
      </div>
      <div>
        <label className="rotulo" htmlFor={`email${s}`}>
          E-mail
        </label>
        <input
          id={`email${s}`}
          name="email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          className="campo"
          defaultValue={condominio?.email ?? ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={condominio?.ativo ?? true}
          className="h-4 w-4"
        />
        Ativo — aparece na lista do formulário público
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

      <BotaoSalvar rotulo={edicao ? "Salvar alterações" : "Cadastrar"} />
    </form>
  );
}
