"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { analisarCsv, type LinhaCsv } from "@/lib/importacao-csv";
import { validarLinhaCondominio } from "@/lib/importacao/condominios";
import {
  importarCondominiosAction,
  type ResultadoImportacaoCondominios,
} from "@/lib/acoes/importar-condominios";

type LinhaPrevia = {
  linha: LinhaCsv;
  numero: number;
  nome: string;
  status: "criar" | "atualizar" | "erro";
  detalhe: string;
};

/**
 * Importação de condomínios por planilha CSV.
 *
 * A prévia roda inteira no navegador, sem nenhuma ida ao servidor — inclusive
 * o "vai criar" vs. "vai atualizar", que só é possível porque a página já traz
 * a lista de condomínios existentes. Isso é conveniência para quem está
 * revisando antes de confirmar; a validação que decide o que é gravado roda
 * de novo no servidor, porque é ele quem decide o que é verdade — o cliente
 * pode errar, mentir ou estar com uma prévia desatualizada.
 */
export function ImportarCondominios({
  condominios,
}: {
  condominios: { id: number; nome: string }[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [aberto, setAberto] = useState(false);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [erroArquivo, setErroArquivo] = useState<string | null>(null);
  const [previa, setPrevia] = useState<LinhaPrevia[]>([]);
  const [resultado, setResultado] = useState<ResultadoImportacaoCondominios | null>(null);
  const [enviando, iniciarEnvio] = useTransition();

  const nomesExistentes = new Set(condominios.map((c) => c.nome));

  async function aoEscolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setResultado(null);
    setNomeArquivo(arquivo.name);
    setErroArquivo(null);

    if (/\.(xlsx|xls)$/i.test(arquivo.name)) {
      setErroArquivo(
        'Esse arquivo parece ser do Excel. No Excel ou Google Sheets, use "Salvar como" ou "Fazer download" escolhendo o formato CSV, e envie o arquivo .csv gerado.',
      );
      setPrevia([]);
      return;
    }

    const texto = await arquivo.text();
    const { cabecalho, linhas } = analisarCsv(texto);

    if (!cabecalho.includes("nome")) {
      setErroArquivo(
        'Não encontrei a coluna "nome" no arquivo. Baixe o modelo abaixo e mantenha os mesmos nomes de coluna.',
      );
      setPrevia([]);
      return;
    }

    if (linhas.length === 0) {
      setErroArquivo("A planilha não tem nenhuma linha de dado, só o cabeçalho.");
      setPrevia([]);
      return;
    }

    setPrevia(
      linhas.map((linha, i) => {
        const v = validarLinhaCondominio(linha);
        if (!v.ok) {
          return { linha, numero: i + 2, nome: linha.nome ?? "", status: "erro", detalhe: v.erro };
        }
        const jaExiste = nomesExistentes.has(v.dados.nome);
        return {
          linha,
          numero: i + 2,
          nome: v.dados.nome,
          status: jaExiste ? "atualizar" : "criar",
          detalhe: jaExiste
            ? "Já cadastrado — os campos serão substituídos pelos desta planilha."
            : "Condomínio novo.",
        };
      }),
    );
  }

  function confirmar() {
    const validas = previa.filter((p) => p.status !== "erro").map((p) => p.linha);
    if (validas.length === 0) return;

    iniciarEnvio(async () => {
      const r = await importarCondominiosAction(validas);
      setResultado(r);
      router.refresh();
    });
  }

  function recomecar() {
    setNomeArquivo(null);
    setErroArquivo(null);
    setPrevia([]);
    setResultado(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const aCriar = previa.filter((p) => p.status === "criar").length;
  const aAtualizar = previa.filter((p) => p.status === "atualizar").length;
  const comErro = previa.filter((p) => p.status === "erro").length;

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="botao botao-secundario w-full"
      >
        Importar planilha
      </button>
    );
  }

  return (
    <div className="rounded-xl p-3" style={{ border: "1px solid var(--borda)" }}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm">Importar condomínios por planilha</h3>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="text-xs underline"
          style={{ color: "var(--tinta-3)" }}
        >
          fechar
        </button>
      </div>

      <p className="text-xs mb-3" style={{ color: "var(--tinta-2)" }}>
        Arquivo CSV com as colunas nome, endereco, gerente_responsavel, telefone,
        email e ativo. Só "nome" é obrigatório.{" "}
        <a href="/modelos/condominios.csv" download className="underline">
          Baixar modelo
        </a>
        . Um nome que já existe é <strong>substituído</strong> pelos dados desta
        planilha — coluna em branco apaga o valor antigo daquele campo.
      </p>

      {!resultado ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={aoEscolherArquivo}
            className="campo"
            style={{ padding: "0.5rem" }}
          />

          {erroArquivo ? (
            <p
              className="text-sm rounded-lg px-3 py-2 mt-3"
              style={{
                color: "var(--status-critico-texto)",
                background: "color-mix(in srgb, var(--status-critico) 10%, var(--superficie))",
                border: "1px solid color-mix(in srgb, var(--status-critico) 30%, transparent)",
              }}
            >
              {erroArquivo}
            </p>
          ) : null}

          {nomeArquivo && previa.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm mb-2" style={{ color: "var(--tinta-2)" }}>
                <strong className="num">{previa.length}</strong> linha(s) em{" "}
                {nomeArquivo} ·{" "}
                <span style={{ color: "var(--status-bom-texto)" }}>
                  {aCriar} novo(s)
                </span>{" "}
                ·{" "}
                <span style={{ color: "var(--tinta-2)" }}>{aAtualizar} atualização(ões)</span>
                {comErro > 0 ? (
                  <>
                    {" "}
                    ·{" "}
                    <span style={{ color: "var(--status-critico-texto)" }}>
                      {comErro} com problema
                    </span>
                  </>
                ) : null}
              </p>

              <div className="tabela-rolagem" style={{ maxHeight: "16rem" }}>
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Linha</th>
                      <th>Nome</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previa.map((p) => (
                      <tr key={p.numero}>
                        <td className="num">{p.numero}</td>
                        <td>{p.nome || "—"}</td>
                        <td>
                          <span
                            className={
                              p.status === "erro"
                                ? "badge badge-danger"
                                : p.status === "atualizar"
                                  ? "badge badge-neutral"
                                  : "badge badge-ok"
                            }
                          >
                            {p.detalhe}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={confirmar}
                disabled={enviando || aCriar + aAtualizar === 0}
                className="botao botao-primario w-full mt-3"
              >
                {enviando
                  ? "Importando…"
                  : `Confirmar importação (${aCriar + aAtualizar} linha(s))`}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div>
          <p
            className="text-sm rounded-lg px-3 py-2 mb-3"
            style={{
              color: "var(--status-bom-texto)",
              background: "color-mix(in srgb, var(--status-bom) 10%, var(--superficie))",
              border: "1px solid color-mix(in srgb, var(--status-bom) 30%, transparent)",
            }}
          >
            {resultado.criados} criado(s), {resultado.atualizados} atualizado(s)
            {resultado.comErro > 0 ? `, ${resultado.comErro} com erro` : ""}.
          </p>

          {resultado.comErro > 0 ? (
            <ul className="text-xs space-y-1 mb-3" style={{ color: "var(--status-critico-texto)" }}>
              {resultado.resultados
                .filter((r) => !r.ok)
                .map((r) => (
                  <li key={r.linha}>
                    Linha {r.linha} ({r.nome || "sem nome"}): {r.erro}
                  </li>
                ))}
            </ul>
          ) : null}

          <button type="button" onClick={recomecar} className="botao botao-secundario w-full">
            Importar outro arquivo
          </button>
        </div>
      )}
    </div>
  );
}
