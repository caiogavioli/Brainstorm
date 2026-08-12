import Link from "next/link";

import { formatarHora } from "@/lib/datas";

export type LinhaQuadro = {
  id: number;
  nome: string;
  luz: "VERDE" | "AMARELA" | "VERMELHA";
  /** Dias do período em que se esperava boletim (só os já decorridos). */
  diasEsperados: number;
  diasPreenchidos: number;
  /** Não conformidades sem plano de ação — o que acende o amarelo. */
  semPlano: number;
  naoConformes: number;
  /** Hora do envio e autor: só existem quando o período é um único dia. */
  enviadoEm: Date | null;
  preenchidoPor: string | null;
};

/**
 * Quadro de preenchimento do período, um lugar por condomínio.
 *
 * É a primeira coisa da tela porque responde a pergunta da manhã: quem mandou o
 * boletim e quem não mandou.
 *
 * O quadro é dimensionado para cerca de 50 condomínios, e isso muda o desenho.
 * Cinquenta cartões grandes não são "grandes o bastante para ler de relance" —
 * são duas telas de rolagem em que achar o vermelho vira uma caça. Então o que
 * é grande aqui é a contagem, e os condomínios vêm agrupados por estado: o que
 * falta primeiro, em destaque; o que já está certo por último, comprimido em
 * etiquetas. A resposta "faltam 7" fica legível de longe; os nomes dos 43 que
 * estão em dia ocupam o mínimo necessário para serem conferidos.
 *
 * A cor nunca carrega o significado sozinha. Cada bloco traz o rótulo por
 * extenso e um símbolo próprio (✓ / ! / ✕), porque vermelho e verde são o par
 * que some no daltonismo mais comum — e um painel de operação que só funciona
 * para quem enxerga cor não serve como painel de operação.
 */
const APARENCIA = {
  VERMELHA: {
    rotulo: "Não preenchido",
    simbolo: "✕",
    cor: "var(--status-critico)",
    texto: "var(--status-critico-texto)",
  },
  AMARELA: {
    rotulo: "Incompleto",
    simbolo: "!",
    cor: "var(--status-atencao)",
    texto: "color-mix(in srgb, var(--status-atencao) 72%, var(--tinta))",
  },
  VERDE: {
    rotulo: "Preenchido",
    simbolo: "✓",
    cor: "var(--status-bom)",
    texto: "var(--status-bom-texto)",
  },
} as const;

type Luz = keyof typeof APARENCIA;

function detalhe(l: LinhaQuadro): string {
  const umDia = l.diasEsperados <= 1;

  if (l.luz === "VERMELHA") {
    const faltando = l.diasEsperados - l.diasPreenchidos;
    return umDia ? "Sem boletim" : `${faltando} de ${l.diasEsperados} dias sem boletim`;
  }
  if (l.luz === "AMARELA") {
    const falta =
      l.diasEsperados - l.diasPreenchidos > 0
        ? `${l.diasEsperados - l.diasPreenchidos} dia(s) sem boletim · `
        : "";
    return `${falta}${l.semPlano} não conformidade(s) sem plano de ação`;
  }
  if (l.naoConformes > 0) {
    return `${l.naoConformes} não conformidade(s), todas tratadas`;
  }
  return umDia ? "Dia em conformidade" : `${l.diasPreenchidos} dias em conformidade`;
}

export function QuadroPreenchimento({
  linhas,
  rotuloPeriodo,
  diasAnalisados,
}: {
  linhas: LinhaQuadro[];
  rotuloPeriodo: string;
  /** Dias já decorridos dentro do período. Zero = o período ainda não começou. */
  diasAnalisados: number;
}) {
  const grupos: Record<Luz, LinhaQuadro[]> = {
    VERMELHA: linhas.filter((l) => l.luz === "VERMELHA"),
    AMARELA: linhas.filter((l) => l.luz === "AMARELA"),
    VERDE: linhas.filter((l) => l.luz === "VERDE"),
  };

  return (
    <section className="card card-pad mb-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-lg font-bold">Preenchimento — {rotuloPeriodo}</h2>
        <p className="text-xs" style={{ color: "var(--tinta-3)" }}>
          Incompleto = boletim enviado com não conformidade sem plano de ação.
          Prazo em branco não conta como pendência.
        </p>
      </div>

      {/* Período inteiramente no futuro: ninguém devia boletim ainda, então
          "zero faltando" seria verdade e "todos preenchidos" seria mentira.
          Dizer que não há o que medir é a única leitura honesta. */}
      {diasAnalisados === 0 ? (
        <div
          className="flex h-24 items-center justify-center rounded-lg px-4 text-center text-sm"
          style={{ background: "var(--superficie-2)", color: "var(--tinta-3)" }}
        >
          O período selecionado ainda não começou — não há boletim esperado para
          medir.
        </div>
      ) : linhas.length === 0 ? (
        <div
          className="flex h-24 items-center justify-center rounded-lg text-sm"
          style={{ background: "var(--superficie-2)", color: "var(--tinta-3)" }}
        >
          Nenhum condomínio ativo no filtro atual.
        </div>
      ) : (
        <>
          {/* O placar. É isto que precisa ser lido de longe — não cada cartão. */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {(["VERMELHA", "AMARELA", "VERDE"] as Luz[]).map((luz) => {
              const a = APARENCIA[luz];
              const total = grupos[luz].length;
              const vazio = total === 0;
              return (
                <div
                  key={luz}
                  className="rounded-xl px-4 py-3"
                  style={{
                    border: `1px solid color-mix(in srgb, ${a.cor} ${vazio ? 22 : 50}%, transparent)`,
                    background: vazio
                      ? "var(--superficie-2)"
                      : `color-mix(in srgb, ${a.cor} 10%, var(--superficie))`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex-none grid place-items-center rounded-full font-bold"
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        background: vazio ? "var(--eixo)" : a.cor,
                        color: luz === "AMARELA" && !vazio ? "#0b0b0b" : "#ffffff",
                        fontSize: "1.125rem",
                        lineHeight: 1,
                      }}
                    >
                      {a.simbolo}
                    </span>
                    <span className="min-w-0">
                      <span
                        className="block num font-bold leading-none"
                        style={{
                          fontSize: "2rem",
                          color: vazio ? "var(--tinta-3)" : a.texto,
                        }}
                      >
                        {total}
                      </span>
                      <span
                        className="block text-xs font-semibold mt-1"
                        style={{ color: "var(--tinta-2)" }}
                      >
                        {a.rotulo}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quem falta e quem está pela metade: bloco por condomínio, com o
              motivo escrito. São as linhas que exigem uma ligação hoje. */}
          {(["VERMELHA", "AMARELA"] as Luz[]).map((luz) =>
            grupos[luz].length === 0 ? null : (
              <div key={luz} className="mb-4">
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ color: APARENCIA[luz].texto }}
                >
                  {APARENCIA[luz].rotulo} ({grupos[luz].length})
                </h3>
                <ul
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
                  }}
                >
                  {grupos[luz].map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/boletim?condominio=${l.id}`}
                        className="flex h-full items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
                        style={{
                          border: `1px solid color-mix(in srgb, ${APARENCIA[luz].cor} 45%, transparent)`,
                          background: `color-mix(in srgb, ${APARENCIA[luz].cor} 9%, var(--superficie))`,
                        }}
                      >
                        <span
                          aria-hidden
                          className="flex-none grid place-items-center rounded-full font-bold"
                          style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            background: APARENCIA[luz].cor,
                            color: luz === "AMARELA" ? "#0b0b0b" : "#ffffff",
                            fontSize: "0.8125rem",
                            lineHeight: 1,
                          }}
                        >
                          {APARENCIA[luz].simbolo}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold leading-tight">
                            {l.nome}
                          </span>
                          <span
                            className="block text-xs mt-0.5"
                            style={{ color: "var(--tinta-2)" }}
                          >
                            {detalhe(l)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}

          {/* Quem está em dia: etiqueta, não cartão. Serve para conferir que o
              nome está na lista, e não para ser estudado um a um. */}
          {grupos.VERDE.length > 0 ? (
            <div>
              <h3
                className="text-sm font-bold mb-2"
                style={{ color: APARENCIA.VERDE.texto }}
              >
                Preenchido ({grupos.VERDE.length})
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {grupos.VERDE.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/boletim?condominio=${l.id}`}
                      title={`${l.nome} — ${detalhe(l)}${
                        l.enviadoEm
                          ? ` · ${formatarHora(l.enviadoEm)}${
                              l.preenchidoPor ? ` · ${l.preenchidoPor}` : ""
                            }`
                          : ""
                      }`}
                      className="flex items-center gap-1.5 rounded-full py-1 pl-2 pr-3 text-xs font-semibold transition-colors"
                      style={{
                        border:
                          "1px solid color-mix(in srgb, var(--status-bom) 35%, transparent)",
                        background:
                          "color-mix(in srgb, var(--status-bom) 8%, var(--superficie))",
                        color: "var(--tinta-2)",
                      }}
                    >
                      <span
                        aria-hidden
                        className="flex-none grid place-items-center rounded-full"
                        style={{
                          width: "1rem",
                          height: "1rem",
                          background: "var(--status-bom)",
                          color: "#ffffff",
                          fontSize: "0.625rem",
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </span>
                      {l.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
