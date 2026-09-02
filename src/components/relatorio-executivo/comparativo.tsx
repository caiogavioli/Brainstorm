function pct(valor: number): string {
  return valor.toFixed(valor >= 10 ? 0 : 1).replace(".", ",");
}

type Item = {
  rotulo: string;
  atual: number;
  anterior: number;
  formatar: (v: number) => string;
  /** "up" = maior é melhor (cobertura, conformidade); "down" = menor é melhor (ocorrências, críticas). */
  direcao: "up" | "down";
};

function Delta({ atual, anterior, direcao }: Pick<Item, "atual" | "anterior" | "direcao">) {
  if (anterior === 0 && atual === 0) {
    return <span style={{ color: "var(--tinta-3)" }}>sem mudança</span>;
  }
  if (anterior === 0) {
    return <span style={{ color: "var(--tinta-3)" }}>período anterior sem dado</span>;
  }
  const variacao = ((atual - anterior) / anterior) * 100;
  const melhorou = direcao === "up" ? variacao > 0 : variacao < 0;
  const cor =
    variacao === 0
      ? "var(--tinta-3)"
      : melhorou
        ? "var(--status-bom-texto)"
        : "var(--status-critico-texto)";
  const sinal = variacao > 0 ? "+" : "";
  return (
    <span style={{ color: cor }} className="font-semibold">
      {sinal}
      {pct(variacao)}% vs. período anterior
    </span>
  );
}

/**
 * Card de comparativo com o período anterior equivalente (mesma quantidade
 * de dias, um mês antes). Quando o período anterior não tem boletim nenhum
 * — típico logo depois de um condomínio entrar em operação — mostra isso em
 * vez de forçar uma comparação contra zero, que enganaria mais do que ajuda.
 */
export function ComparativoPeriodoAnterior({
  rotuloAnterior,
  temDadoAnterior,
  itens,
}: {
  rotuloAnterior: string;
  temDadoAnterior: boolean;
  itens: Item[];
}) {
  return (
    <section className="card card-pad mb-4">
      <h2 className="font-semibold mb-1">Comparativo com o período anterior</h2>
      <p className="text-xs mb-3" style={{ color: "var(--tinta-3)" }}>
        Mesma quantidade de dias, um mês antes ({rotuloAnterior}).
      </p>

      {!temDadoAnterior ? (
        <div
          className="flex h-20 items-center justify-center rounded-lg px-4 text-center text-sm"
          style={{ background: "var(--superficie-2)", color: "var(--tinta-3)" }}
        >
          Sem boletim nenhum no período anterior — provavelmente antes de
          entrar em operação. A comparação passa a valer a partir do próximo
          período com histórico.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {itens.map((item) => (
            <div
              key={item.rotulo}
              className="rounded-lg px-3 py-2.5"
              style={{ border: "1px solid var(--borda)" }}
            >
              <div className="titulo-secao mb-1">{item.rotulo}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold num">{item.formatar(item.atual)}</span>
                <span className="text-xs num" style={{ color: "var(--tinta-3)" }}>
                  antes: {item.formatar(item.anterior)}
                </span>
              </div>
              <div className="mt-1 text-xs">
                <Delta atual={item.atual} anterior={item.anterior} direcao={item.direcao} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export type { Item as ItemComparativo };
