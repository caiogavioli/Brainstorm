"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import {
  alternarServicoAction,
  excluirServicoAction,
  salvarServicoAction,
} from "@/lib/acoes/servicos";
import type { ResultadoAcao } from "@/lib/acoes/boletim";
import { centavosParaCampo, formatarMoeda } from "@/lib/dinheiro";
import { Aviso } from "@/components/aviso";

export type ServicoEditavel = {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  categoria: string;
  unidade: string;
  valorPadraoCentavos: number;
  ordem: number;
  ativo: boolean;
  usadoEmModelos: number;
};

/** Unidades sugeridas. É `datalist`, não `select`: a lista ajuda sem impedir. */
const UNIDADES = ["un", "h", "dia", "mês", "m²", "m", "kg", "visita", "verba"];

function BotaoSalvar({ rotulo }: { rotulo: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario w-full" disabled={pending}>
      {pending ? "Salvando…" : rotulo}
    </button>
  );
}

export function FormularioServico({
  servico,
  categorias,
  aoSalvar,
}: {
  servico?: ServicoEditavel;
  categorias: string[];
  aoSalvar?: () => void;
}) {
  const router = useRouter();
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    salvarServicoAction,
    null,
  );
  const [chaveReset, setChaveReset] = useState(0);
  const edicao = servico != null;
  const s = edicao ? `-${servico.id}` : "";

  useEffect(() => {
    if (estado?.ok) {
      router.refresh();
      if (edicao) aoSalvar?.();
      else setChaveReset((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, router]);

  return (
    <form action={acao} key={chaveReset} className="space-y-3">
      {edicao ? <input type="hidden" name="id" value={servico.id} /> : null}

      <div>
        <label className="rotulo" htmlFor={`servico-nome${s}`}>
          Nome do serviço
        </label>
        <input
          id={`servico-nome${s}`}
          name="nome"
          className="campo"
          required
          placeholder="Limpeza de caixa d'água"
          defaultValue={servico?.nome ?? ""}
        />
      </div>

      <div>
        <label className="rotulo" htmlFor={`servico-descricao${s}`}>
          Descrição
        </label>
        <textarea
          id={`servico-descricao${s}`}
          name="descricao"
          className="campo"
          rows={2}
          placeholder="O texto que vai aparecer no orçamento"
          defaultValue={servico?.descricao ?? ""}
        />
      </div>

      <div>
        <label className="rotulo" htmlFor={`servico-categoria${s}`}>
          Categoria
        </label>
        <input
          id={`servico-categoria${s}`}
          name="categoria"
          className="campo"
          list={`categorias${s}`}
          placeholder="Geral"
          defaultValue={servico?.categoria ?? ""}
        />
        <datalist id={`categorias${s}`}>
          {categorias.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="rotulo" htmlFor={`servico-unidade${s}`}>
            Unidade
          </label>
          <input
            id={`servico-unidade${s}`}
            name="unidade"
            className="campo"
            list={`unidades${s}`}
            placeholder="un"
            defaultValue={servico?.unidade ?? ""}
          />
          <datalist id={`unidades${s}`}>
            {UNIDADES.map((u) => (
              <option key={u} value={u} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="rotulo" htmlFor={`servico-valor${s}`}>
            Valor padrão (R$)
          </label>
          <input
            id={`servico-valor${s}`}
            name="valorPadrao"
            className="campo num"
            inputMode="decimal"
            placeholder="0,00"
            defaultValue={
              servico ? centavosParaCampo(servico.valorPadraoCentavos) : ""
            }
          />
        </div>
      </div>

      <div>
        <label className="rotulo" htmlFor={`servico-ordem${s}`}>
          Ordem na lista
        </label>
        <input
          id={`servico-ordem${s}`}
          name="ordem"
          type="number"
          min={0}
          max={9999}
          className="campo num"
          defaultValue={servico?.ordem ?? 0}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={servico?.ativo ?? true}
          className="h-4 w-4"
        />
        Ativo — pode ser usado em novos orçamentos
      </label>

      <Aviso estado={estado} />

      <BotaoSalvar rotulo={edicao ? "Salvar alterações" : "Adicionar ao catálogo"} />
    </form>
  );
}

/** Lista do catálogo, agrupada por categoria. */
export function ListaServicos({
  servicos,
  categorias,
}: {
  servicos: ServicoEditavel[];
  categorias: string[];
}) {
  if (servicos.length === 0) {
    return (
      <div className="card card-pad">
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          O catálogo está vazio. Cadastre os serviços que você vende com mais
          frequência — é o que vai permitir montar um orçamento em minutos, com o
          mesmo texto e o mesmo preço toda vez.
        </p>
      </div>
    );
  }

  const grupos = new Map<string, ServicoEditavel[]>();
  for (const servico of servicos) {
    const lista = grupos.get(servico.categoria);
    if (lista) lista.push(servico);
    else grupos.set(servico.categoria, [servico]);
  }

  return (
    <div className="space-y-4">
      {[...grupos.entries()].map(([categoria, lista]) => (
        <section key={categoria}>
          <h3 className="titulo-secao mb-2">{categoria}</h3>
          <div className="space-y-2">
            {lista.map((servico) => (
              <LinhaServico
                key={servico.id}
                servico={servico}
                categorias={categorias}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function LinhaServico({
  servico,
  categorias,
}: {
  servico: ServicoEditavel;
  categorias: string[];
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [estado, setEstado] = useState<ResultadoAcao | null>(null);
  const [processando, iniciar] = useTransition();

  function executar(acao: () => Promise<ResultadoAcao>) {
    iniciar(async () => {
      const r = await acao();
      setEstado(r);
      if (r.ok) router.refresh();
    });
  }

  return (
    <div className="card card-pad">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold">{servico.nome}</div>
          {servico.descricao ? (
            <p className="text-xs mt-0.5" style={{ color: "var(--tinta-2)" }}>
              {servico.descricao}
            </p>
          ) : null}
          <p className="text-xs mt-1 num" style={{ color: "var(--tinta-3)" }}>
            {servico.codigo}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="font-semibold num">
            {formatarMoeda(servico.valorPadraoCentavos)}
          </div>
          <div className="text-xs" style={{ color: "var(--tinta-3)" }}>
            por {servico.unidade}
          </div>
          {!servico.ativo ? (
            <span className="badge badge-neutral mt-1">Inativo</span>
          ) : null}
        </div>
      </div>

      <div
        className="mt-3 pt-3 flex flex-wrap items-center gap-4"
        style={{ borderTop: "1px solid var(--borda)" }}
      >
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className="text-xs font-semibold underline"
          style={{ color: "var(--serie-1)" }}
          aria-expanded={aberto}
        >
          {aberto ? "Fechar edição" : "Editar"}
        </button>

        <button
          type="button"
          disabled={processando}
          onClick={() => executar(() => alternarServicoAction(servico.id, !servico.ativo))}
          className="text-xs font-semibold underline"
          style={{
            color: servico.ativo ? "var(--tinta-2)" : "var(--status-bom-texto)",
          }}
        >
          {processando ? "…" : servico.ativo ? "Desativar" : "Reativar"}
        </button>

        {/* Serviço em uso não oferece exclusão: o caminho certo é desativar, e
            um botão que só devolve erro é ruído. */}
        {servico.usadoEmModelos === 0 ? (
          <button
            type="button"
            disabled={processando}
            onClick={() => executar(() => excluirServicoAction(servico.id))}
            className="text-xs font-semibold underline"
            style={{ color: "var(--status-critico-texto)" }}
          >
            Excluir
          </button>
        ) : (
          <span className="text-xs num" style={{ color: "var(--tinta-3)" }}>
            usado em {servico.usadoEmModelos} modelo(s)
          </span>
        )}
      </div>

      <Aviso estado={estado} className="mt-3" />

      {aberto ? (
        <div
          className="mt-3 rounded-xl p-3"
          style={{ background: "var(--superficie-2)" }}
        >
          <FormularioServico
            servico={servico}
            categorias={categorias}
            aoSalvar={() => setAberto(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
