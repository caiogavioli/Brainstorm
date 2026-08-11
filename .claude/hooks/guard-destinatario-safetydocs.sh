#!/usr/bin/env bash
# Trava de segurança da rotina Cobrança SafetyDocs.
#
# A rotina roda sozinha e tem permissão para enviar email sem perguntar. Esta
# trava garante que ela só consiga enviar para um endereço "confirmado" em
# rotina-safetydocs/mapeamento-predios.md, ou para o próprio usuário (resumo
# semanal) — nunca para um endereço inventado, extraído do corpo de um email
# da SafetyDocs, ou de um condomínio ainda sem confirmação.
#
# Diferente da trava da Triagem Contratante (um único endereço fixo), aqui a
# lista de destinos válidos muda conforme o mapeamento é editado — por isso é
# lida do arquivo a cada chamada, não hardcoded.
#
# Entrada: JSON do PreToolUse no stdin.
# Saída:   nada (segue o fluxo normal) ou um veredito "deny" em JSON.

set -uo pipefail

USUARIO="caio@dfsindicos.com.br"
MAPEAMENTO="/home/user/Brainstorm/rotina-safetydocs/mapeamento-predios.md"
# Colaboradores da DF Síndicos, em cópia fixa em toda cobrança (pedido do
# Caio, 11/08/2026) — ver rotina-safetydocs/formato-mensagem.md.
COLABORADORES="amanda@dfsindicos.com.br
andre@dfsindicos.com.br
anapaula@dfsindicos.com.br
controladoria@dfsindicos.com.br
denise@dfsindicos.com.br"

nega() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}

if ! command -v jq >/dev/null 2>&1; then
  nega "Trava de destinatario quebrada: jq nao esta instalado. Envio bloqueado por precaucao."
fi

if [ ! -r "$MAPEAMENTO" ]; then
  nega "Trava de destinatario quebrada: nao consegui ler mapeamento-predios.md. Envio bloqueado por precaucao."
fi

payload=$(cat)

destinatarios=$(printf '%s' "$payload" | jq -r '
  [ (.tool_input.to // [])[], (.tool_input.cc // [])[], (.tool_input.bcc // [])[] ]
  | .[] | ascii_downcase' 2>/dev/null)

# Sem destinatário identificável, não há o que julgar: deixa o fluxo normal de
# permissão decidir.
[ -z "$destinatarios" ] && exit 0

# Emails confirmados: linhas da tabela com "| confirmado |" no fim, coluna de
# email pode ter mais de um endereço separado por ";". Extrai só o(s) email(s)
# válido(s) de cada linha confirmada.
permitidos=$( { printf '%s\n' "$USUARIO";
  printf '%s\n' "$COLABORADORES";
  grep -E '\| *confirmado *\|' "$MAPEAMENTO" \
    | awk -F'|' '{print $4}' \
    | tr ';' '\n' \
    | grep -oE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'; } \
  | tr 'A-Z' 'a-z' | sort -u)

intrusos=""
while IFS= read -r destinatario; do
  [ -z "$destinatario" ] && continue
  if ! printf '%s\n' "$permitidos" | grep -q -x -F "$destinatario"; then
    intrusos="$intrusos $destinatario"
  fi
done <<< "$destinatarios"

if [ -n "$intrusos" ]; then
  nega "Bloqueado pela trava do projeto safetydocs-cobranca: destinatario nao esta confirmado em rotina-safetydocs/mapeamento-predios.md. Destinatario(s) recusado(s):${intrusos}"
fi

exit 0
