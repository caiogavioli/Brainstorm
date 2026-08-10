"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import type { Papel } from "@prisma/client";

import {
  atualizarUsuarioAction,
  criarUsuarioAction,
  excluirUsuarioAction,
  redefinirSenhaAction,
} from "@/lib/acoes/usuarios";
import type { ResultadoAcao } from "@/lib/acoes/boletim";

type Condominio = { id: number; nome: string };

function Aviso({ estado }: { estado: ResultadoAcao | null }) {
  if (!estado) return null;
  return (
    <p
      role="status"
      className="text-sm rounded-lg px-3 py-2"
      style={
        estado.ok
          ? {
              color: "var(--status-bom-texto)",
              background: "color-mix(in srgb, var(--status-bom) 10%, var(--superficie))",
              border: "1px solid color-mix(in srgb, var(--status-bom) 30%, transparent)",
            }
          : {
              color: "var(--status-critico-texto)",
              background: "color-mix(in srgb, var(--status-critico) 10%, var(--superficie))",
              border: "1px solid color-mix(in srgb, var(--status-critico) 30%, transparent)",
            }
      }
    >
      {estado.ok ? estado.mensagem : estado.erro}
    </p>
  );
}

function Botao({ rotulo }: { rotulo: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao botao-primario w-full" disabled={pending}>
      {pending ? "Salvando…" : rotulo}
    </button>
  );
}

/** Lista de condomínios com caixas de seleção — o escopo do gerente. */
function SeletorCondominios({
  condominios,
  selecionados,
  desabilitado,
}: {
  condominios: Condominio[];
  selecionados?: number[];
  desabilitado?: boolean;
}) {
  return (
    <fieldset className="space-y-1.5" disabled={desabilitado}>
      <legend className="rotulo">Condomínios que este usuário pode operar</legend>
      {condominios.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--tinta-3)" }}>
          Nenhum condomínio cadastrado ainda.
        </p>
      ) : (
        condominios.map((c) => (
          <label key={c.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="condominios"
              value={c.id}
              defaultChecked={selecionados?.includes(c.id)}
              className="h-4 w-4"
            />
            {c.nome}
          </label>
        ))
      )}
      {desabilitado ? (
        <p className="text-xs" style={{ color: "var(--tinta-3)" }}>
          Administradores enxergam todos os condomínios automaticamente.
        </p>
      ) : null}
    </fieldset>
  );
}

export function FormularioNovoUsuario({ condominios }: { condominios: Condominio[] }) {
  const router = useRouter();
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    criarUsuarioAction,
    null,
  );
  const [papel, setPapel] = useState<Papel>("GESTOR");
  const [chaveReset, setChaveReset] = useState(0);

  useEffect(() => {
    if (estado?.ok) {
      router.refresh();
      setChaveReset((k) => k + 1);
    }
  }, [estado, router]);

  return (
    <form action={acao} key={chaveReset} className="space-y-3">
      <div>
        <label className="rotulo" htmlFor="nome">
          Nome
        </label>
        <input id="nome" name="nome" className="campo" required />
      </div>
      <div>
        <label className="rotulo" htmlFor="email">
          E-mail (será o login)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          className="campo"
          required
        />
      </div>
      <div>
        <label className="rotulo" htmlFor="senha">
          Senha inicial
        </label>
        <input
          id="senha"
          name="senha"
          type="text"
          className="campo"
          minLength={8}
          required
          placeholder="mínimo 8 caracteres"
        />
        <p className="mt-1 text-xs" style={{ color: "var(--tinta-3)" }}>
          Combine com a pessoa e peça que troque depois — você pode redefinir a
          qualquer momento nesta tela.
        </p>
      </div>
      <div>
        <label className="rotulo" htmlFor="papel">
          Perfil
        </label>
        <select
          id="papel"
          name="papel"
          className="campo"
          value={papel}
          onChange={(e) => setPapel(e.target.value as Papel)}
        >
          <option value="GESTOR">Gerente predial (preenche o boletim)</option>
          <option value="ADMIN">Administrador (vê tudo, inclui o dashboard)</option>
        </select>
      </div>

      <SeletorCondominios condominios={condominios} desabilitado={papel === "ADMIN"} />

      <Aviso estado={estado} />
      <Botao rotulo="Criar usuário" />
    </form>
  );
}

export function EditarUsuario({
  usuario,
  condominios,
}: {
  usuario: {
    id: number;
    nome: string;
    email: string;
    papel: Papel;
    ativo: boolean;
    condominios: number[];
  };
  condominios: Condominio[];
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [papel, setPapel] = useState<Papel>(usuario.papel);

  const [estadoEdicao, acaoEdicao] = useActionState<ResultadoAcao | null, FormData>(
    atualizarUsuarioAction,
    null,
  );
  const [estadoSenha, acaoSenha] = useActionState<ResultadoAcao | null, FormData>(
    redefinirSenhaAction,
    null,
  );

  useEffect(() => {
    if (estadoEdicao?.ok || estadoSenha?.ok) router.refresh();
  }, [estadoEdicao, estadoSenha, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="text-xs font-semibold underline"
        style={{ color: "var(--serie-1)" }}
        aria-expanded={aberto}
      >
        {aberto ? "Fechar" : "Gerenciar"}
      </button>

      {aberto ? (
        <div
          className="mt-3 space-y-4 rounded-xl p-3"
          style={{ background: "var(--superficie-2)" }}
        >
          <form action={acaoEdicao} className="space-y-3">
            <input type="hidden" name="id" value={usuario.id} />
            <div>
              <label className="rotulo" htmlFor={`nome-${usuario.id}`}>
                Nome
              </label>
              <input
                id={`nome-${usuario.id}`}
                name="nome"
                className="campo"
                defaultValue={usuario.nome}
                required
              />
            </div>
            <div>
              <label className="rotulo" htmlFor={`email-${usuario.id}`}>
                E-mail (login)
              </label>
              <input
                id={`email-${usuario.id}`}
                name="email"
                type="email"
                inputMode="email"
                autoCapitalize="none"
                className="campo"
                defaultValue={usuario.email}
                required
              />
            </div>
            <div>
              <label className="rotulo" htmlFor={`papel-${usuario.id}`}>
                Perfil
              </label>
              <select
                id={`papel-${usuario.id}`}
                name="papel"
                className="campo"
                value={papel}
                onChange={(e) => setPapel(e.target.value as Papel)}
              >
                <option value="GESTOR">Gerente predial</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <SeletorCondominios
              condominios={condominios}
              selecionados={usuario.condominios}
              desabilitado={papel === "ADMIN"}
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="ativo"
                defaultChecked={usuario.ativo}
                className="h-4 w-4"
              />
              Usuário ativo (desmarque para bloquear o acesso)
            </label>

            <Aviso estado={estadoEdicao} />
            <Botao rotulo="Salvar" />
          </form>

          <form
            action={acaoSenha}
            className="space-y-2 pt-3"
            style={{ borderTop: "1px solid var(--borda)" }}
          >
            <input type="hidden" name="id" value={usuario.id} />
            <label className="rotulo" htmlFor={`senha-${usuario.id}`}>
              Redefinir senha
            </label>
            <input
              id={`senha-${usuario.id}`}
              name="senha"
              type="text"
              className="campo"
              minLength={8}
              placeholder="nova senha (mínimo 8 caracteres)"
            />
            <Aviso estado={estadoSenha} />
            <Botao rotulo="Redefinir senha" />
          </form>

          <div className="pt-3" style={{ borderTop: "1px solid var(--borda)" }}>
            <ExcluirUsuario id={usuario.id} nome={usuario.nome} ativo={usuario.ativo} />
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 * Exclusão de usuário. Desativar já resolve a maior parte dos casos (a pessoa
 * saiu da empresa e não deve mais entrar), então a exclusão fica atrás de uma
 * confirmação e o texto aponta o caminho reversível.
 */
function ExcluirUsuario({
  id,
  nome,
  ativo,
}: {
  id: number;
  nome: string;
  ativo: boolean;
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [estado, setEstado] = useState<ResultadoAcao | null>(null);
  const [processando, iniciar] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setAberto((v) => !v);
          setEstado(null);
        }}
        className="text-xs font-semibold underline"
        style={{ color: "var(--status-critico-texto)" }}
        aria-expanded={aberto}
      >
        {aberto ? "Cancelar exclusão" : "Excluir usuário"}
      </button>

      {aberto ? (
        <div
          className="mt-3 rounded-xl p-3"
          style={{
            background: "color-mix(in srgb, var(--status-critico) 6%, var(--superficie))",
            border: "1px solid color-mix(in srgb, var(--status-critico) 35%, transparent)",
          }}
        >
          <p className="text-sm mb-1">
            Excluir <strong>{nome}</strong> apaga o acesso definitivamente.
          </p>
          <p className="text-xs mb-3" style={{ color: "var(--tinta-2)" }}>
            Os boletins e ocorrências que ele lançou continuam no histórico.
            {ativo ? (
              <>
                {" "}
                Se a ideia é só bloquear a entrada, desmarque{" "}
                <strong>Usuário ativo</strong> acima — dá para reverter depois.
              </>
            ) : null}
          </p>

          <Aviso estado={estado} />

          <button
            type="button"
            disabled={processando}
            onClick={() =>
              iniciar(async () => {
                const r = await excluirUsuarioAction(id);
                setEstado(r);
                if (r.ok) router.refresh();
              })
            }
            className="botao botao-perigo w-full mt-2"
          >
            {processando ? "Excluindo…" : "Excluir definitivamente"}
          </button>
        </div>
      ) : null}
    </>
  );
}
