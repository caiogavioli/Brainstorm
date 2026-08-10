# P-001 — Controle de pedidos e prazos vindos por email do contratante

**Fase:** rodada 2 — aguardando decisão do usuário (D1, D2, D3 em `sessoes/S-002-*.md`)
**Apresentado em:** 2026-08-10

## Em uma frase
Perder o controle do que o contratante pediu por email — o que já foi respondido, o que ainda deve resposta e o que tem prazo correndo.

## Apresentação, nas palavras do usuário

> TEnho uma dificuldade que preciso resolver: recebo emails do meu contratante, e preciso monitorar esses emails, as respostas que preciso dar, os prazos, etc. em resumo, preciso ter controle dos pedidos e ações que preciso fazer para este cliente. como você pode me ajudar com este controle?

## Como é hoje
Marca o email com **flag** e, às vezes, cria um **rascunho** que funciona como post-it de acompanhamento. Olha a caixa a cada email que chega. É um sistema que existe e que funciona para o volume — falhou por não ter visto a mensagem, não por falta de organização.

Parte das tarefas não é produzir a resposta, e sim **cobrar os condomínios** para que eles respondam. Ou seja, em boa parte dos itens a bola está com um terceiro.

## Frequência e volume
- Acontece: **2 a 3 emails por semana** (~10/mês)
- Todos viram tarefa dele, sem exceção
- Prazo às vezes vem explícito no email, às vezes não vem
- Um email pode conter **um ou vários pedidos**

## Quem sofre
O usuário. Impacto direto na relação com o contratante quando um pedido escapa — o cliente descobre antes dele e cobra.

## O que já foi tentado
Flag + rascunho-post-it no próprio Outlook. Não falhou por ser primitivo; falhou porque um email não foi visto e portanto nunca chegou a ser marcado.

## Como saberíamos que resolveu
**Zero pedidos descobertos por cobrança do cliente.** A métrica não é tempo economizado (o volume é baixo demais para isso importar), é não ser pego de surpresa.

Caso de falha de referência: pedido em **05/08 com prazo 07/08**, cobrado por WhatsApp em 10/08, sem que o email tivesse sido visto.

## Restrições conhecidas
- **Outlook / Microsoft 365**, caixa pessoal, não compartilhada.
- Vários endereços remetentes do mesmo contratante, em várias threads.
- Precisa funcionar no **Android** (usa Windows no computador).
- Ferramentas já pagas e em uso: **Microsoft 365** e **Monday**.
- Automação deve **perguntar antes de agir** — nada de criação silenciosa.
- Sem restrição de armazenamento imposta pelo contratante.
- Existe um segundo canal, **WhatsApp**, usado sobretudo para cobrar respostas de email e ocasionalmente para pedir coisas novas.

## Leitura do time (Rodada 2)

Os três convergiram em que **isto não é um projeto de software**: 10 itens/mês não justificam sistema. A falha foi de percepção, não de gestão.

Divergências registradas em `sessoes/S-002-*.md`:
- **Rafael × Tomás:** notificação basta (esperar um mês) × notificação não tem memória, precisa de varredura que repete.
- **Tomás × Marina:** Microsoft To Do por já ler a flag nativamente × To Do não representa "aguardando terceiro" nem quebra um email em vários pedidos.
- Ponto de Marina que os outros dois contornaram: **flag é um bit por mensagem**; email com três pedidos parcialmente respondido perde o resto em silêncio.
