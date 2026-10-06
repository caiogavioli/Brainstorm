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

> otimo. já está funcionando? acho que o ideal é rodar a rotina às 12h00, por que a regra da BGRE é receber o Flash Report de manhã

> sim, conta como no prazo só até as 12h

> faça uma revisão para ver se os outros condomínios mandaram o flash report
> além disso, gostaria que o relatório fosse melhorado, que contivesse mais itens visuais ao inves de tanto texto

> adorei. faça mais uma alteração: quero filtrar mensalmente, e depois o filtro semanal como você fez

> vi que o TNU mandou o flash report. busque se o Panamerica mandou, e atualize a análise

> apenas corrigindo uma informação. "Parque Corporate" é o condomínio "O Parque - T07". faça essa alteração

> além disso, gostaria que existisse um filtro por condomínio, logo abaixo o filtro das datas. faça os botões do filtro de forma bonita

> além disso, quero que você retire do relatório o item "Cobranças da BGRE sem resposta". não ficou legal expor isso ali

> sim, reescreva esses cartões também
> arrume a numeração das semanas: organize contando as semanas do ano
> os botões dos condomínios ficaram bons, porém eles tem uma barra de rolagem que não ficou boa. faça um design dos botoes em duas linhas

> outro ponto: retire onde está escrito fonte. não preicsamkos saber a fonte

> adorei o resultado.
> agora, quero fazer uma análise um pouco maior... quero que você verifique se é possível buscar todos os flash reports dos condomínios desde o início do ano de 2026. ainda não faça análises dos arquivos, apenas verifique se existem flash reports enviados nesse período, listando por condomínio

> extraia e analise todos os reports desde janeiro

## O que foi feito nesta sessão

- Branch criado: `claude/flash-report-analises-semanais` (a partir de `main`).
- Busca "Flash Report" no Outlook: reports de 9 condomínios desde agosto/2026, mais threads de perguntas da BGRE.
- Extração dos PDFs em paralelo, um agente por condomínio, para um conjunto de dados estruturado (fora do GitHub).
- Recorte definido pelo usuário: só semanas a partir de 03/08/2026 (primeira segunda-feira de agosto); o que veio antes ficou de fora.
- Resultado: artefato com visão geral executiva e um dashboard por semana (9 semanas, 9 condomínios): https://claude.ai/artifact/V7wZJk18Nu6pGvnFBjnNRQ (privado). Os dados extraídos não vão para o GitHub.
- Achados principais: Panamérica Park sem report desde 24/08 com AVCB vencendo em 17/10; JKB com falta de energia de 30/09 e CFTV sem confirmação de retorno; Arquipeo com alagamento de 12/09 e notificação da WPP; Passeio Paulista com evento de diesel fora do Flash; 15 semanas sem report localizado em 5 condomínios.
- Confirmado pelo usuário: a carteira do Flash Report são esses 9 condomínios. A severidade é classificação automática e pode ser ajustada.
- Pedido atendido direto (relatório executivo + dashboards por semana); as rodadas 1 e 2 do time de três ficam para quando o usuário quiser decidir se isso vira rotina/projeto.

- Rotina semanal criada: segunda 12h00 (America/Sao_Paulo; começou 17h48, trocado a pedido do usuário), Routine `trig_016LpCwLxczWm1iVwAddguVz` na sessão original. A primeira execução agendada é segunda 12/10 às 12h00 e processa a semana de 05/10, além de procurar os reports atrasados das semanas anteriores. Arquivos em `rotina-flash-report/`.

- Regra de prazo definida pelo usuário: o Flash Report só conta como no prazo se chegar **até as 12h da segunda-feira** (BGRE recebe de manhã). Com a regra, só 14 dos 58 reports (24%) ficaram no prazo nas 9 semanas; o Arquipeo cumpre 6 de 9 e O Parque - T07, Passeio Paulista e Panamérica Park nunca chegaram a tempo. Artefato republicado (versão 2) e `build.py` recalcula a regra a cada rodada.

- Revisão de 06/10 no Outlook (7 condomínios com semanas em falta): chegaram Alphaville, Passeio Paulista e O Parque - T07 (semana de 28/09, todos depois das 12h). Continuam sem report: Panamérica Park (6 semanas, desde 24/08, sem cobrança da BGRE por e-mail), TNU (3 segundas sem Flash desde 14/09, ainda sem cobrança da BGRE), Centenário Plaza (24/08, 31/08, 07/09), 17007 Nações (31/08, 07/09, 21/09) e Alphaville (16 a 22/08). Fatos só por e-mail anotados: bomba de incêndio do PNP travou em 28/08, interrupções de energia no Fórum Trabalhista do PNP, pedido da BGRE sobre água de ar condicionado no Passeio Paulista e aprovação de fornecedor único (Henkotech) pendente com o usuário desde 02/10.
- Relatório redesenhado (versão 3 do artefato): manchetes curtas, anéis de cobertura e pontualidade, mapa de severidade, barras empilhadas por condomínio, gráfico de horário de chegada com a linha das 12h, contagem regressiva de datas críticas e, em cada semana, uma linha do tempo de 7 dias com ícones por tipo de ocorrência. Prioridades e temas agora têm número em destaque, três frases curtas e uma ação.
- Filtro mensal (versão 4 do artefato): linha de meses no topo e, dentro de cada mês, a visão do mês (indicadores, mapa, destaques, gráficos, cobranças) e as semanas. Semana entra no mês em que cai a quinta-feira. Prioridades, temas e datas críticas ficam só na aba Tudo.
- Atualização de 06/10 (17h40): o TNU mandou a semana de 28/09 a 04/10 às 15h43 (depois do prazo). O Panamérica Park não mandou: segue o consolidado de 10 a 23/08 como último report (6 semanas sem Flash, AVCB vence em 17/10). Por e-mail do PNP: bomba elétrica de incêndio travou em 27/08, Fórum Trabalhista cobra providência após queda em 14/09, válvula da Caixa 1 travada com pedido de R$ 8.520,00 (PP 3889/26) esperando aprovação do usuário. Artefato na versão 5; novo card "Aprovações esperando você" (Passeio Paulista e PNP).
- Correção do usuário: o condomínio antes chamado "Parque Corporate" é **"O Parque - T07"**. Nome trocado no artefato (versão 6), no playbook e nas notas; o identificador interno `parque-corporate` ficou, porque os dados e a rotina dependem dele.
- Filtro por condomínio (versão 7 do artefato): linha de botões abaixo das abas, com sigla, nome e ponto da pior severidade no recorte; seleção múltipla, combina com mês e semana. Com um condomínio só aparece a linha "Semana a semana" dele.
- A seção "Cobranças da BGRE sem resposta" saiu do relatório a pedido do usuário, e as cobranças também deixaram de ser gravadas nos dados da página. Cartões de prioridade ainda citam pedidos da BGRE sem resposta no texto; perguntar se também devem ser reescritos.
- Versão 8 do artefato: cartões de prioridade e textos das semanas reescritos sem referência a cobranças da BGRE sem resposta; semanas numeradas pela semana do ano (03/08 = semana 32); botões de condomínio em duas linhas (5 por linha, 2 colunas no celular) sem barra de rolagem; texto "fonte" e menções ao Outlook retirados da página. O cabeçalho só fica fixo em telas grandes e altas.

## Rodada do ano inteiro (06/10/2026)

- **Inventário (só metadados, sem abrir anexos):** um agente por condomínio listou os Flash Reports de 01/01 a 06/10. Resultado entregue ao usuário antes de qualquer análise. Ressalvas: 17007 Nações tem 20 semanas com original e anexo e 11 só com indício indireto; Centenário Plaza tem 3 semanas só por respostas, e a caixa compartilhada `adm.centenario` não é acessível; O Parque - T07 começa em 13/04 e o TNU em 06/04 (janeiro a março não confirmados como ausentes por limite de requisições); o assunto do JKB de 27/04 repete o de 06/04; Passeio Paulista troca de remetente e tem consolidados; Panamérica Park tem vários consolidados (12 a 25/01, 23/03 a 05/04, 13/04 a 03/05, 01 a 14/06, 10 a 23/08).
- **Extração e análise:** 168 e-mails em 19 lotes, um agente por lote, com o `prompt-extracao.md` (período real tirado do conteúdo do PDF; um item por e-mail). Voltaram 166 relatórios (reenvios e e-mails da mesma semana viraram um item). Mais a semana de 27/07, que o recorte antigo de agosto tinha deixado de fora. Os dados continuam só dentro do artefato; nada de condomínio foi para o GitHub.
- **Resultado (versão 9 do artefato):** 40 semanas (29/12/2025 a 05/10/2026), 9 condomínios, 236 relatórios próprios e 8 semanas em consolidados, de 360 semanas-condomínio devidas; 116 sem report localizado. Severidade: 25 altas, 111 médias, 100 baixas. Prazo das 12h: 64 de 236 (27%); Arquipeo 26 de 40, O Parque - T07 0 de 26 (ciclo de terça a segunda). Energia: 60 itens em 7 de 9 condomínios (Centenário Plaza em 14 semanas). Seis passageiros retidos em elevador, cinco no JKB. Chuva em dois picos: junho (Arquipeo, 66 pontos de infiltração em 24/06) e setembro (alagamento de 12/09). Semanas altas: Centenário Plaza e Panamérica Park 5 cada, JKB, Arquipeo e 17007 Nações 4 cada, Alphaville nenhuma.
- **Achado de método:** o Flash omite fatos que aparecem nos registros de ocorrência por e-mail. No 17007 Nações a seção de segurança dizia "sem ocorrência" nas semanas da tentativa de roubo (21/06) e do óbito de um colaborador do coworking da Torre Sigma (06/07).
- **Leituras parciais** (cartões marcados com ◔ no mapa e no cartão): O Parque - T07, 16 relatórios de abril a julho com as seções de energia, elevadores e segurança ilegíveis (zero ali não é ausência); 17007 Nações, 4 semanas só com o corpo do e-mail porque o anexo `.pptx.zip` não abriu; JKB, 4 semanas com campanhas e seções de manutenção como imagem; Alphaville, 1 semana (PDF de 27/04 repete o de 22/03); Panamérica Park, 1 semana (23/03 a 05/04, PDF original fora da caixa).
- **Contagem entre as duas levas:** janeiro a julho e agosto em diante foram lidos em momentos diferentes; o gráfico mensal é ordem de grandeza. O JKB responde por 62% das ocorrências de setembro (alarmes recorrentes de restaurante), e o painel avisa quando um condomínio puxa o mês.
- **Painel adaptado para 40 semanas:** aba "Tudo" só com a visão geral; mapa de severidade compacto (só o glifo, meses no cabeçalho); rótulos de gráfico espaçados; condomínio isolado mostra as 12 semanas mais recentes e recolhe o resto; gráfico novo "Evolução mês a mês". Texto executivo reescrito com os números do ano (manchetes, temas, método); as prioridades de hoje continuam as de outubro.
- **Código:** `build.py` ganhou `--desde` (acrescenta semanas anteriores), aceita lotes `<slug>-<n>.json` e o campo `limitacao` por semana (vira `lim` no cartão). Commits no branch; nenhuma ação externa foi feita.
- O artefato está compartilhado como "qualquer pessoa com o link" e traz dados operacionais; o usuário foi avisado para conferir o menu Compartilhar.
