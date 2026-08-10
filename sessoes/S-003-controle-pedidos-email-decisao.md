# S-003 — P-001, decisão final

**Data:** 2026-08-10
**Problema:** P-001 — Controle de pedidos e prazos vindos por email do contratante
**Fase:** decisão tomada — encerra a Rodada 2

---

## Resposta do usuário (palavras dele)

> vai nessa

Referindo-se ao arranjo proposto: **D1 varredura + D2 To Do + D3 (a)**.

---

## Decisões

| # | Decisão | Quem ganhou | Quem perdeu, e o que fica registrado |
|---|---|---|---|
| **D1** | Regra no Outlook **+ varredura diária** | Tomás e Marina | Rafael queria viver um mês só com a notificação antes de construir qualquer coisa. Perdeu no argumento de que notificação não tem memória: a do dia 05 provavelmente apareceu e morreu na tela de bloqueio. |
| **D2** | Lista mora no **Microsoft To Do** | Tomás | Marina queria Monday pelo estado "aguardando terceiro" e pela quebra de um email em vários pedidos. Perdeu para "zero peças novas" — mas a objeção dela **não foi resolvida**, foi contornada (ver risco R1). |
| **D3** | WhatsApp **fora da v1, cobranças registradas em uma linha** | Marina | Rafael queria fora inteiramente. O registro fica não como funcionalidade, mas como a única métrica honesta de sucesso. |

## O que não foi resolvido, só adiado

**R1 — a objeção da Marina sobre a flag continua de pé.** Flag é um bit por mensagem, e o usuário confirmou que um email pode trazer vários pedidos. Com To Do, um email com três pedidos vira uma tarefa. Se ele responder dois e desmarcar, o terceiro some em silêncio.

Mitigação aceita para a v1, sem construir nada: quando um email trouxer mais de um pedido, **o usuário quebra à mão em tarefas separadas no To Do**, na hora em que lê. São 2 a 3 emails por semana — o custo disso é de segundos. Se em um mês ele não estiver fazendo isso, a mitigação falhou e a decisão D2 volta para a mesa.

## Critério de sucesso, acordado

**Zero pedidos descobertos por cobrança do contratante.** Medido pelas linhas de cobrança por WhatsApp registradas (D3). Revisão em ~30 dias.

---

## Camada 1 — configuração a executar

1. Identificar os endereços remetentes do contratante na caixa do Outlook.
2. Pasta dedicada + categoria para esses remetentes.
3. Regra que classifica a chegada.
4. Notificação no Outlook do Android restrita a essa pasta.
5. Flag continua sendo o gesto de "isto é tarefa minha" — já sincroniza com o To Do.

## Camada 2 — varredura diária

Rotina de manhã que lista pedidos em aberto com estado (`comigo` / `aguardando terceiro` / `fechado`) e prazo, e cobra o que está parado — inclusive o que está parado no colo do condomínio. Começa como conversa diária, sem código.

---

## Estado

Decisão fechada. **Nenhum repositório será criado** — o recorte foi "não é projeto", e não houve pedido explícito. Documento operacional em `projetos/controle-pedidos-contratante.md`.
