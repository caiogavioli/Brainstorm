#!/usr/bin/env bash
# Trava de segurança da rotina Triagem Contratante.
#
# A rotina roda sozinha e tem permissão para enviar email sem perguntar. Esta
# trava garante que ela só consiga enviar para o próprio usuário — nunca para a
# Brookfield, para uma administradora ou para qualquer terceiro.
#
# A regra "nunca responder ou encaminhar email para terceiros" existe escrita no
# playbook desde o começo. Escrita num markdown, ela depende de o modelo lembrar.
# Aqui ela é verificada por um programa antes de a chamada acontecer.
#
# Entrada: JSON do PreToolUse no stdin.
# Saída:   nada (segue o fluxo normal) ou um veredito "deny" em JSON.

set -uo pipefail

DESTINO_PERMITIDO="caio@dfsindicos.com.br"

nega() {
  # Sem jq não dá para montar JSON com segurança; este printf basta porque a
  # mensagem é controlada aqui dentro.
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}

if ! command -v jq >/dev/null 2>&1; then
  nega "Trava de destinatario quebrada: jq nao esta instalado. Envio bloqueado por precaucao."
fi

payload=$(cat)

destinatarios=$(printf '%s' "$payload" | jq -r '
  [ (.tool_input.to // [])[], (.tool_input.cc // [])[], (.tool_input.bcc // [])[] ]
  | .[] | ascii_downcase' 2>/dev/null)

# Sem destinatário identificável, não há o que julgar: deixa o fluxo normal de
# permissão decidir.
[ -z "$destinatarios" ] && exit 0

intrusos=$(printf '%s\n' "$destinatarios" | grep -v -x -F "$DESTINO_PERMITIDO" || true)

if [ -n "$intrusos" ]; then
  lista=$(printf '%s' "$intrusos" | tr '\n' ' ')
  nega "Bloqueado pela trava do projeto triagem-contratante: a rotina so pode enviar email para ${DESTINO_PERMITIDO}. Destinatario recusado: ${lista}"
fi

exit 0
