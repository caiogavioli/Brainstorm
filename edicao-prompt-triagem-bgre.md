# Corrigir o prompt da Routine "Triagem Contratante" — para colar

**Por que manualmente:** a Routine foi criada pela interface do claude.ai
(`created_via: http_api`). A API recusa tanto `update_trigger` quanto
`fire_trigger` vindos de um agente:

```
this routine was created via "http_api", not by an agent.
Agents can only update routines they created (via create_trigger)
```

Então esta edição é sua. São **duas substituições** no campo de instruções.

---

## Onde

1. Abra **claude.ai/code/routines**
2. Clique na routine **"Triagem Contratante — rodada diária"**
3. Abra o campo de instruções (o texto longo que começa com *"Execute a rodada
   diária da Triagem Contratante agora…"*)
4. Faça as duas trocas abaixo
5. Salve

Não mexa em nome, cron (`30 10 * * 1-5`), ambiente ou conectores.

---

## Troca 1 — o passo 7

**Procure por** (é a linha que começa com `7.`):

```
7. Enviar o email diário de caio@dfsindicos.com.br para caio@dfsindicos.com.br, assunto "[Triagem] <Dia> <DD/MM> — <n> pedido(s)", no formato de tabela com emoji de formato-mensagem.md, com link para o board.
```

**Troque por:**

```
7. Enviar o email diário de caio@dfsindicos.com.br, assunto "[Triagem] <Dia> <DD/MM> — <n> pedido(s)", no formato de tabela com emoji de formato-mensagem.md, com link para o board. Destinatários fixos: to ["caio@dfsindicos.com.br"] e cc ["denise@dfsindicos.com.br", "amanda@dfsindicos.com.br", "andre@dfsindicos.com.br", "anapaula@dfsindicos.com.br", "controladoria@dfsindicos.com.br"] — a equipe da DF Síndicos. Não acrescente nem tire ninguém dessa lista, e nunca copie um remetente que apareceu na triagem do dia.
```

## Troca 2 — a regra dura que virou mentira

Esta é a que importa. **Procure em REGRAS DURAS por:**

```
- NUNCA responder ou encaminhar email para terceiros. Há um hook que recusa qualquer destinatário que não seja o próprio usuário — não tente contorná-lo.
```

**Troque por:**

```
- NUNCA responder ou encaminhar email para terceiros. A mensagem diária vai para a equipe da DF Síndicos (o to e o cc do passo 7) e para mais ninguém. Contratante (bgre.com, brookfieldproperties.com) e administradoras (cbre.com, cushwake.com, innova.net.br) são terceiros e continuam proibidos: há um hook que recusa a chamada se qualquer endereço de fora da DF Síndicos entrar no to, cc ou bcc. Não tente contorná-lo — se ele recusar, envie só para caio@dfsindicos.com.br e registre a falha no rodapé da mensagem.
```

---

## Por que a Troca 2 é a que importa

A Troca 1 sozinha deixaria o prompt se contradizendo: o passo 7 mandando
copiar cinco pessoas e as REGRAS DURAS dizendo que o hook *"recusa qualquer
destinatário que não seja o próprio usuário"*. Numa contradição dentro do
mesmo prompt, a regra marcada como **dura** costuma ganhar — e a rotina
mandaria só para o Caio.

O playbook no repositório já foi corrigido (`playbook.md` Passo 7 e
`entrega.md`), e o próprio prompt diz *"onde os dois discordarem, siga o
playbook"* — então há uma boa chance de funcionar mesmo sem esta edição. Mas
é uma chance, não uma garantia, e o custo de fechar é colar dois parágrafos.

---

## Como conferir que pegou

Depois de salvar, me avise: eu leio a routine pela API (`list_triggers`) e
confirmo que o texto novo está lá. Não precisa esperar a rodada das 07h30
para descobrir.

Se preferir não editar agora, o teste natural é a mensagem de 01/09 às
~07h42: **se o Cc não vier com os cinco da DF, foi esta contradição.**
