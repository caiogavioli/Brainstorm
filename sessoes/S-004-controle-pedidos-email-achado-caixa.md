# S-004 — P-001, achado na caixa real

**Data:** 2026-08-10
**Problema:** P-001
**Fase:** reabertura da Rodada 2 — a premissa caiu

---

## Por que esta sessão existe

O usuário aprovou o arranjo D1+D2+D3 e autorizou montar a camada 1. Antes de criar a regra era preciso saber **quais são os endereços do contratante**. Ao medir isso na caixa, os números não bateram com o relato — e a medição virou o assunto.

**Nada foi escrito na caixa do usuário.** Só leitura.

---

## Contexto que a caixa revelou

- Conta: `caio@dfsindicos.com.br` — **DF Síndicos**, síndico profissional.
- Colegas na mesma empresa: `denise@dfsindicos.com.br`, `amanda@dfsindicos.com.br`.
- Contratante = **Brookfield**, em dois domínios simultâneos: `@bgre.com` (novo) e `@brookfieldproperties.com` (antigo, ainda ativo). Uma regra por domínio precisa cobrir os dois.
- Administradoras prediais no meio do fluxo: CBRE, Cushman & Wakefield, Innova, Hines.
- Ativos citados: Centenário Plaza, JK, Panamérica Park, Passeio Paulista, Arquipeo, PL Extrema, O Parque, Nações, Alphaville Tower, Business Park Jundiaí-Itupeva.

Isso explica a frase da Rodada 1 sobre "cobrar os condomínios": o contratante pede, e boa parte do trabalho é acionar a administradora do ativo.

## Volume medido (Inbox, 03/08 a 10/08 — 7 dias)

| Recorte | Emails |
|---|---|
| **Inbox inteira** | **352** |
| De `@bgre.com` (contratante) | **61** |
| De `@brookfieldproperties.com` (contratante, domínio antigo) | 4 |
| De `@cbre.com` | 90 |
| De `@bgre.com` **somente em 05/08** | 12 |

**O relato era "2 a 3 emails semanais" do contratante. São ~65.** Vinte vezes mais.

A leitura mais provável não é erro do usuário: ele contou os emails que **viraram tarefa consciente**. Os outros ~60 passaram pelos olhos dele sem virar nada — e são exatamente o ruído em que o pedido do dia 05 se escondeu.

---

## O email do dia 05 foi identificado

| Campo | Valor |
|---|---|
| Assunto | **Automatização de energia elétrica** |
| De | Thassia Bispo — `thassia.bispo@bgre.com` |
| Recebido | **05/08/2026**, 17h47 (BRT) |
| Caio está em | **`toRecipients` — primeiro destinatário**, não em cópia |
| Corpo | *"Podem por favor me ajudar com os dados dos prédios que já possuem automatização de energia elétrica... Caso tenha algum, quanto gastamos para a implementação... **Por favor, podem enviar até sexta-feira.**"* |
| `isRead` | **true** |
| `flag` | **notFlagged** |
| `categories` | **`["2: FYI"]`** |

05/08/2026 é uma quarta-feira. "Até sexta-feira" = **07/08**. Bate exatamente com o relato do usuário: pedido em 05/08, prazo 07/08, cobrança em 10/08.

### O que isso derruba

O usuário disse *"eu não tinha visto o email do pedido"*. O metadado diz outra coisa: **lido, e classificado como `2: FYI`**.

Duas hipóteses, e a diferença entre elas decide o desenho:

- **(a) Triagem manual errada** — ele bateu o olho, achou que era informativo, marcou FYI e seguiu. Nesse caso o problema é de **critério de triagem**, e nenhum lembrete resolve.
- **(b) Categoria aplicada por regra automática** já existente na caixa. Nesse caso a regra está classificando como "para sua informação" um email em que ele é o destinatário principal com prazo explícito — e o problema é uma **regra mal calibrada**.

Em ambas, notificação e lista de tarefas atacam o lugar errado.

### Descoberta paralela: já existe uma taxonomia

A categoria chama-se `2: FYI` — numerada. Isso indica um esquema já em uso (`1: …`, `2: FYI`, `3: …`) que ninguém mencionou na Rodada 1, porque a pergunta 6 foi sobre "o que você faz para não perder pedido" e ele respondeu flag e rascunho.

**O usuário já tem um sistema de triagem.** A conversa deixa de ser "que ferramenta construir" e passa a ser "por que a triagem que já existe deixou passar".

Um segundo email do mesmo dia confirma que o esquema funciona quando aplicado certo: *"RE: Documentos Safety JKTB"*, mesma remetente, mesmo dia — Caio em **cc**, conteúdo puramente informativo, categorizado `2: FYI`. Correto. O do dia 05 recebeu o mesmo rótulo estando no **para** e com prazo.

---

## Reação do time

### Rafael
> "Eu matei o projeto com base num número que não conferi. É o erro mais básico que existe e eu cometi ele com a maior confiança do mundo. Retiro o 'isso não é projeto'.
>
> Mas retiro pelo motivo certo, não pelo volume. Mesmo que fossem 3 emails por semana, o dia 05 teria acontecido igual — porque ele **viu** o email. O problema nunca foi lembrete. É triagem. E triagem, ao contrário de lista de tarefa, escala mal no braço: são 352 emails por semana passando por um julgamento de dois segundos cada."

### Tomás
> "Minha regra morreu na hora em que o número apareceu. Pasta dedicada com 65 emails por semana é uma segunda caixa de entrada, e notificação para 65 emails por semana é notificação que ele desliga na quinta.
>
> A parte boa: ele já tem categoria numerada, que é infraestrutura de graça e já sincronizada em todos os aparelhos dele. Não precisamos construir sistema nenhum — precisamos consertar o critério de quem carimba `2: FYI`. Isso continua sendo barato, e continuo contra construir qualquer coisa com mais de duas peças."

### Marina
> "Eu passei a Rodada 2 inteira dizendo que todo dado está sujo até prova em contrário, e não apliquei isso ao dado mais importante da mesa, que era o auto-relato do próprio usuário. 61 contra 3.
>
> Sobre o desenho: o sinal que separa pedido de ruído estava ali o tempo todo e não é o remetente — é **para × cópia**. O email perdido tinha ele como primeiro do `para`. O email corretamente arquivado como FYI tinha ele em `cc`. Isso é um campo estruturado, não é adivinhação de linguagem natural, e é o filtro mais barato que existe.
>
> E mantenho o que falei: a unidade continua sendo o pedido, não a mensagem. O email do dia 05 pede **duas** coisas — quais prédios têm automação, e quanto custou. Uma flag não representa isso."

---

## Limitação técnica registrada

A ferramenta de criação de regra disponível nesta sessão aceita como condição apenas: remetente exato, remetente contém, assunto contém, tem anexo, importância. **Não expõe a condição "enviado para mim" (para × cópia)** — que é justamente o filtro mais valioso identificado aqui.

Consequências:
- A regra "só quando estou no *para*" precisa ser criada **à mão** pelo usuário no Outlook (a condição existe nativamente lá), **ou**
- a distinção fica a cargo de uma varredura, que **consegue** ler `toRecipients` e `ccRecipients` separadamente via API.

---

## Perguntas abertas, bloqueiam o próximo passo

1. **Qual é a taxonomia completa de categorias?** Aparece `2: FYI`. Quais são a 1, a 3, a 4? O que cada uma significa?
2. **Quem aplica a categoria** — você à mão, ou já existe regra automática fazendo isso?
3. **Confirma que "2 a 3 por semana"** era o número de pedidos que viraram tarefa, e não de emails recebidos do contratante?

---

## Estado

Decisão D1+D2+D3 **suspensa** — a premissa que a sustentava caiu. Camada 1 **não executada**. Nada alterado na caixa do usuário.
