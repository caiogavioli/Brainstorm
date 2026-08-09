import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { Papel } from "@prisma/client";

import { prisma } from "@/lib/db";

const COOKIE_SESSAO = "condo_sessao";
const DURACAO_SESSAO_SEGUNDOS = 60 * 60 * 12; // 12 horas

// Hash bcrypt válido de uma senha aleatória, usado só para igualar o tempo de
// resposta quando o e-mail não existe (defesa contra enumeração por timing).
const HASH_DESCARTE =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export type Sessao = {
  usuarioId: number;
  nome: string;
  email: string;
  papel: Papel;
  /** Condomínios que o usuário pode operar. Vazio + ADMIN = todos. */
  condominios: number[];
};

function segredo(): Uint8Array {
  const valor = process.env.AUTH_SECRET;
  if (!valor || valor.length < 16) {
    throw new Error(
      "AUTH_SECRET ausente ou muito curto. Defina-o no .env (openssl rand -base64 32).",
    );
  }
  return new TextEncoder().encode(valor);
}

export async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, 10);
}

export async function conferirSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}

/** Valida credenciais e grava o cookie de sessão. */
export async function autenticar(
  email: string,
  senha: string,
): Promise<{ ok: true } | { ok: false; erro: string }> {
  const usuario = await prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { acessos: { select: { condominioId: true } } },
  });

  // Mensagem genérica para não revelar quais e-mails existem.
  const generico = { ok: false as const, erro: "E-mail ou senha inválidos." };
  if (!usuario || !usuario.ativo) {
    // Gasta o mesmo tempo de um hash real para não vazar a existência do
    // e-mail por diferença de latência.
    await bcrypt.compare(senha, HASH_DESCARTE);
    return generico;
  }
  if (!(await conferirSenha(senha, usuario.senhaHash))) return generico;

  const sessao: Sessao = {
    usuarioId: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    papel: usuario.papel,
    condominios: usuario.acessos.map((a) => a.condominioId),
  };

  const token = await new SignJWT({ ...sessao })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_SESSAO_SEGUNDOS}s`)
    .sign(segredo());

  const jar = await cookies();
  jar.set(COOKIE_SESSAO, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_SESSAO_SEGUNDOS,
  });

  return { ok: true };
}

export async function encerrarSessao(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_SESSAO);
}

/** Sessão atual, ou null quando não autenticado / token inválido. */
export async function sessaoAtual(): Promise<Sessao | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_SESSAO)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, segredo());
    return {
      usuarioId: Number(payload.usuarioId),
      nome: String(payload.nome),
      email: String(payload.email),
      papel: payload.papel as Papel,
      condominios: Array.isArray(payload.condominios)
        ? (payload.condominios as number[])
        : [],
    };
  } catch {
    return null;
  }
}

/** Exige autenticação; redireciona para o login quando ausente. */
export async function exigirSessao(): Promise<Sessao> {
  const sessao = await sessaoAtual();
  if (!sessao) redirect("/login");
  return sessao;
}

/** Exige papel ADMIN (painel administrativo e dashboard gerencial). */
export async function exigirAdmin(): Promise<Sessao> {
  const sessao = await exigirSessao();
  if (sessao.papel !== "ADMIN") redirect("/boletim");
  return sessao;
}

/** IDs de condomínio que a sessão pode ler/escrever (null = todos). */
export function escopoCondominios(sessao: Sessao): number[] | null {
  return sessao.papel === "ADMIN" ? null : sessao.condominios;
}

/**
 * Cláusula `where` do Prisma filtrada pelo escopo do usuário.
 *
 * O condomínio pedido é sempre INTERSECTADO com o escopo — nunca aplicado
 * sozinho. Sem isso, trocar `?condominio=` na URL leria dados de um prédio ao
 * qual o usuário não tem acesso. Quando o pedido cai fora do escopo, devolve
 * um filtro que não casa com nada, em vez de ignorar o parâmetro.
 */
export function filtroCondominio(
  sessao: Sessao,
  condominioId?: number | null,
): { condominioId?: number | { in: number[] } } {
  const escopo = escopoCondominios(sessao);

  if (condominioId != null) {
    if (escopo === null) return { condominioId };
    return escopo.includes(condominioId)
      ? { condominioId }
      : { condominioId: { in: [] } };
  }

  return escopo ? { condominioId: { in: escopo } } : {};
}

/** Garante que a sessão pode operar o condomínio informado. */
export function podeAcessarCondominio(sessao: Sessao, condominioId: number): boolean {
  const escopo = escopoCondominios(sessao);
  return escopo === null || escopo.includes(condominioId);
}

export async function exigirAcessoCondominio(
  sessao: Sessao,
  condominioId: number,
): Promise<void> {
  if (!podeAcessarCondominio(sessao, condominioId)) {
    throw new Error("Sem permissão para acessar este condomínio.");
  }
}

/** Condomínios visíveis para a sessão, ordenados por nome. */
export async function condominiosDaSessao(sessao: Sessao) {
  const escopo = escopoCondominios(sessao);
  return prisma.condominio.findMany({
    where: {
      ativo: true,
      ...(escopo ? { id: { in: escopo } } : {}),
    },
    orderBy: { nome: "asc" },
  });
}
