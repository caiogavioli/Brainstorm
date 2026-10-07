# avaliacao-trimestral-bgre

**Origem:** P-001 — Avaliação trimestral das administradoras e da sindicância dos condomínios (BGRE)
**Status:** fechado em spec (2026-10-06). Primeiro ciclo (3T26) em andamento.
**Repositório:** nenhum. Projeto documental e operacional: o kit genérico vive neste branch (`claude/gifted-ritchie-hxhsjj`, em `entregas/avaliacao-trimestral-bgre/`); os dados dos condomínios vivem no OneDrive, nunca no GitHub.

## Problema que resolve

Todo trimestre o usuário (DF Síndicos) avalia, em planilhas da BGRE preenchidas à mão, **a administradora de cada um dos 9 condomínios** e **a própria sindicância** de cada prédio. São até 18 planilhas por trimestre, cerca de **2 horas cada**, e a maior parte do tempo vai em **juntar evidência**: pedir às administradoras, caçar em e-mail, WhatsApp, drives e sistemas da Brookfield. As administradoras conhecem o checklist de evidências e não o usam.

O resultado pesa: as notas alimentam o **índice de SLA** (abaixo de 90% há punição e retenção de valores nos contratos) e a confirmação da avaliação libera o faturamento da taxa de performance da administradora. Prazo: **1 mês após o fim do trimestre**.

## Escopo da v1

Entra:
- **Pedido mensal de evidências às administradoras** (1º dia útil), em rascunho no Outlook para o usuário enviar, um por condomínio, a partir de um modelo genérico. No 3T26, pedido único de transição (evidências de jul–set, prazo interno 16/10).
- **Evidência por e-mail ou pasta compartilhada**; WhatsApp só como aviso.
- **Pasta de evidências por condomínio** no OneDrive do usuário, compartilhada só com a administradora daquele condomínio, numa árvore separada da das notas (a administradora nunca vê a nota antes de o usuário circular). *A criar; o compartilhamento com externos é um clique do usuário por pasta.*
- **Árvore interna de pastas** `<Condomínio>\<Ano>\Q1…Q4` nas duas pastas de avaliação (administradora e sindicância). *Feita em 2026-10-06.* Tem pasta `2025` só nos 6 condomínios que já eram avaliados em 2025; **PL Extrema, Passeio Paulista e 17007 começaram a ser avaliados em 2026** e só têm `2026`.
- **Excel mestre de controle**, com mapa por condomínio × item, aba mensal (condomínio × item × mês × status × quem forneceu × canal), resumo e regras de pontuação da planilha da BGRE. *Primeira versão feita em 2026-10-06.*
- **Folha de apoio por condomínio** antes do preenchimento (item a item: evidência encontrada, nota sugerida, comentário no estilo do usuário) e **conferência da planilha preenchida** depois (nota digitada × marcação, média recalculada, N/A sinalizado). *A produzir a partir do fechamento do 3T26.*
- **Trilha da sindicância:** mesma folha de apoio e conferência, sem pasta compartilhada (não há terceiro para cobrar), reaproveitando a evidência da administradora; o item 3.4 da sindicância ("realizar a avaliação da administradora") passa a ser **calculado** a partir do controle.
- **Painel privado** (artefato) com os 9 condomínios, evolução por trimestre e distância até 90%, atualizado sob demanda.
- Arquivar o **PDF assinado e digitalizado** na pasta do trimestre.

Não entra (por decisão consciente):
- **Software e repositório novo.** É uma rotina com um kit de arquivos e e-mails.
- **Alterar a planilha da BGRE.** O modelo é deles, único e imutável; só muda por aviso expresso do usuário.
- **Preencher a planilha por script.** O usuário continua preenchendo à mão (regravar um `.xlsx` pode perder formatação ou abas e a BGRE pode estranhar). Fica para depois de um teste numa cópia.
- **Penalidade no texto do pedido.** Se a evidência não chega, o usuário busca por conta própria; o pedido é um pedido com data.
- **PDF consolidado para a BGRE.** Só a pedido dela; a BGRE já recebe a planilha assinada.
- **Mudar a regra de "Não aplicável = 100%".** É escolha do usuário para não derrubar a nota da administradora; o controle apenas **sinaliza** o N/A.
- **Itens 3.3 e 3.4 na cobrança às administradoras.** O usuário preenche pelo seu controle de compras e contratos; o resultado do compliance da BGRE chega depois do prazo e serve só como conferência.

## Usuários e uso

Um único usuário, no Windows. A equipe de 4 pessoas só consome saídas (arquivos no OneDrive); só o usuário tem Claude Code pago. Uso **mensal** (pedido às administradoras, conferência do que chegou) e **trimestral** (folha de apoio, preenchimento, conferência, envio à BGRE, arquivo). Prazo do trimestre: 1 mês após o fim (3T26: **31/10/2026**).

## Arquitetura escolhida

Tudo em ferramentas que o usuário já paga e usa; nenhuma peça nova a manter.

```
Ciclo mensal (1º dia útil)
  modelo do pedido (kit) ──► Claude gera rascunhos no Outlook, 1 por condomínio ──► usuário revisa e envia
  administradora responde por e-mail (anexo/link) ou deposita na pasta compartilhada
  Claude lê a caixa de e-mail e o OneDrive ──► atualiza a aba "Controle mensal" (status, quem forneceu, canal)

Ciclo trimestral (fim do trimestre → 1 mês)
  Excel mestre ──► folha de apoio por condomínio (administradora e sindicância)
  usuário preenche a planilha da BGRE à mão ──► Claude confere (valores) ──► usuário imprime, assina, digitaliza
  envio por e-mail à administradora e à BGRE ──► PDF assinado arquivado em <Condomínio>\<Ano>\Qn

OneDrive (Operacional\Claude)
  Avaliação de Administradora BGRE\<Condomínio>\<Ano>\Q1…Q4   (interna: planilhas, controle)
  Avaliação de Sindicância BGRE\<Condomínio>\<Ano>\Q1…Q4       (interna)
  Evidências BGRE\<Condomínio>\…                                (a criar; compartilhada só com a administradora)
```

**Fonte da prova por item** (decisão D3):

| Quem fornece | Itens |
|---|---|
| Administradora (pasta ou e-mail) | 1.1 relatório de OS · 2.3 pastas financeiras · 2.5 indicadores de segurança do trabalho · 2.6 RGM · 3.2 justificativas de variação > 5% · 4.1–4.3 pesquisa de satisfação (quando houver) |
| Action Log (o usuário lê lá) | 2.2.1 zeladoria · 2.2.3 CAPEX · 2.4 reunião mensal · 3.1 inadimplência |
| E-mail do usuário (SafetyDocs, Climas, Arotech) | 2.1 documentos nas plataformas · 2.2.2 documentação legal (regra: 1 documento vencido = nota zero) |
| O próprio controle do usuário | 3.3 compras · 3.4 contratações |

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Controle e consolidação | Excel (`.xlsx`) no OneDrive, gerado por script | O usuário já usa Excel no Windows; nenhuma peça nova; qualquer um da equipe abre |
| Envio às administradoras | Rascunhos no Outlook (conector Microsoft 365) | O usuário já usa Outlook; o envio continua dele, sem automação que mande e-mail em nome dele |
| Entrega de evidência | E-mail ou pasta compartilhada do OneDrive | Já existentes; sem plataforma nova para as administradoras aprenderem |
| Leitura de e-mail e OneDrive | Conector Microsoft 365 | Lê valores de planilha, anexos e e-mails; é o que o usuário já conectou |
| Painel | Artefato privado do Claude | Sem hospedagem própria; atualiza sob demanda |
| Documentação e modelos | Este branch do repositório Brainstorm | Fonte da verdade do processo, sem dados de condomínio |

## Decisões e trade-offs

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Recorte: 1 projeto, 2 trilhas (administradora e sindicância), sem repositório novo | 2 projetos separados; script avulso | A evidência é a mesma vista de dois ângulos e uma avaliação alimenta a outra (item 3.4 da sindicância) |
| Pedido **mensal** com rascunho pronto, e pedido trimestral para o que só fecha no trimestre (D1) | Pedido único no fim do trimestre com lembrete (Tomás); tudo mensal | Sete itens são pontuados "33,33% por mês"; evidência de um mês que ninguém guardou não se reconstrói; o rascunho derruba o custo de enviar |
| Pasta de evidências **separada** da das notas, uma por condomínio, no OneDrive do usuário (D2) | Biblioteca de site SharePoint da DF (Tomás; fica como migração futura); só e-mail | É o que o usuário pediu; a administradora não pode ver a nota antes de ele circular |
| O usuário **continua preenchendo à mão**; o Claude entrega folha de apoio e conferência (D4) | Cópia da planilha preenchida por script (Marina) | A planilha é da BGRE e tem formatação e abas ocultas que um script pode perder |
| **Excel mestre + painel**; PDF só a pedido da BGRE; arquivar PDF assinado (D5) | PDF consolidado já na v1 | Ninguém pediu PDF consolidado; a dor é cobrar e juntar evidência |
| Evidência que não chega: o **usuário busca por conta própria**, sem penalidade no pedido | Anunciar perda de nota (a regra "33,33% por mês" permitiria) | Escolha do usuário; o controle registra **quem forneceu** (administradora × DF) como indicador de sucesso |
| **E-mail ou pasta** como evidência; WhatsApp só como aviso | Aceitar WhatsApp | O Claude só lê e-mail e OneDrive; sem canal legível o controle não vê o que foi entregue |
| **3.3 e 3.4 pelo controle do usuário**, sem esperar o compliance da BGRE | Aguardar o resultado da BGRE | O resultado do trimestre chega semanas depois do prazo (no 2T26: entre 5 e 10 semanas) |
| "Não aplicável = 100%" mantido; o controle só sinaliza | Excluir o item da média | Regra do usuário para não derrubar a nota; a planilha da BGRE não pode ser alterada |
| Estrutura `<Condomínio>\<Ano>\Q1…Q4` | `1T25…4T25` dentro do ano | Pedido do usuário: o ano já está na pasta pai |

## Riscos

- **Evidência fora do alcance do Claude.** O Claude só lê a caixa de e-mail conectada e o OneDrive; WhatsApp, e-mail de outra pessoa da equipe, Action Log, IPMS e drive Brookfield ficam invisíveis. Mitigação: o pedido exige e-mail ou pasta e a aba mensal registra o **canal** para medir quanto ainda chega por WhatsApp.
- **O pedido ser ignorado**, como o checklist foi. Sem penalidade no texto, o risco é real. Mitigação: o indicador "% entregue pela administradora" mostra se melhora; o histórico de não entrega fica à mão caso o usuário queira levar à BGRE (decisão dele).
- **Documento vencido zera o item 2.2.2.** Em 05/10/2026 havia documentos vencidos no SafetyDocs em 7 dos 9 condomínios (foto, não o fim do trimestre). Pode derrubar a nota e o SLA; o usuário precisa conferir.
- **Compartilhar pasta com externos** depende da política do tenant e é um clique manual por pasta; o conector não concede permissão. Risco de uma administradora ver a pasta de outra se a árvore for mal montada.
- **Troca do modelo da BGRE.** O modelo já mudou (rev. 1 maio/2022, rev. 3 fev/2024). O usuário avisa quando mudar; até lá o controle assume o modelo atual.
- **Limites do conector Microsoft 365**: grava arquivos até 1 MB e a reprodução de um `.xlsx` grande dentro da chamada falhou (o arquivo é entregue pela conversa e o usuário salva à mão); lê planilha **sem fórmulas**; HTML de e-mail só com tags sem atributos (sem tabela com borda); rascunho sai sem a assinatura do Outlook.
- **Dados de condomínio no GitHub.** Nunca: notas, fornecedores, comentários e contagens por condomínio ficam no OneDrive; aqui só estrutura e modelos.
- **Prazo apertado do 3T26** (31/10): o ciclo começou com o pedido de transição, e a pasta compartilhada ainda não existe.

## Critério de pronto (v1)

- [x] Árvore interna de pastas nas duas pastas de avaliação, 9 condomínios (2026-10-06)
- [x] Mapa de lacunas do 3T26 em Excel (mapa, resumo, achados, controle mensal, regras) (2026-10-06)
- [x] Modelo genérico do pedido de evidências e 9 rascunhos do 3T26 no Outlook (2026-10-06)
- [ ] Rascunhos revisados e enviados pelo usuário; primeiras respostas conferidas na aba "Controle mensal"
- [ ] Árvore **Evidências BGRE** criada e compartilhada, uma pasta por condomínio, só com a administradora correspondente
- [ ] Folha de apoio por condomínio (administradora) do 3T26
- [ ] Conferência da planilha de administradora preenchida (nota digitada × marcação, média recalculada, N/A sinalizado), nos 9 condomínios
- [ ] Trilha da sindicância: folha de apoio, conferência e item 3.4 calculado a partir do controle
- [ ] Excel mestre consolidado do 3T26 (notas compiladas por condomínio e administradora, destaque abaixo de 90%)
- [ ] Painel privado do 3T26
- [ ] Planilhas do 3T26 enviadas à BGRE até 31/10/2026 e PDFs assinados arquivados
- [ ] Indicador de sucesso medido no 4T26: % de itens entregues pela administradora e horas de preenchimento por planilha, contra a linha de base de ≈ 2 h por planilha

## Fora do escopo mas mapeado (v2+)

- Painel da evolução por trimestre com **histórico retroativo** (1T25 em diante), lendo as planilhas antigas nas pastas dos condomínios. A linha de base de PL Extrema, Passeio Paulista e 17007 começa em 2026.
- **Alerta mensal de risco ao SLA** (nota projetada no meio do trimestre, semáforo de itens que podem zerar: documento vencido, compra fora da política, contrato vencido).
- Preencher uma **cópia** da planilha por script (depois de teste), se o ganho compensar o risco.
- Migrar a pasta compartilhada para um site SharePoint da DF, se a equipe crescer ou a conta pessoal virar problema.
- Pedido **trimestral** dos itens que só fecham no trimestre (pesquisa de satisfação, medições de equipamentos), quando houver resultado.
- Relação com o `aprovacoes-contratos-concorrencia` (checklist de assinatura de contratos e quadros) e com a análise de concorrências: o controle de compras e contratações (3.3 e 3.4) pode vir dali.

## Como retomar numa sessão nova

1. Ler o catálogo em `MEMORY.md` de `main`, depois este arquivo e `sessoes/S-004-…` (decisões e execução).
2. Modelo do pedido: `entregas/avaliacao-trimestral-bgre/pedido-evidencias-modelo.md`.
3. OneDrive: `Operacional\Claude\Avaliação de Administradora BGRE` e `…\Avaliação de Sindicância BGRE`. O Excel de controle mais recente está em `Avaliação de Administradora BGRE` (ou na conversa, se a gravação direta falhou).
4. Destinatários: `rotina-safetydocs/mapeamento-predios.md`, branch `claude/safetydocs-automation-4rq592` (confirmado pelo usuário em 11/08/2026).
5. Painel de acompanhamento: artefato privado "Checklist Avaliações BGRE" (levantamento + checklist clicável; ver `sessoes/S-006-…`). Os dados vivem lá, não aqui.
6. Antes de qualquer envio: o usuário revisa e envia; nada sai em nome dele sem isso.
