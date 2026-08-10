# S-001 — P-001, Rodada 1 (entendimento)

**Data:** 2026-08-10
**Problema:** P-001 — Controle de pedidos e prazos vindos por email do contratante
**Fase:** Rodada 1 — perguntas de entendimento

---

## Apresentação do usuário (palavras dele)

> TEnho uma dificuldade que preciso resolver: recebo emails do meu contratante, e preciso monitorar esses emails, as respostas que preciso dar, os prazos, etc. em resumo, preciso ter controle dos pedidos e ações que preciso fazer para este cliente. como você pode me ajudar com este controle?

---

## Perguntas — Marina (backend, dados e integrações)

Ela quer saber de onde o dado nasce e o que acontece quando a fonte mente.

1. Qual é o provedor da caixa de email: Outlook/Microsoft 365, Gmail, ou outra coisa? É uma caixa só sua ou uma caixa compartilhada com mais gente?
2. Os pedidos chegam de **um** remetente ou de vários endereços do mesmo contratante? Vem por thread nova a cada assunto, ou tudo continua na mesma thread eterna?
3. O prazo vem **escrito** no email ("preciso até sexta"), vem implícito ("urgente", "assim que possível"), ou você mesmo estipula depois de ler?
4. Um email = um pedido, ou um email costuma carregar três pedidos misturados no meio de um texto longo?
5. Além do email, o mesmo contratante te aciona por WhatsApp, Teams, ligação ou reunião? Se sim, esses pedidos também precisam entrar no mesmo controle ou eles ficam de fora?

## Perguntas — Rafael (produto e full-stack)

Ele quer saber quem abre isso e quantos minutos por semana isso devolve.

6. O que você faz **hoje** para não perder um pedido? Deixa o email não lido, marca com flag/estrela, anota num caderno, na cabeça, numa planilha? Descreva o que existe hoje mesmo que seja feio.
7. Quantos emails desse contratante chegam por semana, e quantos deles viram uma ação sua de verdade?
8. Qual foi a última vez que algo escapou — e o que aconteceu? Você quer resolver "esqueci de responder", "perdi o prazo", ou "não sei dizer ao cliente o status de tudo que ele pediu"? São dores diferentes.
9. Em que momento do dia você olharia esse controle: de manhã antes de começar, ao longo do dia toda hora que chega email, ou sexta para fechar a semana?
10. Você precisa **mostrar** esse controle para alguém (o contratante, um sócio, um chefe), ou é um painel só seu?

## Perguntas — Tomás (infra, automação e custo)

Ele quer saber quem mantém isso em seis meses.

11. Onde você trabalha no dia a dia: computador só seu, celular também? É Windows, Mac, Linux? Precisa funcionar no celular?
12. Que ferramentas você **já paga e já usa** hoje — Microsoft 365, Google Workspace, Notion, Trello, Monday, Todoist? Prefiro encaixar no que já existe do que subir mais uma coisa.
13. Você aceita que uma automação leia sua caixa de email por API e crie tarefas sozinha, ou prefere apertar um botão e revisar antes de virar tarefa? (Diferença entre "confio na máquina" e "a máquina sugere, eu decido".)
14. Tem restrição da empresa do contratante sobre onde o conteúdo desses emails pode ser armazenado — algo que não pode sair da caixa corporativa?

---

## Respostas do usuário

_Aguardando._

---

## Estado

Rodada 1 aberta. Rodada 2 (decisão e propostas) só depois das respostas.
