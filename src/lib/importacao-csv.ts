/**
 * Leitor de CSV mínimo, sem dependência externa.
 *
 * Cobre o que uma planilha exportada do Excel, Numbers ou Google Sheets produz:
 * campos entre aspas quando têm vírgula ou aspas dentro, quebras de linha CRLF
 * ou LF, e o BOM que o Excel do Windows costuma gravar no início do arquivo.
 * Não cobre delimitador diferente de vírgula — quem exportar com `;` precisa
 * trocar para `,` antes de enviar.
 *
 * Roda igual no navegador e no servidor: nenhuma das duas pontas confia
 * cegamente na outra. O cliente usa isto para mostrar uma prévia instantânea,
 * sem round-trip; o servidor recebe as LINHAS JÁ INTERPRETADAS (não o texto
 * bruto) e valida de novo antes de gravar — o mesmo padrão do resto do
 * sistema, em que o cliente valida para dar feedback rápido e o servidor
 * valida porque é quem decide o que é verdade.
 */

export type LinhaCsv = Record<string, string>;

export function analisarCsv(textoBruto: string): { cabecalho: string[]; linhas: LinhaCsv[] } {
  const texto = textoBruto.replace(/^\uFEFF/, ""); // BOM do Excel/Windows
  const linhasBrutas = dividirCamposCsv(texto);
  if (linhasBrutas.length === 0) return { cabecalho: [], linhas: [] };

  const cabecalho = linhasBrutas[0].map(normalizarCabecalho);
  const linhas = linhasBrutas
    .slice(1)
    .filter((campos) => campos.some((c) => c.trim() !== ""))
    .map((campos) => {
      const linha: LinhaCsv = {};
      cabecalho.forEach((chave, i) => {
        linha[chave] = (campos[i] ?? "").trim();
      });
      return linha;
    });

  return { cabecalho, linhas };
}

/** "Gerente Responsável" -> "gerente_responsavel": sem acento, sem espaço. */
function normalizarCabecalho(coluna: string): string {
  return coluna
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove os acentos que o NFD separou
    .replace(/\s+/g, "_");
}

/** Percorre caractere a caractere — um `split(",")` ingênuo quebraria um
 *  endereço como `"Rua A, 100"` em dois campos. */
function dividirCamposCsv(texto: string): string[][] {
  const linhas: string[][] = [];
  let linhaAtual: string[] = [];
  let campo = "";
  let dentroDeAspas = false;

  const normalizado = texto.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < normalizado.length; i++) {
    const c = normalizado[i];

    if (dentroDeAspas) {
      if (c === '"') {
        if (normalizado[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          dentroDeAspas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') dentroDeAspas = true;
    else if (c === ",") {
      linhaAtual.push(campo);
      campo = "";
    } else if (c === "\n") {
      linhaAtual.push(campo);
      linhas.push(linhaAtual);
      linhaAtual = [];
      campo = "";
    } else campo += c;
  }

  // Última linha, mesmo sem quebra final. Se o arquivo terminava em "\n", esta
  // linha extra fica só com campos vazios e é descartada pelo filtro acima.
  if (normalizado.length > 0) {
    linhaAtual.push(campo);
    linhas.push(linhaAtual);
  }

  return linhas;
}
