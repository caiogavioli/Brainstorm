"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Criticidade, StatusOcorrencia } from "@prisma/client";

import { CRITICIDADE_LABEL, STATUS_OCORRENCIA_LABEL } from "@/lib/labels";
import { atualizarOcorrenciaAction } from "@/lib/acoes/ocorrencias";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario w-full" disabled={pending}>
      {pending ? "Salvando…" : "Salvar alterações"}
    </button>
  );
}

/** Painel do síndico: muda status, criticidade, SLA e plano de ação. */
export function PainelGestaoOcorrencia({
  id,
  status,
  criticidade,
  previsaoFinalizacao,
  planoAcao,
}: {
  id: number;
  status: StatusOcorrencia;
  criticidade: Criticidade;
  previsaoFinalizacao: string;
  planoAcao: string;
}) {
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    atualizarOcorrenciaAction,
    null,
  );

  return (
    <form action={acao} className="space-y-4">
      <input type="hidden" name="id" value={id} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="rotulo" htmlFor="status">
            Status
          </label>
          <select id="status" name="status" className="campo" defaultValue={status}>
            {(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"] as const).map((s) => (
              <option key={s} value={s}>
                {STATUS_OCORRENCIA_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rotulo" htmlFor="criticidade">
            Criticidade
          </label>
          <select
            id="criticidade"
            name="criticidade"
            className="campo"
            defaultValue={criticidade}
          >
            {(["BAIXA", "MEDIA", "ALTA"] as const).map((c) => (
              <option key={c} value={c}>
                {CRITICIDADE_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="rotulo" htmlFor="previsaoFinalizacao">
          Previsão de finalização (SLA)
        </label>
        <input
          id="previsaoFinalizacao"
          name="previsaoFinalizacao"
          type="date"
          className="campo"
          defaultValue={previsaoFinalizacao}
        />
      </div>

      <div>
        <label className="rotulo" htmlFor="planoAcao">
          Plano de ação
        </label>
        <textarea
          id="planoAcao"
          name="planoAcao"
          className="campo"
          defaultValue={planoAcao}
          placeholder="Empresa acionada, protocolo, prazo combinado…"
        />
      </div>

      <div>
        <label className="rotulo" htmlFor="comentario">
          Registrar no histórico (opcional)
        </label>
        <textarea
          id="comentario"
          name="comentario"
          className="campo"
          style={{ minHeight: "4rem" }}
          placeholder="Ex.: técnico esteve no local, peça chega na sexta."
        />
      </div>

      {estado ? (
        <p
          role="status"
          className="text-sm rounded-lg px-3 py-2"
          style={
            estado.ok
              ? {
                  color: "var(--status-bom-texto)",
                  background:
                    "color-mix(in srgb, var(--status-bom) 10%, var(--superficie))",
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
