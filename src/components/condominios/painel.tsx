"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  alternarCondominioAction,
  excluirCondominioAction,
  resumoExclusaoCondominioAction,
} from "@/lib/acoes/planos";
import type { ResultadoAcao } from "@/lib/acoes/boletim";
import { FormularioCondominio, type CondominioEditavel } from "./formulario";

function Aviso({ estado }: { estado: ResultadoAcao | null }) {
  if (!estado) return null;
  return (
    <p
      role="status"
      className="text-sm rounded-lg px-3 py-2 mt-3"
      style={
        estado.ok
          ? {
              color: "var(--status-bom-texto)",
              background: "color-mix(in srgb, var(--status-bom) 10%, var(--superficie))",
              border: "1px solid color-mix(in srgb, var(--status-bom) 30%, transparent)",
            }
          : {
              color: "var(--status-critico-texto)",
              background: "color-mix(in srgb, var(--status-critico) 10%, var(--superficie))",
              border: "1px solid color-mix(in srgb, var(--status-critico) 30%, transparent)",
            }
      }
    >
      {estado.ok ? estado.mensagem : estado.erro}
    </p>
  );
}

/**
 * Barra de ações de um condomínio na listagem: editar, desativar e excluir.
 *
 * As três ficam juntas de propósito — desativar é o caminho reversível e deve
 * estar visível ao lado da exclusão, para que ninguém apague um histórico
 * inteiro quando o que queria era só tirar o condomínio do formulário.
 */
export function AcoesCondominio({ condominio }: { condominio: CondominioEditavel }) {
  const router = useRouter();
  const [painel, setPainel] = useState<"editar" | "excluir" | null>(null);
  const [processando, iniciar] = useTransition();
  const [estadoAlternar, setEstadoAlternar] = useState<ResultadoAcao | null>(null);

  function alternar() {
    iniciar(async () => {
      const r = await alternarCondominioAction(condominio.id, !condominio.ativo);
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
            color: condominio.ativo ? "var(--tinta-2)" : "var(--status-bom-texto)",
          }}
        >
          {processando ? "…" : condominio.ativo ? "Desativar" : "Reativar"}
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

      <Aviso estado={estadoAlternar} />

      {painel === "editar" ? (
        <div
          className="mt-3 rounded-xl p-3"
          style={{ background: "var(--superficie-2)" }}
        >
          <FormularioCondominio
            condominio={condominio}
            aoSalvar={() => setPainel(null)}
          />
        </div>
      ) : null}

      {painel === "excluir" ? (
        <ConfirmarExclusao
          id={condominio.id}
          nome={condominio.nome}
          ativo={condominio.ativo}
        />
      ) : null}
    </div>
  );
}

/** Exclusão definitiva, atrás de duas barreiras: o resumo do impacto e o nome. */
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
  const [resumo, setResumo] = useState<{
    boletins: number;
    ocorrencias: number;
    planos: number;
    acessos: number;
  } | null>(null);

  // O impacto é buscado na montagem — este painel só existe depois que alguém
  // clicou em "Excluir", então não há consulta especulativa.
  useEffect(() => {
    let vivo = true;
    resumoExclusaoCondominioAction(id).then((r) => {
      if (vivo) setResumo(r);
    });
    return () => {
      vivo = false;
    };
  }, [id]);

  const temHistorico =
    resumo != null &&
    (resumo.boletins > 0 || resumo.ocorrencias > 0 || resumo.planos > 0);

  return (
    <div
      className="mt-3 rounded-xl p-3"
      style={{
        background: "color-mix(in srgb, var(--status-critico) 6%, var(--superficie))",
        border: "1px solid color-mix(in srgb, var(--status-critico) 35%, transparent)",
      }}
    >
      <p className="text-sm font-semibold mb-2">
        Excluir “{nome}” apaga também todo o histórico dele.
      </p>

      {resumo === null ? (
        <p className="text-sm mb-3" style={{ color: "var(--tinta-3)" }}>
          Verificando o que será apagado…
        </p>
      ) : (
        <ul className="text-sm mb-3 space-y-0.5" style={{ color: "var(--tinta-2)" }}>
          <li className="num">{resumo.boletins} boletim(ns)</li>
          <li className="num">{resumo.ocorrencias} ocorrência(s)</li>
          <li className="num">{resumo.planos} plano(s) de ação</li>
          <li className="num">{resumo.acessos} vínculo(s) de usuário</li>
        </ul>
      )}

      {temHistorico && ativo ? (
        <p className="text-xs mb-3" style={{ color: "var(--tinta-2)" }}>
          Se a intenção é só tirar do formulário, use <strong>Desativar</strong>: o
          condomínio some da lista de quem preenche e o histórico continua no
          dashboard.
        </p>
      ) : null}

      <label className="rotulo" htmlFor={`confirma-${id}`}>
        Digite <strong>{nome}</strong> para confirmar
      </label>
      <input
        id={`confirma-${id}`}
        className="campo"
        value={confirmacao}
        onChange={(e) => setConfirmacao(e.target.value)}
        placeholder={nome}
        autoComplete="off"
      />

      <Aviso estado={estado} />

      <button
        type="button"
        disabled={processando || confirmacao.trim() === ""}
        onClick={() =>
          iniciar(async () => {
            const r = await excluirCondominioAction(id, confirmacao);
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
