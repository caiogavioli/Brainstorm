import "server-only";

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import { formatarData } from "@/lib/datas";
import { formatarMoeda, formatarQuantidade } from "@/lib/dinheiro";

/**
 * Geração do PDF do orçamento.
 *
 * Feito com `@react-pdf/renderer`, que monta o documento em Node puro. A
 * alternativa comum — Puppeteer imprimindo uma página — obrigaria a empacotar
 * um Chromium inteiro na função serverless: dezenas de megabytes, partida a
 * frio lenta e um problema recorrente de limite de tamanho na Vercel.
 *
 * O PDF é montado sob demanda a partir dos dados do orçamento, não guardado em
 * disco. Menos coisa para armazenar e nunca sai desatualizado.
 *
 * As fontes são as embutidas no padrão PDF (Helvetica). Elas cobrem o
 * Latin-1 — ou seja, todos os acentos do português — sem precisar embarcar
 * arquivo de fonte nenhum no pacote.
 */

export type DadosPdf = {
  numero: string;
  versao: number;
  titulo: string;
  criadoEm: Date;
  validoAte: Date | null;
  subtotalCentavos: number;
  descontoCentavos: number;
  totalCentavos: number;
  condicoesPagamento: string | null;
  prazoExecucao: string | null;
  observacoes: string | null;
  linkPublico: string | null;
  cliente: {
    nome: string;
    contato: string | null;
    email: string;
    telefone: string | null;
    documento: string | null;
    endereco: string | null;
  };
  itens: {
    descricao: string;
    detalhe: string | null;
    unidade: string;
    quantidadeMilesimos: number;
    valorUnitarioCentavos: number;
    totalCentavos: number;
  }[];
  empresa: {
    nome: string;
    documento: string | null;
    endereco: string | null;
    telefone: string | null;
    email: string | null;
  };
};

const TINTA = "#0b0b0b";
const TINTA_2 = "#52514e";
const TINTA_3 = "#898781";
const GRADE = "#e1e0d9";
const DESTAQUE = "#2a78d6";

const e = StyleSheet.create({
  pagina: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: TINTA,
  },

  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: DESTAQUE,
    paddingBottom: 10,
    marginBottom: 14,
  },
  empresaNome: { fontSize: 15, fontFamily: "Helvetica-Bold" },
  empresaLinha: { fontSize: 8, color: TINTA_2, marginTop: 2 },
  numeroCaixa: { alignItems: "flex-end" },
  numeroRotulo: { fontSize: 7, color: TINTA_3, letterSpacing: 1 },
  numero: { fontSize: 15, fontFamily: "Helvetica-Bold", color: DESTAQUE },

  titulo: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 10 },

  secaoRotulo: {
    fontSize: 7,
    color: TINTA_3,
    letterSpacing: 1,
    marginBottom: 3,
    fontFamily: "Helvetica-Bold",
  },

  blocos: { flexDirection: "row", gap: 16, marginBottom: 14 },
  bloco: { flex: 1 },
  linha: { fontSize: 9, marginBottom: 1.5 },
  linhaFraca: { fontSize: 8, color: TINTA_2, marginBottom: 1.5 },

  // Tabela de itens
  thead: {
    flexDirection: "row",
    backgroundColor: "#f2f2ee",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: GRADE,
  },
  tr: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: GRADE,
  },
  th: { fontSize: 7, color: TINTA_2, fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
  cItem: { width: 22 },
  cDescricao: { flex: 1, paddingRight: 6 },
  cQtde: { width: 58, textAlign: "right" },
  cValor: { width: 68, textAlign: "right" },
  cTotal: { width: 74, textAlign: "right" },
  detalhe: { fontSize: 7.5, color: TINTA_2, marginTop: 1.5 },

  // Totais
  totais: { alignItems: "flex-end", marginTop: 10 },
  totalLinha: { flexDirection: "row", width: 220, justifyContent: "space-between", paddingVertical: 2 },
  totalFinal: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: TINTA,
    marginTop: 4,
    paddingTop: 5,
  },
  totalFinalTexto: { fontSize: 12, fontFamily: "Helvetica-Bold" },

  condicoes: { marginTop: 18, gap: 9 },
  texto: { fontSize: 9, color: TINTA_2, lineHeight: 1.4 },

  aviso: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#f2f2ee",
    borderLeftWidth: 2,
    borderLeftColor: DESTAQUE,
  },
  avisoTexto: { fontSize: 8, color: TINTA_2, lineHeight: 1.4 },
  link: { fontSize: 8, color: DESTAQUE, marginTop: 3 },

  rodape: {
    position: "absolute",
    bottom: 26,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: GRADE,
    paddingTop: 6,
  },
  rodapeTexto: { fontSize: 7, color: TINTA_3 },
});

function DocumentoOrcamento({ dados }: { dados: DadosPdf }) {
  const { cliente, empresa } = dados;

  return (
    <Document
      title={`Orçamento ${dados.numero}`}
      author={empresa.nome}
      subject={dados.titulo}
    >
      <Page size="A4" style={e.pagina}>
        <View style={e.cabecalho} fixed>
          <View>
            <Text style={e.empresaNome}>{empresa.nome}</Text>
            {empresa.documento ? (
              <Text style={e.empresaLinha}>CNPJ {empresa.documento}</Text>
            ) : null}
            {empresa.endereco ? (
              <Text style={e.empresaLinha}>{empresa.endereco}</Text>
            ) : null}
            {empresa.telefone || empresa.email ? (
              <Text style={e.empresaLinha}>
                {[empresa.telefone, empresa.email].filter(Boolean).join("  ·  ")}
              </Text>
            ) : null}
          </View>

          <View style={e.numeroCaixa}>
            <Text style={e.numeroRotulo}>ORÇAMENTO</Text>
            <Text style={e.numero}>
              {dados.numero}
              {dados.versao > 1 ? ` v${dados.versao}` : ""}
            </Text>
            <Text style={e.empresaLinha}>Emissão: {formatarData(dados.criadoEm)}</Text>
            {dados.validoAte ? (
              <Text style={e.empresaLinha}>
                Válido até: {formatarData(dados.validoAte)}
              </Text>
            ) : null}
          </View>
        </View>

        <Text style={e.titulo}>{dados.titulo}</Text>

        <View style={e.blocos}>
          <View style={e.bloco}>
            <Text style={e.secaoRotulo}>CLIENTE</Text>
            <Text style={e.linha}>{cliente.nome}</Text>
            {cliente.documento ? (
              <Text style={e.linhaFraca}>{cliente.documento}</Text>
            ) : null}
            {cliente.endereco ? (
              <Text style={e.linhaFraca}>{cliente.endereco}</Text>
            ) : null}
          </View>
          <View style={e.bloco}>
            <Text style={e.secaoRotulo}>CONTATO</Text>
            {cliente.contato ? <Text style={e.linha}>{cliente.contato}</Text> : null}
            <Text style={e.linhaFraca}>{cliente.email}</Text>
            {cliente.telefone ? (
              <Text style={e.linhaFraca}>{cliente.telefone}</Text>
            ) : null}
          </View>
        </View>

        <Text style={e.secaoRotulo}>ITENS</Text>
        <View style={e.thead}>
          <Text style={[e.th, e.cItem]}>#</Text>
          <Text style={[e.th, e.cDescricao]}>DESCRIÇÃO</Text>
          <Text style={[e.th, e.cQtde]}>QTDE.</Text>
          <Text style={[e.th, e.cValor]}>VALOR UNIT.</Text>
          <Text style={[e.th, e.cTotal]}>TOTAL</Text>
        </View>

        {dados.itens.map((item, i) => (
          // `wrap={false}` mantém a linha inteira na mesma página: uma
          // descrição partida ao meio com o valor na página seguinte é o tipo
          // de detalhe que faz o documento parecer improvisado.
          <View key={i} style={e.tr} wrap={false}>
            <Text style={e.cItem}>{i + 1}</Text>
            <View style={e.cDescricao}>
              <Text>{item.descricao}</Text>
              {item.detalhe ? <Text style={e.detalhe}>{item.detalhe}</Text> : null}
            </View>
            <Text style={e.cQtde}>
              {formatarQuantidade(item.quantidadeMilesimos)} {item.unidade}
            </Text>
            <Text style={e.cValor}>{formatarMoeda(item.valorUnitarioCentavos)}</Text>
            <Text style={e.cTotal}>{formatarMoeda(item.totalCentavos)}</Text>
          </View>
        ))}

        <View style={e.totais} wrap={false}>
          {dados.descontoCentavos > 0 ? (
            <>
              <View style={e.totalLinha}>
                <Text style={{ color: TINTA_2 }}>Subtotal</Text>
                <Text>{formatarMoeda(dados.subtotalCentavos)}</Text>
              </View>
              <View style={e.totalLinha}>
                <Text style={{ color: TINTA_2 }}>Desconto</Text>
                <Text>− {formatarMoeda(dados.descontoCentavos)}</Text>
              </View>
            </>
          ) : null}
          <View style={e.totalFinal}>
            <Text style={e.totalFinalTexto}>TOTAL</Text>
            <Text style={e.totalFinalTexto}>{formatarMoeda(dados.totalCentavos)}</Text>
          </View>
        </View>

        <View style={e.condicoes}>
          {dados.condicoesPagamento ? (
            <View>
              <Text style={e.secaoRotulo}>CONDIÇÕES DE PAGAMENTO</Text>
              <Text style={e.texto}>{dados.condicoesPagamento}</Text>
            </View>
          ) : null}
          {dados.prazoExecucao ? (
            <View>
              <Text style={e.secaoRotulo}>PRAZO DE EXECUÇÃO</Text>
              <Text style={e.texto}>{dados.prazoExecucao}</Text>
            </View>
          ) : null}
          {dados.observacoes ? (
            <View>
              <Text style={e.secaoRotulo}>OBSERVAÇÕES</Text>
              <Text style={e.texto}>{dados.observacoes}</Text>
            </View>
          ) : null}
        </View>

        {dados.linkPublico ? (
          <View style={e.aviso} wrap={false}>
            <Text style={e.avisoTexto}>
              Para aceitar, recusar ou pedir um ajuste neste orçamento, acesse:
            </Text>
            <Text style={e.link}>{dados.linkPublico}</Text>
          </View>
        ) : null}

        <View style={e.rodape} fixed>
          <Text style={e.rodapeTexto}>
            {empresa.nome} · Orçamento {dados.numero}
          </Text>
          <Text
            style={e.rodapeTexto}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

/** Monta o PDF e devolve os bytes. */
export async function gerarPdfOrcamento(dados: DadosPdf): Promise<Buffer> {
  return renderToBuffer(<DocumentoOrcamento dados={dados} />);
}

/**
 * Nome do arquivo baixado: "orcamento-2026-0007.pdf".
 *
 * O número do orçamento já é seguro para nome de arquivo (dígitos e hífen), mas
 * a filtragem fica de pé como rede: ele passa por um cabeçalho HTTP, e uma
 * aspa ou quebra de linha ali seria injeção de cabeçalho.
 */
export function nomeArquivoPdf(numero: string, versao: number): string {
  const limpo = numero.replace(/[^A-Za-z0-9-]/g, "");
  return `orcamento-${limpo}${versao > 1 ? `-v${versao}` : ""}.pdf`;
}
