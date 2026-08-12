# MEMORY.md

Estado vivo do brainstorming. Ler no início de cada sessão, atualizar ao fim de cada rodada ou decisão.

**Última atualização:** 2026-08-12

---

## Situação atual

P-001 mudou de desfecho depois da conexão com o projeto `caiogavioli/triagem-contratante` (já existente, fora deste repositório). Esse projeto já tinha passado pela mesma decisão — descartar estado num arquivo à parte em favor do Monday como fonte única — então a planilha `Acompanhamento Condomínios.xlsx` criada nesta sessão foi descartada como peça viva. O controle por condomínio do caso "Automatização de energia elétrica" agora mora dentro do card correspondente no Monday (board TAREFAS, item 12767606013), documentado em `rotina/monday.md` daquele repositório. Em aberto: se P-001 ainda é um problema próprio ou se era a mesma necessidade do projeto irmão, só sem a conexão feita.

## Problemas

| ID | Título | Fase | Desfecho |
|---|---|---|---|
| P-001 | Controle de respostas dos condomínios sobre automação de energia elétrica | virou script | rotina reaproveitável: planilha por caso + leitura automática do Outlook via conector, sem repositório dedicado |

Fases: `apresentado` → `rodada 1` → `rodada 2` → `fechado` / `descartado` / `virou script`

## Projetos fechados

| Projeto | Origem | Repositório | Data |
|---|---|---|---|
| — | — | — | — |

## Decisões sobre o processo

| Data | Decisão | Contexto |
|---|---|---|
| 2026-08-09 | Repositório dedicado só é criado no **passo 5**, mediante pedido explícito do usuário. Fim da Rodada 2 não dispara criação. | O usuário perguntou em que momento o repo nasce; alternativa considerada era criar já no fim da Rodada 1, descartada por gerar repositório vazio com nome provisório. |
| 2026-08-09 | Relação problema → repositório não é 1-para-1. O recorte sai da Rodada 2. | Problemas aparentemente separados costumam ser o mesmo sistema. |
| 2026-08-09 | Duas rodadas de perguntas, sem emendar. Rodada 1 = entendimento, Rodada 2 = decisão. | Formato pedido pelo usuário na abertura. |
| 2026-08-09 | Time fixo de três personas com vieses declarados: Marina (dados/integrações), Rafael (produto/recorte), Tomás (infra/custo). | Formato pedido pelo usuário. |

## Preferências do usuário observadas

- Idioma: português do Brasil.
- Quer clareza sobre **quando** cada artefato é criado — não gosta de passo implícito. Ser explícito sobre gatilhos.
- GitHub: conta `caiogavioli`. Repositório de brainstorming: `caiogavioli/Brainstorm`, branch de trabalho `claude/project-brainstorming-t0jeoe`.

## Em aberto

- Repositórios novos devem nascer **públicos ou privados**? Confirmar no primeiro fechamento.
- Stack de preferência do usuário ainda desconhecida (linguagens, nuvem, o que ele já roda hoje). Levantar na Rodada 1 do primeiro problema.
