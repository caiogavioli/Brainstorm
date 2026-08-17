import Link from "next/link";
import { notFound } from "next/navigation";

import { exigirAdmin } from "@/lib/auth";
import { formatarData } from "@/lib/datas";
import { formatarMoeda, formatarQuantidade } from "@/lib/dinheiro";
import {
  dadosDaEmpresa,
  linkPublico,
  orcamentoCompleto,
} from "@/lib/orcamentos/consultas";

export const metadata = { title: "Imprimir orçamento — Gestão de Condomínios" };

/**
 * Versão para impressão, aproveitando a classe `.sem-impressao` que o projeto
 * já usa nos boletins.
 *
 * Convive com o PDF em vez de competir: o PDF é o arquivo que vai anexado ao
 * e-mail e tem layout fixo; esta página é para quem quer imprimir na hora, ou
 * conferir na tela sem esperar a geração do arquivo.
 */
export default async function PaginaImprimirOrcamento({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirAdmin();

  const { id } = await params;
  const orcamento = await orcamentoCompleto(Number(id));
  if (!orcamento) notFound();

  const empresa = dadosDaEmpresa();
  const link = orcamento.status === "RASCUNHO" ? null : linkPublico(orcamento.token);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="sem-impressao mb-4 flex flex-wrap gap-2">
        <Link
          href={`/orcamentos/${orcamento.id}`}
          className="text-xs font-semibold underline"
          style={{ color: "var(--serie-1)" }}
        >
          ← Voltar ao orçamento
        </Link>
        <span className="text-xs" style={{ color: "var(--tinta-3)" }}>
          Use Ctrl+P (ou Cmd+P) para imprimir ou salvar em PDF.
        </span>
      </div>

      <article className="card card-pad">
        <header
          className="flex flex-wrap items-start justify-between gap-3 pb-3 mb-4"
          style={{ borderBottom: "2px solid var(--serie-1)" }}
        >
          <div>
            <div className="text-lg font-bold">{empresa.nome}</div>
            {empresa.documento ? (
              <div className="text-xs num" style={{ color: "var(--tinta-2)" }}>
                CNPJ {empresa.documento}
              </div>
            ) : null}
            {empresa.endereco ? (
              <div className="text-xs" style={{ color: "var(--tinta-2)" }}>
                {empresa.endereco}
              </div>
            ) : null}
            {empresa.telefone || empresa.email ? (
              <div className="text-xs" style={{ color: "var(--tinta-2)" }}>
                {[empresa.telefone, empresa.email].filter(Boolean).join(" · ")}
              </div>
            ) : null}
          </div>

          <div className="text-right">
            <div className="titulo-secao">Orçamento</div>
            <div className="text-lg font-bold num" style={{ color: "var(--serie-1)" }}>
              {orcamento.numero}
              {orcamento.versao > 1 ? ` v${orcamento.versao}` : ""}
            </div>
            <div className="text-xs num" style={{ color: "var(--tinta-2)" }}>
              Emissão: {formatarData(orcamento.criadoEm)}
            </div>
            {orcamento.validoAte ? (
              <div className="text-xs num" style={{ color: "var(--tinta-2)" }}>
                Válido até: {formatarData(orcamento.validoAte)}
              </div>
            ) : null}
          </div>
        </header>

        <h1 className="font-bold mb-4">{orcamento.titulo}</h1>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="titulo-secao">Cliente</div>
            <div>{orcamento.cliente.nome}</div>
            {orcamento.cliente.documento ? (
              <div className="text-xs num" style={{ color: "var(--tinta-2)" }}>
                {orcamento.cliente.documento}
              </div>
            ) : null}
            {orcamento.cliente.endereco ? (
              <div className="text-xs" style={{ color: "var(--tinta-2)" }}>
                {orcamento.cliente.endereco}
              </div>
            ) : null}
          </div>
          <div>
            <div className="titulo-secao">Contato</div>
            {orcamento.cliente.contato ? <div>{orcamento.cliente.contato}</div> : null}
            <div className="text-xs" style={{ color: "var(--tinta-2)" }}>
              {orcamento.cliente.email}
            </div>
            {orcamento.cliente.telefone ? (
              <div className="text-xs num" style={{ color: "var(--tinta-2)" }}>
                {orcamento.cliente.telefone}
              </div>
            ) : null}
          </div>
        </div>

        <table className="w-full text-sm mb-4">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--borda)" }}>
              <th className="titulo-secao text-left pb-1 w-8">#</th>
              <th className="titulo-secao text-left pb-1">Descrição</th>
              <th className="titulo-secao text-right pb-1">Qtde.</th>
              <th className="titulo-secao text-right pb-1">Valor unit.</th>
              <th className="titulo-secao text-right pb-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {orcamento.itens.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--grade)" }}>
                <td className="py-1.5 num align-top">{i + 1}</td>
                <td className="py-1.5 pr-3 align-top">
                  {item.descricao}
                  {item.detalhe ? (
                    <div className="text-xs" style={{ color: "var(--tinta-2)" }}>
                      {item.detalhe}
                    </div>
                  ) : null}
                </td>
                <td className="py-1.5 text-right num align-top whitespace-nowrap">
                  {formatarQuantidade(item.quantidadeMilesimos)} {item.unidade}
                </td>
                <td className="py-1.5 text-right num align-top whitespace-nowrap">
                  {formatarMoeda(item.valorUnitarioCentavos)}
                </td>
                <td className="py-1.5 text-right num align-top whitespace-nowrap">
                  {formatarMoeda(item.totalCentavos)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="ml-auto max-w-xs text-sm mb-5">
          {orcamento.descontoCentavos > 0 ? (
            <>
              <div className="flex justify-between">
                <dt style={{ color: "var(--tinta-2)" }}>Subtotal</dt>
                <dd className="num">{formatarMoeda(orcamento.subtotalCentavos)}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "var(--tinta-2)" }}>Desconto</dt>
                <dd className="num">− {formatarMoeda(orcamento.descontoCentavos)}</dd>
              </div>
            </>
          ) : null}
          <div
            className="flex justify-between pt-2 mt-2 font-bold text-base"
            style={{ borderTop: "1px solid var(--tinta)" }}
          >
            <dt>TOTAL</dt>
            <dd className="num">{formatarMoeda(orcamento.totalCentavos)}</dd>
          </div>
        </dl>

        <div className="space-y-3 text-sm">
          {orcamento.condicoesPagamento ? (
            <div>
              <div className="titulo-secao">Condições de pagamento</div>
              <p style={{ color: "var(--tinta-2)" }}>{orcamento.condicoesPagamento}</p>
            </div>
          ) : null}
          {orcamento.prazoExecucao ? (
            <div>
              <div className="titulo-secao">Prazo de execução</div>
              <p style={{ color: "var(--tinta-2)" }}>{orcamento.prazoExecucao}</p>
            </div>
          ) : null}
          {orcamento.observacoes ? (
            <div>
              <div className="titulo-secao">Observações</div>
              <p style={{ color: "var(--tinta-2)" }}>{orcamento.observacoes}</p>
            </div>
          ) : null}
        </div>

        {link ? (
          <p
            className="text-xs mt-5 pt-3"
            style={{ borderTop: "1px solid var(--grade)", color: "var(--tinta-2)" }}
          >
            Para aceitar, recusar ou pedir um ajuste, acesse:{" "}
            <span className="break-all">{link}</span>
          </p>
        ) : null}
      </article>
    </div>
  );
}
