# Criar a Triagem Contratante como Routine — passo a passo

Rótulos conferidos na documentação oficial de Routines.

## Por que por aqui e não por programação

A documentação é explícita sobre o que resolve o seu problema:

> *"Routines run autonomously as full Claude Code cloud sessions: there is no
> permission-mode picker and **no approval prompts during a run**."*

> *"Claude can use every tool from an included connector, including writes,
> **without asking for permission during a run**."*

Um trigger criado por programação nesta organização **não consegue carregar os
conectores** — a sessão nasceria sem Outlook e sem Monday. Pela interface, os
conectores já vêm marcados por padrão.

---

## Os 8 passos

### 1. Abrir o formulário
Acesse **claude.ai/code/routines** e clique em **New routine**.

### 2. Nome
```
Triagem Contratante — rodada diária
```

### 3. Instruções (prompt)
Cole o texto inteiro da seção **"Texto para colar"**, mais abaixo neste arquivo.

O campo tem um **seletor de modelo** ao lado. O modelo escolhido é usado em
todas as execuções.

### 4. Repositórios
Adicione os **dois**:

- `caiogavioli/triagem-contratante` — onde mora o playbook
- `caiogavioli/Brainstorm` — onde mora a trava de segurança

⚠️ Cada repositório é clonado **a partir da branch padrão**. As travas já foram
colocadas na branch padrão dos dois, então funciona de qualquer jeito.

### 5. Ambiente
Deixe **Default**. A rede dele é **Trusted**, e a documentação diz que o
tráfego dos conectores passa pelos servidores da Anthropic — ou seja, **não
precisa liberar domínio nenhum** para o Outlook e o Monday funcionarem.

### 6. Gatilho
Em **Select a trigger**, escolha **Schedule** e depois o preset **weekdays**
(dias úteis), às **07:30**.

O horário é digitado no **seu fuso** e convertido automaticamente. Não precisa
calcular UTC.

> A execução pode começar alguns minutos depois do horário — é um
> escalonamento proposital, e o desvio é sempre o mesmo para cada rotina.

### 7. Conectores
Na seção **Connectors**, no fim do formulário: **todos os seus conectores já
vêm incluídos por padrão.** Não precisa adicionar nada.

Só confira que estes dois estão na lista, e **não os remova**:

- ✅ **Microsoft 365** — a caixa de e-mail
- ✅ **monday.com** — o quadro

Sem um dos dois, a rotina não funciona.

### 8. Criar
Clique em **Create**.

---

## Como testar

Na página da rotina, clique em **Run now**.

### ⚠️ Armadilha: testar no mesmo dia

Se você disparar num dia em que o `[Triagem]` já saiu, a rotina **não vai
mandar e-mail** — e isso está **certo**. A regra "uma mensagem por dia" vai
detectar a mensagem anterior e pular o envio. Você veria "não chegou e-mail" e
concluiria errado.

**Teste limpo:** deixar rodar sozinha na segunda às 07:30. Sucesso é o e-mail
`[Triagem] Segunda 17/08` chegar sem você aprovar nada.

**Teste imediato:** clicar em **Run now** e julgar por outros sinais:

1. **Nenhum pedido de aprovação apareceu** — é o que importa
2. Leu o Monday e a caixa sem erro
3. Explicou no fim que não enviou porque já havia mensagem do dia

### Não confie na bolinha verde

A documentação avisa:

> *"A green status in the run list means the session started and exited without
> an infrastructure error. **It does not mean the task in your prompt
> succeeded.**"*

Clique na execução e leia a transcrição para ver o que realmente aconteceu.

---

## Depois do teste, me conte três coisas

1. Apareceu pedido de aprovação? Se sim, **em qual passo**
2. O e-mail chegou (ou foi corretamente pulado)?
3. O quadro no Monday foi atualizado?

Se ainda pedir aprovação mesmo assim, o caminho de agente está esgotado e
partimos para o plano B: tirar a rotina de dentro do Claude e rodá-la como
programa próprio no GitHub Actions, falando direto com a Graph API, a API do
Monday e a API da Claude.

---

## ✅ RESOLVIDO — 17/08/2026

A Routine criada pela interface **funcionou**. Rodou sozinha às 07h46 BRT, sem
nenhum pedido de aprovação, leu a caixa e o Monday, criou o card do pedido novo
com o prazo preenchido e enviou a mensagem do dia.

Confirmou também que o playbook chegou certo pela `main`: a mensagem dela saiu
com a coluna Prazo nova, e ela tratou corretamente os e-mails de data
manipulada, registrando "já mapeado, sem pedido novo aqui" em vez de os
classificar como anomalia.

O trigger antigo (`trig_01XgjXnVg8oytX2yvTv5ZqTZ`) foi **apagado** no mesmo dia.
Enquanto os dois coexistiram houve colisão real: duas mensagens no mesmo dia e
um card duplicado no quadro, porque as duas execuções leram o estado antes de a
outra escrever. O card duplicado foi removido; ficou o da Routine.

**Lição para o desenho:** duas rotinas escrevendo no mesmo quadro não se
enxergam. A regra "uma mensagem por dia" só protege contra a segunda execução
se ela consultar a caixa DEPOIS de a primeira ter enviado — o que não acontece
quando as duas partem quase juntas.

---

## Texto para colar

```
Execute a rodada diária da Triagem Contratante agora, do começo ao fim, sem pedir confirmação — não há ninguém acompanhando esta execução.

CONTEXTO
- Caixa: caio@dfsindicos.com.br (Outlook / Microsoft 365)
- Domínios do contratante: bgre.com e brookfieldproperties.com
- Fuso: America/Sao_Paulo. A API devolve UTC — converta antes de calcular datas.
- Estado: Monday, board TAREFAS 18425132208, grupo group_mm637vs0. É a fonte única. Não existe arquivo de estado em lugar nenhum.

PRIMEIRO PASSO OBRIGATÓRIO — carregue o playbook
No repositório caiogavioli/triagem-contratante, leia nesta ordem:
  1. rotina/playbook.md
  2. rotina/criterios-classificacao.md
  3. rotina/formato-mensagem.md
  4. rotina/entrega.md
  5. rotina/monday.md
O playbook é a especificação; este prompt é só o gatilho. Onde os dois discordarem, siga o playbook.

RESUMO DA RODADA
1. Ler os itens do grupo group_mm637vs0 no Monday. NÃO tocar em itens de outros grupos — são as tarefas pessoais do usuário.
2. Buscar na Inbox os emails dos dois domínios recebidos desde a última execução. Excluir remetentes @dfsindicos.com.br e assuntos com [Triagem]. Paginar se vier nextOffset.
3. Usar sempre sentDateTime, nunca receivedDateTime, para janela, ordenação, dias parado e prazos relativos. O usuário edita a data de recebimento à mão para fixar emails no topo do Outlook — há casos com dois anos de diferença. Data futura é marcador de importância dele, não defeito: não sinalizar como anomalia.
4. Classificar cada email em demanda ou informativo e extrair o prazo. Na dúvida, demanda.
5. Ler os emails do próprio usuário com [Triagem] no assunto desde a última execução — são as respostas dele fechando pedidos em linguagem natural. Confirmar na mensagem o que foi entendido antes de fechar qualquer item.
6. Criar item no Monday para cada demanda nova, com o campo "Resumo e o que fazer" preenchido; atualizar Dias parado dos abertos; itens marcados Concluída saem da lista.
7. Enviar o email diário de caio@dfsindicos.com.br para caio@dfsindicos.com.br, assunto "[Triagem] <Dia> <DD/MM> — <n> pedido(s)", no formato de tabela com emoji de formato-mensagem.md, com link para o board.

PRAZO NA TABELA
Quando o email declarar data de entrega, ela vai numa coluna Prazo própria: data explícita vira DD/MM; "até sexta-feira", "hoje" e "amanhã" são resolvidos pelo sentDateTime e viram data real; vencido e "vence hoje" vão em negrito e forçam o emoji vermelho na linha. Sem data declarada, travessão — nunca inventar nem estimar prazo. A mesma data vai para a coluna Data de Término (date_mm5x783a) do Monday, em YYYY-MM-DD.

REGRAS DURAS
- Envie a mensagem MESMO em dia sem pedido nenhum. Silêncio é ambíguo entre "não teve pedido" e "a rotina quebrou", e o usuário conta com esse sinal.
- Se já existir um [Triagem] enviado hoje, não envie outro.
- NUNCA marcar como lido, mover, arquivar, apagar ou categorizar email do contratante. Só leitura da caixa; a única escrita é o próprio email diário.
- NUNCA responder ou encaminhar email para terceiros. Há um hook que recusa qualquer destinatário que não seja o próprio usuário — não tente contorná-lo.
- Não carregar o corpo HTML inteiro dos emails: usar o bodyPreview da busca e só ler o email completo quando precisar separar Para de Cópia. Um email de duas linhas já veio com 190 KB.
- Nunca fechar um pedido sem confirmar na mensagem o que você entendeu.

Se algo falhar, envie a mensagem assim mesmo e descreva a falha no rodapé. Falhar em silêncio é o único resultado inaceitável.
```

---

## A rotina do SafetyDocs tem o mesmo defeito

A `Cobrança SafetyDocs — rodada semanal` (segundas, 08h08) também está amarrada
a uma sessão persistente e vai pedir aprovação do mesmo jeito. Mesmo
procedimento resolve, quando você quiser.
