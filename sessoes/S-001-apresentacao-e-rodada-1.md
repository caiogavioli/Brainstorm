# S-001 — Apresentação e Rodada 1: sistema para o Action Log

**Data:** 2026-10-07 · **Problema:** P-001 · **Fase:** 1 (apresentação) → 2 (Rodada 1 aberta)

## O que o usuário disse (palavras dele)

> a planilha anexa é o action log da DF Sìndicos, usado em todos os condomínios sob nossa gestão (cada condominio possui um arquivo diferente). analise a planilha e me dê sugestões/opções para montar um sistema que atenda todas as necessidades da nossa planilha (cada aba tem um tema específico), as mais importantes são o proprio Action Log (onde colocamos um assunto e fazemos atualização periodica dele com a administradora), Investimentos, e ForeCast.

Anexo: `Action_Log_-_Atrium_Century_Plaza_-_2025.xlsx` (fica fora do repositório).

## Leitura da planilha, aba por aba

| Aba | O que é | Estado observado no arquivo |
|---|---|---|
| **Action Log** | Assuntos × reuniões semanais | **Viva.** 52 itens (40 concluídos, 11 em andamento, 1 stand by); 138 colunas de reunião; 2.046 observações |
| **Investimentos 2024 / 2025** | Acompanhamento do que a AGO aprovou: teto, executado, saving | 2024 usada (15 itens, 14 concluídos, todos do Fundo de Reserva); **2025 em branco** e com título copiado de "2023" |
| **Fluxo de Caixa** (ForeCast) | Saldo mensal por fundo, realizado + projetado | **Viva.** 6 fundos × 12 meses, digitado à mão |
| **Posição Financeira** | Saldo por fundo entre duas datas | Viva, digitada à mão, datas do cabeçalho em texto |
| **Documentos Obrigatórios** | ~116 documentos, status por fórmula | **Defasada:** 49 "vencidos" na aba × "145 regulares, 5 vencidos" no Action Log do mesmo período (que vem do SafetyDocs) |
| **Contratos – Despesas / Receitas** | Cadastro com vigência, reajuste, aviso prévio | **Defasada:** 18 de 20 contratos de despesa "vencidos", coluna de renovação vazia; 2 fórmulas com `#VALUE!` em Receitas |
| **Auditoria** | Recomendações da auditoria e respostas | **Vazia** (100 linhas numeradas) |
| **Inadimplência** | Lista por unidade; total por fórmula | Parcialmente viva; contém dados pessoais (nome de proprietário) |
| **REV-03** | Histórico de revisões da planilha | Informativa (3 revisões, jan/2024) |
| **BASE – Listas Suspensas** (oculta, protegida) | Listas das validações | É o "catálogo" que um sistema deve herdar |

## Achados transversais

1. **Modelo "uma coluna por reunião".** O histórico de um assunto está espalhado na horizontal. Pelo menos 57% das observações são cópia literal da semana anterior (1.176 de 2.046) — o preenchimento semanal é, em boa parte, "repetir".
2. **O Action Log tem campos que ninguém usa:** Responsável preenchido em 3 dos 52 itens; Plano de Ação em 1; Prazo em 1. O que sobrevive é Assunto + observação semanal + status.
3. **Quebras de manutenção:** o filtro vai só até a linha 48 e a coluna Y (os 7 itens mais novos e quase todas as reuniões ficam de fora); regras de formatação condicional apontam para `#REF!`.
4. **Itens "vivos" copiam números de outros lugares** à mão (documentos ← SafetyDocs; inadimplência ← relatório da administradora): o Action Log é, em parte, um espelho de outros sistemas. Em dois relatórios consecutivos o valor de inadimplência aparece idêntico — indício de cópia sem atualização.
5. **Investimentos:** o saving é `teto − executado`; item "em cotação" (executado vazio) entra no resumo como economia de 100% do teto. Só há um valor (teto) e um valor (executado): falta o **contratado**, a **cotação vencedora**, a **AGO que aprovou** e o **cronograma de pagamento**.
6. **Fluxo de Caixa:** (a) não tem coluna de **orçado** — a linha "PREVISTO X REALIZADO" é, na verdade, receitas − despesas; (b) no Fundo Ordinário nenhum mês é marcado PROJETADO, embora novembro e dezembro repitam os mesmos valores; (c) o Fundo Água fica com saldo **negativo desde maio** e ninguém é avisado; (d) o título não traz o ano, e os saldos iniciais não conferem com a Posição Financeira — não dá para saber qual ano a aba representa.
7. **Planilha por condomínio:** cada cópia diverge com o tempo. Não há visão de portfólio.
8. **O que está vivo e o que é herança** é a primeira pergunta de produto: três abas (Documentos, Contratos, Auditoria) parecem ter sido ultrapassadas por outros sistemas ou nunca entraram em uso. *(Hipótese baseada em um único arquivo.)*

## Terreno de opções (preliminar — **não é decisão**; a Rodada 2 recomenda)

- **A. Monday** (já pagam): um board com coluna "Condomínio"; cada assunto é um item e a observação semanal vira *update* do item — o histórico fica vertical. Encaixa bem o Action Log; Investimentos cabe com colunas de valor; **Forecast encaixa mal** (matriz mensal por categoria).
- **B. Microsoft 365** (Listas do SharePoint + Excel mestre + Power BI/Power Apps): fica onde os arquivos já estão; Action Log e Investimentos viram listas; Forecast continua em Excel ou vai para Power BI. Mais flexível que o Monday, mais trabalhoso de montar e de manter.
- **C. App próprio**, possivelmente sobre o app de boletim já existente (Next.js/Prisma, multi-condomínio, com login): Action Log + Investimentos + Forecast no mesmo modelo de dados, ata semanal gerada para a administradora. Máximo de integração e de controle; máximo de manutenção.
- **D. Híbrido:** Action Log no Monday/app, Forecast e Investimentos num Excel mestre único com uma aba por condomínio.

## Rodada 1 — perguntas

**Marina (1–5)**

1. De onde vêm os números do Fluxo de Caixa e da Posição Financeira hoje: digitados à mão a partir de qual documento da administradora (PDF, Excel, sistema deles)? Em que dia do mês chega?
2. Quando a administradora reapresenta um mês corrigido, o que acontece com a planilha? Há versões, ou a célula é sobrescrita? Quem percebe a diferença?
3. A atualização semanal "com a administradora" acontece em reunião, por e-mail, ou nos dois? Quem escreve a observação, e o que a administradora faz com ela depois (responde, confirma, só recebe)?
4. Os itens que copiam números de outros lugares (documentos, inadimplência) continuam sendo atualizados à mão toda semana? Quanto tempo isso leva?
5. Quantos condomínios e quantas administradoras? A estrutura da planilha é igual em todos os arquivos ou cada um divergiu? Existe um arquivo-mestre de onde as cópias saem?

**Rafael (6–10)**

6. Quem preenche o Action Log (só você? os 4 da equipe?), quando (ao vivo na reunião ou depois) e quanto tempo por condomínio por semana?
7. Quem lê o Action Log além de vocês — administradora, sindicância/conselho, proprietário? Em que forma chega a eles (o Excel inteiro, PDF, print)?
8. Investimentos: quem alimenta cada coluna e quem consome o resultado (AGO, relatório ao proprietário)? A aba de 2025 está vazia — onde vivem os investimentos de 2025?
9. Forecast: que decisão ele serve e quem pede? Alguém age quando um fundo projeta saldo negativo (como o Fundo Água neste arquivo)? Para você, falta o **orçado** (previsão aprovada) ao lado do realizado?
10. Das 11 abas visíveis, quais você realmente usa hoje e quais são herança? Posso tirar Documentos, Contratos e Auditoria do escopo, sabendo que o SafetyDocs cobre documentos?

**Tomás (11–14)**

11. Quantas pessoas vão mexer no sistema, e a administradora (ou o conselho) precisa **entrar** nele, ou só **receber** relatório?
12. O Monday está liberado para isso (licenças, boards, convidados externos)? Há teto de custo mensal para ferramenta nova?
13. O app de boletim/gestão (Next.js/Prisma, ~50 prédios) está rodando em produção? Se sim, é candidato a base ou é outro mundo (operação diária × gestão semanal)? Quem mantém hoje?
14. Há exigência de algum cliente (ex.: BGRE/Brookfield) sobre onde dados financeiros e de inadimplência podem morar? Precisa funcionar bem no celular (Android)?

**Atrito já visível (hipóteses, não posições finais):**
- **Tomás:** "isso talvez seja Monday para o Action Log e um Excel mestre para o resto, e fim de conversa — o app só se justificar se Monday não resolver."
- **Marina:** "Forecast sem fonte de verdade definida (administradora × planilha) e sem versão do mês corrigido vai gerar o mesmo problema em qualquer ferramenta; esse ponto vem antes da escolha de plataforma."
- **Rafael:** "antes de qualquer plataforma, descobrir se metade das abas está morta; se está, o projeto é menor do que parece."

## Respostas do usuário

Respondidas em 2026-10-07, com o anexo `Consolidado_Fornecedores___rede.xlsx` (fica fora do repositório). Transcrição literal:

1. a administradora que preenche manualmente
2. a celula é sobreescrita
3. os dois, a administradora escreve a observcação, acompanha o tema, e a sindicância faz apontamentos ou inclui exigências
4. Documentos são analisados pela data de vencimento após o primeiro preenchimento de todas as linhas, só atualiza aquilo que foi renovado. Inadimplência é atualizada no mínimo mensalmente, mas quando ocorre o pagamento de algum inadimplente, a administradora atualiza
5. a lista de condomínio e suas administradoras está na planilha anexa
6. a administradora (todos os funcionários: gerente, supervisor, assistente, etc.). eles devem preencher sempre que tem atualização de cada tema, porém o ActionLog é revisado semanalmente pela DF Sìndicos e precisa estar atualizado
7. Administradora, sindicancia e proprietário
8. Administradora alimenta, de acordo com os investimentos aprovados em assembleia. Ela gerencia a contratação e a execução dos serviços, faz os pagamentos, e atualiza a planilha com o andamento dos temas.
9. O Forecast serve para a sindicância e a administradora analisarem o comportamento das contas do condomínio, se vai faltar ou sobrar dinheiro no final do ano ou em algum mÊs específico. Se vai ficar negativo, realizamos reunião em conjunto para discutir as ações.
10. não, não tire nenhuma. ALguns condomínios possuem o Safetydocs (os da BGRE), mas os outros não tem.
11. Estimo que 100 pessoas, da mesma forma que o Boletim Diário. A Administradora é quem vai preencher tudo, o conselho/proprietários vão entrar nele para acompanhar
12. não gostaria de usar o monday, está muito caro. acho melhor desenvolver uma plataforma própria
13. o app de boletim pode ser usado como uma ideia, uma base. mas esse deve ser um sistema apartado.
14. não restrigem. seria bom funcionar no celular

**Sem resposta direta:** tempo gasto por semana (6), teto de custo mensal (12), quem mantém o app de boletim e se está em produção (13).

### O que o anexo mostra (sem e-mails nem telefones)

Aba `Planilha1` — a carteira: 40 condomínios, com apelido, CNPJ, endereço, cliente/proprietário, **Responsável DF**, administradora, contatos (gerente regional e gerente predial) e os fornecedores por disciplina (segurança, recepção, limpeza, manutenção predial e de automação). Aba `Agenda Assembleia` — 10 assembleias de setembro/2026, por área (Office/Logistics) e administradora.

- **Administradoras:** 13 valores distintos na coluna (CBRE 10, Innova 6, "BRPRA/CBRE" 5 — a confirmar se é a mesma CBRE —, Cushman & Wakefield 4, Hines 3, Colliers 2, Hersil 2, e 6 com 1 condomínio cada).
- **Responsável DF:** Amanda 17, Caio 12, Denise 10 (1 em branco) — a revisão semanal da DF já é naturalmente dividida em três carteiras.
- **Clientes/proprietários:** Brookfield/BGRE 11, Petros 6, XP 4, Carrefour 2, REC 2, BSP 2, mais 8 com 1 cada; 4 em branco.
- **Geografia:** SP 29, RJ 5, MG 2, AM 2, 2 sem UF.
- Os 100 usuários estimados batem com ~2,5 pessoas por condomínio (gerente predial + regional + conselho).
