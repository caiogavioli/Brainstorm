# S-005 — P-001, Rodada 3 (decisão, com o problema corrigido)

**Data:** 2026-08-10
**Problema:** P-001
**Fase:** Rodada 3 — o problema real, propostas e recorte

---

## Orientações do usuário (palavras dele)

> 1) não vamos misturar essa demanda com a classificação de categorias (não leve em conta isso). 2) não tenho regra automatica, mas preciso monitorar todos os e-mails enviados pela "BGRE" e pela "brookfieldproperties". 3) sim, 2 a 3 são os pedidos. eu recebo muito mais e-mails desses domínios, com diversas demandas. preciso monitorar todos os e-mails, porém dividi-los entre demandas com prazos e e-mails informativos.

## O que isso fecha

| Ponto | Decidido |
|---|---|
| Categorias existentes (`2: FYI` etc.) | **Fora de escopo.** Não usar, não tocar, não propor mudança. Solução nova não depende delas. |
| Escopo de monitoramento | **Todos** os emails de `@bgre.com` e `@brookfieldproperties.com`. Sem filtro de remetente individual. |
| Volume | ~65/semana confirmado. Destes, ~2–3 são pedidos dirigidos a ele. |
| O que a solução tem que fazer | **Dividir o fluxo em duas pilhas: demanda com prazo × informativo.** |
| Origem do `2: FYI` no email perdido | Aplicado **à mão** por ele — não havia regra. Confirma triagem manual errada. |

**O problema, enunciado corretamente:** separar ~2–3 agulhas por semana de ~62 palhas, num fluxo de 65 mensagens semanais de dois domínios, e capturar o prazo quando houver.

Não é lista de tarefas. Não é notificação. É **classificação**.

---

## Por que a triagem manual falha (e vai continuar falhando)

A taxa de acerto exigida é o problema. Se ele acertar 95% das triagens, erra ~3 por mês — e cada erro é um dia 05. O trabalho é entediante, repetitivo, e o custo do erro só aparece dias depois, por cobrança do cliente. É exatamente a forma de tarefa em que atenção humana é pior.

O caso de referência prova: ele leu o email, no campo *Para*, com "até sexta-feira" escrito, e carimbou FYI.

## Sinais disponíveis para classificar

| Sinal | Força | Custo | Observação |
|---|---|---|---|
| **Para × Cópia** | Alta | Grátis, campo estruturado | Email perdido: ele no *Para*. Email FYI legítimo do mesmo dia: ele em *Cópia*. |
| Menção nominal no corpo (`@Caio`, "Caio, favor…") | Alta | Precisa ler o corpo | Pega o pedido que chega com ele em cópia |
| Data/prazo explícito ("até sexta", "até 26/08") | Alta | Precisa ler o corpo | É o dado que ele quer extraído |
| Verbo de pedido dirigido a ele | Média | Precisa ler o corpo | "podem enviar", "favor providenciar", "peço que" |
| Remetente é `noreply@`/sistema | Alta (negativa) | Grátis | IPMS, D4Sign, convites — nunca são demanda dele |
| Assunto começa com "Flash Report" | Média (negativa) | Grátis | Relatório semanal recorrente, quase sempre informativo |

**Para × Cópia sozinho não basta** — resolve o caso do dia 05, mas perde o pedido que chega com ele em cópia e menção nominal no corpo. E gera falso positivo em email de rotina endereçado a três pessoas.

---

## As três propostas

### A — Regra nativa do Outlook, zero código

Duas regras: emails dos dois domínios com ele no *Para* → pasta `Contratante/Demanda`; o resto dos dois domínios → pasta `Contratante/Acompanhar`. Notificação no Android só na primeira pasta.

- **Custo:** R$ 0/mês, ~30 min de configuração
- **Acerta:** o corte grosso, e o caso do dia 05
- **Falha:** não lê o corpo, não extrai prazo, perde pedido que chega em cópia, não distingue "Flash Report" de pedido
- **Nota:** a condição "estou no Para" existe nativamente no Outlook, mas **precisa ser criada à mão** — a ferramenta desta sessão não a expõe

### B — Triagem diária por LLM, entrega um resumo

Uma rotina lê os emails dos dois domínios das últimas 24h, classifica cada um em `demanda` / `informativo`, extrai o prazo quando houver, e entrega uma lista pronta para ele aprovar.

- **Custo:** centavos por dia em tokens; o trabalho está em onde hospedar
- **Acerta:** lê o corpo, pega menção nominal, extrai prazo em linguagem natural, respeita "a máquina sugere, eu decido" (resposta 13)
- **Falha:** erra classificação às vezes; precisa de um lugar para rodar todo dia; alguém mantém

### C — A regra faz o corte grosso, o LLM faz o fino

A regra nativa separa os dois domínios do resto da caixa (barato e confiável). A rotina diária só olha essa pasta e classifica dentro dela.

- **Custo:** soma dos dois, mas a rotina fica mais simples e mais barata
- **Vantagem real:** se a rotina cair, a pasta continua funcionando. Degradação graciosa.

### Onde a rotina de B/C roda — o ponto do Tomás

| Onde | Custo/mês | Manutenção | Qualidade da classificação |
|---|---|---|---|
| **Power Automate** (já incluso no M365 dele) | R$ 0 | Baixa, sem servidor | Fraca em texto livre sem AI Builder (que é pago) |
| **Sessão agendada do Claude** com conector M365 | Já pago na assinatura | Praticamente zero | Alta — lê o corpo e entende português |
| **Script próprio** (Python + Graph + API) num host | Host + tokens | Alta — é dele | Alta, e sob controle total |

---

## Recomendações — e onde elas divergem

### Rafael
> "Recorte primeiro. Vocês dois vão querer construir um classificador, e antes disso eu quero saber se ele precisa de classificação **ou de condensação**.
>
> São 13 emails do contratante por dia útil. Treze. Se alguém entregar para ele, uma vez por dia, uma lista de treze linhas — remetente, assunto, uma frase do que se pede, prazo se houver — ele tria isso em **dois minutos**, e tria bem, porque está olhando treze coisas juntas e comparáveis em vez de treze interrupções perdidas no meio de 350 emails.
>
> O dia 05 confirma que isso bastaria: o email chegou 17h47 de quarta com prazo sexta. Um resumo na manhã de quinta dava 24 horas de folga.
>
> **Vou de B, na versão mais burra possível: o robô não classifica, ele só junta e resume.** A decisão continua sendo dele. Se depois de um mês ele reclamar que quer a máquina decidindo, aí a gente classifica."

### Marina
> "Discordo do Rafael no ponto que ele acha que é detalhe. 'Só juntar e resumir' já exige ler o corpo e extrair o prazo — e extrair prazo **é** classificar. Ele está descrevendo o meu sistema e chamando de mais simples.
>
> E discordo do recorte dele por outro motivo: um resumo diário de treze linhas sem marcar quais têm prazo é uma lista onde tudo tem o mesmo peso. O erro do dia 05 foi exatamente dar o mesmo peso a coisas de pesos diferentes. Repetir isso numa lista bonita não conserta nada.
>
> **Vou de C.** Regra nativa segurando o corte grosso, porque ela nunca cai e não depende de token nenhum. Em cima dela, classificação que lê corpo, marca `demanda` ou `informativo`, e devolve o prazo com a data. E quero uma coisa que nenhum dos dois pediu: **a lista tem que mostrar o que continua em aberto de dias anteriores**, não só o que chegou hoje. Pedido com prazo de sexta some do resumo de quinta se o resumo só olha as últimas 24h."

### Tomás
> "Concordo com o C do desenho da Marina e brigo com ela sobre onde isso roda.
>
> Script próprio está fora. É host, é chave de API, é rotação de credencial, é ele me ligando num sábado. Para um usuário só, isso é loucura.
>
> Power Automate é o que eu normalmente defenderia — já vem no M365 dele, roda sozinho, zero servidor. Mas ele não lê português com juízo sem AI Builder pago, e a metade do valor aqui está em entender 'podem enviar até sexta-feira'. Então ele serve para a parte estrutural (domínio, Para × Cópia, mover para pasta) e não serve para a parte de leitura.
>
> **Minha recomendação: a regra nativa faz o que é estrutural, e a leitura fica numa sessão agendada do Claude, que já está paga e não tem infra nenhuma.** Se um dia isso sair do ar, a pasta continua lá e ele volta a triar na mão como faz hoje — que é o pior caso, e é exatamente o presente. Nenhuma peça nova para manter.
>
> A objeção honesta contra a minha própria proposta: ele passa a depender de um serviço que não é dele. Aceito, porque a alternativa é ele manter servidor."

---

## Decisões para o usuário

### E1 — A máquina classifica, ou só condensa?

- **Rafael:** só condensa. Lista diária de ~13 linhas, você decide em 2 minutos. Menos peça, menos erro de máquina, e o julgamento continua com quem conhece o contrato.
- **Marina:** classifica. Lista sem marcar prazo repete o erro do dia 05, que foi dar peso igual a coisas de peso diferente.

### E2 — Onde a rotina roda?

- **Tomás:** sessão agendada do Claude — zero infra, já paga, lê português.
- **Marina:** aceita, mas registra que é dependência externa. Script próprio daria controle total ao custo de manutenção.
- Power Automate fica para a parte estrutural nos dois casos.

### E3 — Com que frequência, e a lista mostra o quê?

- Uma vez de manhã × duas vezes ao dia (manhã e fim de tarde).
- **Marina:** a lista tem que incluir **pendências antigas ainda em aberto**, não só as últimas 24h. Sem isso, um prazo de sexta desaparece do resumo de quinta.
- **Rafael:** concorda com pendências antigas; acha 1x/dia suficiente pelo caso de referência.

---

## Recorte

**Agora é um projeto.** O time inteiro mudou de posição, e por dado, não por entusiasmo: 65 mensagens semanais de dois domínios, com classificação e extração de prazo, rodando todo dia — isso tem código, tem agendamento e tem estado (o que já foi triado, o que segue em aberto).

É **um** projeto, não dois. WhatsApp continua fora (D3 mantido, cobranças anotadas à mão como medição).

Nome provisório: **`triagem-contratante`**.

**Repositório não será criado sem pedido explícito** (regra dura 1). Fim de Rodada 3 não é gatilho.

---

## Estado

Rodada 3 entregue. Aguardando E1, E2, E3.
