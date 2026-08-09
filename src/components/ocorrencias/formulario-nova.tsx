"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import type { GrupoChecklist } from "@prisma/client";

import { GRUPO_LABEL } from "@/lib/checklist";
import { CRITICIDADE_LABEL, STATUS_OCORRENCIA_LABEL } from "@/lib/labels";
import { criarOcorrenciaAction } from "@/lib/acoes/ocorrencias";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

type Item = { id: number; nome: string; grupo: GrupoChecklist };

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario flex-[2]" disabled={pending}>
      {pending ? "Salvando…" : "Registrar ocorrência"}
    </button>
  );
}

export function FormularioNovaOcorrencia({
  condominios,
  itens,
}: {
  condominios: { id: number; nome: string }[];
  itens: Item[];
}) {
  const router = useRouter();
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    criarOcorrenciaAction,
    null,
  );
  const [setorFora, setSetorFora] = useState(false);

  useEffect(() => {
    if (estado?.ok && estado.id) {
      router.push(`/ocorrencias/${estado.id}`);
      router.refresh();
    }
  }, [estado, router]);

  // Agrupa o seletor de setor pelos mesmos grupos do boletim.
  const grupos = Array.from(new Set(itens.map((i) => i.grupo)));

  return (
    <form action={acao} className="space-y-4">
      <div className="card card-pad space-y-4">
        <div>
          <label className="rotulo" htmlFor="condominioId">
            Condomínio
          </label>
          <select id="condominioId" name="condominioId" className="campo" required>
            {condominios.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="rotulo" htmlFor="checklistItemId">
            Setor / Equipamento
          </label>
          {setorFora ? (
            <input
              name="setorLivre"
              className="campo"
              placeholder="Descreva o setor (fora da lista do boletim)"
              required
            />
          ) : (
            <select id="checklistItemId" name="checklistItemId" className="campo" required>
              <option value="">Selecione…</option>
              {grupos.map((g) => (
                <optgroup key={g} label={GRUPO_LABEL[g]}>
                  {itens
                    .filter((i) => i.grupo === g)
                    .map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nome}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setSetorFora((v) => !v)}
            className="mt-2 text-xs font-medium underline"
            style={{ color: "var(--serie-1)" }}
          >
            {setorFora ? "Escolher da lista do boletim" : "Setor não está na lista"}
          </button>
        </div>

        <div>
          <label className="rotulo" htmlFor="descricao">
            Descrição do problema
          </label>
          <textarea
            id="descricao"
            name="descricao"
            className="campo"
            required
            minLength={5}
            placeholder="O que aconteceu, onde e desde quando."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="rotulo" htmlFor="criticidade">
              Criticidade
            </label>
            <select id="criticidade" name="criticidade" className="campo" defaultValue="MEDIA">
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
            <select id="status" name="status" className="campo" defaultValue="PENDENTE">
              {(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"] as const).map((s) => (
                <option key={s} value={s}>
                  {STATUS_OCORRENCIA_LABEL[s]}
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
          />
        </div>

        <div>
          <label className="rotulo" htmlFor="planoAcao">
            Plano de ação (opcional)
          </label>
          <textarea
            id="planoAcao"
            name="planoAcao"
            className="campo"
            placeholder="Empresa acionada, protocolo, prazo combinado…"
          />
        </div>

        {estado && !estado.ok ? (
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
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/ocorrencias")}
          className="botao botao-secundario flex-1"
        >
          Cancelar
        </button>
        <BotaoSalvar />
      </div>
    </form>
  );
}
