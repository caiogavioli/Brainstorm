"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { analisarCsv, type LinhaCsv } from "@/lib/importacao-csv";
import { resolverCondominios, validarLinhaUsuario } from "@/lib/importacao/usuarios";
import {
  importarUsuariosAction,
  type ResultadoImportacaoUsuarios,
} from "@/lib/acoes/importar-usuarios";

type LinhaPrevia = {
  linha: LinhaCsv;
  numero: number;
  nome: string;
  email: string;
  status: "criar" | "erro";
  detalhe: string;
};

/**
 * Importação de usuários por planilha CSV.
 *
 * Mesma divisão do componente irmão de condomínios: prévia inteira no
 * navegador (inclusive resolvendo os nomes de condomínio contra a lista que a
 * página já carregou), e o servidor validando tudo de novo antes de gravar —
 * é ele quem decide o que é verdade.
 *
 * A diferença que importa aqui é a senha: quando a planilha não traz uma, o
 * servidor gera e devolve UMA VEZ, só nesta resposta. Depois de sair desta
 * tela ninguém mais consegue vê-la — nem o próprio admin.
 */
export function ImportarUsuarios({
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
  const [resultado, setResultado] = useState<ResultadoImportacaoUsuarios | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [enviando, iniciarEnvio] = useTransition();

  async function aoEscolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setResultado(null);
    setCopiado(false);
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

    if (!cabecalho.includes("nome") || !cabecalho.includes("email")) {
      setErroArquivo(
        'Não encontrei as colunas "nome" e "email" no arquivo. Baixe o modelo abaixo e mantenha os mesmos nomes de coluna.',
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
        const v = validarLinhaUsuario(linha);
        if (!v.ok) {
          return {
            linha,
            numero: i + 2,
            nome: linha.nome ?? "",
            email: linha.email ?? "",
            status: "erro",
            detalhe: v.erro,
          };
        }

        if (v.dados.papel === "GESTOR") {
          const resolvidos = resolverCondominios(v.dados.condominiosNomes, condominios);
          if (!resolvidos.ok) {
            return {
              linha,
              numero: i + 2,
              nome: v.dados.nome,
              email: v.dados.email,
              status: "erro",
              detalhe: `Condomínio não encontrado: ${resolvidos.naoEncontrados.join(", ")}`,
            };
          }
        }

        return {
          linha,
          numero: i + 2,
          nome: v.dados.nome,
          email: v.dados.email,
          status: "criar",
          detalhe:
            v.dados.papel === "ADMIN"
              ? "Administrador"
              : `Gerente · ${v.dados.condominiosNomes.join(", ")}`,
        };
      }),
    );
  }

  function confirmar() {
    const validas = previa.filter((p) => p.status !== "erro").map((p) => p.linha);
    if (validas.length === 0) return;

    iniciarEnvio(async () => {
      const r = await importarUsuariosAction(validas);
      setResultado(r);
      router.refresh();
    });
  }

  function recomecar() {
    setNomeArquivo(null);
    setErroArquivo(null);
    setPrevia([]);
    setResultado(null);
    setCopiado(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function copiarCredenciais() {
    if (!resultado) return;
    const texto = resultado.resultados
      .filter((r) => r.senhaGerada)
      .map((r) => `${r.email}\t${r.senhaGerada}`)
      .join("\n");
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const prontas = previa.filter((p) => p.status === "criar").length;
  const comErro = previa.filter((p) => p.status === "erro").length;
  const credenciaisGeradas = resultado?.resultados.filter((r) => r.senhaGerada) ?? [];

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
        <h3 className="font-semibold text-sm">Importar usuários por planilha</h3>
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
        Colunas nome, email, senha, papel (ADMIN ou GESTOR) e condominios — vários
        nomes separados por <code>;</code>. Deixe "senha" em branco para o sistema
        gerar uma automaticamente.{" "}
        <a href="/modelos/usuarios.csv" download className="underline">
          Baixar modelo
        </a>
        .
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
                <span style={{ color: "var(--status-bom-texto)" }}>{prontas} pronta(s)</span>
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
                      <th>E-mail</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previa.map((p) => (
                      <tr key={p.numero}>
                        <td className="num">{p.numero}</td>
                        <td>{p.nome || "—"}</td>
                        <td className="truncate">{p.email || "—"}</td>
                        <td>
                          <span
                            className={
                              p.status === "erro" ? "badge badge-danger" : "badge badge-ok"
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
                disabled={enviando || prontas === 0}
                className="botao botao-primario w-full mt-3"
              >
                {enviando ? "Importando…" : `Confirmar importação (${prontas} linha(s))`}
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
            {resultado.criados} criado(s)
            {resultado.jaExistiam > 0
              ? `, ${resultado.jaExistiam} já existia(m) (não alterado)`
              : ""}
            {resultado.comErro > 0 ? `, ${resultado.comErro} com erro` : ""}.
          </p>

          {credenciaisGeradas.length > 0 ? (
            <div
              className="rounded-lg p-3 mb-3"
              style={{
                background: "var(--superficie-2)",
                border: "1px solid var(--borda)",
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold">
                  Senhas geradas — só aparecem aqui
                </h4>
                <button
                  type="button"
                  onClick={copiarCredenciais}
                  className="botao botao-secundario"
                  style={{ minHeight: "1.75rem", padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}
                >
                  {copiado ? "Copiado!" : "Copiar tudo"}
                </button>
              </div>
              <p className="text-xs mb-2" style={{ color: "var(--tinta-3)" }}>
                Depois de sair desta tela, ninguém — nem o admin — consegue ver essas
                senhas de novo. Copie e repasse agora por um canal seguro.
              </p>
              <ul className="text-xs space-y-0.5 num" style={{ color: "var(--tinta)" }}>
                {credenciaisGeradas.map((r) => (
                  <li key={r.email}>
                    {r.email} · <strong>{r.senhaGerada}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {resultado.comErro > 0 ? (
            <ul className="text-xs space-y-1 mb-3" style={{ color: "var(--status-critico-texto)" }}>
              {resultado.resultados
                .filter((r) => !r.ok)
                .map((r) => (
                  <li key={r.linha}>
                    Linha {r.linha} ({r.email || r.nome || "sem identificação"}): {r.erro}
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
