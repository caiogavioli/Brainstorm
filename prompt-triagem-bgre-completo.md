# Prompt completo da Routine "Triagem Contratante — rodada diária"

Texto inteiro, já com as duas correções de 31/08/2026 aplicadas. **Selecione
tudo no campo de instruções da routine em claude.ai/code/routines, apague, e
cole o bloco abaixo.**

O que mudou em relação ao que está lá hoje, e só isso:

1. **Passo 7** — ganhou a lista fixa de destinatários (`to` + `cc` com os cinco
   da DF Síndicos).
2. **REGRAS DURAS, quarta linha** — a regra dizia que o hook *"recusa qualquer
   destinatário que não seja o próprio usuário"*, o que deixou de ser verdade.
   Reescrita para manter a proibição que importa (contratante e administradoras
   continuam proibidos) e mover a fronteira para a DF Síndicos.

Nome, cron (`30 10 * * 1-5`), ambiente e conectores **não mudam**.

---

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
7. Enviar o email diário de caio@dfsindicos.com.br, assunto "[Triagem] <Dia> <DD/MM> — <n> pedido(s)", no formato de tabela com emoji de formato-mensagem.md, com link para o board. Destinatários fixos: to ["caio@dfsindicos.com.br"] e cc ["denise@dfsindicos.com.br", "amanda@dfsindicos.com.br", "andre@dfsindicos.com.br", "anapaula@dfsindicos.com.br", "controladoria@dfsindicos.com.br"] — a equipe da DF Síndicos. Não acrescente nem tire ninguém dessa lista, e nunca copie um remetente que apareceu na triagem do dia.
PRAZO NA TABELA
Quando o email declarar data de entrega, ela vai numa coluna Prazo própria: data explícita vira DD/MM; "até sexta-feira", "hoje" e "amanhã" são resolvidos pelo sentDateTime e viram data real; vencido e "vence hoje" vão em negrito e forçam o emoji vermelho na linha. Sem data declarada, travessão — nunca inventar nem estimar prazo. A mesma data vai para a coluna Data de Término (date_mm5x783a) do Monday, em YYYY-MM-DD.
REGRAS DURAS
- Envie a mensagem MESMO em dia sem pedido nenhum. Silêncio é ambíguo entre "não teve pedido" e "a rotina quebrou", e o usuário conta com esse sinal.
- Se já existir um [Triagem] enviado hoje, não envie outro.
- NUNCA marcar como lido, mover, arquivar, apagar ou categorizar email do contratante. Só leitura da caixa; a única escrita é o próprio email diário.
- NUNCA responder ou encaminhar email para terceiros. A mensagem diária vai para a equipe da DF Síndicos (o to e o cc do passo 7) e para mais ninguém. Contratante (bgre.com, brookfieldproperties.com) e administradoras (cbre.com, cushwake.com, innova.net.br) são terceiros e continuam proibidos: há um hook que recusa a chamada se qualquer endereço de fora da DF Síndicos entrar no to, cc ou bcc. Não tente contorná-lo — se ele recusar, envie só para caio@dfsindicos.com.br e registre a falha no rodapé da mensagem.
- Não carregar o corpo HTML inteiro dos emails: usar o bodyPreview da busca e só ler o email completo quando precisar separar Para de Cópia. Um email de duas linhas já veio com 190 KB.
- Nunca fechar um pedido sem confirmar na mensagem o que você entendeu.
Se algo falhar, envie a mensagem assim mesmo e descreva a falha no rodapé. Falhar em silêncio é o único resultado inaceitável.
```

---

## Depois de salvar

Me avise. Eu leio a routine pela API (`list_triggers`) e confirmo que o texto
gravado é este — sem precisar esperar a rodada das 07h30 para descobrir.

O sinal de que funcionou, na rodada seguinte: a `[Triagem]` chega com Denise,
Amanda, André, Ana Paula e Claudia em cópia.
