/**
 * O boletim só é cobrado em dia útil — sábado, domingo e feriado não geram
 * pendência. `carregarDashboard()` ainda trata todo dia do calendário como
 * esperado (ver nota em `consultas/dashboard.ts`), o que infla a cobertura
 * de qualquer período que cruze um fim de semana. Até essa correção chegar
 * lá, o relatório executivo recalcula localmente com este helper.
 *
 * Sem calendário de feriados — só exclui sábado e domingo.
 */
/** Mesma janela de dias, um mês antes — usado no comparativo do relatório executivo. */
export function periodoAnteriorEquivalente(
  de: string,
  ate: string,
): { de: string; ate: string } {
  const deAnterior = new Date(`${de}T00:00:00.000Z`);
  deAnterior.setUTCMonth(deAnterior.getUTCMonth() - 1);
  const ateAnterior = new Date(`${ate}T00:00:00.000Z`);
  ateAnterior.setUTCMonth(ateAnterior.getUTCMonth() - 1);
  return {
    de: deAnterior.toISOString().slice(0, 10),
    ate: ateAnterior.toISOString().slice(0, 10),
  };
}

export function diasUteisEntre(de: string, ate: string): string[] {
  const dias: string[] = [];
  let atual = new Date(`${de}T00:00:00.000Z`);
  const fim = new Date(`${ate}T00:00:00.000Z`);
  while (atual <= fim) {
    const diaDaSemana = atual.getUTCDay(); // 0 = domingo, 6 = sábado
    if (diaDaSemana !== 0 && diaDaSemana !== 6) {
      dias.push(atual.toISOString().slice(0, 10));
    }
    atual = new Date(atual.getTime() + 86_400_000);
  }
  return dias;
}
