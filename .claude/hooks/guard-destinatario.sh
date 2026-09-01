#!/usr/bin/env bash
# Trava de destinatário — projetos Triagem Contratante e afins.
#
# Duas camadas, porque há dois tipos de envio com riscos diferentes:
#
# 1. A ROTINA AUTOMÁTICA (assunto "[Triagem] …" ou "[Relatório de Triagem] …")
#    roda sozinha, de madrugada, sem ninguém conferindo. Ela só pode escrever
#    para dentro da DF Síndicos — o usuário e os cinco colegas listados em
#    INTERNOS. Qualquer outro destinatário é recusado, mesmo que esteja na
#    lista de mapeados. Uma rotina não supervisionada não deve ganhar o
#    direito de falar com o contratante ou com administradora.
#
#    A camada 1 foi de um endereço para seis em 31/08/2026, a pedido do
#    usuário: ele quer que a equipe da DF receba as duas triagens em cópia.
#    A propriedade que interessa não mudou — o que muda é a fronteira. Antes
#    era "só o usuário", agora é "só a casa dele". O contratante (bgre.com,
#    brookfieldproperties.com) e as administradoras (cbre, cushwake, innova)
#    seguem recusados para a rotina, mesmo estando liberados em MAPEADOS para
#    o envio pontual. É essa assimetria que o hook existe para manter.
#
# 2. ENVIO PONTUAL, pedido pelo usuário numa conversa, pode ir para os
#    endereços já confirmados em rotina-safetydocs/mapeamento-predios.md —
#    gestores prediais das administradoras. Endereço fora dessa lista é
#    recusado.
#
# A lista abaixo é cópia dos endereços com status "confirmado" naquele
# arquivo, na versão de 11/08/2026. Hardcoded de propósito: o mapeamento vive
# noutra branch e pode não estar no working tree quando o hook roda. Ao
# confirmar um prédio novo lá, acrescente aqui também.
#
# Liberada em 20/08/2026 a pedido explícito do usuário, para a cobrança dos
# descontos de NF (17.007, TNU e Centenário).
#
# Ampliada em 31/08/2026, também a pedido explícito, para a cobrança da
# Pesquisa de Satisfação 2026. Três grupos entraram:
#
#   - equipe DF Síndicos (denise, amanda, andre, anapaula, controladoria);
#   - CONTRATANTE: gabriel.fernandes@bgre.com e alex.trindade@bgre.com;
#   - jose.perozzi@cbre.com, segundo endereço do gestor do JKB.
#
# A entrada do contratante é a mudança relevante e vale registrar por quê ela
# não desfaz a proteção original: a camada 1 continua intacta. Uma mensagem com
# assunto "[Triagem] …" ou "[Relatório de Triagem] …" segue indo só para o
# usuário, mesmo agora que a BGRE está na lista. Quem ganhou o direito de
# escrever para o contratante foi o envio pontual, conferido pelo usuário —
# não a rotina que roda de madrugada sem ninguém olhando.
#
# Entrada: JSON do PreToolUse no stdin.
# Saída:   nada (segue o fluxo normal) ou um veredito "deny" em JSON.

set -uo pipefail

USUARIO="caio@dfsindicos.com.br"

# Camada 1 — quem a rotina automática pode copiar. Só gente de dentro da DF.
INTERNOS="
caio@dfsindicos.com.br
denise@dfsindicos.com.br
amanda@dfsindicos.com.br
andre@dfsindicos.com.br
anapaula@dfsindicos.com.br
controladoria@dfsindicos.com.br
"

# Endereços confirmados no mapeamento de prédios, em minúsculas.
MAPEADOS="
caio@dfsindicos.com.br
denise@dfsindicos.com.br
amanda@dfsindicos.com.br
andre@dfsindicos.com.br
anapaula@dfsindicos.com.br
controladoria@dfsindicos.com.br
gabriel.fernandes@bgre.com
alex.trindade@bgre.com
jose.perozzi@cbre.com
abner.nogueira@cbre.com
marco.gimenez@cbre.com
katia.oliveira@cbre.com
cristiane.cavalcanti@cbre.com
helena.borges@cushwake.com
guilherme.larucci@cushwake.com
ricardo.lugli@cushwake.com
marcelo.durazzo@sa.cushwake.com
plextrema.gerente@innova.net.br
plextrema.supervisor@innova.net.br
geraldo.ferreira@innova.net.br
luis.baptista@innova.net.br
pedro.perozzi@cbre.com
lenilde.costa@cbre.com
marcus.martinez@cbre.com
paloma.pedrosa@cbre.com
17007@cbre.com
17007.oper@cbre.com
atriumcomercial.gerente@innova.net.br
atriumcomercial.supervisor@innova.net.br
atriumcomercial.assistente@innova.net.br
thomaz.bastos@innova.net.br
adriano.camilo@cbre.com
daiane.silva1@cbre.com
jose.ferreira@cbre.com
sandra.alquimin@cushwake.com
ederson.silva@cushwake.com
oparquecorporate.gerente@innova.net.br
oparquecorporate.manutencao@innova.net.br
oparquecorporate.analista@innova.net.br
oparquecorporate.assistente@innova.net.br
kelly.dangelis@cbre.com
suneimy.brito@cbre.com
"

nega() {
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

# Sem destinatário identificável, não há o que julgar.
[ -z "$destinatarios" ] && exit 0

assunto=$(printf '%s' "$payload" | jq -r '.tool_input.subject // ""' 2>/dev/null)

# Camada 1 — mensagem da própria rotina: só gente de dentro da DF, sem exceção.
case "$assunto" in
  "[Triagem]"*|"[Relatório de Triagem]"*|"[Relatorio de Triagem]"*)
    internos=$(printf '%s\n' "$INTERNOS" | grep -v '^[[:space:]]*$' | tr -d ' ')
    intrusos=$(printf '%s\n' "$destinatarios" | grep -v -x -F "$internos" || true)
    if [ -n "$intrusos" ]; then
      lista=$(printf '%s' "$intrusos" | tr '\n' ' ')
      nega "Bloqueado: mensagem da rotina automatica (assunto ${assunto}) so pode ir para a equipe da DF Sindicos. A liberacao para enderecos mapeados (contratante, administradoras) NAO vale para a rotina, que roda sem supervisao. Destinatario recusado: ${lista}"
    fi
    exit 0
    ;;
esac

# Camada 2 — envio pontual: precisa estar no mapeamento.
permitidos=$(printf '%s\n' "$MAPEADOS" | grep -v '^[[:space:]]*$' | tr -d ' ')
intrusos=$(printf '%s\n' "$destinatarios" | grep -v -x -F "$permitidos" || true)

if [ -n "$intrusos" ]; then
  lista=$(printf '%s' "$intrusos" | tr '\n' ' ')
  nega "Bloqueado pela trava de destinatario: so e permitido enviar para ${USUARIO} ou para enderecos confirmados em rotina-safetydocs/mapeamento-predios.md. Destinatario recusado: ${lista}. Para liberar, confirme o endereco naquele arquivo e acrescente na lista do hook."
fi

exit 0
