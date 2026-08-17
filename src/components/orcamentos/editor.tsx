"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  atualizarOrcamentoAction,
  carregarModeloAction,
  criarOrcamentoAction,
} from "@/lib/acoes/orcamentos";
import type { ResultadoAcao } from "@/lib/acoes/boletim";
import { centavosParaCampo, formatarMoeda, lerMoeda } from "@/lib/dinheiro";
import { Aviso } from "@/components/aviso";
import {
  EditorLinhas,
  useLinhas,
  type LinhaSalva,
  type ServicoDoCatalogo,
} from "@/components/orcamentos/linhas";

export type ClienteOpcao = { id: number; nome: string; contato: string | null };
export type ModeloOpcao = { id: number; nome: string };

export type OrcamentoEditavel = {
  id: number;
  clienteId: number;
  titulo: string;
  condicoesPagamento: string | null;
  prazoExecucao: string | null;
  observacoes: string | null;
  descontoCentavos: number;
  validadeDias: number;
  itens: LinhaSalva[];
};

export function EditorOrcamento({
  orcamento,
  clientes,
  modelos,
  catalogo,
}: {
  orcamento?: OrcamentoEditavel;
  clientes: ClienteOpcao[];
  modelos: ModeloOpcao[];
  catalogo: ServicoDoCatalogo[];
}) {
  const router = useRouter();
  const [estado, setEstado] = useState<ResultadoAcao | null>(null);
  const [salvando, iniciar] = useTransition();
  const [aplicandoModelo, setAplicandoModelo] = useState(false);

  const [clienteId, setClienteId] = useState(orcamento?.clienteId ?? 0);
  const [titulo, setTitulo] = useState(orcamento?.titulo ?? "");
  const [condicoesPagamento, setCondicoesPagamento] = useState(
    orcamento?.condicoesPagamento ?? "",
  );
  const [prazoExecucao, setPrazoExecucao] = useState(orcamento?.prazoExecucao ?? "");
  const [observacoes, setObservacoes] = useState(orcamento?.observacoes ?? "");
  const [desconto, setDesconto] = useState(
    orcamento ? centavosParaCampo(orcamento.descontoCentavos) : "",
  );
  const [validadeDias, setValidadeDias] = useState(
    String(orcamento?.validadeDias ?? 15),
  );

  const linhas = useLinhas(orcamento?.itens);

  /**
   * Aplicar um modelo substitui itens e textos de uma vez.
   *
   * Confirma antes quando já há conteúdo digitado: é a ação mais destrutiva do
   * editor, e um clique errado no seletor apagaria tudo sem aviso.
   */
  function aplicarModelo(modeloId: number) {
    if (modeloId <= 0) return;

    const temConteudo =
      linhas.linhas.some((l) => l.descricao.trim() !== "" || l.valorUnitario.trim() !== "") ||
      condicoesPagamento.trim() !== "";
    if (
      temConteudo &&
      !window.confirm(
        "Aplicar o modelo substitui os itens e os textos já preenchidos. Continuar?",
      )
    ) {
      return;
    }

    setAplicandoModelo(true);
    void carregarModeloAction(modeloId)
      .then((modelo) => {
        if (!modelo) {
          setEstado({ ok: false, erro: "Modelo não encontrado ou inativo." });
          return;
        }
        linhas.substituir(modelo.itens);
        setCondicoesPagamento(modelo.condicoesPagamento ?? "");
        setPrazoExecucao(modelo.prazoExecucao ?? "");
        setObservacoes(modelo.observacoes ?? "");
        setValidadeDias(String(modelo.validadeDias));
      })
      .finally(() => setAplicandoModelo(false));
  }

  const descontoCentavos = lerMoeda(desconto) ?? 0;
  // O desconto nunca leva o total abaixo de zero — a mesma trava do servidor,
  // repetida aqui só para a prévia não mostrar número negativo.
  const descontoAplicado = Math.min(Math.max(descontoCentavos, 0), linhas.subtotal);
  const total = linhas.subtotal - descontoAplicado;

  function salvar() {
    iniciar(async () => {
      const dados = {
        id: orcamento?.id,
        clienteId,
        titulo,
        condicoesPagamento,
        prazoExecucao,
        observacoes,
        desconto,
        validadeDias,
        itens: linhas.paraEnvio(),
      };
      const r = orcamento
        ? await atualizarOrcamentoAction(dados)
        : await criarOrcamentoAction(dados);
      setEstado(r);
      if (r.ok && r.id) {
        router.push(`/orcamentos/${r.id}`);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="card card-pad space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="rotulo" htmlFor="orcamento-cliente">
              Cliente
            </label>
            <select
              id="orcamento-cliente"
              className="campo"
              value={clienteId}
              onChange={(e) => setClienteId(Number(e.target.value))}
            >
              <option value={0}>Selecione…</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                  {c.contato ? ` — A/C ${c.contato}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="rotulo" htmlFor="orcamento-modelo">
              Partir de um modelo
            </label>
            <select
              id="orcamento-modelo"
              className="campo"
              defaultValue={0}
              disabled={aplicandoModelo || modelos.length === 0}
              onChange={(e) => {
                aplicarModelo(Number(e.target.value));
                e.target.value = "0";
              }}
            >
              <option value={0}>
                {modelos.length === 0 ? "Nenhum modelo cadastrado" : "Escolher modelo…"}
              </option>
              {modelos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
            <p className="text-xs mt-1" style={{ color: "var(--tinta-3)" }}>
              {aplicandoModelo
                ? "Carregando…"
                : "Preenche itens e textos de uma vez. Você ajusta depois."}
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="rotulo" htmlFor="orcamento-titulo">
              Título
            </label>
            <input
              id="orcamento-titulo"
              className="campo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Manutenção predial — Edifício Atrium"
            />
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <h2 className="font-semibold mb-3">Itens</h2>
        <EditorLinhas ctrl={linhas} catalogo={catalogo} />
      </div>

      <div className="card card-pad space-y-3">
        <h2 className="font-semibold">Condições</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="rotulo" htmlFor="orcamento-condicoes">
              Condições de pagamento
            </label>
            <textarea
              id="orcamento-condicoes"
              className="campo"
              rows={2}
              value={condicoesPagamento}
              onChange={(e) => setCondicoesPagamento(e.target.value)}
            />
          </div>
          <div>
            <label className="rotulo" htmlFor="orcamento-prazo">
              Prazo de execução
            </label>
            <textarea
              id="orcamento-prazo"
              className="campo"
              rows={2}
              value={prazoExecucao}
              onChange={(e) => setPrazoExecucao(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="rotulo" htmlFor="orcamento-observacoes">
              Observações (o cliente lê)
            </label>
            <textarea
              id="orcamento-observacoes"
              className="campo"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
          <div>
            <label className="rotulo" htmlFor="orcamento-desconto">
              Desconto (R$)
            </label>
            <input
              id="orcamento-desconto"
              className="campo num"
              inputMode="decimal"
              placeholder="0,00"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
            />
          </div>
          <div>
            <label className="rotulo" htmlFor="orcamento-validade">
              Validade (dias)
            </label>
            <input
              id="orcamento-validade"
              type="number"
              min={1}
              max={365}
              className="campo num"
              value={validadeDias}
              onChange={(e) => setValidadeDias(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt style={{ color: "var(--tinta-2)" }}>Subtotal</dt>
            <dd className="num">{formatarMoeda(linhas.subtotal)}</dd>
          </div>
          {descontoAplicado > 0 ? (
            <div className="flex justify-between">
              <dt style={{ color: "var(--tinta-2)" }}>Desconto</dt>
              <dd className="num">− {formatarMoeda(descontoAplicado)}</dd>
            </div>
          ) : null}
          <div
            className="flex justify-between pt-2 mt-2 text-lg font-semibold"
            style={{ borderTop: "1px solid var(--borda)" }}
          >
            <dt>Total</dt>
            <dd className="num" data-teste="total-orcamento">
              {formatarMoeda(total)}
            </dd>
          </div>
        </dl>
      </div>

      <Aviso estado={estado} />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={salvar}
          disabled={salvando}
          className="botao botao-primario flex-1"
        >
          {salvando ? "Salvando…" : orcamento ? "Salvar orçamento" : "Criar orçamento"}
        </button>
        <button
          type="button"
          onClick={() => router.push(orcamento ? `/orcamentos/${orcamento.id}` : "/orcamentos")}
          disabled={salvando}
          className="botao botao-secundario"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
