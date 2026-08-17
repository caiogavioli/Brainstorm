"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { alternarClienteAction, excluirClienteAction } from "@/lib/acoes/clientes";
import type { ResultadoAcao } from "@/lib/acoes/boletim";
import { Aviso } from "@/components/aviso";
import { FormularioCliente, type ClienteEditavel } from "./formulario";

/**
 * Ações de um cliente na listagem: editar, desativar e excluir.
 *
 * As três ficam lado a lado de propósito — desativar é o caminho reversível e
 * precisa estar visível junto da exclusão, para ninguém apagar um cadastro
 * quando o que queria era só tirá-lo da lista de seleção.
 */
export function AcoesCliente({ cliente }: { cliente: ClienteEditavel }) {
  const router = useRouter();
  const [painel, setPainel] = useState<"editar" | "excluir" | null>(null);
  const [processando, iniciar] = useTransition();
  const [estadoAlternar, setEstadoAlternar] = useState<ResultadoAcao | null>(null);

  function alternar() {
    iniciar(async () => {
      const r = await alternarClienteAction(cliente.id, !cliente.ativo);
      setEstadoAlternar(r);
      if (r.ok) router.refresh();
    });
  }

  return (
    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--borda)" }}>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setPainel((p) => (p === "editar" ? null : "editar"))}
          className="text-xs font-semibold underline"
          style={{ color: "var(--serie-1)" }}
          aria-expanded={painel === "editar"}
        >
          {painel === "editar" ? "Fechar edição" : "Editar"}
        </button>

        <button
          type="button"
          disabled={processando}
          onClick={alternar}
          className="text-xs font-semibold underline"
          style={{
            color: cliente.ativo ? "var(--tinta-2)" : "var(--status-bom-texto)",
          }}
        >
          {processando ? "…" : cliente.ativo ? "Desativar" : "Reativar"}
        </button>

        <button
          type="button"
          onClick={() => setPainel((p) => (p === "excluir" ? null : "excluir"))}
          className="text-xs font-semibold underline"
          style={{ color: "var(--status-critico-texto)" }}
          aria-expanded={painel === "excluir"}
        >
          {painel === "excluir" ? "Cancelar exclusão" : "Excluir"}
        </button>
      </div>

      <Aviso estado={estadoAlternar} className="mt-3" />

      {painel === "editar" ? (
        <div
          className="mt-3 rounded-xl p-3"
          style={{ background: "var(--superficie-2)" }}
        >
          <FormularioCliente cliente={cliente} aoSalvar={() => setPainel(null)} />
        </div>
      ) : null}

      {painel === "excluir" ? (
        <ConfirmarExclusao
          id={cliente.id}
          nome={cliente.nome}
          ativo={cliente.ativo}
        />
      ) : null}
    </div>
  );
}

/** Exclusão definitiva, travada pelo nome digitado. */
function ConfirmarExclusao({
  id,
  nome,
  ativo,
}: {
  id: number;
  nome: string;
  ativo: boolean;
}) {
  const router = useRouter();
  const [confirmacao, setConfirmacao] = useState("");
  const [estado, setEstado] = useState<ResultadoAcao | null>(null);
  const [processando, iniciar] = useTransition();

  return (
    <div
      className="mt-3 rounded-xl p-3"
      style={{
        background: "color-mix(in srgb, var(--status-critico) 6%, var(--superficie))",
        border: "1px solid color-mix(in srgb, var(--status-critico) 35%, transparent)",
      }}
    >
      <p className="text-sm font-semibold mb-2">
        Excluir “{nome}” apaga o cadastro para sempre.
      </p>

      {ativo ? (
        <p className="text-xs mb-3" style={{ color: "var(--tinta-2)" }}>
          Se a intenção é só parar de orçar para ele, use <strong>Desativar</strong>:
          o cliente some da lista de seleção e o cadastro continua aqui.
        </p>
      ) : null}

      <label className="rotulo" htmlFor={`confirma-cliente-${id}`}>
        Digite <strong>{nome}</strong> para confirmar
      </label>
      <input
        id={`confirma-cliente-${id}`}
        className="campo"
        value={confirmacao}
        onChange={(e) => setConfirmacao(e.target.value)}
        placeholder={nome}
        autoComplete="off"
      />

      <Aviso estado={estado} className="mt-3" />

      <button
        type="button"
        disabled={processando || confirmacao.trim() === ""}
        onClick={() =>
          iniciar(async () => {
            const r = await excluirClienteAction(id, confirmacao);
            setEstado(r);
            if (r.ok) router.refresh();
          })
        }
        className="botao botao-perigo w-full mt-3"
      >
        {processando ? "Excluindo…" : "Excluir definitivamente"}
      </button>
    </div>
  );
}
