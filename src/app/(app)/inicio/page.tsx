import Link from "next/link";

import { exigirSessao } from "@/lib/auth";
import { carregarInicio } from "@/lib/consultas/inicio";
import { formatarData, formatarDataReferencia } from "@/lib/datas";
import {
  CRITICIDADE_CLASSE,
  CRITICIDADE_LABEL,
  STATUS_OCORRENCIA_CLASSE,
  STATUS_OCORRENCIA_LABEL,
} from "@/lib/labels";
import { MarcadorSLA } from "@/components/marcador-sla";

export const metadata = { title: "Início — Boletim Informativo Diário" };

/**
 * Quantas ocorrências entram no destaque.
 *
 * Cinco, e não a lista inteira: no celular cada cartão ocupa quase um terço da
 * tela, então doze empurrariam o botão do boletim para três telas de rolagem —
 * exatamente o contrário de "logo abaixo". Destaque é o que é urgente, não o
 * que existe; o resto continua a um toque em "ver todas".
 */
const MAXIMO_EM_DESTAQUE = 5;

/**
 * Tela inicial de quem preenche o boletim.
 *
 * A ordem da página é deliberada e responde à rotina: primeiro o que está
 * aberto e cobrando resposta, depois o boletim de hoje. Abrir no formulário
 * faria o pendente virar segunda tela — e segunda tela é tela que não se abre.
 */
export default async function PaginaInicio() {
  const sessao = await exigirSessao();
  const dados = await carregarInicio(sessao);

  const { resumo } = dados;
  const emDestaque = dados.ocorrencias.slice(0, MAXIMO_EM_DESTAQUE);
  const faltamHoje = dados.pendencias.filter((p) => !p.enviadoHoje);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Olá, {sessao.nome.split(" ")[0]}</h1>
        <p className="text-sm" style={{ color: "var(--tinta-2)" }}>
          {formatarDataReferencia(dados.hoje)} ·{" "}
          {dados.pendencias.length === 1
            ? dados.pendencias[0].nome
            : `${dados.pendencias.length} condomínio(s) sob sua responsabilidade`}
        </p>
      </div>

      {/* ------------------------------------------------ Ocorrências ------ */}
      <section className="card card-pad mb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
          <h2 className="text-lg font-bold">Ocorrências em aberto</h2>
          {dados.ocorrencias.length > 0 ? (
            <Link
              href="/ocorrencias"
              className="text-xs font-semibold underline sem-impressao"
              style={{ color: "var(--serie-1)" }}
            >
              Ver todas ({dados.ocorrencias.length})
            </Link>
          ) : null}
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--tinta-3)" }}>
          Tudo que você apontou e ainda não foi concluído. Toque em uma para
          registrar o andamento, anexar foto ou dar por concluída.
        </p>

        {dados.ocorrencias.length === 0 ? (
          <div
            className="flex h-24 items-center justify-center rounded-lg text-center text-sm"
            style={{ background: "var(--superficie-2)", color: "var(--tinta-3)" }}
          >
            Nenhuma ocorrência em aberto. ✓
          </div>
        ) : (
          <>
            {/* O placar antes da lista: mesmo com 40 itens abertos, o que muda
                a manhã é quantos furaram o prazo. */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Contador
                valor={resumo.atrasadas}
                rotulo="Em atraso"
                destaque={resumo.atrasadas > 0 ? "critico" : null}
              />
              <Contador
                valor={resumo.venceEmBreve}
                rotulo="Vencem em ≤3d"
                destaque={resumo.venceEmBreve > 0 ? "atencao" : null}
              />
              <Contador
                valor={resumo.semPlano}
                rotulo="Sem plano de ação"
                destaque={resumo.semPlano > 0 ? "atencao" : null}
              />
            </div>

            <ul className="space-y-2">
              {emDestaque.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/ocorrencias/${o.id}`}
                    className="block rounded-xl p-3 transition-colors"
                    style={{
                      border: `1px solid ${
                        (o.diasAteSLA ?? 1) < 0
                          ? "color-mix(in srgb, var(--status-critico) 45%, transparent)"
                          : "var(--borda)"
                      }`,
                      background:
                        (o.diasAteSLA ?? 1) < 0
                          ? "color-mix(in srgb, var(--status-critico) 7%, var(--superficie))"
                          : "var(--superficie)",
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{o.setor}</span>
                      <span className={CRITICIDADE_CLASSE[o.criticidade]}>
                        {CRITICIDADE_LABEL[o.criticidade]}
                      </span>
                      <span className={STATUS_OCORRENCIA_CLASSE[o.status]}>
                        {STATUS_OCORRENCIA_LABEL[o.status]}
                      </span>
                      <MarcadorSLA dias={o.diasAteSLA} />
                      {o.totalRecorrencias > 0 ? (
                        <span className="badge badge-neutral">
                          Reincidente ({o.totalRecorrencias + 1}×)
                        </span>
                      ) : null}
                    </div>

                    <p
                      className="text-sm line-clamp-2"
                      style={{ color: "var(--tinta-2)" }}
                    >
                      {o.descricao}
                    </p>

                    <div
                      className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
                      style={{ color: "var(--tinta-3)" }}
                    >
                      {dados.pendencias.length > 1 ? <span>{o.condominio}</span> : null}
                      <span className="num">
                        Previsão: {formatarData(o.previsaoFinalizacao)}
                      </span>
                      {!o.planoAcao?.trim() ? (
                        <span style={{ color: "var(--status-critico-texto)" }}>
                          sem plano de ação
                        </span>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {dados.ocorrencias.length > emDestaque.length ? (
              <Link
                href="/ocorrencias"
                className="botao botao-secundario w-full mt-3 sem-impressao"
              >
                Ver as outras {dados.ocorrencias.length - emDestaque.length}
              </Link>
            ) : null}
          </>
        )}
      </section>

      {/* ------------------------------------------------ Boletim de hoje -- */}
      <section className="card card-pad">
        <h2 className="text-lg font-bold mb-1">Boletim de hoje</h2>
        <p className="text-sm mb-4" style={{ color: "var(--tinta-2)" }}>
          {faltamHoje.length === 0 ? (
            <>
              Já enviado
              {dados.pendencias.length > 1 ? " em todos os seus condomínios" : ""}. Se
              precisar corrigir algo, é só lançar de novo.
            </>
          ) : dados.pendencias.length === 1 ? (
            <>Ainda não enviado. Leva cerca de 2 minutos.</>
          ) : (
            <>
              Falta enviar em{" "}
              <strong>
                {faltamHoje.length} de {dados.pendencias.length}
              </strong>
              : {faltamHoje.map((p) => p.nome).join(", ")}.
            </>
          )}
        </p>

        <Link
          href={
            faltamHoje.length === 1
              ? `/boletim/novo?condominio=${faltamHoje[0].condominioId}`
              : "/boletim/novo"
          }
          className="botao botao-primario w-full"
          style={{ minHeight: "3.25rem", fontSize: "1rem" }}
        >
          {faltamHoje.length === 0 ? "Lançar outro boletim" : "Iniciar novo boletim"}
        </Link>

        <Link
          href="/boletim"
          className="botao botao-secundario w-full mt-2 sem-impressao"
        >
          Ver boletins anteriores
        </Link>
      </section>
    </div>
  );
}

function Contador({
  valor,
  rotulo,
  destaque,
}: {
  valor: number;
  rotulo: string;
  destaque: "critico" | "atencao" | null;
}) {
  const cor =
    destaque === "critico"
      ? "var(--status-critico-texto)"
      : destaque === "atencao"
        ? "color-mix(in srgb, var(--status-atencao) 72%, var(--tinta))"
        : "var(--tinta-3)";

  return (
    <div
      className="rounded-lg px-3 py-2 text-center"
      style={{ background: "var(--superficie-2)" }}
    >
      <div className="num font-bold leading-none" style={{ fontSize: "1.5rem", color: cor }}>
        {valor}
      </div>
      <div className="text-xs mt-1" style={{ color: "var(--tinta-2)" }}>
        {rotulo}
      </div>
    </div>
  );
}
