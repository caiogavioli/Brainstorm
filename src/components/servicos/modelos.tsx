"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  alternarModeloAction,
  excluirModeloAction,
  salvarModeloAction,
} from "@/lib/acoes/servicos";
import type { ResultadoAcao } from "@/lib/acoes/boletim";
import { formatarMoeda, formatarQuantidade, totalLinhaCentavos } from "@/lib/dinheiro";
import { Aviso } from "@/components/aviso";
import {
  EditorLinhas,
  useLinhas,
  type ServicoDoCatalogo,
} from "@/components/orcamentos/linhas";

export type { ServicoDoCatalogo };

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

  const [nome, setNome] = useState(modelo?.nome ?? "");
  const [descricao, setDescricao] = useState(modelo?.descricao ?? "");
  const [condicoesPagamento, setCondicoesPagamento] = useState(
    modelo?.condicoesPagamento ?? "",
  );
  const [prazoExecucao, setPrazoExecucao] = useState(modelo?.prazoExecucao ?? "");
  const [observacoes, setObservacoes] = useState(modelo?.observacoes ?? "");
  const [validadeDias, setValidadeDias] = useState(String(modelo?.validadeDias ?? 15));
  const [ativo, setAtivo] = useState(modelo?.ativo ?? true);

  const linhas = useLinhas(modelo?.itens);

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
        itens: linhas.paraEnvio(),
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

      <div>
        <h4 className="titulo-secao mb-2">Itens do modelo</h4>
        <EditorLinhas ctrl={linhas} catalogo={catalogo} />
      </div>

      <div
        className="flex items-center justify-between rounded-xl px-3 py-2"
        style={{ background: "var(--superficie-2)" }}
      >
        <span className="titulo-secao">Total do modelo</span>
        <strong className="num text-lg">{formatarMoeda(linhas.subtotal)}</strong>
      </div>

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
