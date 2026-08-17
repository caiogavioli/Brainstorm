"use client";

import { useRef, useState } from "react";

import {
  centavosParaCampo,
  formatarMoeda,
  formatarQuantidade,
  lerMoeda,
  lerQuantidade,
  totalLinhaCentavos,
} from "@/lib/dinheiro";

/**
 * Edição da lista de itens — compartilhada pelo modelo de orçamento e pelo
 * orçamento em si.
 *
 * As duas telas precisam exatamente do mesmo comportamento: escolher do
 * catálogo, ajustar quantidade e valor, reordenar, ver o total ao vivo. Manter
 * duas cópias significaria corrigir um arredondamento em dois lugares e
 * esquecer o segundo.
 */

export type ServicoDoCatalogo = {
  id: number;
  nome: string;
  descricao: string | null;
  unidade: string;
  valorPadraoCentavos: number;
  categoria: string;
};

/** Como uma linha chega do banco. */
export type LinhaSalva = {
  servicoCatalogoId: number | null;
  descricao: string;
  detalhe: string | null;
  unidade: string;
  quantidadeMilesimos: number;
  valorUnitarioCentavos: number;
};

/** Uma linha enquanto está sendo editada: tudo texto, como a pessoa digitou. */
export type LinhaEdicao = {
  chave: number;
  servicoCatalogoId: number;
  descricao: string;
  detalhe: string;
  unidade: string;
  quantidade: string;
  valorUnitario: string;
};

/** O que vai para a Server Action. */
export type LinhaEnvio = {
  servicoCatalogoId: number;
  descricao: string;
  detalhe: string;
  unidade: string;
  quantidade: string;
  valorUnitario: string;
};

/**
 * Total de uma linha em edição, ou `null` quando o que foi digitado ainda não é
 * um número.
 *
 * O `null` vira "—" na tela em vez de zero: um total zerado parece um preço
 * combinado, e quem está no meio de digitar "1.2" não quis dizer que o serviço
 * é de graça.
 */
function totalDaLinha(linha: LinhaEdicao): number | null {
  const quantidade = lerQuantidade(linha.quantidade);
  const valor = lerMoeda(linha.valorUnitario);
  if (quantidade === null || valor === null) return null;
  return totalLinhaCentavos(quantidade, valor);
}

export type ControleLinhas = ReturnType<typeof useLinhas>;

export function useLinhas(iniciais?: LinhaSalva[]) {
  // Contador para as chaves do React. Um índice de array não serve: remover a
  // linha 2 faria a 3 herdar a chave da 2, e o React reaproveitaria o campo
  // errado, embaralhando o que já tinha sido digitado.
  const proximaChave = useRef(0);
  const novaChave = () => proximaChave.current++;

  const vazia = (): LinhaEdicao => ({
    chave: novaChave(),
    servicoCatalogoId: 0,
    descricao: "",
    detalhe: "",
    unidade: "un",
    quantidade: "1",
    valorUnitario: "",
  });

  const [linhas, setLinhas] = useState<LinhaEdicao[]>(() =>
    iniciais && iniciais.length > 0
      ? iniciais.map((item) => ({
          chave: novaChave(),
          servicoCatalogoId: item.servicoCatalogoId ?? 0,
          descricao: item.descricao,
          detalhe: item.detalhe ?? "",
          unidade: item.unidade,
          quantidade: formatarQuantidade(item.quantidadeMilesimos),
          valorUnitario: centavosParaCampo(item.valorUnitarioCentavos),
        }))
      : [vazia()],
  );

  function alterar(chave: number, mudanca: Partial<LinhaEdicao>) {
    setLinhas((atual) => atual.map((l) => (l.chave === chave ? { ...l, ...mudanca } : l)));
  }

  /**
   * Escolher um serviço do catálogo COPIA descrição, unidade e valor para a
   * linha — e a partir daí eles são editáveis.
   *
   * Copiar, e não referenciar, é a regra do módulo inteiro: reajustar o preço de
   * um serviço amanhã não pode reescrever um orçamento que o cliente já recebeu.
   */
  function aplicarServico(
    chave: number,
    servicoId: number,
    catalogo: ServicoDoCatalogo[],
  ) {
    const servico = catalogo.find((s) => s.id === servicoId);
    if (!servico) {
      alterar(chave, { servicoCatalogoId: 0 });
      return;
    }
    alterar(chave, {
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

  function remover(chave: number) {
    // Nunca fica sem nenhuma linha: uma lista vazia não tem onde clicar para
    // recomeçar, e o formulário viraria um beco sem saída.
    setLinhas((atual) =>
      atual.length === 1 ? [vazia()] : atual.filter((l) => l.chave !== chave),
    );
  }

  function adicionar() {
    setLinhas((atual) => [...atual, vazia()]);
  }

  /** Substitui todas as linhas — usado ao aplicar um modelo ao orçamento. */
  function substituir(novas: LinhaSalva[]) {
    setLinhas(
      novas.length === 0
        ? [vazia()]
        : novas.map((item) => ({
            chave: novaChave(),
            servicoCatalogoId: item.servicoCatalogoId ?? 0,
            descricao: item.descricao,
            detalhe: item.detalhe ?? "",
            unidade: item.unidade,
            quantidade: formatarQuantidade(item.quantidadeMilesimos),
            valorUnitario: centavosParaCampo(item.valorUnitarioCentavos),
          })),
    );
  }

  const totais = linhas.map(totalDaLinha);
  const subtotal = totais.reduce<number>((soma, t) => soma + (t ?? 0), 0);
  const temIncompleta = totais.some((t) => t === null);

  const paraEnvio = (): LinhaEnvio[] =>
    linhas.map((l) => ({
      servicoCatalogoId: l.servicoCatalogoId,
      descricao: l.descricao,
      detalhe: l.detalhe,
      unidade: l.unidade,
      quantidade: l.quantidade,
      valorUnitario: l.valorUnitario,
    }));

  return {
    linhas,
    totais,
    subtotal,
    temIncompleta,
    alterar,
    aplicarServico,
    mover,
    remover,
    adicionar,
    substituir,
    paraEnvio,
  };
}

export function EditorLinhas({
  ctrl,
  catalogo,
}: {
  ctrl: ControleLinhas;
  catalogo: ServicoDoCatalogo[];
}) {
  return (
    <div>
      <div className="space-y-3">
        {ctrl.linhas.map((linha, indice) => (
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
                  onClick={() => ctrl.mover(indice, -1)}
                  disabled={indice === 0}
                  className="text-xs font-semibold disabled:opacity-30"
                  style={{ color: "var(--tinta-2)" }}
                  aria-label={`Mover item ${indice + 1} para cima`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => ctrl.mover(indice, 1)}
                  disabled={indice === ctrl.linhas.length - 1}
                  className="text-xs font-semibold disabled:opacity-30"
                  style={{ color: "var(--tinta-2)" }}
                  aria-label={`Mover item ${indice + 1} para baixo`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => ctrl.remover(linha.chave)}
                  className="text-xs font-semibold underline"
                  style={{ color: "var(--status-critico-texto)" }}
                >
                  Remover
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <div>
                <label className="rotulo" htmlFor={`servico-${linha.chave}`}>
                  Serviço do catálogo
                </label>
                <select
                  id={`servico-${linha.chave}`}
                  className="campo"
                  value={linha.servicoCatalogoId}
                  onChange={(e) =>
                    ctrl.aplicarServico(linha.chave, Number(e.target.value), catalogo)
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

              <div>
                <label className="rotulo" htmlFor={`descricao-${linha.chave}`}>
                  Descrição
                </label>
                <textarea
                  id={`descricao-${linha.chave}`}
                  className="campo"
                  rows={2}
                  value={linha.descricao}
                  onChange={(e) =>
                    ctrl.alterar(linha.chave, { descricao: e.target.value })
                  }
                  placeholder="O que o cliente vai ler nesta linha"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
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
                      ctrl.alterar(linha.chave, { quantidade: e.target.value })
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
                      ctrl.alterar(linha.chave, { unidade: e.target.value })
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
                      ctrl.alterar(linha.chave, { valorUnitario: e.target.value })
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
                {ctrl.totais[indice] === null
                  ? "—"
                  : formatarMoeda(ctrl.totais[indice]!)}
              </strong>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={ctrl.adicionar}
        className="botao botao-secundario w-full mt-3"
      >
        + Adicionar item
      </button>

      {ctrl.temIncompleta ? (
        <p className="text-xs mt-2" style={{ color: "var(--tinta-3)" }}>
          Alguma linha tem quantidade ou valor que ainda não dá para ler como
          número — o total ignora essas linhas.
        </p>
      ) : null}
    </div>
  );
}
