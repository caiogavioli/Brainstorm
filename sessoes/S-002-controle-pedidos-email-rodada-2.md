# S-002 — P-001, Rodada 2 (decisão)

**Data:** 2026-08-10
**Problema:** P-001 — Controle de pedidos e prazos vindos por email do contratante
**Fase:** Rodada 2 — propostas com trade-off e recorte

---

## Respostas do usuário à Rodada 1 (palavras dele)

> **Marina:** 1) outlook/microsoft 365, a caixa é só minha. 2) vem de vários endereços, em várias threads. 3) nem sempre vem prazo, mas muitas vezes eles colocam prazo definido. 4) diversas formas. um email um pedido, ou um email varios pedidos. 5) eles também me acionam via whatsapp, a maior parte das vezes para cobrar resposta dos emails enviados. Mas, em algumas vezes, eles pedem coisas via whatsapp.
>
> **Rafael:** 1) Eu marco com um flag no e-mail, e as vezes crio um rascunho para acompanhamento das tarefas (como se fosse um post it). 7) 2 a 3 emails semanais, e todos viram tarefa minha (mesmo que seja somente cobrar os condomínios para enviar resposta). 8) essa semana.... fizeram um pedido dia 05/08, com prazo 07/08, e me cobraram hoje a resposta. porém eu não tinha visto o email do pedido. 9) toda hora que chegar o email. 10) painel só meu.
>
> **Tomás:** 11) computador com windows e celular com android. 12) Microsoft 365 e monday. 13) Prefiro que ela me pergunte 14) Não, não ha restrição.

---

## Fatos que essas respostas fixaram

| Fato | Consequência para o desenho |
|---|---|
| Outlook / M365, caixa pessoal | Acesso por API (Graph) é viável e é a mesma conta que ele já usa no celular |
| Vários remetentes, várias threads | Não dá para filtrar por remetente único — precisa de lista de remetentes ou de domínio |
| Prazo às vezes explícito, às vezes não | Extração de prazo é *melhor esforço*; a ausência de prazo não pode fazer o item sumir |
| Um email pode conter vários pedidos | Item ≠ email. A unidade de controle é o **pedido**, não a mensagem |
| WhatsApp cobra respostas e às vezes traz pedido novo | Existe uma segunda fonte, e ela é a que hoje avisa que algo falhou |
| **2 a 3 emails por semana**, todos viram tarefa | Volume baixíssimo. Não há problema de escala, há problema de **atenção** |
| Falha real: pedido em 05/08, prazo 07/08, não viu o email | A falha foi de **percepção**, não de organização |
| Parte das tarefas é cobrar condomínios | Existe estado "aguardando terceiro" — a bola nem sempre está com ele |
| Windows + Android | Precisa funcionar no celular. Isso elimina soluções de desktop |
| Já paga M365 e Monday | Custo marginal de usar essas duas é zero |
| Quer ser perguntado antes | Automação sugere, humano decide. Nada de criação silenciosa |
| Sem restrição de armazenamento | Não há trava de compliance no desenho |

---

## Rafael — produto e recorte

**"Isso não deveria ser um projeto de software. E eu sou o único aqui autorizado a dizer isso."**

Dois a três emails por semana. Dez por mês. Um sistema de gestão de demandas para dez itens por mês é uma piada — o esforço de manter o sistema passa o esforço de fazer o trabalho no primeiro mês.

E vou ser mais duro comigo mesmo: eu meço tudo em tempo economizado por semana, e aqui **o tempo economizado é perto de zero**. Organizar dez itens por mês custa uns quinze minutos. Não é isso que está em jogo. O que está em jogo é o episódio do dia 05: um pedido perdido com o cliente cobrando depois. O custo disso não se mede em minutos, se mede em confiança com quem te paga. Então a métrica de sucesso aqui não é "economizei X horas", é **"zero pedidos descobertos por cobrança do cliente"**.

Isso muda o alvo. O alvo não é um painel bonito. O alvo é: nenhum email desse cliente fica sem ser visto.

Repara no seu próprio comportamento: você **já** tem um sistema. Flag no email e rascunho como post-it. Isso não falhou por ser primitivo — a flag funciona bem para dez itens. Falhou porque **você não viu o email para poder marcar a flag**. Trocar a flag por um board do Monday não teria salvado o dia 05: você também não teria visto o card.

**Minha recomendação:** resolver o problema de notificação primeiro e sozinho. Regra no Outlook que joga os remetentes desse cliente numa pasta dedicada, com alerta e categoria própria, notificação ligada no Outlook do Android **só para essa pasta**. Custo: vinte minutos de configuração, zero real por mês. Se depois de um mês isso não bastar, aí sim a gente conversa sobre onde mora a lista.

**O que eu recorto fora, conscientemente:** painel, relatório, métrica, histórico, integração com WhatsApp. Nada disso resolve o dia 05.

---

## Tomás — infra, automação e custo

**Concordo com o Rafael no diagnóstico e discordo dele na peça que ele quer usar.**

Onde concordo: não se constrói software para dez itens por mês. Quem mantém isso em seis meses é você, e você não quer manter nada. Toda peça que eu adicionar aqui é uma peça que vai quebrar num sábado.

Onde discordo do Rafael: ele para na regra do Outlook e diz "se não bastar, a gente vê". Eu acho que a regra sozinha **não basta** e dá para saber disso agora, sem esperar um mês. Regra do Outlook é *push*: ela te avisa no instante em que o email chega. Se você estava em reunião naquele instante — que foi exatamente o que aconteceu no dia 05 — a notificação morre na tela de bloqueio e nunca mais volta. Notificação não tem memória. É por isso que ela falha.

O que falta é o oposto de uma notificação: uma varredura que **repete**. Algo que todo dia de manhã olhe a pasta e diga "estes três emails chegaram, você não respondeu nenhum, um deles tem prazo amanhã". Isso perdoa o dia em que você não viu. Notificação não perdoa.

Onde discordo do usuário: você já paga o Monday, então o reflexo é botar a lista lá. **Eu tiraria o Monday desta v1.** Monday é ferramenta de time, e aqui tem um usuário só, painel só dele. Você vai pagar o pedágio de manter um board sincronizado com a caixa de email para ver uma lista de cinco itens. Microsoft To Do já vem no M365 que você paga, já está no seu Android, é o mesmo login, e — o detalhe que decide — **ele lê a flag do Outlook nativamente**. O que você já faz hoje (marcar flag) já aparece no To Do sem você mudar nada de comportamento. Zero peças móveis novas.

**Minha recomendação:** regra do Outlook (do Rafael) **mais** uma varredura diária que me cobra o que está parado. Lista mora no To Do via flag, que é o hábito que você já tem. Monday fica de fora até você me provar que precisa dele.

---

## Marina — backend, dados e integrações

**Discordo dos dois no ponto que os dois estão contornando.**

Rafael diz "a flag funciona bem para dez itens". Tomás diz "a flag já sincroniza com o To Do, ótimo". Os dois estão tratando a flag como se ela fosse suficiente. Ela não é, e o motivo está na resposta 4 do usuário: **um email pode conter vários pedidos.**

Flag é um bit por mensagem. Um email com três pedidos tem uma flag. Você responde dois dos três, tira a flag, e o terceiro evaporou — e evaporou de um jeito pior que o dia 05, porque você acha que tratou aquele email. Esse é o modo de falha silencioso, o que não te avisa que aconteceu. O dia 05 pelo menos gerou uma cobrança. Esse não gera nada até o cliente perguntar de uma coisa que você jurava ter fechado.

A unidade de controle tem que ser o **pedido**, não a mensagem. E isso não é preciosismo de arquiteto: é o próprio usuário que disse que os emails vêm "de diversas formas".

Segundo ponto, e esse ninguém tocou. O usuário disse que parte das tarefas é *"cobrar os condomínios para enviar resposta"*. Então um item tem pelo menos três estados, não dois:

- **comigo** — a bola está com você, é você que produz a resposta
- **aguardando terceiro** — você já cobrou o condomínio, está esperando
- **fechado** — respondido ao contratante

Uma lista de "feito / não feito" mistura os dois primeiros, e é aí que a cobrança do cliente te pega desprevenido: você acha que está "esperando o condomínio", mas ninguém está cobrando o condomínio. Item parado em "aguardando terceiro" há cinco dias é exatamente o que a varredura do Tomás tem que gritar.

Terceiro: o **WhatsApp**. O usuário disse que a maior parte das mensagens é para cobrar resposta de email. Traduzindo: hoje o WhatsApp é o seu sistema de alerta de falha. Toda vez que ele toca para cobrar, é um item que escapou. Eu **não** quero integrar WhatsApp na v1 — concordo com o Rafael que isso é escopo demais. Mas quero que você registre manualmente, em uma linha, toda vez que a cobrança vier por lá. Em um mês isso te diz se o sistema funcionou, e é a única métrica honesta que existe aqui.

Onde eu cedo: com dez itens por mês, **a extração não precisa ser automática**. Não vale construir parser de prazo em português. Um humano lendo o email quebra em pedidos melhor que qualquer coisa que eu escreva, em trinta segundos.

**Minha recomendação:** aceito a infra mínima do Tomás, mas a varredura diária não pode ser um "você tem 3 emails não lidos". Ela tem que listar **pedidos em aberto com estado e prazo**, e cobrar o que está parado — inclusive o que está parado no colo do condomínio.

---

## Os desacordos, para o usuário decidir

### D1 — Basta notificar, ou precisa de varredura que repete?

- **Rafael:** basta notificar. Configure a regra, viva um mês, e só construa a varredura se falhar de novo. Não construa contra um problema que talvez a regra já resolva.
- **Tomás:** não basta. A notificação do dia 05 provavelmente até apareceu — e morreu na tela de bloqueio. Notificação não tem memória, varredura tem. É a diferença entre te avisar uma vez e te cobrar todo dia.

### D2 — Onde mora a lista de pedidos?

- **Tomás:** Microsoft To Do. Já vem no M365, já está no Android, lê a flag do Outlook sem você mudar de hábito. Zero peças novas.
- **Marina:** To Do não guarda estado "aguardando terceiro" nem quebra um email em três pedidos sem virar bagunça. Se a lista vai ter estado de verdade, o Monday que você já paga faz isso melhor.
- **Rafael:** para cinco itens simultâneos, os dois servem. Não gaste a decisão aqui.

### D3 — O que entra na v1?

- **Rafael:** só email. WhatsApp fora.
- **Marina:** email automático, WhatsApp registrado à mão em uma linha — não como funcionalidade, como **medição** de quantos pedidos escaparam.
- **Tomás:** concordo com a Marina, desde que registrar seja uma linha e não um formulário.

---

## Recorte proposto

**Isto não é um projeto de software. É uma configuração mais uma rotina.**

Os três chegam junto nisso, por caminhos diferentes: Rafael pelo volume, Tomás pela manutenção, Marina porque com dez itens por mês o humano extrai melhor que qualquer parser. Não nasce repositório novo daqui a não ser que a rotina precise virar código agendado — e mesmo aí seria um repositório pequeno de um script só.

O que se entrega, em três camadas de custo crescente:

**Camada 1 — configuração, zero código, ~20 min (consenso dos três)**
Regra no Outlook: remetentes do contratante → pasta dedicada + categoria + notificação no Android só dessa pasta. Ataca diretamente o modo de falha do dia 05.

**Camada 2 — rotina diária de cobrança (Tomás e Marina; Rafael quer esperar)**
Uma varredura de manhã que lista pedidos em aberto, com estado (`comigo` / `aguardando terceiro` / `fechado`) e prazo, e reclama do que está parado. Pode começar como uma conversa diária, sem código nenhum.

**Camada 3 — só se a 1 e a 2 não bastarem**
Automação que lê a caixa por API, propõe a quebra de um email em pedidos, e pergunta antes de criar (respeitando a resposta 13). Aqui sim há trabalho de verdade — e é o único cenário em que nasce repositório.

---

## Estado

Rodada 2 entregue. Aguardando decisão do usuário em D1, D2 e D3.
Nenhum repositório será criado — o gatilho é pedido explícito.
