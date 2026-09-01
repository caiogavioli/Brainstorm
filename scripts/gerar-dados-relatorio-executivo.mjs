#!/usr/bin/env node
/**
 * Busca um período em /api/relatorio-executivo e imprime, em stdout, o
 * `const DATA = {...};` pronto pra colar no relatório executivo publicado
 * (o artifact em claude.ai/code) — mesma transformação usada na primeira
 * versão do relatório (24-31/08/2026), agora reaproveitável todo mês.
 *
 * Uso:
 *   RELATORIO_API_TOKEN=... NODE_USE_ENV_PROXY=1 \
 *     node scripts/gerar-dados-relatorio-executivo.mjs 2026-09-01 2026-09-30 \
 *     [--url https://boletiminformativodiario-liart-psi.vercel.app]
 *
 * Sem --url, usa a URL de produção conhecida. O token nunca é impresso.
 *
 * NODE_USE_ENV_PROXY=1 é obrigatório em ambientes que só saem à internet por
 * HTTPS_PROXY (como uma sessão do Claude Code) — o fetch nativo do Node não
 * lê HTTPS_PROXY sozinho, diferente do curl; sem essa flag a chamada falha
 * com "Host not in allowlist" mesmo com o domínio liberado.
 */

const DEFAULT_URL = "https://boletiminformativodiario-liart-psi.vercel.app";

function erro(msg) {
  console.error(`Erro: ${msg}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const posicionais = args.filter((a) => !a.startsWith("--"));
const [de, ate] = posicionais;
const urlIdx = args.indexOf("--url");
const baseUrl = urlIdx >= 0 ? args[urlIdx + 1] : DEFAULT_URL;

if (!de || !ate || !/^\d{4}-\d{2}-\d{2}$/.test(de) || !/^\d{4}-\d{2}-\d{2}$/.test(ate)) {
  erro("informe `de` e `ate` no formato YYYY-MM-DD como argumentos posicionais.");
}
const token = process.env.RELATORIO_API_TOKEN;
if (!token) erro("defina RELATORIO_API_TOKEN no ambiente.");

function somarDias(dataISO, quantidade) {
  const d = new Date(`${dataISO}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + quantidade);
  return d.toISOString().slice(0, 10);
}

/** Mesma janela de dias, um mês antes (para o card de comparativo). */
function periodoAnteriorDe(de, ate) {
  const deAnt = new Date(`${de}T00:00:00.000Z`);
  deAnt.setUTCMonth(deAnt.getUTCMonth() - 1);
  const ateAnt = new Date(`${ate}T00:00:00.000Z`);
  ateAnt.setUTCMonth(ateAnt.getUTCMonth() - 1);
  return { de: deAnt.toISOString().slice(0, 10), ate: ateAnt.toISOString().slice(0, 10) };
}

async function buscar(deQ, ateQ) {
  const url = `${baseUrl}/api/relatorio-executivo?de=${deQ}&ate=${ateQ}`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) {
    const corpo = await resp.text().catch(() => "");
    erro(`${resp.status} de ${url} — ${corpo.slice(0, 300)}`);
  }
  return resp.json();
}

function ddmm(iso) {
  if (!iso) return null;
  return iso.slice(8, 10) + "/" + iso.slice(5, 7);
}
function ddmmyyyy(iso) {
  if (!iso) return null;
  return iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4);
}

function transformar(raw) {
  const dash = raw.dashboard;
  const ocorrencias = raw.ocorrencias.map((o) => ({
    id: o.id,
    data: ddmm(o.dataAbertura),
    condominio: o.condominio.nome,
    setor: o.checklistItem ? o.checklistItem.nome : (o.setorLivre || "—"),
    criticidade: o.criticidade,
    status: o.status,
    desc: o.descricao,
    conclusao: ddmm(o.dataConclusao),
  }));
  const filaPrioridade = dash.filaPrioridade.map((p) => ({
    condominio: p.condominio,
    setor: p.setor,
    desc: p.descricao,
    criticidade: p.criticidade,
    status: p.status,
    previsao: p.previsaoFinalizacao ? ddmmyyyy(p.previsaoFinalizacao) : null,
  }));
  const porCondominio = dash.porCondominio.map((c) => ({
    nome: c.nome, boletins: c.boletins, boletinsEsperados: c.boletinsEsperados,
    diasConformes: c.diasConformes, ocorrencias: c.ocorrencias, criticas: c.criticas,
    emAberto: c.emAberto, atrasadas: c.atrasadas,
  }));
  const quadroPreenchimento = dash.quadroPreenchimento.map((q) => ({
    nome: q.nome, luz: q.luz, diasEsperados: q.diasEsperados, diasPreenchidos: q.diasPreenchidos,
    semPlano: q.semPlano, naoConformes: q.naoConformes,
  }));
  return {
    periodo: dash.periodo,
    kpis: dash.kpis,
    distribuicaoStatusDia: dash.distribuicaoStatusDia,
    porSetor: dash.porSetor,
    linhaDoTempo: dash.linhaDoTempo.pontos.map((p) => ({ d: p.rotulo, v: p.ocorrencias })),
    historicoMensal: dash.historicoMensal.map((m) => ({ mes: m.rotuloCurto, abertas: m.abertas, concluidas: m.concluidas })),
    matrizRisco: dash.matrizRisco.map((r) => ({ criticidade: r.criticidade, ...r.celulas, total: r.total })),
    porCondominio,
    quadroPreenchimento,
    planosPorStatus: dash.planosPorStatus,
    totalPlanos: dash.totalPlanos,
    filaPrioridade,
    ocorrencias,
    totalCondominios: raw.condominios.length,
    geradoEm: raw.geradoEm,
  };
}

const [principal, anterior] = await Promise.all([
  buscar(de, ate),
  buscar(...Object.values(periodoAnteriorDe(de, ate))),
]);

const data = transformar(principal);
data.periodoAnterior = {
  periodo: anterior.dashboard.periodo,
  kpis: anterior.dashboard.kpis,
};

process.stdout.write("const DATA = " + JSON.stringify(data) + ";\n");
