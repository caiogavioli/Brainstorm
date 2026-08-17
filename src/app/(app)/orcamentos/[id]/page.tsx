import Link from "next/link";
import { notFound } from "next/navigation";

import { exigirAdmin } from "@/lib/auth";
import { formatarData, formatarDataHora } from "@/lib/datas";
import { formatarMoeda, formatarQuantidade } from "@/lib/dinheiro";
import {
  STATUS_ORCAMENTO_AJUDA,
  STATUS_ORCAMENTO_CLASSE,
  STATUS_ORCAMENTO_LABEL,
} from "@/lib/labels";
import { linkPublico, orcamentoCompleto } from "@/lib/orcamentos/consultas";
import { AcoesOrcamento } from "@/components/orcamentos/acoes";

export const metadata = { title: "Orçamento — Gestão de Condomínios" };

export default async function PaginaOrcamento({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirAdmin();

  const { id } = await params;
  const orcamento = await orcamentoCompleto(Number(id));
  if (!orcamento) notFound();

  const link = orcamento.status === "RASCUNHO" ? null : linkPublico(orcamento.token);
  const rascunho = orcamento.status === "RASCUNHO";

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/orcamentos"
          className="text-xs font-semibold underline"
          style={{ color: "var(--serie-1)" }}
        >
          ← Orçamentos
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3 mt-1">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold num">
                {orcamento.numero}
                {orcamento.versao > 1 ? ` v${orcamento.versao}` : ""}
              </h1>
              <span className={STATUS_ORCAMENTO_CLASSE[orcamento.status]}>
                {STATUS_ORCAMENTO_LABEL[orcamento.status]}
              </span>
            </div>
            <p className="font-semibold">{orcamento.titulo}</p>
            <p className="text-xs" style={{ color: "var(--tinta-3)" }}>
              {STATUS_ORCAMENTO_AJUDA[orcamento.status]}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-bold num">
              {formatarMoeda(orcamento.totalCentavos)}
            </div>
            {orcamento.validoAte ? (
              <div className="text-xs num" style={{ color: "var(--tinta-3)" }}>
                válido até {formatarData(orcamento.validoAte)}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4 order-2 lg:order-1">
          <section className="card card-pad">
            <h2 className="font-semibold mb-3">Itens</h2>
            <div className="tabela-rolagem">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--borda)" }}>
                    <th className="titulo-secao text-left pb-2">Descrição</th>
                    <th className="titulo-secao text-right pb-2 whitespace-nowrap">Qtde.</th>
                    <th className="titulo-secao text-right pb-2 whitespace-nowrap">
                      Valor unit.
                    </th>
                    <th className="titulo-secao text-right pb-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamento.itens.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid var(--grade)" }}>
                      <td className="py-2 pr-3">
                        {item.descricao}
                        {item.detalhe ? (
                          <div className="text-xs" style={{ color: "var(--tinta-3)" }}>
                            {item.detalhe}
                          </div>
                        ) : null}
                      </td>
                      <td className="py-2 text-right num whitespace-nowrap">
                        {formatarQuantidade(item.quantidadeMilesimos)} {item.unidade}
                      </td>
                      <td className="py-2 text-right num whitespace-nowrap">
                        {formatarMoeda(item.valorUnitarioCentavos)}
                      </td>
                      <td className="py-2 text-right num whitespace-nowrap">
                        {formatarMoeda(item.totalCentavos)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <dl className="mt-3 ml-auto max-w-xs space-y-1 text-sm">
              <div className="flex justify-between">
                <dt style={{ color: "var(--tinta-2)" }}>Subtotal</dt>
                <dd className="num">{formatarMoeda(orcamento.subtotalCentavos)}</dd>
              </div>
              {orcamento.descontoCentavos > 0 ? (
                <div className="flex justify-between">
                  <dt style={{ color: "var(--tinta-2)" }}>Desconto</dt>
                  <dd className="num">− {formatarMoeda(orcamento.descontoCentavos)}</dd>
                </div>
              ) : null}
              <div
                className="flex justify-between pt-2 mt-2 font-semibold text-base"
                style={{ borderTop: "1px solid var(--borda)" }}
              >
                <dt>Total</dt>
                <dd className="num">{formatarMoeda(orcamento.totalCentavos)}</dd>
              </div>
            </dl>
          </section>

          {orcamento.condicoesPagamento || orcamento.prazoExecucao || orcamento.observacoes ? (
            <section className="card card-pad space-y-3">
              <h2 className="font-semibold">Condições</h2>
              {orcamento.condicoesPagamento ? (
                <div>
                  <div className="titulo-secao">Pagamento</div>
                  <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
                    {orcamento.condicoesPagamento}
                  </p>
                </div>
              ) : null}
              {orcamento.prazoExecucao ? (
                <div>
                  <div className="titulo-secao">Prazo de execução</div>
                  <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
                    {orcamento.prazoExecucao}
                  </p>
                </div>
              ) : null}
              {orcamento.observacoes ? (
                <div>
                  <div className="titulo-secao">Observações</div>
                  <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
                    {orcamento.observacoes}
                  </p>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 order-1 lg:order-2">
          <section className="card card-pad">
            <h2 className="font-semibold mb-2">Cliente</h2>
            <div className="text-sm">
              <div className="font-medium">{orcamento.cliente.nome}</div>
              {orcamento.cliente.contato ? (
                <div style={{ color: "var(--tinta-2)" }}>
                  A/C {orcamento.cliente.contato}
                </div>
              ) : null}
              <div className="truncate" style={{ color: "var(--tinta-2)" }}>
                {orcamento.cliente.email}
              </div>
              {orcamento.cliente.telefone ? (
                <div className="num" style={{ color: "var(--tinta-2)" }}>
                  {orcamento.cliente.telefone}
                </div>
              ) : null}
            </div>
            <Link
              href="/clientes"
              className="text-xs font-semibold underline mt-2 inline-block"
              style={{ color: "var(--serie-1)" }}
            >
              Ver cadastro
            </Link>
          </section>

          <AcoesOrcamento
            id={orcamento.id}
            numero={orcamento.numero}
            rascunho={rascunho}
            link={link}
          />

          <section className="card card-pad">
            <h2 className="font-semibold mb-2">Acompanhamento</h2>
            <dl className="text-sm space-y-1.5">
              <Campo rotulo="Criado" valor={formatarDataHora(orcamento.criadoEm)} />
              {orcamento.criadoPor ? (
                <Campo rotulo="Por" valor={orcamento.criadoPor.nome} />
              ) : null}
              <Campo
                rotulo="Enviado"
                valor={
                  orcamento.enviadoEm ? formatarDataHora(orcamento.enviadoEm) : "ainda não"
                }
              />
              <Campo
                rotulo="1ª visualização"
                valor={
                  orcamento.primeiraVisualizacaoEm
                    ? formatarDataHora(orcamento.primeiraVisualizacaoEm)
                    : "ainda não"
                }
              />
              <Campo
                rotulo="Visualizações"
                valor={String(orcamento.totalVisualizacoes)}
              />
              <Campo
                rotulo="Resposta"
                valor={
                  orcamento.respondidoEm
                    ? formatarDataHora(orcamento.respondidoEm)
                    : "aguardando"
                }
              />
            </dl>
            <p className="text-xs mt-3" style={{ color: "var(--tinta-3)" }}>
              O envio e o registro de visualização entram nas fases 3 e 4.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt style={{ color: "var(--tinta-3)" }}>{rotulo}</dt>
      <dd className="num text-right">{valor}</dd>
    </div>
  );
}
