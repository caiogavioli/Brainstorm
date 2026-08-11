# Agendamento

## Estado: **criada em 11/08/2026 — aguardando primeira execução automática**

## Ficha

| | |
|---|---|
| Routine | `trig_01TdEoP9RFiL1uADLHitmSWF` |
| Nome | Cobrança SafetyDocs — rodada semanal |
| Quando | segunda-feira, 08h00 (BRT) = `0 11 * * 1` (UTC) |
| Próxima execução agendada | 17/08/2026 |
| Modo | **Self-bind** — dispara na sessão `session_014q8edMzmJjxUDcXQffkfBb` (`claude/safetydocs-automation-4rq592`), que já tem o conector Microsoft 365 ativo. Mesmo motivo da Triagem Contratante: sessão nova nasce sem conector. |

O aviso genérico "this trigger stores no MCP connectors" apareceu na criação
— confirmado nos mesmos termos da Triagem Contratante: **não se aplica** ao
modo self-bind, porque é a sessão-alvo (já conectada) que executa, não uma
sessão nova.

## O risco que já é conhecido, declarado desde o início

A sessão hospedeira é de vida limitada. Se ela for reciclada, a Routine perde
o alvo e para de rodar — sem erro visível. O sinal de que isso aconteceu é a
ausência do resumo semanal até 09h de segunda (ver `entrega.md`).

## Rodada manual

A qualquer momento, numa sessão com Microsoft 365 conectado, colar o conteúdo
de `prompt-da-routine.txt`. A rotina é idempotente no que importa: se um
condomínio já recebeu cobrança nos últimos 7 dias, ela pula.

## Plano B — criar pela interface

Se o resumo semanal não chegar por duas semanas seguidas:

1. **claude.ai → Routines → New**
2. Agendamento: segunda-feira, 08h00 (São Paulo)
3. Marcar o conector **Microsoft 365**
4. Colar `prompt-da-routine.txt` deste diretório, sem alterar
5. Salvar, e desativar a Routine antiga para não rodar duas vezes
