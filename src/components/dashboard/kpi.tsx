/**
 * Cartão de KPI (stat tile).
 *
 * O número é a figura principal e usa tinta primária — nunca a cor da série.
 * Quando há sinal de estado, ele vem como ícone + texto na nota, para não
 * depender de cor.
 */
export function CartaoKPI({
  rotulo,
  valor,
  unidade,
  nota,
  destaque,
}: {
  rotulo: string;
  valor: string | number;
  unidade?: string;
  nota?: string;
  /** Realce sutil para o KPI que exige ação (ex.: SLA estourado). */
  destaque?: "alerta" | "bom" | null;
}) {
  const borda =
    destaque === "alerta"
      ? "color-mix(in srgb, var(--status-critico) 40%, transparent)"
      : destaque === "bom"
        ? "color-mix(in srgb, var(--status-bom) 40%, transparent)"
        : "var(--borda)";

  return (
    <div className="card card-pad" style={{ borderColor: borda }}>
      <div className="titulo-secao mb-2">{rotulo}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold leading-none">{valor}</span>
        {unidade ? (
          <span className="text-base font-semibold" style={{ color: "var(--tinta-3)" }}>
            {unidade}
          </span>
        ) : null}
      </div>
      {nota ? (
        <p className="mt-2 text-xs leading-snug" style={{ color: "var(--tinta-3)" }}>
          {nota}
        </p>
      ) : null}
    </div>
  );
}
