"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type ItemNav = { href: string; rotulo: string; icone: string };

/**
 * Navegação responsiva: barra inferior fixa no celular (alvos de 44px),
 * barra superior horizontal no desktop.
 */
export function Navegacao({
  itens,
  usuario,
  papel,
  aoSair,
}: {
  itens: ItemNav[];
  usuario: string;
  papel: string;
  aoSair: () => Promise<void>;
}) {
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  const ativo = (href: string) =>
    caminho === href || caminho.startsWith(`${href}/`);

  return (
    <>
      {/* Cabeçalho */}
      <header
        className="sticky top-0 z-30 sem-impressao"
        style={{
          background: "var(--superficie)",
          borderBottom: "1px solid var(--borda)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-14 items-center justify-between gap-3">
            <Link href={itens[0]?.href ?? "/boletim"} className="flex items-center gap-2 min-w-0">
              <span
                className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-white text-xs font-bold"
                style={{ background: "var(--serie-1)" }}
                aria-hidden
              >
                BD
              </span>
              <span className="font-semibold truncate">Boletim Diário</span>
            </Link>

            {/* Navegação desktop */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Principal">
              {itens.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={ativo(item.href) ? "page" : undefined}
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  style={
                    ativo(item.href)
                      ? {
                          background:
                            "color-mix(in srgb, var(--serie-1) 12%, var(--superficie))",
                          color: "var(--serie-1)",
                        }
                      : { color: "var(--tinta-2)" }
                  }
                >
                  {item.rotulo}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right leading-tight">
                <div className="text-sm font-medium truncate max-w-[12rem]">
                  {usuario}
                </div>
                <div className="text-xs" style={{ color: "var(--tinta-3)" }}>
                  {papel}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuAberto((v) => !v)}
                className="botao botao-secundario md:hidden"
                style={{ minHeight: "2.25rem", padding: "0.375rem 0.625rem" }}
                aria-expanded={menuAberto}
                aria-label="Abrir menu da conta"
              >
                ⋯
              </button>
              <form action={aoSair} className="hidden md:block">
                <button
                  type="submit"
                  className="botao botao-secundario"
                  style={{ minHeight: "2.25rem", padding: "0.375rem 0.75rem" }}
                >
                  Sair
                </button>
              </form>
            </div>
          </div>

          {menuAberto ? (
            <div
              className="md:hidden pb-3 pt-1"
              style={{ borderTop: "1px solid var(--grade)" }}
            >
              <div className="pt-2 pb-3">
                <div className="text-sm font-medium">{usuario}</div>
                <div className="text-xs" style={{ color: "var(--tinta-3)" }}>
                  {papel}
                </div>
              </div>
              <form action={aoSair}>
                <button type="submit" className="botao botao-secundario w-full">
                  Sair
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </header>

      {/* Navegação inferior no celular */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden sem-impressao"
        aria-label="Principal"
        style={{
          background: "var(--superficie)",
          borderTop: "1px solid var(--borda)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <ul className="flex">
          {itens.map((item) => (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={ativo(item.href) ? "page" : undefined}
                className="flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[0.6875rem] font-medium"
                style={{
                  color: ativo(item.href) ? "var(--serie-1)" : "var(--tinta-3)",
                }}
              >
                <span aria-hidden className="text-base leading-none">
                  {item.icone}
                </span>
                <span className="truncate max-w-full">{item.rotulo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
