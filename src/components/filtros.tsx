"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { primeiroDiaDoMes, somarDias, ultimoDiaDoMes } from "@/lib/datas";

/**
 * Barra de filtros global (condomínio + período), em uma única linha acima do
 * conteúdo. Escreve na URL, então o estado é compartilhável e sobrevive ao
 * recarregamento.
 *
 * O período é um intervalo aberto — data de início e data de término, cada uma
 * num campo de calendário. Um seletor de mês só responde perguntas mensais, e a
 * análise real quase nunca cai certinho num mês: "da última visita até hoje",
 * "a semana passada", "os três dias do feriado".
 *
 * Os atalhos existem porque o caso mais frequente é o de hoje, e clicar duas
 * vezes num calendário para pedir "hoje" seria um retrocesso em relação ao
 * seletor de dia que havia antes.
 */
export function FiltrosGlobais({
  condominios,
  mostrarPeriodo = true,
  rotuloPeriodo = "Período",
  ajudaPeriodo,
  dePadrao,
  atePadrao,
  hoje,
  extras,
  multiploCondominio = false,
}: {
  condominios: { id: number; nome: string }[];
  mostrarPeriodo?: boolean;
  /** Muda quando a data filtrada não é a do registro (ex.: "Previsão entre"). */
  rotuloPeriodo?: string;
  ajudaPeriodo?: string;
  /** Valores exibidos quando a URL não traz `?de=`/`?ate=`. */
  dePadrao?: string;
  atePadrao?: string;
  /** Hoje no fuso de operação, vindo do servidor — os atalhos dependem disso e
   *  calcular no cliente daria divergência de hidratação. */
  hoje?: string;
  extras?: {
    nome: string;
    rotulo: string;
    opcoes: { valor: string; rotulo: string }[];
  }[];
  /** Campo de condomínio vira seleção múltipla (checkboxes) em vez de um único
   *  `<select>`. Escreve a mesma chave `?condominio=`, como lista separada por
   *  vírgula — quem não usa este modo continua lendo um valor único, sem
   *  quebrar. */
  multiploCondominio?: boolean;
}) {
  const router = useRouter();
  const caminho = usePathname();
  const parametros = useSearchParams();

  const de = parametros.get("de") ?? dePadrao ?? "";
  const ate = parametros.get("ate") ?? atePadrao ?? "";

  const navegar = useCallback(
    (mudancas: Record<string, string>) => {
      const busca = new URLSearchParams(parametros.toString());
      for (const [chave, valor] of Object.entries(mudancas)) {
        if (valor) busca.set(chave, valor);
        else busca.delete(chave);
      }
      router.push(`${caminho}?${busca.toString()}`);
    },
    [caminho, parametros, router],
  );

  // --------------------------------------------- Seleção múltipla de condomínio
  const idsSelecionados = useMemo(() => {
    const bruto = parametros.get("condominio");
    if (!bruto) return [] as number[];
    return bruto
      .split(",")
      .map((v) => Number(v))
      .filter((n) => Number.isInteger(n));
  }, [parametros]);

  const [painelAberto, setPainelAberto] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);

  // Seleção provisória: os cliques nos checkboxes só mudam este estado local.
  // A URL (e a busca dos dados) só muda quando o usuário clica em "Aplicar
  // filtros" — cada condomínio marcado, um por um, disparava uma nova
  // navegação e refazia a consulta inteira a cada clique, o que ficava lento
  // com vários condomínios.
  const [selecaoPendente, setSelecaoPendente] = useState<number[]>(idsSelecionados);

  useEffect(() => {
    if (!painelAberto) return;
    function aoClicarFora(evento: MouseEvent) {
      if (painelRef.current && !painelRef.current.contains(evento.target as Node)) {
        setPainelAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [painelAberto]);

  function abrirPainel() {
    setSelecaoPendente(idsSelecionados);
    setPainelAberto(true);
  }

  function alternarPendente(id: number) {
    setSelecaoPendente((atual) =>
      atual.includes(id) ? atual.filter((v) => v !== id) : [...atual, id],
    );
  }

  function aplicarSelecao() {
    navegar({ condominio: selecaoPendente.join(",") });
    setPainelAberto(false);
  }

  const rotuloSelecaoCondominio =
    idsSelecionados.length === 0
      ? "Todos"
      : idsSelecionados.length === 1
        ? (condominios.find((c) => c.id === idsSelecionados[0])?.nome ?? "1 selecionado")
        : `${idsSelecionados.length} selecionados`;

  /**
   * Um intervalo invertido devolveria zero resultados e pareceria um sistema
   * quebrado, não um filtro mal preenchido. Arrastar a outra ponta junto é o
   * comportamento que não tem como confundir.
   */
  const mudarInicio = (valor: string) =>
    navegar({ de: valor, ...(valor && ate && valor > ate ? { ate: valor } : {}) });

  const mudarFim = (valor: string) =>
    navegar({ ate: valor, ...(valor && de && valor < de ? { de: valor } : {}) });

  const atalhos = hoje
    ? [
        { rotulo: "Hoje", de: hoje, ate: hoje },
        { rotulo: "Ontem", de: somarDias(hoje, -1), ate: somarDias(hoje, -1) },
        { rotulo: "7 dias", de: somarDias(hoje, -6), ate: hoje },
        { rotulo: "30 dias", de: somarDias(hoje, -29), ate: hoje },
        { rotulo: "Este mês", de: primeiroDiaDoMes(hoje), ate: hoje },
        {
          rotulo: "Mês passado",
          de: primeiroDiaDoMes(somarDias(primeiroDiaDoMes(hoje), -1)),
          ate: ultimoDiaDoMes(somarDias(primeiroDiaDoMes(hoje), -1)),
        },
      ]
    : [];

  return (
    <div className="card card-pad mb-4 sem-impressao">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[10rem] flex-1">
          <label className="rotulo" htmlFor="filtro-condominio">
            Condomínio
          </label>
          {multiploCondominio ? (
            <div className="relative" ref={painelRef}>
              <button
                type="button"
                id="filtro-condominio"
                className="campo flex w-full items-center justify-between gap-2 text-left"
                onClick={() => (painelAberto ? setPainelAberto(false) : abrirPainel())}
              >
                <span className="truncate">{rotuloSelecaoCondominio}</span>
                <span aria-hidden style={{ color: "var(--tinta-3)" }}>
                  ▾
                </span>
              </button>
              {painelAberto ? (
                <div
                  className="absolute z-10 mt-1 flex w-64 flex-col rounded-lg p-2"
                  style={{
                    background: "var(--superficie)",
                    border: "1px solid var(--borda)",
                    boxShadow: "var(--sombra)",
                  }}
                >
                  <div className="mb-1 flex items-center justify-between px-1">
                    <span className="text-xs" style={{ color: "var(--tinta-3)" }}>
                      {selecaoPendente.length === 0
                        ? "Todos"
                        : `${selecaoPendente.length} marcado(s)`}
                    </span>
                    {selecaoPendente.length > 0 ? (
                      <button
                        type="button"
                        className="text-xs underline"
                        style={{ color: "var(--tinta-3)" }}
                        onClick={() => setSelecaoPendente([])}
                      >
                        limpar
                      </button>
                    ) : null}
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {condominios.map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 rounded px-1 py-1 text-sm"
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          checked={selecaoPendente.includes(c.id)}
                          onChange={() => alternarPendente(c.id)}
                        />
                        {c.nome}
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="botao botao-primario mt-2 w-full justify-center text-sm"
                    onClick={aplicarSelecao}
                  >
                    Aplicar filtros
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <select
              id="filtro-condominio"
              className="campo"
              value={parametros.get("condominio") ?? ""}
              onChange={(e) => navegar({ condominio: e.target.value })}
            >
              <option value="">Todos</option>
              {condominios.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          )}
        </div>

        {mostrarPeriodo ? (
          <>
            <div className="min-w-[9rem] flex-1">
              <label className="rotulo" htmlFor="filtro-de">
                {rotuloPeriodo} — início
              </label>
              <input
                id="filtro-de"
                type="date"
                className="campo"
                max={ate || undefined}
                value={de}
                onChange={(e) => mudarInicio(e.target.value)}
              />
            </div>

            <div className="min-w-[9rem] flex-1">
              <label className="rotulo" htmlFor="filtro-ate">
                {rotuloPeriodo} — término
              </label>
              <input
                id="filtro-ate"
                type="date"
                className="campo"
                min={de || undefined}
                value={ate}
                onChange={(e) => mudarFim(e.target.value)}
              />
            </div>
          </>
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
              onChange={(e) => navegar({ [extra.nome]: e.target.value })}
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

      {mostrarPeriodo && atalhos.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: "var(--tinta-3)" }}>
            Atalhos:
          </span>
          {atalhos.map((a) => {
            const ativo = de === a.de && ate === a.ate;
            return (
              <button
                key={a.rotulo}
                type="button"
                aria-pressed={ativo}
                onClick={() => navegar({ de: a.de, ate: a.ate })}
                className="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                style={{
                  border: `1px solid ${ativo ? "var(--serie-1)" : "var(--borda)"}`,
                  background: ativo
                    ? "color-mix(in srgb, var(--serie-1) 12%, transparent)"
                    : "transparent",
                  color: ativo ? "var(--serie-1)" : "var(--tinta-2)",
                }}
              >
                {a.rotulo}
              </button>
            );
          })}
          {de || ate ? (
            <button
              type="button"
              onClick={() => navegar({ de: "", ate: "" })}
              className="text-xs underline"
              style={{ color: "var(--tinta-3)" }}
            >
              limpar período
            </button>
          ) : null}
        </div>
      ) : null}

      {ajudaPeriodo ? (
        <p className="mt-2 text-xs" style={{ color: "var(--tinta-3)" }}>
          {ajudaPeriodo}
        </p>
      ) : null}
    </div>
  );
}
