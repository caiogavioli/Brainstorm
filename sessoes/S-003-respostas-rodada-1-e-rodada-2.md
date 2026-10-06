# S-003 — Respostas da Rodada 1 e Rodada 2 (2026-10-06)

## Respostas do usuário à Rodada 1 (palavras dele)

> 1 eu digito, vindo de e-mails, relatorios, análise de sistemas, etc
> 2 a administradora não tem poder para analisar e discordar... a avaliação é feita por mim e validada pela BGRE
> 3 a nota pode mudar, mas não é usual, apenas em casos de erros graves na avaliação. normalmente imprimo e assino fisicamente
> 4 sim, todos fazem da mesma maneira
> 5 não aplicavel = 100% para não dar erro na planilha e diminuir a nota da administradora. Essa planilha é da BGRE e não posso mudar nada nela
> 6 sim, são todos
> 7 eu preencho, demoro cerca de 2 horas. juntar evidencia
> 8 a DF se autoavalia e a BGRE valida
> 9 A DF circula por e-mail para a administradora e para a BGRE. As notas são usadas para o indice de SLA (abaixo de 90% tem punição/retenção de valores conforme contratos)
> 10 os prazos são 1 mês após acabar o trimestre. o que mais doí é pedir as informações e evidencias para as administradoras. queria "automatizar" isso, por exemplo, criar uma lista que eles devem me enviar trimestralmente/mensalmente, e criar uma pasta no Onedrive compartilhada com cada condomínio, para que eles coloquem as evidências lá.
> 11 apenas eu, no Windows
> 12 todos
> 13 ler no onedrive
> 14 não sei. quebra: só vai mudar se eu te falar expressamente. eu te aviso se mudar qualquer coisa

## O que a Rodada 1 estabeleceu

- **Fatos.** Os 9 condomínios listados são toda a carteira. Modelo de planilha único e **imutável** (é da BGRE; mudança só por aviso expresso do usuário). Quem avalia é a DF; a BGRE valida; a administradora não contesta. Prazo: 1 mês após o fim do trimestre — para o **3T26 (jul–set) vence em 31/10/2026**.
- **Regra de "Não aplicável = 100%"** é escolha do usuário para não derrubar a nota da administradora — fica como regra do projeto (o controle só **sinaliza** o N/A, não altera o 100%).
- **As notas alimentam o índice de SLA: abaixo de 90% há punição/retenção de valores nos contratos.** Isso muda o peso do problema: um erro de planilha tem consequência financeira.
- **A dor principal não é digitar, é cobrar e juntar evidência das administradoras** (≈ 2 h por preenchimento — a confirmar se é por planilha ou no total). O pedido do usuário é uma **lista do que cada administradora deve enviar (mensal/trimestral)** e **uma pasta compartilhada no OneDrive por condomínio** para elas colocarem as evidências.
- **Saídas desejadas:** Excel, painel e PDF (resposta "todos"). **Leitura:** direto do OneDrive. **Usuário único**, Windows.
- O checklist de evidências recebido (15 itens, com "evidência necessária" e "ação" por item) já é, na prática, a lista de pedido às administradoras.

## Rodada 2 — decisões e propostas

Nada de repositório aqui: fim da Rodada 2 não é gatilho. Cada persona recomenda uma opção; onde discordam, o desacordo vai para o usuário.

### D1 — Cadência do pedido às administradoras

- **A.** Pedido **mensal** (1º dia útil) dos itens avaliados mês a mês + pedido **trimestral** dos itens que só fecham no trimestre.
- **B.** Um pedido **trimestral** único no fim do trimestre.
- **C.** Pedido mensal de tudo.

**Marina — A.** Sete itens são pontuados "33,33% por mês em conformidade"; evidência de um mês que ninguém guardou **não se reconstrói** em outubro. Pedir mês a mês é o que dá prova e dá tempo de corrigir antes do fim do trimestre. Também quer um **registro** (quem foi cobrado, quando, o que chegou).
**Rafael — A.** Só o que se mede por mês é pedido por mês; o resto, uma vez. Mede em horas: cobrar de última hora, para nove condomínios, é onde as 2 h viram dias.
**Tomás — B, com um lembrete no meio do trimestre.** Menos e-mails, menos peças. Aceita A se o e-mail já vier **pronto em rascunho** e custar um clique por administradora.
**Desacordo para o usuário:** A (Marina e Rafael) × B com lembrete (Tomás). Recomendação do time: **A**, com rascunho pronto.

### D2 — Onde as administradoras colocam a evidência

- **A.** Pasta de evidências **por condomínio**, no seu OneDrive, compartilhada **só com a administradora daquele condomínio** (o que você pediu).
- **B.** Biblioteca num **site do SharePoint da DF**, em vez de OneDrive pessoal.
- **C.** Sem pasta: tudo por e-mail com link.

**Marina — A**, com duas regras duras: (1) **nunca** compartilhar a pasta onde ficam as planilhas de nota — a administradora não pode ver a nota antes de você circular; por isso a pasta compartilhada é uma árvore **separada** só de evidências; (2) uma pasta por condomínio, nunca um pai comum, para a CBRE não ver a pasta da Cushman.
**Rafael — A**, desde que reduza o trabalho: é a única opção que muda *quem* corre atrás.
**Tomás — B.** OneDrive pessoal some junto com a conta, e parte do histórico já está no OneDrive de outra pessoa da equipe. Biblioteca de site sobrevive a troca de gente. Avisa também que compartilhar com **externos** depende da política do tenant, e o conector que eu uso **não consegue conceder permissão**: o compartilhamento é um clique seu por pasta.
**Desacordo para o usuário:** A × B. Recomendação do time: **A**, com a árvore separada e as duas regras; B fica como migração futura se a equipe crescer.

### D3 — Quais itens a administradora entrega e quais você mesmo busca

Com base no checklist recebido (proposta, para você confirmar item a item):

| Quem fornece | Itens |
|---|---|
| Administradora entrega na **pasta** | 1.1 relatório de OS · 2.3 pastas financeiras · 2.5 indicadores de segurança do trabalho · 2.6 RGM · 3.2 justificativas de variação > 5% · 4.1–4.3 resultado da pesquisa de satisfação |
| Administradora **preenche o Action Log** (você lê lá) | 2.2.1 zeladoria · 2.2.3 CAPEX · 2.4 reunião mensal · 3.1 inadimplência |
| Já chega no **seu e-mail** (SafetyDocs / Climas / Arotech) | 2.1 documentos nas plataformas · 2.2.2 documentação legal |
| **Só a BGRE** tem (análise do compliance/GED) | 3.3 compras · 3.4 contratações |

**Rafael:** a pasta só precisa dos itens da primeira linha — o resto não pede nada à administradora, só **lembrete de que o Action Log é semanal**. **Marina:** concorda; quer que o controle mostre a **fonte** de cada item para não misturar "faltou entregar" com "não consegui abrir o sistema". **Tomás:** sem desacordo. Falta confirmar: o checklist foi enviado às administradoras ou é só seu?

### D4 — Quem preenche as planilhas da BGRE

- **A.** Você continua preenchendo à mão (como disse) e eu entrego uma **folha de apoio** por condomínio (item a item: evidência encontrada, nota sugerida, texto de comentário no seu estilo) e, **depois**, uma **conferência** da planilha preenchida (nota digitada × marcação, média recalculada, N/A sinalizado).
- **B.** Eu gero uma **cópia** da planilha com as notas e comentários preenchidos; você revisa e assina.

**Marina — B**, porque os erros que vi (um `X` digitado por cima da fórmula; item "Ruim" marcado como "Excelente") nasceram de digitação à mão.
**Rafael e Tomás — A.** A planilha é da BGRE e tem formatação/abas ocultas; regravar um `.xlsx` por script pode perder elementos, e o risco de a BGRE estranhar o arquivo é maior que o ganho. Você disse que quer preencher; A respeita isso e já derruba as 2 h.
**Desacordo para o usuário:** A × B. Recomendação do time: **A na v1**; B só depois de testar numa cópia.

### D5 — Saídas (você respondeu "todos")

- **Excel mestre** (base de tudo): uma linha por condomínio × trimestre × item, status de evidência, notas compiladas, destaque do que fica abaixo de 90%.
- **Painel** (artefato privado, atualizado sob demanda): quadro dos 9 condomínios e das administradoras, evolução por trimestre, distância até 90%.
- **PDF:** **Rafael** diz que a BGRE já recebe a sua planilha assinada; ninguém pediu PDF consolidado — fica para quando houver pedido. **Marina** pede só **arquivar** o PDF assinado e digitalizado na pasta do trimestre. **Tomás:** concorda com o Excel como núcleo.
**Recomendação do time:** v1 = Excel mestre + painel; PDF consolidado depois, a seu pedido; arquivar o PDF assinado desde já.

## Proposta de recorte

**É 1 projeto, `avaliacao-trimestral-bgre`, com duas trilhas, e não é software.** É uma rotina com um kit de arquivos e e-mails.

- **Trilha administradora (a que tem a dor):** lista de pedido por administradora (mensal/trimestral, a partir do checklist), rascunhos de e-mail em Outlook para você enviar, árvore de pastas de evidência por condomínio, folha de apoio e conferência da planilha preenchida, Excel mestre e painel.
- **Trilha sindicância (barata):** não tem terceiro para cobrar (a DF se autoavalia e a BGRE valida), então **não precisa de pasta compartilhada**: folha de apoio, conferência e painel. Ela reaproveita a evidência da administradora — e o item 3.4 da sindicância ("realizar a avaliação da administradora") passa a ser **calculado** pelo controle.
- **Sem repositório novo, sem código de produto:** arquivos de condomínio e notas ficam no OneDrive, nunca no GitHub; aqui fica só o kit genérico (lista, modelos de e-mail, estrutura de pastas, regras).
- **Prazo imediato:** o 3T26 vence em 31/10. **Rafael:** o 3T26 é a transição — não dá para esperar a pasta funcionar. Primeiro passo útil já: um **mapa de lacunas** do 3T26 (o que já está no seu e-mail/OneDrive por condomínio, o que falta), e só então o primeiro pedido às administradoras. A rotina mensal começa no 4T26.

## Estado

Rodada 2 **aberta**, aguardando decisão do usuário em D1–D5 e confirmação do recorte. Perguntas pendentes: (a) as ≈ 2 h são **por planilha** ou no total do trimestre? (b) o checklist de evidências já foi enviado às administradoras? Sem "fecha o projeto" não há spec nem repositório.
