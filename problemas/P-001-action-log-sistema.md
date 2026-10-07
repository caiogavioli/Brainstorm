# P-001 — Sistema para substituir a planilha "Action Log" da DF Síndicos

## Em uma frase
Cada condomínio sob gestão da DF Síndicos tem **o seu próprio arquivo Excel** (o "Action Log"), com abas de tema diferente; a rotina de atualizá-lo toda semana com a administradora e a falta de visão de portfólio fazem a planilha virar o gargalo. Queremos um sistema que atenda a todas as necessidades das abas — sendo as mais importantes o **Action Log** em si, **Investimentos** e **Fluxo de Caixa (o "ForeCast")**.

## Como é hoje
Arquivo de exemplo analisado: *Action Log – Atrium Century Plaza – 2025* (12 abas, 1 oculta).

- **Action Log:** uma linha por assunto (52 itens) e **uma coluna nova por reunião semanal** (138 reuniões entre 03/01/2024 e 25/09/2026). O assunto é aberto, recebe uma observação por semana (texto livre) e é fechado quando concluído. A atualização é feita "periodicamente com a administradora".
- **Investimentos (por ano):** 50 linhas por ano, com prioridade, descrição, alocação (qual fundo paga), valor teto aprovado, valor executado, saving (teto − executado), responsável, status e observações, mais um resumo por fundo.
- **Fluxo de Caixa (ForeCast):** 12 meses × 6 fundos (Ordinário, Reserva, Contingência, Individualização de Consumos, Água, Energia), cada um com saldo inicial, receitas, despesas por categoria e saldo final, com marcação REALIZADO/PROJETADO por mês.
- **Posição Financeira:** saldo por fundo entre duas datas.
- **Documentos Obrigatórios:** ~116 documentos em 3 seções (legal; prevenção e combate a incêndio; técnica e prestadores), com status por fórmula a partir do vencimento.
- **Contratos – Despesas / Receitas:** cadastro de contratos com vigência, reajuste, aviso prévio e status por fórmula.
- **Auditoria:** recomendações da auditoria, plano de ação, prazo e status.
- **Inadimplência:** lista por unidade, com valor inicial, valor atual e status.
- **REV-03:** histórico de revisões da própria planilha (modelo versionado à mão).
- **BASE (oculta):** listas suspensas que alimentam as validações (prioridade, classe, status, fundos, índices de reajuste, tipos de contrato).

## Frequência e volume
- Acontece: semanal (Action Log), mensal (Fluxo de Caixa, Posição Financeira), por evento (Investimentos, Documentos, Contratos).
- Tempo gasto por vez: não informado.
- Volume: um arquivo por condomínio — **40 condomínios, ~13 administradoras, 3 responsáveis da DF, ~100 usuários estimados** (Rodada 1).

## Quem sofre
Quem **preenche** é a administradora (todos os funcionários do condomínio); a DF Síndicos **revisa toda semana** e precisa do log atualizado; **sindicância e proprietário** leem, e a sindicância faz apontamentos e inclui exigências. Hoje a célula é sobrescrita, sem histórico de quem mudou o quê.

## O que já foi tentado
A própria planilha, já com 3 revisões de estrutura (jan/2024). Cada revisão corrigiu formatação e fórmulas, mas manteve o modelo de "um arquivo por condomínio, uma coluna por reunião".

## Como saberíamos que resolveu
**A definir na Rodada 2.** Hipóteses para o usuário confirmar: (a) o histórico de um assunto se lê de cima para baixo, sem rolar 138 colunas; (b) a administradora recebe a pauta da semana já pronta, sem o Excel inteiro; (c) investimento mostra teto × contratado × executado sem contar "em cotação" como economia; (d) Forecast mostra orçado × realizado × projetado e avisa quando um fundo vai ficar negativo; (e) dá para ver os condomínios lado a lado.

## Restrições conhecidas
- Já usam **Microsoft 365** e **Monday**; equipe de 4, só o usuário tem Claude Code pago (ver `MEMORY.md`).
- Dados de condomínio e de inadimplência (nome de proprietário) são sensíveis — a planilha original **não vai para o GitHub**.
- Existe, em outro branch deste repositório, um app Next.js/Prisma multi-condomínio (`claude/condominio-boletim-gestao-ougoqd`) e a rotina SafetyDocs (`claude/safetydocs-automation-4rq592`) — possíveis bases ou fontes de dados; relação a esclarecer.
