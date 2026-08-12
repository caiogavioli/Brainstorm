/**
 * Utilidades de data.
 *
 * Convenção do projeto:
 * - `dataReferencia` é uma string "YYYY-MM-DD" (o "dia" do boletim), imune a
 *   fuso horário — é assim que se garante 1 boletim por condomínio por dia.
 * - Campos `DateTime` guardam o instante real em UTC.
 * - A exibição usa o fuso de operação (America/Sao_Paulo por padrão).
 */

export const FUSO_OPERACAO = process.env.TZ_OPERACAO ?? "America/Sao_Paulo";

/** Retorna "YYYY-MM-DD" do instante informado no fuso de operação. */
export function dataReferenciaDe(data: Date = new Date()): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO_OPERACAO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(data);
  const get = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** "YYYY-MM" do mês corrente no fuso de operação. */
export function mesReferenciaAtual(): string {
  return dataReferenciaDe().slice(0, 7);
}

/** Converte "YYYY-MM-DD" em Date (meia-noite UTC) para comparações estáveis. */
export function dataReferenciaParaDate(referencia: string): Date {
  return new Date(`${referencia}T00:00:00.000Z`);
}

/**
 * Deslocamento do fuso de operação em relação ao UTC, no instante dado.
 *
 * Calculado a partir do próprio Intl em vez de uma constante, porque uma
 * constante "−3h" fica errada silenciosamente se o horário de verão voltar ou
 * se o sistema for lido em outro fuso.
 */
function deslocamentoMs(instante: Date): number {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO_OPERACAO,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instante);
  const get = (tipo: string) => Number(partes.find((p) => p.type === tipo)?.value ?? 0);
  const comoSeFosseUTC = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  );
  return comoSeFosseUTC - instante.getTime();
}

/**
 * Instante UTC em que começa o dia "YYYY-MM-DD" no fuso de operação.
 *
 * Isso importa para qualquer filtro sobre coluna `DateTime`: meia-noite UTC é
 * 21h do dia anterior em Brasília, então um filtro ingênuo joga tudo que foi
 * registrado depois das 21h para o dia seguinte. Quem preencheu o boletim às
 * 21h30 não o encontraria no dia em que trabalhou.
 *
 * A segunda passada corrige o caso de a estimativa cair do outro lado de uma
 * virada de horário de verão.
 */
export function inicioDoDiaLocal(dia: string): Date {
  const palpite = new Date(`${dia}T00:00:00.000Z`);
  const primeira = new Date(palpite.getTime() - deslocamentoMs(palpite));
  return new Date(palpite.getTime() - deslocamentoMs(primeira));
}

/**
 * Intervalo semiaberto [início, fim) que cobre os dias de `de` até `ate`,
 * inclusive nas duas pontas, medido no fuso de operação.
 */
export function intervaloDeDatas(de: string, ate: string): { inicio: Date; fim: Date } {
  return { inicio: inicioDoDiaLocal(de), fim: inicioDoDiaLocal(somarDias(ate, 1)) };
}

/** Soma (ou subtrai) dias a "YYYY-MM-DD", devolvendo outra data no mesmo formato. */
export function somarDias(dia: string, quantidade: number): string {
  const d = new Date(`${dia}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + quantidade);
  return d.toISOString().slice(0, 10);
}

/** Primeiro dia do mês a que "YYYY-MM-DD" pertence. */
export function primeiroDiaDoMes(dia: string): string {
  return `${dia.slice(0, 7)}-01`;
}

/** Último dia do mês a que "YYYY-MM-DD" pertence. */
export function ultimoDiaDoMes(dia: string): string {
  return `${dia.slice(0, 7)}-${String(diasNoMes(dia.slice(0, 7))).padStart(2, "0")}`;
}

/** Todos os dias de `de` até `ate`, inclusive. */
export function diasDoIntervalo(de: string, ate: string): string[] {
  const lista: string[] = [];
  for (let d = de; d <= ate; d = somarDias(d, 1)) lista.push(d);
  return lista;
}

/** "01/08/2026 a 12/08/2026", ou só "12/08/2026" quando as pontas coincidem. */
export function rotuloIntervalo(de: string, ate: string): string {
  return de === ate
    ? formatarDataReferencia(de)
    : `${formatarDataReferencia(de)} a ${formatarDataReferencia(ate)}`;
}

/**
 * Data escolhida por uma pessoa num campo de calendário, gravada ao MEIO-DIA UTC.
 *
 * Meia-noite UTC parece o natural e está errado: exibida em Brasília (UTC−3),
 * ela volta para o dia anterior. Quem digitou 28 lê 27 no relatório, e um prazo
 * exibido com um dia de diferença do combinado destrói a confiança no número.
 *
 * Meio-dia deixa 12 horas de folga em cada direção, o que cobre qualquer fuso
 * em que este sistema seja lido.
 */
export function dataEscolhidaParaDate(dia: string): Date {
  return new Date(`${dia}T12:00:00.000Z`);
}

/** Primeiro e último instante de um mês "YYYY-MM", no fuso de operação. */
export function intervaloDoMes(mes: string): { inicio: Date; fim: Date } {
  return intervaloDeDatas(`${mes}-01`, ultimoDiaDoMes(`${mes}-01`));
}

/** Quantidade de dias de um mês "YYYY-MM". */
export function diasNoMes(mes: string): number {
  const [ano, mesNum] = mes.split("-").map(Number);
  return new Date(Date.UTC(ano, mesNum, 0)).getUTCDate();
}

/** Lista de "YYYY-MM-DD" de todos os dias de um mês. */
export function diasDoMes(mes: string): string[] {
  const total = diasNoMes(mes);
  return Array.from(
    { length: total },
    (_, i) => `${mes}-${String(i + 1).padStart(2, "0")}`,
  );
}

/** Últimos N meses (mais antigo primeiro), incluindo o mês informado. */
export function ultimosMeses(mesFinal: string, quantidade: number): string[] {
  const [ano, mes] = mesFinal.split("-").map(Number);
  const lista: string[] = [];
  for (let i = quantidade - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(ano, mes - 1 - i, 1));
    lista.push(
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
    );
  }
  return lista;
}

const MESES_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "2026-08" -> "agosto/2026" */
export function rotuloMes(mes: string): string {
  const [ano, mesNum] = mes.split("-").map(Number);
  return `${MESES_PT[mesNum - 1]}/${ano}`;
}

/** "2026-08-09" -> "09/08" */
export function rotuloDiaCurto(referencia: string): string {
  const [, mes, dia] = referencia.split("-");
  return `${dia}/${mes}`;
}

/** "2026-08-09" -> "09/08/2026" */
export function formatarDataReferencia(referencia: string): string {
  const [ano, mes, dia] = referencia.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarData(data: Date | string | null | undefined): string {
  if (!data) return "—";
  const d = typeof data === "string" ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: FUSO_OPERACAO,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatarDataHora(data: Date | string | null | undefined): string {
  if (!data) return "—";
  const d = typeof data === "string" ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: FUSO_OPERACAO,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Valor para <input type="date">, a partir de um DateTime. */
export function paraInputDate(data: Date | string | null | undefined): string {
  if (!data) return "";
  const d = typeof data === "string" ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) return "";
  return dataReferenciaDe(d);
}

/**
 * Dias restantes até o SLA (negativo = atrasado). Compara apenas datas,
 * ignorando horas, para não acusar atraso por causa de minutos.
 */
export function diasAteSLA(
  previsao: Date | string | null | undefined,
  referencia: Date = new Date(),
): number | null {
  if (!previsao) return null;
  const alvo = dataReferenciaParaDate(paraInputDate(previsao));
  const hoje = dataReferenciaParaDate(dataReferenciaDe(referencia));
  if (Number.isNaN(alvo.getTime())) return null;
  return Math.round((alvo.getTime() - hoje.getTime()) / 86_400_000);
}

/** Só a hora, para o quadro do dia — a data já está no título. */
export function formatarHora(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(data);
}
