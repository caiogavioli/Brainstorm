# S-002 — Rodada 2: decisões do sistema do Action Log

**Data:** 2026-10-07 · **Problema:** P-001 · **Fase:** 3 (Rodada 2 aberta)

## O que as respostas da Rodada 1 já decidiram (não voltam à discussão)

- **Plataforma própria**, sem Monday (caro). Sistema **apartado** do app de boletim, que serve só de referência/base de código.
- **Quem preenche é a administradora** (gerente, supervisor, assistente…); a **DF Síndicos revisa toda semana** e precisa ver tudo atualizado; **sindicância e proprietário** entram para acompanhar, e a sindicância faz apontamentos e inclui exigências.
- **Nenhuma aba sai do escopo.** O que muda é a ordem de entrega.
- ~100 usuários, 40 condomínios, ~13 administradoras, 3 carteiras da DF; precisa funcionar bem no celular; nenhum cliente restringe onde os dados moram.
- Forecast serve para antecipar falta/sobra de caixa; saldo negativo dispara reunião conjunta.

## Consequências que o time tira disso

- É um **portal multiorganização** (DF, administradoras, sindicâncias/proprietários), não uma planilha melhorada: o centro do projeto é **permissão e rastro de alteração**, porque quem escreve é externo e hoje "a célula é sobrescrita" sem histórico.
- **Posição Financeira não é tela de entrada**: é o saldo por fundo, que sai do Forecast. Vira visão calculada (a informação continua existindo; só deixa de ser digitada duas vezes).
- **Documentos**: BGRE usa SafetyDocs; os demais não. O módulo próprio existe para quem não tem SafetyDocs.

## Rodada 2 — decisões

Ver o chat da sessão para o texto completo de cada decisão, recomendações e desacordos. Resumo do que o usuário precisa decidir:

| # | Decisão | Marina | Rafael | Tomás | Estado |
|---|---|---|---|---|---|
| 1 | Como entra a exigência da sindicância no Action Log | exigência com prazo, 2 tipos só | exigência com prazo | comentário + "aguardando quem" | **Decidido: Tomás** — comentário comum + campo "aguardando: administradora / sindicância / DF"; sem tipo "exigência" nem prazo próprio |
| 2 | Investimento: entidade própria ou assunto com campos financeiros | entidade própria | assunto com campos | assunto com campos | **Decidido: Marina** — entidade própria (teto da AGO, contratado, pago, saving só quando concluído), vínculo opcional a assunto do Action Log |
| 3 | Forecast: versão do mês corrigido | versões navegáveis | log basta | log basta | **Decidido: Rafael e Tomás** — log de alterações (quem, quando, antes e depois); sem versões navegáveis |
| 4 | Login: um para os dois sistemas ou separado | separado | único (via link por e-mail) | separado | **Decidido: contas separadas**, "da mesma forma que as do boletim" |
| 5 | Inadimplência: quem vê nome e unidade | conselho vê, proprietário só o total | conselho vê, proprietário só o total | só administradora e DF | **Decidido: todo mundo** (administradora, DF, sindicância e proprietário veem nome e unidade) |
| 6 | Escopo da v1 e migração das 40 planilhas | converge | converge | converge | Proposta mantida; **sem objeção, mas sem "ok" explícito do usuário** — confirmar na spec |

## Respostas do usuário

Respondidas em 2026-10-07, transcrição literal:

1) tomás
2) marina
3) rafael e tomás
4) contas separadas (da mesma forma que as do boletim)
5) todo mundo

Decisão 6 não foi comentada.

**Risco registrado (Marina), sem reabrir a decisão 5:** nome e unidade de inadimplente visíveis a todos os proprietários é dado pessoal exposto entre terceiros (LGPD). Fica na spec como risco, com mitigação barata: toda consulta à lista nominal grava quem viu e quando, e a visibilidade nominal é uma configuração por condomínio (padrão: todos veem), para poder fechar sem refazer o sistema.

**Consequência da decisão 1 (Rafael, sem reabrir):** sem prazo próprio na exigência, a cobrança da sindicância depende do campo "aguardando" e da revisão semanal da DF; o assunto ainda tem prazo no nível do assunto.
