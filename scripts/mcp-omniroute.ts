/**
 * omniroute — servidor MCP somente leitura para o sistema de boletim.
 *
 * Expõe condomínios, boletins, ocorrências e planos de ação via Model
 * Context Protocol, para que um cliente de IA (Claude Code, Claude
 * Desktop, etc.) consulte os dados do sistema sem precisar do login web.
 *
 * Comunicação por stdio — sem porta HTTP, sem exposição além do processo
 * que o inicia. Conecta direto no Postgres via `DATABASE_URL`, os mesmos
 * dados do app, sem nenhuma rota nova no Next.
 *
 * Somente leitura de propósito: um cliente de IA não deve escrever no
 * boletim de produção. Quem preenche o boletim é o formulário público.
 *
 * Uso:
 *   DATABASE_URL=postgresql://... npm run mcp:omniroute
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

function textoJson(dado: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(dado, null, 2) }] };
}

const server = new McpServer({
  name: "omniroute",
  version: "1.0.0",
});

server.tool(
  "listar_condominios",
  "Lista os condomínios cadastrados no sistema, com nome, endereço e responsável.",
  {
    apenasAtivos: z
      .boolean()
      .default(true)
      .describe("Quando true (padrão), omite condomínios desativados."),
  },
  async ({ apenasAtivos }) => {
    const condominios = await prisma.condominio.findMany({
      where: apenasAtivos ? { ativo: true } : {},
      orderBy: { nome: "asc" },
    });
    return textoJson(condominios);
  },
);

server.tool(
  "listar_boletins",
  "Lista boletins diários, com status geral, faltas de equipe e quem preencheu. Filtra por condomínio e por intervalo de dataReferencia (YYYY-MM-DD).",
  {
    condominioId: z.number().int().optional().describe("Restringe a um único condomínio."),
    de: z.string().optional().describe("Data de referência inicial, formato YYYY-MM-DD."),
    ate: z.string().optional().describe("Data de referência final, formato YYYY-MM-DD."),
  },
  async ({ condominioId, de, ate }) => {
    const boletins = await prisma.boletim.findMany({
      where: {
        ...(condominioId != null ? { condominioId } : {}),
        ...(de || ate
          ? { dataReferencia: { ...(de ? { gte: de } : {}), ...(ate ? { lte: ate } : {}) } }
          : {}),
      },
      orderBy: { dataReferencia: "desc" },
      select: {
        id: true,
        dataReferencia: true,
        dataRegistro: true,
        statusGeral: true,
        houveFaltas: true,
        qtdeFaltas: true,
        setoresFaltas: true,
        preenchidoPor: true,
        condominioId: true,
        condominio: { select: { nome: true } },
      },
    });
    return textoJson(boletins);
  },
);

server.tool(
  "obter_boletim",
  "Retorna um boletim específico com todos os itens do checklist e as ocorrências que ele gerou.",
  {
    id: z.number().int().describe("ID do boletim."),
  },
  async ({ id }) => {
    const boletim = await prisma.boletim.findUnique({
      where: { id },
      include: {
        condominio: { select: { nome: true } },
        itens: {
          include: { checklistItem: { select: { nome: true, grupo: true } } },
          orderBy: { checklistItem: { ordem: "asc" } },
        },
        ocorrencias: { select: { id: true, descricao: true, criticidade: true, status: true } },
      },
    });
    if (!boletim) return textoJson({ erro: `Boletim ${id} não encontrado.` });
    return textoJson(boletim);
  },
);

server.tool(
  "listar_ocorrencias",
  "Lista ocorrências (não conformidades), com filtros por condomínio, status, criticidade e intervalo de abertura.",
  {
    condominioId: z.number().int().optional(),
    status: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"]).optional(),
    criticidade: z.enum(["BAIXA", "MEDIA", "ALTA"]).optional(),
    de: z.string().optional().describe("Data de abertura inicial, formato YYYY-MM-DD."),
    ate: z.string().optional().describe("Data de abertura final, formato YYYY-MM-DD."),
  },
  async ({ condominioId, status, criticidade, de, ate }) => {
    const inicio = de ? new Date(`${de}T00:00:00`) : undefined;
    const fim = ate ? new Date(`${ate}T23:59:59.999`) : undefined;
    const ocorrencias = await prisma.ocorrencia.findMany({
      where: {
        ...(condominioId != null ? { condominioId } : {}),
        ...(status ? { status } : {}),
        ...(criticidade ? { criticidade } : {}),
        ...(inicio || fim
          ? { dataAbertura: { ...(inicio ? { gte: inicio } : {}), ...(fim ? { lte: fim } : {}) } }
          : {}),
      },
      orderBy: [{ criticidade: "desc" }, { dataAbertura: "desc" }],
      select: {
        id: true,
        dataAbertura: true,
        descricao: true,
        criticidade: true,
        status: true,
        previsaoFinalizacao: true,
        dataConclusao: true,
        condominioId: true,
        condominio: { select: { nome: true } },
        checklistItem: { select: { nome: true } },
        setorLivre: true,
        totalRecorrencias: true,
      },
    });
    return textoJson(ocorrencias);
  },
);

server.tool(
  "obter_ocorrencia",
  "Retorna uma ocorrência específica com histórico de atualizações, fotos e recorrências (dias em que o mesmo problema reapareceu).",
  {
    id: z.number().int().describe("ID da ocorrência."),
  },
  async ({ id }) => {
    const ocorrencia = await prisma.ocorrencia.findUnique({
      where: { id },
      include: {
        condominio: { select: { nome: true } },
        checklistItem: { select: { nome: true, grupo: true } },
        fotos: true,
        historico: { orderBy: { criadoEm: "desc" } },
        recorrencias: { orderBy: { dataReferencia: "desc" } },
      },
    });
    if (!ocorrencia) return textoJson({ erro: `Ocorrência ${id} não encontrada.` });
    return textoJson(ocorrencia);
  },
);

server.tool(
  "listar_planos_acao",
  "Lista os planos de ação (projetos de longo prazo e visitas operacionais) de um ou todos os condomínios.",
  {
    condominioId: z.number().int().optional(),
    status: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"]).optional(),
  },
  async ({ condominioId, status }) => {
    const planos = await prisma.planoAcao.findMany({
      where: {
        ...(condominioId != null ? { condominioId } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: [{ criticidade: "desc" }, { previsaoFinalizacao: "asc" }],
      include: { condominio: { select: { nome: true } } },
    });
    return textoJson(planos);
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
