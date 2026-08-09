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
  extras,
}: {
  condominios: { id: number; nome: string }[];
  mostrarMes?: boolean;
  /** Mês exibido quando a URL não traz `?mes=` — mantém o campo em sincronia
   *  com o período que a página está realmente mostrando. */
  mesPadrao?: string;
  extras?: {
    nome: string;
    rotulo: string;
    opcoes: { valor: string; rotulo: string }[];
  }[];
}) {
  const router = useRouter();
  const caminho = usePathname();
  const parametros = useSearchParams();

  const atualizar = useCallback(
    (chave: string, valor: string) => {
      const busca = new URLSearchParams(parametros.toString());
      if (valor) busca.set(chave, valor);
      else busca.delete(chave);
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

        {mostrarMes ? (
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
