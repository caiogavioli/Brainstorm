# Criar a Triagem Contratante como Routine no claude.ai

Passo a passo, e o texto pronto para colar.

## Por que pela interface, e não por aqui

Um trigger criado por programação nesta organização **não consegue carregar os
conectores**. A ferramenta avisa isso explicitamente: a sessão disparada nasce
sem Outlook e sem Monday — cega e muda.

Pela interface de Routines, dá para anexar os conectores, e a execução roda sem
prompt de aprovação por desenho.

## O que preencher

| Campo | Valor |
|---|---|
| **Nome** | `Triagem Contratante — rodada diária` |
| **Quando** | Dias úteis (seg–sex), **07:30** horário de Brasília |
| **Conectores** | ✅ **Microsoft 365** · ✅ **monday.com** — os dois são obrigatórios |
| **Repositório** | `caiogavioli/Brainstorm` |
| **Notificação** | Push ao terminar (opcional, recomendado) |

⚠️ **Se faltar um dos dois conectores, a rotina não funciona.** O Microsoft 365
é a caixa de e-mail; o monday.com é o quadro de estado.

## Depois de criar — como testar sem se enganar

⚠️ **Atenção a uma armadilha:** se você disparar ainda hoje (sexta 14/08), a
rotina **não vai mandar e-mail** — e isso é o comportamento correto, não falha.
A regra "uma mensagem por dia" vai detectar que o `[Triagem] Sexta 14/08` já
saiu de manhã e pular o envio. Você veria "não chegou e-mail" e concluiria
errado.

Então, duas formas de testar:

**Opção A — esperar segunda (mais limpa).** A Routine dispara sozinha às 07:30.
Sinal de sucesso: o e-mail `[Triagem] Segunda 17/08` chega **sem você ter
aprovado nada**.

**Opção B — disparar hoje mesmo.** Como o e-mail será pulado de propósito,
julgue por outros dois sinais:

1. **Nenhum prompt de aprovação apareceu** — este é o que importa
2. A execução leu o Monday e a caixa sem erro, e explicou no final que não
   enviou porque já havia mensagem do dia

### O que me contar depois

Só três coisas:

1. Apareceu algum pedido de aprovação? Se sim, **em qual passo**
2. O e-mail chegou (ou foi corretamente pulado)?
3. O quadro no Monday foi atualizado?

Se pedir aprovação mesmo pela interface, o problema não é mais de configuração
— aí partimos para o caminho B, que é tirar a rotina de dentro do Claude e
rodá-la como programa próprio no GitHub Actions.

---

## Texto do prompt — colar inteiro no campo de instrução

```
Execute a rodada diária da Triagem Contratante agora, do começo ao fim, sem pedir confirmação — não há ninguém acompanhando esta execução.

CONTEXTO
- Caixa: caio@dfsindicos.com.br (Outlook / Microsoft 365)
- Domínios do contratante: bgre.com e brookfieldproperties.com
- Fuso: America/Sao_Paulo. A API devolve UTC — converta antes de calcular datas.
- Estado: Monday, board TAREFAS 18425132208, grupo group_mm637vs0. É a fonte única. Não existe arquivo de estado em lugar nenhum.

PRIMEIRO PASSO OBRIGATÓRIO — carregue o playbook
Clone caiogavioli/triagem-contratante (branch main) e leia, nesta ordem:
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
5. Ler os emails do próprio usuário com [Triagem] no assunto desde a última execução — são as respostas dele fechando pedidos em linguagem natural.
6. Criar item no Monday para cada demanda nova, com o campo "Resumo e o que fazer" preenchido; atualizar Dias parado dos abertos; itens marcados Concluída saem da lista e o fechamento é confirmado na mensagem.
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
a uma sessão persistente e vai pedir aprovação do mesmo jeito. Quando quiser,
refazemos ela pela interface com o mesmo procedimento — os conectores dela são
os mesmos.

## Depois que a Routine nova estiver rodando

Apagar o trigger antigo `trig_01XgjXnVg8oytX2yvTv5ZqTZ`, senão a rotina roda
duas vezes por dia. **Não apague antes de confirmar que a nova funciona.**
