import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { exigirSessao, podeAcessarCondominio } from "@/lib/auth";
import {
  diasAteSLA,
  formatarData,
  formatarDataHora,
  paraInputDate,
} from "@/lib/datas";
import {
  CRITICIDADE_CLASSE,
  CRITICIDADE_LABEL,
  STATUS_OCORRENCIA_CLASSE,
  STATUS_OCORRENCIA_LABEL,
} from "@/lib/labels";
import { MarcadorSLA } from "@/components/marcador-sla";
import { PainelGestaoOcorrencia } from "@/components/ocorrencias/painel-gestao";

export const metadata = { title: "Ocorrência — Gestão de Condomínios" };

export default async function PaginaOcorrencia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sessao = await exigirSessao();
  const { id } = await params;

  const ocorrencia = await prisma.ocorrencia.findUnique({
    where: { id: Number(id) },
    include: {
      condominio: { select: { nome: true } },
      checklistItem: { select: { nome: true } },
      abertaPor: { select: { nome: true } },
      boletim: { select: { id: true, dataReferencia: true } },
      recorrencias: {
        orderBy: { dataReferencia: "desc" },
        select: { id: true, dataReferencia: true, observacao: true, boletimId: true },
      },
      fotos: true,
      historico: {
        orderBy: { criadoEm: "desc" },
        include: { usuario: { select: { nome: true } } },
      },
    },
  });

  if (!ocorrencia || !podeAcessarCondominio(sessao, ocorrencia.condominioId)) {
    notFound();
  }

  const setor = ocorrencia.checklistItem?.nome ?? ocorrencia.setorLivre ?? "—";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold">{setor}</h1>
            <span className={CRITICIDADE_CLASSE[ocorrencia.criticidade]}>
              {CRITICIDADE_LABEL[ocorrencia.criticidade]}
            </span>
            <span className={STATUS_OCORRENCIA_CLASSE[ocorrencia.status]}>
              {STATUS_OCORRENCIA_LABEL[ocorrencia.status]}
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
            {ocorrencia.condominio.nome} · Ocorrência #{ocorrencia.id} · aberta em{" "}
            <span className="num">{formatarData(ocorrencia.dataAbertura)}</span>
            {ocorrencia.abertaPor ? ` por ${ocorrencia.abertaPor.nome}` : ""}
          </p>
        </div>
        <Link href="/ocorrencias" className="botao botao-secundario sem-impressao">
          Voltar
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <div className="card card-pad">
            <div className="titulo-secao mb-2">Descrição do problema</div>
            <p className="text-sm whitespace-pre-wrap">{ocorrencia.descricao}</p>

            {ocorrencia.boletim ? (
              <p className="mt-3 text-xs" style={{ color: "var(--tinta-3)" }}>
                Gerada pelo{" "}
                <Link
                  href={`/boletim/${ocorrencia.boletim.id}`}
                  className="underline"
                  style={{ color: "var(--serie-1)" }}
                >
                  boletim de {formatarData(ocorrencia.boletim.dataReferencia)}
                </Link>
                .
              </p>
            ) : (
              <p className="mt-3 text-xs" style={{ color: "var(--tinta-3)" }}>
                Ocorrência avulsa (não originada de boletim).
              </p>
            )}
          </div>

          {ocorrencia.recorrencias.length > 0 ? (
            <div
              className="card card-pad"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--status-critico) 40%, transparent)",
              }}
            >
              <div className="titulo-secao mb-2">
                Problema recorrente — {ocorrencia.recorrencias.length + 1} boletins
              </div>
              <p className="text-sm mb-3" style={{ color: "var(--tinta-2)" }}>
                Este mesmo problema foi reencontrado em boletins posteriores. Em
                vez de abrir uma ocorrência nova a cada dia, os registros ficam
                todos aqui — <strong>um problema, um plano de ação</strong>.
              </p>
              <ul className="space-y-1.5">
                {ocorrencia.recorrencias.map((r) => (
                  <li key={r.id} className="flex gap-3 text-sm">
                    <Link
                      href={`/boletim/${r.boletimId}`}
                      className="num font-semibold flex-none"
                      style={{ color: "var(--serie-1)" }}
                    >
                      {formatarData(r.dataReferencia)}
                    </Link>
                    <span style={{ color: "var(--tinta-2)" }}>
                      {r.observacao ?? "Registrado novamente, sem novo detalhe."}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {ocorrencia.fotos.length > 0 ? (
            <div className="card card-pad">
              <div className="titulo-secao mb-2">
                Fotos ({ocorrencia.fotos.length})
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ocorrencia.fotos.map((foto) => (
                  <a
                    key={foto.id}
                    href={foto.caminho}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={foto.caminho}
                      alt={`Foto da ocorrência ${ocorrencia.id}`}
                      className="h-32 w-full rounded-lg object-cover"
                      style={{ border: "1px solid var(--borda)" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="card card-pad">
            <div className="titulo-secao mb-2">Plano de ação</div>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--tinta-2)" }}>
              {ocorrencia.planoAcao ?? "Ainda não informado."}
            </p>
          </div>

          <div className="card card-pad">
            <div className="titulo-secao mb-3">
              Histórico ({ocorrencia.historico.length})
            </div>
            <ol className="space-y-3">
              {ocorrencia.historico.map((log) => (
                <li key={log.id} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2 w-2 flex-none rounded-full"
                    style={{ background: "var(--serie-1)" }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm">{log.mensagem}</p>
                    <p className="text-xs num" style={{ color: "var(--tinta-3)" }}>
                      {formatarDataHora(log.criadoEm)}
                      {log.usuario ? ` · ${log.usuario.nome}` : ""}
                    </p>
                  </div>
                </li>
              ))}
              {ocorrencia.historico.length === 0 ? (
                <li className="text-sm" style={{ color: "var(--tinta-3)" }}>
                  Sem registros de atualização.
                </li>
              ) : null}
            </ol>
          </div>
        </div>

        {/* Painel de gestão */}
        <aside className="space-y-4">
          <div className="card card-pad">
            <div className="titulo-secao mb-2">Prazo</div>
            <div className="text-sm num mb-2">
              {formatarData(ocorrencia.previsaoFinalizacao)}
            </div>
            <MarcadorSLA
              dias={diasAteSLA(ocorrencia.previsaoFinalizacao)}
              concluida={ocorrencia.status === "CONCLUIDO"}
            />
            {ocorrencia.totalRecorrencias > 0 ? (
              <p className="mt-2 text-xs num" style={{ color: "var(--status-critico-texto)" }}>
                ▲ Reapareceu em {ocorrencia.totalRecorrencias}{" "}
                {ocorrencia.totalRecorrencias > 1 ? "boletins" : "boletim"} depois
              </p>
            ) : null}
            {ocorrencia.dataConclusao ? (
              <p className="mt-2 text-xs num" style={{ color: "var(--tinta-3)" }}>
                Concluída em {formatarData(ocorrencia.dataConclusao)}
              </p>
            ) : null}
          </div>

          <div className="card card-pad sem-impressao">
            <div className="titulo-secao mb-3">Gerenciar</div>
            <PainelGestaoOcorrencia
              id={ocorrencia.id}
              status={ocorrencia.status}
              criticidade={ocorrencia.criticidade}
              previsaoFinalizacao={paraInputDate(ocorrencia.previsaoFinalizacao)}
              planoAcao={ocorrencia.planoAcao ?? ""}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
