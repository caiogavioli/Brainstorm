import "server-only";

import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/db";
import { carregarDashboard } from "@/lib/consultas/dashboard";
import { intervaloDeDatas } from "@/lib/datas";

export const dynamic = "force-dynamic";

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Compara em tempo constante e falha fechado: sem `RELATORIO_API_TOKEN`
 * configurado no ambiente, nenhuma requisição passa — nunca "sem token
 * configurado = liberado".
 */
function tokenValido(recebido: string | null): boolean {
  const esperado = process.env.RELATORIO_API_TOKEN;
  if (!esperado || esperado.length < 16 || !recebido) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Endpoint só de leitura para alimentar o relatório executivo (Claude/外部).
 * Não usa a sessão de cookie do app (`lib/auth.ts`) — é pensado para ser
 * chamado fora de um navegador logado, por isso o token próprio via header
 * `Authorization: Bearer <RELATORIO_API_TOKEN>`. Sempre vê todos os
 * condomínios (nunca fica restrito ao escopo de um usuário): quem detém o
 * token já teria que ser confiável com o negócio inteiro.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;
  if (!tokenValido(bearer)) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const de = searchParams.get("de");
  const ate = searchParams.get("ate");
  const condominioIdParam = searchParams.get("condominioId");

  if (!de || !ate || !FORMATO_DATA.test(de) || !FORMATO_DATA.test(ate)) {
    return NextResponse.json(
      { erro: "Informe `de` e `ate` no formato YYYY-MM-DD (ex.: ?de=2026-09-01&ate=2026-09-30)." },
      { status: 400 },
    );
  }
  if (de > ate) {
    return NextResponse.json({ erro: "`de` não pode ser depois de `ate`." }, { status: 400 });
  }

  let condominioId: number | null = null;
  if (condominioIdParam) {
    condominioId = Number(condominioIdParam);
    if (!Number.isInteger(condominioId) || condominioId <= 0) {
      return NextResponse.json({ erro: "`condominioId` inválido." }, { status: 400 });
    }
  }

  const { inicio, fim } = intervaloDeDatas(de, ate);

  const [dashboard, condominios, ocorrencias] = await Promise.all([
    carregarDashboard({ condominioId, de, ate, escopo: null }),
    prisma.condominio.findMany({ orderBy: { nome: "asc" } }),
    prisma.ocorrencia.findMany({
      where: {
        ...(condominioId ? { condominioId } : {}),
        dataAbertura: { gte: inicio, lt: fim },
      },
      select: {
        id: true,
        dataAbertura: true,
        dataConclusao: true,
        previsaoFinalizacao: true,
        criticidade: true,
        status: true,
        descricao: true,
        setorLivre: true,
        condominio: { select: { id: true, nome: true } },
        checklistItem: { select: { nome: true, grupo: true } },
      },
      orderBy: { dataAbertura: "asc" },
    }),
  ]);

  return NextResponse.json({
    geradoEm: new Date().toISOString(),
    filtro: { de, ate, condominioId },
    dashboard,
    condominios,
    ocorrencias,
  });
}
