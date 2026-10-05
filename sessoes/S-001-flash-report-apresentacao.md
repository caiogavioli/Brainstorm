# S-001 — Apresentação: Flash Report (análises semanais)

**Data:** 2026-10-05 · **Fase:** 1 — Apresentação

## Relato do usuário (palavras dele)

> vamos iniciar um novo projeto, que vou chamar de Flash Report - Análises semanais.
> todos meus condomínios (BGRE) devem enviar na segunda-feira, um arquivo chamado Flash Report. Ele é um relatório das ocorrencias da semana anterior.
> por favor faça uma busca nos meus e-mails, analise os flash reports, e monte um relatório executivo (pode ser um artefato). Considere um dashboard para cada semana.

> faça um branch novo, chamado Flash Report (ou algo assim)

> analise apenas os meses de agosto/26 para frente. deixe o passado de fora

> são esses 9 mesmo.

> sim, faça uma rotina segunda feira a tarde

## O que foi feito nesta sessão

- Branch criado: `claude/flash-report-analises-semanais` (a partir de `main`).
- Busca "Flash Report" no Outlook: reports de 9 condomínios desde agosto/2026, mais threads de perguntas da BGRE.
- Extração dos PDFs em paralelo, um agente por condomínio, para um conjunto de dados estruturado (fora do GitHub).
- Recorte definido pelo usuário: só semanas a partir de 03/08/2026 (primeira segunda-feira de agosto); o que veio antes ficou de fora.
- Resultado: artefato com visão geral executiva e um dashboard por semana (9 semanas, 9 condomínios): https://claude.ai/artifact/V7wZJk18Nu6pGvnFBjnNRQ (privado). Os dados extraídos não vão para o GitHub.
- Achados principais: Panamérica Park sem report desde 24/08 com AVCB vencendo em 17/10; JKB com falta de energia de 30/09 e CFTV sem confirmação de retorno; Arquipeo com alagamento de 12/09 e notificação da WPP; Passeio Paulista com evento de diesel fora do Flash; 15 semanas sem report localizado em 5 condomínios.
- Confirmado pelo usuário: a carteira do Flash Report são esses 9 condomínios. A severidade é classificação automática e pode ser ajustada.
- Pedido atendido direto (relatório executivo + dashboards por semana); as rodadas 1 e 2 do time de três ficam para quando o usuário quiser decidir se isso vira rotina/projeto.

- Rotina semanal criada: segunda 17h48 (America/Sao_Paulo), Routine `trig_016LpCwLxczWm1iVwAddguVz` na sessão original. A primeira execução cai hoje (05/10) às 17h48 e reprocessa a semana 28/09, onde 5 condomínios estavam com prazo hoje. Arquivos em `rotina-flash-report/`.
