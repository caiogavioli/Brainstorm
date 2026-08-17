/**
 * Dinheiro e quantidades do módulo de orçamentos.
 *
 * Regra do projeto: **nada aqui usa ponto flutuante**.
 *
 * `0.1 + 0.2` não dá `0.3` em nenhuma linguagem que represente decimais em
 * binário, e JavaScript não é exceção. Num orçamento de trinta linhas, isso
 * fecha o total com um ou dois centavos de diferença da soma na calculadora do
 * cliente — que é exatamente o tipo de erro que destrói a confiança no
 * documento inteiro.
 *
 * Então:
 * - dinheiro é **inteiro em centavos** (`12345` = R$ 123,45);
 * - quantidade é **inteiro em milésimos** (`1500` = 1,5), o que cobre meia
 *   hora, 2,5 m² e 0,25 de diária sem precisar de decimal.
 *
 * A conversão para texto acontece só na borda: ao mostrar na tela e ao ler o
 * que a pessoa digitou.
 */

/** Quantos milésimos formam uma unidade. */
const MILESIMOS = 1000;

// ---------------------------------------------------------------------------
// Exibição
// ---------------------------------------------------------------------------

const FORMATO_MOEDA = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** `12345` -> `"R$ 123,45"` */
export function formatarMoeda(centavos: number): string {
  return FORMATO_MOEDA.format(centavos / 100);
}

/**
 * `12345` -> `"123,45"` — sem o símbolo, para dentro de campos de formulário.
 *
 * Sempre com duas casas: um campo que mostra "1500" quando o valor é R$ 1.500,00
 * convida a pessoa a reler como mil e quinhentos centavos.
 */
export function centavosParaCampo(centavos: number): string {
  const sinal = centavos < 0 ? "-" : "";
  const absoluto = Math.abs(centavos);
  return `${sinal}${Math.trunc(absoluto / 100)},${String(absoluto % 100).padStart(2, "0")}`;
}

/** `1500` -> `"1,5"`; `1000` -> `"1"`. Sem zeros à direita inúteis. */
export function formatarQuantidade(milesimos: number): string {
  const inteiro = Math.trunc(milesimos / MILESIMOS);
  const resto = Math.abs(milesimos % MILESIMOS);
  if (resto === 0) return String(inteiro);
  const casas = String(resto).padStart(3, "0").replace(/0+$/, "");
  const sinal = milesimos < 0 && inteiro === 0 ? "-" : "";
  return `${sinal}${inteiro},${casas}`;
}

// ---------------------------------------------------------------------------
// Leitura do que a pessoa digitou
// ---------------------------------------------------------------------------

/**
 * Texto livre -> centavos, ou `null` quando não dá para entender.
 *
 * Aceita o que uma pessoa realmente digita num campo de preço:
 * `"1.234,56"`, `"1234,56"`, `"R$ 1.234,56"`, `"1234.56"`, `"1234"`.
 *
 * A ambiguidade real é o ponto: em `"1.234"` ele separa milhar (mil duzentos e
 * trinta e quatro), em `"1.23"` ele é decimal. A regra abaixo decide pelo
 * formato — ponto seguido de exatamente 3 dígitos e sem vírgula depois é
 * milhar; qualquer outro ponto é decimal. É a leitura que acerta os dois casos
 * que aparecem de verdade em orçamento brasileiro.
 */
export function lerMoeda(texto: string): number | null {
  const limpo = texto.replace(/[R$\s ]/gi, "").trim();
  if (limpo === "") return null;

  const negativo = limpo.startsWith("-");
  let corpo = negativo ? limpo.slice(1) : limpo;

  if (!/^[\d.,]+$/.test(corpo)) return null;

  if (corpo.includes(",")) {
    // Vírgula presente: ela é a decimal, e todo ponto é separador de milhar.
    corpo = corpo.replace(/\./g, "");
    if ((corpo.match(/,/g) ?? []).length > 1) return null;
    corpo = corpo.replace(",", ".");
  } else {
    // Só pontos. Vira milhar quando TODOS os grupos após o primeiro ponto têm
    // exatamente 3 dígitos ("1.234", "1.234.567"); caso contrário é decimal.
    const partes = corpo.split(".");
    if (partes.length > 1) {
      const todosMilhar = partes.slice(1).every((p) => /^\d{3}$/.test(p));
      if (todosMilhar) corpo = partes.join("");
      else if (partes.length > 2) return null;
    }
  }

  const numero = Number(corpo);
  if (!Number.isFinite(numero)) return null;

  // `Math.round` fecha o arredondamento aqui, no único ponto do sistema em que
  // um decimal existe — daqui para dentro é tudo inteiro.
  const centavos = Math.round(numero * 100);
  return negativo ? -centavos : centavos;
}

/**
 * Texto livre -> milésimos, ou `null` quando não dá para entender.
 * Aceita `"1"`, `"1,5"`, `"1.5"`, `"0,25"`. Não aceita negativo: quantidade
 * negativa em orçamento é sempre erro de digitação, e passar batido vira
 * desconto invisível no total.
 */
export function lerQuantidade(texto: string): number | null {
  const limpo = texto.replace(/[\s ]/g, "").replace(",", ".");
  if (limpo === "" || !/^\d*\.?\d*$/.test(limpo) || limpo === ".") return null;

  const numero = Number(limpo);
  if (!Number.isFinite(numero) || numero < 0) return null;

  return Math.round(numero * MILESIMOS);
}

// ---------------------------------------------------------------------------
// Cálculo
// ---------------------------------------------------------------------------

/**
 * Total de uma linha: quantidade × valor unitário, em centavos.
 *
 * O arredondamento é por linha, e de propósito. Somar totais não arredondados e
 * arredondar só no fim produz um total que não bate com a soma das linhas que o
 * cliente vê impressas — e ele confere justamente assim, somando a coluna.
 * Melhor um centavo de diferença em relação à matemática exata do que uma
 * coluna que não fecha na frente de quem vai pagar.
 */
export function totalLinhaCentavos(
  quantidadeMilesimos: number,
  valorUnitarioCentavos: number,
): number {
  return Math.round((quantidadeMilesimos * valorUnitarioCentavos) / MILESIMOS);
}

/** Soma dos totais de linha. */
export function somarLinhas(
  linhas: { quantidadeMilesimos: number; valorUnitarioCentavos: number }[],
): number {
  return linhas.reduce(
    (soma, l) => soma + totalLinhaCentavos(l.quantidadeMilesimos, l.valorUnitarioCentavos),
    0,
  );
}
