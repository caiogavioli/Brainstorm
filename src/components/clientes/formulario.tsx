"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { salvarClienteAction } from "@/lib/acoes/clientes";
import type { ResultadoAcao } from "@/lib/acoes/boletim";
import { Aviso } from "@/components/aviso";

function BotaoSalvar({ rotulo }: { rotulo: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario w-full" disabled={pending}>
      {pending ? "Salvando…" : rotulo}
    </button>
  );
}

export type ClienteEditavel = {
  id: number;
  nome: string;
  contato: string | null;
  email: string;
  telefone: string | null;
  documento: string | null;
  endereco: string | null;
  observacoes: string | null;
  ativo: boolean;
};

/**
 * Mesmo formulário para cadastrar e editar — com `cliente`, envia o `id`
 * escondido e a Server Action faz update. Mesmo padrão do cadastro de
 * condomínios.
 */
export function FormularioCliente({
  cliente,
  aoSalvar,
}: {
  cliente?: ClienteEditavel;
  aoSalvar?: () => void;
} = {}) {
  const router = useRouter();
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    salvarClienteAction,
    null,
  );
  const [chaveReset, setChaveReset] = useState(0);
  const edicao = cliente != null;
  // Sufixo nos ids: a página tem vários destes formulários abertos ao mesmo
  // tempo, e `htmlFor` duplicado quebra o clique no rótulo.
  const s = edicao ? `-${cliente.id}` : "";

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
      {edicao ? <input type="hidden" name="id" value={cliente.id} /> : null}

      <div>
        <label className="rotulo" htmlFor={`nome${s}`}>
          Nome / Razão social
        </label>
        <input
          id={`nome${s}`}
          name="nome"
          className="campo"
          required
          defaultValue={cliente?.nome ?? ""}
        />
      </div>

      <div>
        <label className="rotulo" htmlFor={`contato${s}`}>
          Pessoa de contato
        </label>
        <input
          id={`contato${s}`}
          name="contato"
          className="campo"
          placeholder="Quem lê e assina"
          defaultValue={cliente?.contato ?? ""}
        />
      </div>

      <div>
        <label className="rotulo" htmlFor={`email${s}`}>
          E-mail <span style={{ color: "var(--status-critico-texto)" }}>*</span>
        </label>
        <input
          id={`email${s}`}
          name="email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          className="campo"
          required
          defaultValue={cliente?.email ?? ""}
        />
        <p className="text-xs mt-1" style={{ color: "var(--tinta-3)" }}>
          É para cá que o orçamento vai. Por isso é o único campo obrigatório
          além do nome.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
            defaultValue={cliente?.telefone ?? ""}
          />
        </div>
        <div>
          <label className="rotulo" htmlFor={`documento${s}`}>
            CNPJ / CPF
          </label>
          <input
            id={`documento${s}`}
            name="documento"
            className="campo"
            inputMode="numeric"
            defaultValue={cliente?.documento ?? ""}
          />
        </div>
      </div>

      <div>
        <label className="rotulo" htmlFor={`endereco${s}`}>
          Endereço
        </label>
        <input
          id={`endereco${s}`}
          name="endereco"
          className="campo"
          defaultValue={cliente?.endereco ?? ""}
        />
      </div>

      <div>
        <label className="rotulo" htmlFor={`observacoes${s}`}>
          Observações internas
        </label>
        <textarea
          id={`observacoes${s}`}
          name="observacoes"
          className="campo"
          rows={2}
          placeholder="Não aparece para o cliente"
          defaultValue={cliente?.observacoes ?? ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={cliente?.ativo ?? true}
          className="h-4 w-4"
        />
        Ativo — aparece na hora de montar um orçamento
      </label>

      <Aviso estado={estado} />

      <BotaoSalvar rotulo={edicao ? "Salvar alterações" : "Cadastrar cliente"} />
    </form>
  );
}
