import Link from "next/link";

import { formatarDataReferencia, formatarHora } from "@/lib/datas";

export type LinhaQuadro = {
  id: number;
  nome: string;
  luz: "VERDE" | "AMARELA" | "VERMELHA";
  detalhe: string;
  naoConformes: number;
  enviadoEm: Date | null;
  preenchidoPor: string | null;
};

/**
 * Quadro de preenchimento do dia, um cartão por condomínio.
 *
 * É a primeira coisa da tela porque responde a pergunta da manhã: quem mandou o
 * boletim e quem não mandou. Deliberadamente grande — é lido de relance, às
 * vezes de longe, e não estudado.
 *
 * A cor nunca carrega o significado sozinha. Cada cartão traz o rótulo por
 * extenso ("Não preenchido") e um símbolo próprio, porque vermelho e verde são
 * o par que some no daltonismo mais comum — e porque um quadro que só funciona
 * para quem enxerga cor não serve como painel de operação.
 */
const APARENCIA = {
  VERDE: {
    rotulo: "Preenchido",
    simbolo: "✓",
    cor: "var(--status-bom)",
    texto: "var(--status-bom-texto)",
  },
  AMARELA: {
    rotulo: "Incompleto",
    simbolo: "!",
    cor: "var(--status-atencao)",
    texto: "color-mix(in srgb, var(--status-atencao) 72%, var(--tinta))",
  },
  VERMELHA: {
    rotulo: "Não preenchido",
    simbolo: "✕",
    cor: "var(--status-critico)",
    texto: "var(--status-critico-texto)",
  },
} as const;

export function QuadroDoDia({
  linhas,
  dia,
}: {
  linhas: LinhaQuadro[];
  dia: string;
}) {
  const contagem = {
    VERDE: linhas.filter((l) => l.luz === "VERDE").length,
    AMARELA: linhas.filter((l) => l.luz === "AMARELA").length,
    VERMELHA: linhas.filter((l) => l.luz === "VERMELHA").length,
  };

  return (
    <section className="card card-pad mb-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h2 className="text-lg font-bold">Boletins de {formatarDataReferencia(dia)}</h2>
        <p className="text-sm num" style={{ color: "var(--tinta-2)" }}>
          {contagem.VERDE} preenchido(s) · {contagem.AMARELA} incompleto(s) ·{" "}
          <strong style={{ color: contagem.VERMELHA > 0 ? "var(--status-critico-texto)" : undefined }}>
            {contagem.VERMELHA} faltando
          </strong>
        </p>
      </div>
      <p className="text-xs mb-4" style={{ color: "var(--tinta-3)" }}>
        Incompleto = boletim enviado com não conformidade sem plano de ação. Prazo em
        branco não conta como pendência.
      </p>

      {linhas.length === 0 ? (
        <div
          className="flex h-24 items-center justify-center rounded-lg text-sm"
          style={{ background: "var(--superficie-2)", color: "var(--tinta-3)" }}
        >
          Nenhum condomínio ativo no filtro atual.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {linhas.map((l) => {
            const a = APARENCIA[l.luz];
            return (
              <li key={l.id}>
                <Link
                  href={`/boletim?condominio=${l.id}`}
                  className="flex items-center gap-4 rounded-xl p-4 h-full transition-colors"
                  style={{
                    border: `1px solid color-mix(in srgb, ${a.cor} 45%, transparent)`,
                    background: `color-mix(in srgb, ${a.cor} 8%, var(--superficie))`,
                    minHeight: "5.5rem",
                  }}
                >
                  {/* A luz. Grande o bastante para ser lida de relance. */}
                  <span
                    aria-hidden
                    className="flex-none grid place-items-center rounded-full font-bold"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      background: a.cor,
                      color: l.luz === "AMARELA" ? "#0b0b0b" : "#ffffff",
                      fontSize: "1.5rem",
                      lineHeight: 1,
                    }}
                  >
                    {a.simbolo}
                  </span>

                  <span className="min-w-0">
                    <span className="block font-semibold leading-tight">{l.nome}</span>
                    <span
                      className="block text-sm font-semibold mt-0.5"
                      style={{ color: a.texto }}
                    >
                      {a.rotulo}
                    </span>
                    <span
                      className="block text-xs mt-0.5"
                      style={{ color: "var(--tinta-2)" }}
                    >
                      {l.detalhe}
                    </span>
                    {l.enviadoEm ? (
                      <span
                        className="block text-xs num mt-0.5"
                        style={{ color: "var(--tinta-3)" }}
                      >
                        {formatarHora(l.enviadoEm)}
                        {l.preenchidoPor ? ` · ${l.preenchidoPor}` : ""}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
