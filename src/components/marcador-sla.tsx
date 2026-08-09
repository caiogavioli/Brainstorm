/**
 * Sinalizador de prazo (SLA).
 *
 * O estado nunca é comunicado só por cor: cada variante traz ícone e texto,
 * então continua legível em impressão P&B e para daltônicos.
 */
export function MarcadorSLA({
  dias,
  concluida,
}: {
  dias: number | null;
  concluida?: boolean;
}) {
  if (concluida) {
    return <span className="badge badge-ok">✓ Concluída</span>;
  }
  if (dias === null) {
    return <span className="badge badge-neutral">Sem prazo</span>;
  }
  if (dias < 0) {
    return (
      <span className="badge badge-danger">
        ▲ {Math.abs(dias)}d em atraso
      </span>
    );
  }
  if (dias === 0) {
    return <span className="badge badge-warn">● Vence hoje</span>;
  }
  if (dias <= 2) {
    return <span className="badge badge-warn">● Vence em {dias}d</span>;
  }
  return <span className="badge badge-info">◷ {dias}d restantes</span>;
}
