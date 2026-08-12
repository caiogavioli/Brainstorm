"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Barra de filtros global (condomínio + período), em uma única linha acima do
 * conteúdo. Escreve na URL, então o estado é compartilhável e sobrevive ao
 * recarregamento.
 */
export function FiltrosGlobais({
  condominios,
  mostrarMes = true,
  mesPadrao,
  mostrarDia = false,
  diaPadrao,
  extras,
}: {
  condominios: { id: number; nome: string }[];
  mostrarMes?: boolean;
  /** Mês exibido quando a URL não traz `?mes=` — mantém o campo em sincronia
   *  com o período que a página está realmente mostrando. */
  mesPadrao?: string;
  /** Habilita a escolha entre analisar um dia ou o mês inteiro. */
  mostrarDia?: boolean;
  diaPadrao?: string;
  extras?: {
    nome: string;
    rotulo: string;
    opcoes: { valor: string; rotulo: string }[];
  }[];
}) {
  const router = useRouter();
  const caminho = usePathname();
  const parametros = useSearchParams();

  const porDia = parametros.get("dia") !== null && parametros.get("dia") !== "";

  const atualizar = useCallback(
    (chave: string, valor: string, limpar?: string) => {
      const busca = new URLSearchParams(parametros.toString());
      if (valor) busca.set(chave, valor);
      else busca.delete(chave);
      if (limpar !== undefined) busca.delete(limpar);
      router.push(`${caminho}?${busca.toString()}`);
    },
    [caminho, parametros, router],
  );

  return (
    <div className="card card-pad mb-4 sem-impressao">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[10rem] flex-1">
          <label className="rotulo" htmlFor="filtro-condominio">
            Condomínio
          </label>
          <select
            id="filtro-condominio"
            className="campo"
            value={parametros.get("condominio") ?? ""}
            onChange={(e) => atualizar("condominio", e.target.value)}
          >
            <option value="">Todos</option>
            {condominios.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        {mostrarDia ? (
          <>
            <div className="min-w-[8rem]">
              <label className="rotulo" htmlFor="filtro-periodo">
                Período
              </label>
              <select
                id="filtro-periodo"
                className="campo"
                value={porDia ? "dia" : "mes"}
                onChange={(e) =>
                  // Trocar de período limpa o outro campo: manter os dois na URL
                  // deixaria ambíguo qual está valendo.
                  e.target.value === "dia"
                    ? atualizar("dia", diaPadrao ?? "", "mes")
                    : atualizar("dia", "", "")
                }
              >
                <option value="dia">Dia</option>
                <option value="mes">Mês</option>
              </select>
            </div>

            {porDia ? (
              <div className="min-w-[9rem] flex-1">
                <label className="rotulo" htmlFor="filtro-dia">
                  Dia
                </label>
                <input
                  id="filtro-dia"
                  type="date"
                  className="campo"
                  value={parametros.get("dia") ?? diaPadrao ?? ""}
                  onChange={(e) => atualizar("dia", e.target.value)}
                />
              </div>
            ) : null}
          </>
        ) : null}

        {mostrarMes && !porDia ? (
          <div className="min-w-[9rem] flex-1">
            <label className="rotulo" htmlFor="filtro-mes">
              Mês/Ano
            </label>
            <input
              id="filtro-mes"
              type="month"
              className="campo"
              value={parametros.get("mes") ?? mesPadrao ?? ""}
              onChange={(e) => atualizar("mes", e.target.value)}
            />
          </div>
        ) : null}

        {extras?.map((extra) => (
          <div key={extra.nome} className="min-w-[9rem] flex-1">
            <label className="rotulo" htmlFor={`filtro-${extra.nome}`}>
              {extra.rotulo}
            </label>
            <select
              id={`filtro-${extra.nome}`}
              className="campo"
              value={parametros.get(extra.nome) ?? ""}
              onChange={(e) => atualizar(extra.nome, e.target.value)}
            >
              {extra.opcoes.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
