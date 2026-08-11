# Permissões

Mesmo problema que a Triagem Contratante já resolveu, mesma solução: a rotina
roda **self-bind**, sem ninguém acompanhando, e não pode parar toda segunda de
manhã esperando aprovação manual. Ver o histórico completo em
`caiogavioli/triagem-contratante` (`rotina/permissoes.md`, `rotina/agendamento.md`) —
aqui só o que muda.

## Onde mora

`/home/user/Brainstorm/.claude/settings.json`, **commitado** no repositório
`Brainstorm` (branch `claude/safetydocs-automation-4rq592`, e deve ser levado
para `main` quando o projeto for mesclado). É lá que a sessão que hospeda a
Routine lê permissões de projeto — arquivo em `.claude/settings.local.json`
seria ignorado pelo git e morreria com o container.

## O que foi liberado

| Ferramenta | Para quê |
|---|---|
| `mcp__Microsoft_365__outlook_email_search` | achar os dois informativos da semana |
| `mcp__Microsoft_365__read_resource` | ler o corpo HTML dos informativos e da pasta Itens Enviados |
| `mcp__Microsoft_365__outlook_send_mail` | enviar a cobrança e o resumo semanal |
| ferramentas de agendamento (`create_trigger`, `list_triggers` etc.) | manter a própria Routine |

## O que foi bloqueado

As mesmas ferramentas de escrita destrutiva da Triagem Contratante — mover,
arquivar, categorizar, apagar, responder, encaminhar, mexer em filtro ou
categoria do Outlook. Ver a lista completa em `.claude/settings.json`.

## A trava de destinatário — diferente da Triagem Contratante

Lá, a trava permite **um único endereço fixo** (o próprio usuário). Aqui isso
não serve: a cobrança precisa sair para **treze condomínios diferentes**, e a
lista de endereços válidos muda conforme `mapeamento-predios.md` é atualizado.

`.claude/hooks/guard-destinatario-safetydocs.sh` resolve isso lendo, a cada
chamada de `outlook_send_mail`, a lista de emails com `status: confirmado` em
`rotina-safetydocs/mapeamento-predios.md` (mais o próprio
`caio@dfsindicos.com.br`, para o resumo semanal). Qualquer destinatário — Para,
Cópia ou Cópia oculta — fora dessa lista é recusado antes de a chamada
acontecer.

Igual à Triagem Contratante: se `jq` não estiver disponível, ou o arquivo de
mapeamento não puder ser lido, a trava **bloqueia** em vez de liberar.

## Teste antes de confiar

Antes da primeira rodada automática, repetir o teste que a Triagem
Contratante fez: tentar mandar `outlook_send_mail` para um endereço fora da
lista (ex. `bloqueado@teste.invalid`) e confirmar que a trava recusa antes de
sair.
