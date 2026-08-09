import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { exigirSessao, podeAcessarCondominio } from "@/lib/auth";
import { GRUPOS } from "@/lib/checklist";
import { formatarDataHora, formatarDataReferencia } from "@/lib/datas";
import {
  CRITICIDADE_CLASSE,
  CRITICIDADE_LABEL,
  SITUACAO_CLASSE,
  SITUACAO_LABEL,
  STATUS_DIA_CLASSE,
  STATUS_DIA_LABEL,
  STATUS_OCORRENCIA_CLASSE,
  STATUS_OCORRENCIA_LABEL,
} from "@/lib/labels";

export const metadata = { title: "Boletim — Gestão de Condomínios" };

export default async function PaginaBoletim({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ criado?: string }>;
}) {
  const sessao = await exigirSessao();
  const { id } = await params;
  const { criado } = await searchParams;

  const boletim = await prisma.boletim.findUnique({
    where: { id: Number(id) },
    include: {
      condominio: true,
      criadoPor: { select: { nome: true } },
      itens: { include: { checklistItem: true } },
      ocorrencias: {
        include: { checklistItem: { select: { nome: true } } },
        orderBy: { criticidade: "desc" },
      },
    },
  });

  if (!boletim || !podeAcessarCondominio(sessao, boletim.condominioId)) notFound();

  const naoConformes = boletim.itens.filter((i) => i.situacao === "NAO_CONFORME");

  return (
    <div className="mx-auto max-w-3xl">
      {criado ? (
        <div
          className="mb-4 rounded-xl px-4 py-3 text-sm sem-impressao"
          role="status"
          style={{
            color: "var(--status-bom-texto)",
            background: "color-mix(in srgb, var(--status-bom) 10%, var(--superficie))",
            border: "1px solid color-mix(in srgb, var(--status-bom) 32%, transparent)",
          }}
        >
          <strong>Boletim registrado.</strong>{" "}
          {boletim.ocorrencias.length > 0
            ? `${boletim.ocorrencias.length} ocorrência(s) foram abertas automaticamente.`
            : "Nenhuma não conformidade registrada."}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{boletim.condominio.nome}</h1>
          <p className="text-sm num" style={{ color: "var(--tinta-2)" }}>
            Boletim de {formatarDataReferencia(boletim.dataReferencia)} · enviado em{" "}
            {formatarDataHora(boletim.dataRegistro)}
            {boletim.criadoPor ? ` por ${boletim.criadoPor.nome}` : ""}
          </p>
        </div>
        <div className="flex gap-2 sem-impressao">
          <Link href="/boletim" className="botao botao-secundario">
            Voltar
          </Link>
        </div>
      </div>

      {/* Resumo do dia */}
      <div className="card card-pad mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="titulo-secao mb-1">Status do dia</div>
            <span className={STATUS_DIA_CLASSE[boletim.statusGeral]}>
              {STATUS_DIA_LABEL[boletim.statusGeral]}
            </span>
          </div>
          <div>
            <div className="titulo-secao mb-1">Não conformes</div>
            <div className="text-2xl font-bold num">{naoConformes.length}</div>
          </div>
          <div>
            <div className="titulo-secao mb-1">Ocorrências</div>
            <div className="text-2xl font-bold num">{boletim.ocorrencias.length}</div>
          </div>
          <div>
            <div className="titulo-secao mb-1">Faltas</div>
            <div className="text-sm font-medium">
              {boletim.houveFaltas ? (
                <>
                  <span className="num">{boletim.qtdeFaltas}</span> —{" "}
                  {boletim.setoresFaltas}
                </>
              ) : (
                <span style={{ color: "var(--tinta-3)" }}>Nenhuma</span>
              )}
            </div>
          </div>
        </div>

        {boletim.observacoes ? (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--grade)" }}>
            <div className="titulo-secao mb-1">Observações gerais</div>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--tinta-2)" }}>
              {boletim.observacoes}
            </p>
          </div>
        ) : null}
      </div>

      {/* Ocorrências abertas por este boletim */}
      {boletim.ocorrencias.length > 0 ? (
        <div className="card card-pad mb-4">
          <h2 className="font-semibold mb-3">Ocorrências geradas</h2>
          <ul className="space-y-2">
            {boletim.ocorrencias.map((o) => (
              <li
                key={o.id}
                className="rounded-lg p-3"
                style={{ border: "1px solid var(--grade)" }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Link
                    href={`/ocorrencias/${o.id}`}
                    className="font-semibold text-sm"
                    style={{ color: "var(--serie-1)" }}
                  >
                    {o.checklistItem?.nome ?? o.setorLivre ?? "Ocorrência"}
                  </Link>
                  <span className={CRITICIDADE_CLASSE[o.criticidade]}>
                    {CRITICIDADE_LABEL[o.criticidade]}
                  </span>
                  <span className={STATUS_OCORRENCIA_CLASSE[o.status]}>
                    {STATUS_OCORRENCIA_LABEL[o.status]}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
                  {o.descricao}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Checklist completo por grupo */}
      {GRUPOS.map((grupo) => {
        const doGrupo = boletim.itens
          .filter((i) => i.checklistItem.grupo === grupo.chave)
          .sort((a, b) => a.checklistItem.ordem - b.checklistItem.ordem);
        if (doGrupo.length === 0) return null;

        return (
          <div key={grupo.chave} className="card card-pad mb-4">
            <h2 className="font-semibold mb-3">{grupo.titulo}</h2>
            <ul className="space-y-1">
              {doGrupo.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 py-1.5"
                  style={{ borderBottom: "1px solid var(--grade)" }}
                >
                  <div className="min-w-0">
                    <div className="text-sm">{item.checklistItem.nome}</div>
                    {item.observacao ? (
                      <p className="text-xs mt-0.5" style={{ color: "var(--tinta-3)" }}>
                        {item.observacao}
                      </p>
                    ) : null}
                  </div>
                  <span className={`${SITUACAO_CLASSE[item.situacao]} flex-none`}>
                    {SITUACAO_LABEL[item.situacao]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
