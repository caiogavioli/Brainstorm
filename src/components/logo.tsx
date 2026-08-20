/**
 * Marca DF Síndicos Profissionais.
 *
 * Desenhada em SVG (e não como imagem) para ficar nítida em qualquer tela,
 * herdar as cores da marca e não pesar no carregamento. Para trocar pelo
 * arquivo oficial da agência, substitua os `path`/`rect` deste componente —
 * o resto do sistema só consome `<Logo />` e `<LogoCompleta />`.
 */

export const MARCA_NAVY = "#31455F";
export const MARCA_DOURADO = "#C9A063";

/** Monograma quadrado — cabeçalho e favicon. */
export function Logo({
  tamanho = 32,
  titulo = "DF Síndicos Profissionais",
}: {
  tamanho?: number;
  titulo?: string;
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 100 100"
      role="img"
      aria-label={titulo}
      style={{ display: "block", flex: "none" }}
    >
      <title>{titulo}</title>
      {/* Moldura */}
      <rect
        x="4.5"
        y="4.5"
        width="91"
        height="91"
        fill="none"
        stroke={MARCA_NAVY}
        strokeWidth="9"
      />
      {/* Haste do F — começa na altura do braço de cima, não no topo da
          moldura, para fechar o ângulo reto do F em vez de continuar
          subindo como se fosse só uma linha divisória entre D e F. */}
      <rect x="52" y="26" width="8.5" height="69.5" fill={MARCA_NAVY} />
      {/* Braços do F */}
      <rect x="60.5" y="26" width="26" height="8.5" fill={MARCA_NAVY} />
      <rect x="60.5" y="45" width="20" height="8.5" fill={MARCA_NAVY} />
      {/* D: haste + barriga arredondada, com o furo (contraforma) recortado
          pela mesma peça via fill-rule evenodd — a versão anterior desenhava
          o furo como uma peça branca por cima, e um dos lados dela tinha um
          comando de tamanho zero (h0 em vez de h8), deixando o traço da
          barriga com espessura desigual: reto de um lado, afunilando do
          outro. Com as duas metades (fora e furo) simétricas e no mesmo
          path, a parede fica com a mesma espessura da haste em todo o
          contorno, e o desenho não depende do fundo estar branco. */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 33 H34 A17 17 0 0 1 34 67 H17 Z M25.5 41.5 H34 A8.5 8.5 0 0 1 34 58.5 H25.5 Z"
        fill={MARCA_NAVY}
      />
    </svg>
  );
}

/** Versão empilhada, com a assinatura — telas de entrada. */
export function LogoCompleta({ tamanho = 76 }: { tamanho?: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Logo tamanho={tamanho} titulo="DF Síndicos Profissionais" />
      <span
        style={{
          color: MARCA_DOURADO,
          fontSize: Math.max(11, tamanho * 0.17),
          letterSpacing: "0.06em",
          fontWeight: 500,
        }}
      >
        Síndicos Profissionais
      </span>
    </div>
  );
}
