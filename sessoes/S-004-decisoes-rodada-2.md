# S-004 — Decisões da Rodada 2 (2026-10-06)

## Respostas do usuário (palavras dele)

> vai com a recomendação do time
> por planilha
> eles conhecem, mas não usam... eu que uso todo trimestre

O usuário **delegou** as decisões D1–D5 de S-003 à recomendação do time (as três opções recomendadas eram as mesmas A de cada decisão, contra a discordância de Tomás em D1 e D2 e de Marina em D4). Não sobrou desacordo a devolver: vale a recomendação.

## Decisões fechadas

| # | Decisão | Alternativas descartadas |
|---|---|---|
| D1 | Pedido **mensal** (1º dia útil) dos itens medidos mês a mês + pedido **trimestral** do resto, com **rascunho de e-mail pronto** no Outlook para o usuário enviar | B (um pedido trimestral com lembrete no meio — Tomás); C (tudo mensal) |
| D2 | **Pasta de evidências por condomínio** no OneDrive do usuário, compartilhada **só** com a administradora daquele condomínio, numa **árvore separada** da das planilhas de nota (a administradora nunca vê a nota antes de o usuário circular) | B (biblioteca SharePoint da DF — Tomás, fica como migração futura); C (só e-mail) |
| D3 | Divisão de itens conforme S-003: administradora entrega na pasta (1.1, 2.3, 2.5, 2.6, 3.2, 4.1–4.3); lê-se no Action Log (2.2.1, 2.2.3, 2.4, 3.1); chega no e-mail do usuário (2.1, 2.2.2); só a BGRE (3.3, 3.4) | — |
| D4 | O usuário **continua preenchendo à mão**; o Claude entrega **folha de apoio** por condomínio e, depois, **conferência** da planilha preenchida. A planilha da BGRE não é tocada | B (cópia preenchida por script — Marina; só depois de testar numa cópia) |
| D5 | v1 = **Excel mestre + painel**; arquivar o PDF assinado e digitalizado na pasta do trimestre; PDF consolidado só a pedido da BGRE | — |
| Recorte | **1 projeto**, `avaliacao-trimestral-bgre`, duas trilhas (administradora e sindicância), **sem software e sem repositório novo**; a trilha da sindicância não usa pasta compartilhada e calcula o item 3.4 a partir do controle | 2 projetos separados; script avulso |

## Fatos novos

- **≈ 2 h por planilha.** São até 18 planilhas por trimestre (9 administradoras + 9 sindicâncias) — a ordem de grandeza é de **dezenas de horas por trimestre**, não de 2 h. (A estimativa do tempo da sindicância, que costuma reaproveitar a evidência da administradora, não foi separada.)
- **Os administradores conhecem o checklist e não o usam; quem o usa é o usuário, todo trimestre.** Logo o checklist **não é um instrumento novo para as administradoras**: o que muda é a **cadência mensal, o rascunho pronto, a pasta de entrega simples e o registro do que foi pedido e recebido**. Só entregar a lista de novo repetiria o que já não funciona.

## Pendência levantada pelo time

**Marina:** o que acontece quando a evidência não chega no prazo do mês? A regra da própria planilha ("33,33% para cada mês preenchido em conformidade") já dá um terço do item por mês; se o pedido mensal disser isso com todas as letras, cria consequência. Se o usuário continuar buscando a evidência por conta própria quando a administradora não entrega, o pedido vira só mais um e-mail ignorado. A resposta do usuário define o texto do rascunho.

## Resposta à pendência (palavras do usuário)

> (b)

**Evidência que não chega no mês: o usuário continua buscando por conta própria**, como hoje. O pedido mensal **não carrega penalidade** e o rascunho de e-mail não anuncia perda de nota.

Consequências para o projeto:
- O texto do rascunho é um **pedido com data** ("enviar até o dia X; se não chegar, a DF levanta diretamente"), sem tom de cobrança.
- Risco apontado por Marina: sem consequência, o pedido tende a ser ignorado como o checklist foi. Por isso o controle registra, por condomínio × item × mês, **quem forneceu**: `administradora` (pasta ou e-mail) ou `DF` (o usuário foi buscar). Esse campo é o **indicador de sucesso da v1**: a parcela de itens entregues pela administradora deve subir; as horas de preenchimento, cair. Também deixa o histórico à mão caso o usuário queira levar a não entrega à BGRE, decisão que continua dele.
- O Excel mestre **não altera nota** por falta de evidência: a nota segue a planilha da BGRE preenchida pelo usuário.

## Estado

Rodada 2 **fechada em decisão**. Recorte aceito pela delegação. Falta: o usuário dizer "fecha o projeto" para gerar a spec (`projetos/avaliacao-trimestral-bgre.md`) — **não é gatilho** o fim da Rodada 2. Próximo passo já combinado, que não depende do fechamento: **mapa de lacunas do 3T26** (prazo 31/10/2026).

## Execução: estrutura de pastas no OneDrive (2026-10-06)

Pedido do usuário: criar uma pasta por condomínio dentro das duas pastas de avaliação, usando como modelo a pasta já criada por ele para o Arquipeo. Depois, ajuste dele: dentro da pasta do ano, os trimestres se chamam só `Q1`…`Q4`.

> pode deixar as pastas dos trimestres como Q1, Q2, Q3 e Q4, pois elas estão dentro da pasta do ano já

Padrão adotado, nas duas árvores (`Operacional\Claude\Avaliação de Administradora BGRE` e `Operacional\Claude\Avaliação de Sindicância BGRE`):

```
<Condomínio>\<Ano>\Q1 | Q2 | Q3
```

- Condomínios (9): Alphaville, Arquipeo, CTN, JKB, PL Extrema, Panamerica Park, Passeio Paulista, TNU, 17007 Nações.
- Anos: 2025 (Q1–Q4) e 2026 (Q1–Q3). O Q4 de 2026 ainda não existe: criar quando o trimestre começar.
- Só estrutura de pastas; nenhum arquivo do usuário foi movido ou copiado.
- A pasta `Arquipeo` da árvore de Administradora é do usuário e não foi alterada, exceto pela criação de `2026\Q3` vazia. Ela ainda usa `1T25…4T25` em 2025.
- Esta é a árvore **interna** (planilhas e controle). A pasta compartilhada com as administradoras (D2) é uma árvore separada, ainda não criada.

## Execução: mapa de lacunas do 3T26 (2026-10-06)

Autorizado pelo usuário ("pode começar"). Só leitura no Outlook e no OneDrive. O arquivo (`Mapa de lacunas 3T26 - Avaliação Administradora BGRE.xlsx`, 5 abas: Mapa 3T26, Resumo, Achados, Controle mensal, Regras da planilha BGRE) contém dados de condomínio e **não vai para o GitHub**. Foi entregue ao usuário na conversa; a gravação direta no OneDrive falhou porque o conector exige que o arquivo seja reproduzido dentro da chamada e a cópia de ~30 mil caracteres saiu truncada. O usuário salva o arquivo à mão na pasta.

Conclusões de processo (sem dados de condomínio):

- **A caixa de e-mail é o lugar errado para procurar a maior parte da evidência.** RGM, relatório de OS e indicadores de segurança do trabalho dos 9 condomínios não apareceram por e-mail no 3T26; os RGMs ficam como arquivos nas pastas dos condomínios no OneDrive, salvos pela equipe, ou em drives/sistemas da Brookfield. A caixa é dominada por relatórios de triagem e avisos do SafetyDocs. Por isso o mapa por condomínio × item tem poucos "em mãos" e muitos "a pedir"/"você confere": isso **não** quer dizer que falte evidência, quer dizer que ela não passa pelo e-mail.
- **O que o e-mail dá com segurança:** o resumo semanal do SafetyDocs (documentos vencidos por condomínio, base dos itens 2.1 e 2.2.2, cuja regra zera a nota com 1 documento vencido), o calendário do compliance da BGRE e os e-mails de envio das avaliações.
- **A análise de compliance da BGRE (3.3 e 3.4) chega depois do prazo do trimestre** (no 2T26 chegou entre 5 e 10 semanas após o fim). O item precisa de regra própria no controle.
- **A pesquisa de satisfação 2026 da BGRE está em fase de cadastro**; o bloco 4 segue como N/A (100% na planilha).
- **O envio da avaliação libera o faturamento da taxa de performance da administradora**, além do índice de SLA: o efeito financeiro é duplo.
- **Consequência para a v1:** o controle precisa de uma aba mensal (condomínio × item × mês × status × quem forneceu), que o mapa já traz pronta, e a fonte de cada item tem de ser decidida item a item com o usuário (e-mail, pasta, link, sistema).

## Respostas do usuário sobre o mapa (2026-10-06, palavras dele)

> tudo chega por e-mail ou por whatsapp
> 3.3 e 3.4: eu preencho pelo meu controle

Decisões:

- **Itens 3.3 e 3.4 (compras e contratações):** o usuário preenche **pelo seu controle**, sem esperar o resultado do compliance da BGRE, que passa a servir só como conferência posterior. No mapa os dois itens saem de "Aguarda BGRE" para "Você confere". Os itens deixam de ser pedido às administradoras.
- **Canal da evidência:** chega **por e-mail ou por WhatsApp**. O Claude só lê o e-mail da caixa conectada; o WhatsApp e os e-mails de outras pessoas da equipe ficam invisíveis ao mapa. Isso explica parte do "não localizado" e muda o desenho do pedido mensal (D1) e da pasta (D2): sem um canal único que o Claude consiga ler, o controle não enxerga o que foi entregue.
- **Recomendação do time, aguardando confirmação do usuário:** o pedido mensal passa a pedir **e-mail ou pasta compartilhada**; WhatsApp serve como aviso de que o material foi enviado, não como evidência. A aba "Controle mensal" ganhou o campo "Canal" (e-mail, WhatsApp, pasta, link/drive, sistema) para medir quanto ainda chega por WhatsApp.
