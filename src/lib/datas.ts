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

/** Primeiro e último instante de um mês "YYYY-MM", em UTC. */
export function intervaloDoMes(mes: string): { inicio: Date; fim: Date } {
  const [ano, mesNum] = mes.split("-").map(Number);
  const inicio = new Date(Date.UTC(ano, mesNum - 1, 1, 0, 0, 0, 0));
  const fim = new Date(Date.UTC(ano, mesNum, 1, 0, 0, 0, 0));
  return { inicio, fim };
}

/** Quantidade de dias de um mês "YYYY-MM". */
export function diasNoMes(mes: string): number {
  const [ano, mesNum] = mes.split("-").map(Number);
  return new Date(Date.UTC(ano, mesNum, 0)).getUTCDate();
}

/** Lista de "YYYY-MM-DD" de todos os dias de um mês. */
/**
 * Início e fim de um único dia, em UTC.
 *
 * O `fim` é o começo do dia seguinte, para as consultas usarem `< fim` e não
 * dependerem de precisão de milissegundo no limite.
 */
export function intervaloDoDia(dia: string): { inicio: Date; fim: Date } {
  const inicio = new Date(`${dia}T00:00:00.000Z`);
  const fim = new Date(inicio);
  fim.setUTCDate(fim.getUTCDate() + 1);
  return { inicio, fim };
}

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
