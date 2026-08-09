"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import type { Criticidade, StatusOcorrencia } from "@prisma/client";

import { CRITICIDADE_LABEL, STATUS_OCORRENCIA_LABEL } from "@/lib/labels";
import { atualizarPlanoAction, criarPlanoAction } from "@/lib/acoes/planos";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

export type PlanoExistente = {
  id: number;
  condominioId: number;
  local: string;
  descricao: string;
  criticidade: Criticidade;
  status: StatusOcorrencia;
  previsaoFinalizacao: string;
  responsavel: string;
  observacoes: string;
};

function BotaoSalvar({ rotulo }: { rotulo: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario flex-[2]" disabled={pending}>
      {pending ? "Salvando…" : rotulo}
    </button>
  );
}

/**
 * Formulário de Plano de Ação — projetos de longo prazo e visitas operacionais.
 * Serve tanto para criação (sem `plano`) quanto para edição.
 */
export function FormularioPlano({
  condominios,
  plano,
  aoConcluir,
}: {
  condominios: { id: number; nome: string }[];
  plano?: PlanoExistente;
  aoConcluir?: () => void;
}) {
  const router = useRouter();
  const edicao = Boolean(plano);
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    edicao ? atualizarPlanoAction : criarPlanoAction,
    null,
  );
  const [chaveReset, setChaveReset] = useState(0);

  useEffect(() => {
    if (estado?.ok) {
      router.refresh();
      if (!edicao) setChaveReset((k) => k + 1); // limpa o formulário de criação
      aoConcluir?.();
    }
  }, [estado, edicao, router, aoConcluir]);

  return (
    <form action={acao} key={chaveReset} className="space-y-4">
      {plano ? <input type="hidden" name="id" value={plano.id} /> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="rotulo" htmlFor="condominioId">
            Condomínio
          </label>
          <select
            id="condominioId"
            name="condominioId"
            className="campo"
            defaultValue={plano?.condominioId}
            required
          >
            {condominios.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rotulo" htmlFor="local">
            Local / Setor
          </label>
          <input
            id="local"
            name="local"
            className="campo"
            defaultValue={plano?.local}
            placeholder="Ex.: Casa de máquinas — Elevadores"
            required
          />
        </div>
      </div>

      <div>
        <label className="rotulo" htmlFor="descricao">
          Descrição do projeto / melhoria
        </label>
        <textarea
          id="descricao"
          name="descricao"
          className="campo"
          defaultValue={plano?.descricao}
          required
          minLength={5}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="rotulo" htmlFor="criticidade">
            Criticidade
          </label>
          <select
            id="criticidade"
            name="criticidade"
            className="campo"
            defaultValue={plano?.criticidade ?? "MEDIA"}
          >
            {(["BAIXA", "MEDIA", "ALTA"] as const).map((c) => (
              <option key={c} value={c}>
                {CRITICIDADE_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rotulo" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="campo"
            defaultValue={plano?.status ?? "PENDENTE"}
          >
            {(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"] as const).map((s) => (
              <option key={s} value={s}>
                {STATUS_OCORRENCIA_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rotulo" htmlFor="previsaoFinalizacao">
            Previsão de finalização
          </label>
          <input
            id="previsaoFinalizacao"
            name="previsaoFinalizacao"
            type="date"
            className="campo"
            defaultValue={plano?.previsaoFinalizacao}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="rotulo" htmlFor="responsavel">
            Responsável (opcional)
          </label>
          <input
            id="responsavel"
            name="responsavel"
            className="campo"
            defaultValue={plano?.responsavel}
            placeholder="Engenharia, administradora, fornecedor…"
          />
        </div>
        <div>
          <label className="rotulo" htmlFor="observacoes">
            Observações (opcional)
          </label>
          <input
            id="observacoes"
            name="observacoes"
            className="campo"
            defaultValue={plano?.observacoes}
          />
        </div>
      </div>

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

      <div className="flex gap-2">
        <BotaoSalvar rotulo={edicao ? "Salvar alterações" : "Criar plano"} />
      </div>
    </form>
  );
}
