"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  alternarModeloAction,
  excluirModeloAction,
  salvarModeloAction,
} from "@/lib/acoes/servicos";
import type { ResultadoAcao } from "@/lib/acoes/boletim";
import {
  centavosParaCampo,
  formatarMoeda,
  formatarQuantidade,
  lerMoeda,
  lerQuantidade,
  totalLinhaCentavos,
} from "@/lib/dinheiro";
import { Aviso } from "@/components/aviso";

export type ServicoDoCatalogo = {
  id: number;
  nome: string;
  descricao: string | null;
  unidade: string;
  valorPadraoCentavos: number;
  categoria: string;
};

export type ModeloEditavel = {
  id: number;
  nome: string;
  descricao: string | null;
  condicoesPagamento: string | null;
  prazoExecucao: string | null;
  observacoes: string | null;
  validadeDias: number;
  ativo: boolean;
  itens: {
    servicoCatalogoId: number | null;
    descricao: string;
    detalhe: string | null;
    unidade: string;
    quantidadeMilesimos: number;
    valorUnitarioCentavos: number;
  }[];
};

/** Uma linha enquanto está sendo editada: tudo texto, como a pessoa digitou. */
type LinhaEdicao = {
  chave: number;
  servicoCatalogoId: number;
  descricao: string;
  detalhe: string;
  unidade: string;
  quantidade: string;
  valorUnitario: string;
};

function linhaVazia(chave: number): LinhaEdicao {
  return {
    chave,
    servicoCatalogoId: 0,
    descricao: "",
    detalhe: "",
    unidade: "un",
    quantidade: "1",
    valorUnitario: "",
  };
}

/**
 * Total de uma linha em edição, ou `null` quando o que foi digitado ainda não
 * é um número.
 *
 * O `null` é mostrado como "—" em vez de zero de propósito: um total zerado
 * parece um preço combinado, e quem está no meio de digitar "1.2" não pretendia
 * dizer que o serviço é de graça.
 */
function totalDaLinha(linha: LinhaEdicao): number | null {
  const quantidade = lerQuantidade(linha.quantidade);
  const valor = lerMoeda(linha.valorUnitario);
  if (quantidade === null || valor === null) return null;
  return totalLinhaCentavos(quantidade, valor);
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

export function EditorModelo({
  modelo,
  catalogo,
  aoFechar,
}: {
  modelo?: ModeloEditavel;
  catalogo: ServicoDoCatalogo[];
  aoFechar: () => void;
}) {
  const router = useRouter();
  const [estado, setEstado] = useState<ResultadoAcao | null>(null);
  const [salvando, iniciar] = useTransition();

  // Contador para as chaves do React. Um índice de array não serve: remover a
  // linha 2 faria a 3 herdar a chave da 2 e o React reaproveitaria o campo
  // errado, embaralhando o que a pessoa já tinha digitado.
  const proximaChave = useRef(0);
  const novaChave = () => proximaChave.current++;

  const [nome, setNome] = useState(modelo?.nome ?? "");
  const [descricao, setDescricao] = useState(modelo?.descricao ?? "");
  const [condicoesPagamento, setCondicoesPagamento] = useState(
    modelo?.condicoesPagamento ?? "",
  );
  const [prazoExecucao, setPrazoExecucao] = useState(modelo?.prazoExecucao ?? "");
  const [observacoes, setObservacoes] = useState(modelo?.observacoes ?? "");
  const [validadeDias, setValidadeDias] = useState(String(modelo?.validadeDias ?? 15));
  const [ativo, setAtivo] = useState(modelo?.ativo ?? true);

  const [linhas, setLinhas] = useState<LinhaEdicao[]>(() =>
    modelo && modelo.itens.length > 0
      ? modelo.itens.map((item) => ({
          chave: novaChave(),
          servicoCatalogoId: item.servicoCatalogoId ?? 0,
          descricao: item.descricao,
          detalhe: item.detalhe ?? "",
          unidade: item.unidade,
          quantidade: formatarQuantidade(item.quantidadeMilesimos),
          valorUnitario: centavosParaCampo(item.valorUnitarioCentavos),
        }))
      : [linhaVazia(novaChave())],
  );

  function alterarLinha(chave: number, mudanca: Partial<LinhaEdicao>) {
    setLinhas((atual) =>
      atual.map((l) => (l.chave === chave ? { ...l, ...mudanca } : l)),
    );
  }

  /**
   * Escolher um serviço do catálogo copia descrição, unidade e valor para a
   * linha — e a partir daí eles são editáveis.
   *
   * Copiar, e não referenciar, é a regra do módulo inteiro: reajustar o preço
   * de um serviço amanhã não pode reescrever um modelo já aprovado.
   */
  function aplicarServico(chave: number, servicoId: number) {
    const servico = catalogo.find((s) => s.id === servicoId);
    if (!servico) {
      alterarLinha(chave, { servicoCatalogoId: 0 });
      return;
    }
    alterarLinha(chave, {
      servicoCatalogoId: servico.id,
      descricao: servico.descricao?.trim() || servico.nome,
      unidade: servico.unidade,
      valorUnitario: centavosParaCampo(servico.valorPadraoCentavos),
    });
  }

  function mover(indice: number, direcao: -1 | 1) {
    const destino = indice + direcao;
    if (destino < 0 || destino >= linhas.length) return;
    setLinhas((atual) => {
      const copia = [...atual];
      [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
      return copia;
    });
  }

  const totais = linhas.map(totalDaLinha);
  const temLinhaIncompleta = totais.some((t) => t === null);
  const total = totais.reduce<number>((soma, t) => soma + (t ?? 0), 0);

  function salvar() {
    iniciar(async () => {
      const r = await salvarModeloAction({
        id: modelo?.id,
        nome,
        descricao,
        condicoesPagamento,
        prazoExecucao,
        observacoes,
        validadeDias,
        ativo,
        itens: linhas.map((l) => ({
          servicoCatalogoId: l.servicoCatalogoId,
          descricao: l.descricao,
          detalhe: l.detalhe,
          unidade: l.unidade,
          quantidade: l.quantidade,
          valorUnitario: l.valorUnitario,
        })),
      });
      setEstado(r);
      if (r.ok) {
        router.refresh();
        aoFechar();
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="rotulo" htmlFor="modelo-nome">
            Nome do modelo
          </label>
          <input
            id="modelo-nome"
            className="campo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Manutenção predial mensal"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="rotulo" htmlFor="modelo-descricao">
            Para que serve (uso interno)
          </label>
          <input
            id="modelo-descricao"
            className="campo"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Não aparece para o cliente"
          />
        </div>

        <div>
          <label className="rotulo" htmlFor="modelo-condicoes">
            Condições de pagamento
          </label>
          <textarea
            id="modelo-condicoes"
            className="campo"
            rows={2}
            value={condicoesPagamento}
            onChange={(e) => setCondicoesPagamento(e.target.value)}
            placeholder="50% na aprovação, 50% na entrega"
          />
        </div>

        <div>
          <label className="rotulo" htmlFor="modelo-prazo">
            Prazo de execução
          </label>
          <textarea
            id="modelo-prazo"
            className="campo"
            rows={2}
            value={prazoExecucao}
            onChange={(e) => setPrazoExecucao(e.target.value)}
            placeholder="15 dias úteis após a aprovação"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="rotulo" htmlFor="modelo-observacoes">
            Observações do orçamento
          </label>
          <textarea
            id="modelo-observacoes"
            className="campo"
            rows={2}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Este texto aparece para o cliente"
          />
        </div>

        <div>
          <label className="rotulo" htmlFor="modelo-validade">
            Validade (dias)
          </label>
          <input
            id="modelo-validade"
            type="number"
            min={1}
            max={365}
            className="campo num"
            value={validadeDias}
            onChange={(e) => setValidadeDias(e.target.value)}
          />
          <p className="text-xs mt-1" style={{ color: "var(--tinta-3)" }}>
            Contados a partir do envio.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm self-end pb-2">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="h-4 w-4"
          />
          Ativo
        </label>
      </div>

      {/* Itens */}
      <div>
        <h4 className="titulo-secao mb-2">Itens do modelo</h4>

        <div className="space-y-3">
          {linhas.map((linha, indice) => (
            <div
              key={linha.chave}
              className="rounded-xl p-3"
              style={{
                background: "var(--superficie-2)",
                border: "1px solid var(--borda)",
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="titulo-secao num">Item {indice + 1}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => mover(indice, -1)}
                    disabled={indice === 0}
                    className="text-xs font-semibold disabled:opacity-30"
                    style={{ color: "var(--tinta-2)" }}
                    aria-label={`Mover item ${indice + 1} para cima`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(indice, 1)}
                    disabled={indice === linhas.length - 1}
                    className="text-xs font-semibold disabled:opacity-30"
                    style={{ color: "var(--tinta-2)" }}
                    aria-label={`Mover item ${indice + 1} para baixo`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLinhas((atual) =>
                        atual.length === 1
                          ? [linhaVazia(novaChave())]
                          : atual.filter((l) => l.chave !== linha.chave),
                      )
                    }
                    className="text-xs font-semibold underline"
                    style={{ color: "var(--status-critico-texto)" }}
                  >
                    Remover
                  </button>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="rotulo" htmlFor={`servico-${linha.chave}`}>
                    Serviço do catálogo
                  </label>
                  <select
                    id={`servico-${linha.chave}`}
                    className="campo"
                    value={linha.servicoCatalogoId}
                    onChange={(e) =>
                      aplicarServico(linha.chave, Number(e.target.value))
                    }
                  >
                    <option value={0}>Linha avulsa (digitar à mão)</option>
                    {catalogo.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.categoria} · {s.nome} — {formatarMoeda(s.valorPadraoCentavos)}/
                        {s.unidade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="rotulo" htmlFor={`descricao-${linha.chave}`}>
                    Descrição
                  </label>
                  <textarea
                    id={`descricao-${linha.chave}`}
                    className="campo"
                    rows={2}
                    value={linha.descricao}
                    onChange={(e) =>
                      alterarLinha(linha.chave, { descricao: e.target.value })
                    }
                    placeholder="O que o cliente vai ler nesta linha"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                  <div>
                    <label className="rotulo" htmlFor={`quantidade-${linha.chave}`}>
                      Qtde.
                    </label>
                    <input
                      id={`quantidade-${linha.chave}`}
                      className="campo num"
                      inputMode="decimal"
                      value={linha.quantidade}
                      onChange={(e) =>
                        alterarLinha(linha.chave, { quantidade: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="rotulo" htmlFor={`unidade-${linha.chave}`}>
                      Unidade
                    </label>
                    <input
                      id={`unidade-${linha.chave}`}
                      className="campo"
                      value={linha.unidade}
                      onChange={(e) =>
                        alterarLinha(linha.chave, { unidade: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="rotulo" htmlFor={`valor-${linha.chave}`}>
                      Valor unit.
                    </label>
                    <input
                      id={`valor-${linha.chave}`}
                      className="campo num"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={linha.valorUnitario}
                      onChange={(e) =>
                        alterarLinha(linha.chave, { valorUnitario: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div
                className="mt-2 pt-2 text-right text-sm num"
                style={{ borderTop: "1px solid var(--borda)" }}
              >
                <span style={{ color: "var(--tinta-3)" }}>Total do item: </span>
                <strong>
                  {totais[indice] === null ? "—" : formatarMoeda(totais[indice]!)}
                </strong>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setLinhas((atual) => [...atual, linhaVazia(novaChave())])}
          className="botao botao-secundario w-full mt-3"
        >
          + Adicionar item
        </button>
      </div>

      <div
        className="flex items-center justify-between rounded-xl px-3 py-2"
        style={{ background: "var(--superficie-2)" }}
      >
        <span className="titulo-secao">Total do modelo</span>
        <strong className="num text-lg">{formatarMoeda(total)}</strong>
      </div>

      {temLinhaIncompleta ? (
        <p className="text-xs" style={{ color: "var(--tinta-3)" }}>
          Alguma linha tem quantidade ou valor que ainda não dá para ler como
          número — o total acima ignora essas linhas.
        </p>
      ) : null}

      <Aviso estado={estado} />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={salvar}
          disabled={salvando}
          className="botao botao-primario flex-1"
        >
          {salvando ? "Salvando…" : modelo ? "Salvar modelo" : "Criar modelo"}
        </button>
        <button
          type="button"
          onClick={aoFechar}
          disabled={salvando}
          className="botao botao-secundario"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Listagem
// ---------------------------------------------------------------------------

export function PainelModelos({
  modelos,
  catalogo,
}: {
  modelos: ModeloEditavel[];
  catalogo: ServicoDoCatalogo[];
}) {
  const [criando, setCriando] = useState(false);

  return (
    <div className="space-y-3">
      {criando ? (
        <div className="card card-pad">
          <h3 className="font-semibold mb-3">Novo modelo</h3>
          <EditorModelo catalogo={catalogo} aoFechar={() => setCriando(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCriando(true)}
          className="botao botao-primario"
          disabled={catalogo.length === 0}
        >
          + Novo modelo
        </button>
      )}

      {catalogo.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          Cadastre ao menos um serviço no catálogo antes de montar um modelo — é
          dele que as linhas saem.
        </p>
      ) : null}

      {modelos.map((modelo) => (
        <CartaoModelo key={modelo.id} modelo={modelo} catalogo={catalogo} />
      ))}
    </div>
  );
}

function CartaoModelo({
  modelo,
  catalogo,
}: {
  modelo: ModeloEditavel;
  catalogo: ServicoDoCatalogo[];
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [estado, setEstado] = useState<ResultadoAcao | null>(null);
  const [processando, iniciar] = useTransition();

  function executar(acao: () => Promise<ResultadoAcao>) {
    iniciar(async () => {
      const r = await acao();
      setEstado(r);
      if (r.ok) router.refresh();
    });
  }

  const total = modelo.itens.reduce(
    (soma, i) => soma + totalLinhaCentavos(i.quantidadeMilesimos, i.valorUnitarioCentavos),
    0,
  );

  return (
    <div className="card card-pad">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold">{modelo.nome}</div>
          {modelo.descricao ? (
            <p className="text-xs mt-0.5" style={{ color: "var(--tinta-2)" }}>
              {modelo.descricao}
            </p>
          ) : null}
          <p className="text-xs mt-1 num" style={{ color: "var(--tinta-3)" }}>
            {modelo.itens.length} item(ns) · validade de {modelo.validadeDias} dia(s)
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="font-semibold num">{formatarMoeda(total)}</div>
          {!modelo.ativo ? (
            <span className="badge badge-neutral mt-1">Inativo</span>
          ) : null}
        </div>
      </div>

      {!editando && modelo.itens.length > 0 ? (
        <ul
          className="mt-3 space-y-1 text-sm"
          style={{ color: "var(--tinta-2)" }}
        >
          {modelo.itens.map((item, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">
                <span className="num">
                  {formatarQuantidade(item.quantidadeMilesimos)} {item.unidade}
                </span>
                {" · "}
                {item.descricao}
              </span>
              <span className="num shrink-0">
                {formatarMoeda(
                  totalLinhaCentavos(
                    item.quantidadeMilesimos,
                    item.valorUnitarioCentavos,
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div
        className="mt-3 pt-3 flex flex-wrap items-center gap-4"
        style={{ borderTop: "1px solid var(--borda)" }}
      >
        <button
          type="button"
          onClick={() => setEditando((v) => !v)}
          className="text-xs font-semibold underline"
          style={{ color: "var(--serie-1)" }}
          aria-expanded={editando}
        >
          {editando ? "Fechar edição" : "Editar"}
        </button>

        <button
          type="button"
          disabled={processando}
          onClick={() => executar(() => alternarModeloAction(modelo.id, !modelo.ativo))}
          className="text-xs font-semibold underline"
          style={{ color: modelo.ativo ? "var(--tinta-2)" : "var(--status-bom-texto)" }}
        >
          {processando ? "…" : modelo.ativo ? "Desativar" : "Reativar"}
        </button>

        <button
          type="button"
          disabled={processando}
          onClick={() => executar(() => excluirModeloAction(modelo.id))}
          className="text-xs font-semibold underline"
          style={{ color: "var(--status-critico-texto)" }}
        >
          Excluir
        </button>
      </div>

      <Aviso estado={estado} className="mt-3" />

      {editando ? (
        <div
          className="mt-3 rounded-xl p-3"
          style={{ background: "var(--superficie-2)" }}
        >
          <EditorModelo
            modelo={modelo}
            catalogo={catalogo}
            aoFechar={() => setEditando(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
