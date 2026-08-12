# Triagem Contratante

**Origem:** P-001
**Status:** fechado — repositório criado, desenvolvimento acontece lá
**Repositório:** <https://github.com/caiogavioli/triagem-contratante> (privado)

## Problema que resolve

Caio é síndico profissional (DF Síndicos) e atende a Brookfield como contratante. A Brookfield escreve de dois domínios simultâneos, `@bgre.com` e `@brookfieldproperties.com`, num volume de **~65 emails por semana**. Desse volume, apenas **2 a 3 por semana são pedidos dirigidos a ele com ação e prazo** — o resto é informativo, cópia de thread, relatório semanal e notificação de sistema.

A triagem hoje é manual, feita a olho no meio de uma Inbox que recebe **352 emails por semana**. Ela falha em silêncio.

**Caso de referência, medido na caixa:** em 05/08/2026 às 17h47, Thassia Bispo (`thassia.bispo@bgre.com`) escreveu com Caio como **primeiro destinatário do campo Para**, pedindo dados de automação predial e custos, com a frase *"Por favor, podem enviar até sexta-feira"* — prazo 07/08. O email foi **lido** e **categorizado à mão como informativo**. Em 10/08 o contratante cobrou a resposta por WhatsApp. Nenhum lembrete teria salvado esse caso: o email foi visto e classificado errado.

## Escopo da v1

**Entra:**
- Monitorar **todos** os emails recebidos de `@bgre.com` e `@brookfieldproperties.com`
- Classificar cada um em **demanda** (precisa de ação dele) ou **informativo**
- Extrair o **prazo** quando declarado no texto, em linguagem natural ("até sexta-feira", "até 26/08", "hoje")
- Entregar **uma mensagem por dia**, de manhã, com as duas listas separadas
- **Manter o histórico dos pedidos de dias anteriores** que continuam em aberto, com quantos dias estão parados
- Um pedido só sai da lista quando for marcado como resolvido

**Não entra (por decisão consciente):**
- O esquema de categorias que o usuário já usa no Outlook (`2: FYI` etc.) — **explicitamente fora por orientação dele**. Não é lido, não é usado, não é alterado.
- WhatsApp como fonte de pedidos. Fica como **medição**: cada cobrança recebida por lá é anotada em uma linha, e em 30 dias diz se a triagem funcionou.
- Emails de outros clientes, da CBRE, da Cushman, da Innova — só os dois domínios da Brookfield.
- Redigir ou enviar respostas. A ferramenta organiza; quem responde é ele.
- Painel, relatório, gráfico, métrica. Uma mensagem por dia é a interface inteira.

## Usuários e uso

Um usuário: Caio. Abre uma vez por dia, de manhã, no Android ou no Windows. Gasta ~2 minutos. Não é compartilhado com ninguém — nem com a Denise nem com a Amanda, que estão na mesma empresa.

## Arquitetura escolhida

```
   Outlook / Microsoft 365 (caixa do Caio)
              │
              │  Graph API — leitura
              ▼
   ┌────────────────────────────────┐
   │  Rotina diária (manhã)         │
   │  1. busca emails das últimas   │
   │     24h dos 2 domínios         │
   │  2. classifica cada um:        │
   │     demanda × informativo      │
   │  3. extrai prazo do texto      │
   │  4. lê o estado do dia anterior│
   │  5. monta a mensagem           │
   └────────────────────────────────┘
              │                  ▲
              │                  │
              ▼                  │
   ┌──────────────────┐   ┌──────────────┐
   │  Mensagem diária │   │  Arquivo de  │
   │  para o Caio     │   │  estado      │
   │                  │   │  (OneDrive)  │
   │  ⚠️ demandas      │   │              │
   │  📄 informativos  │   │  pedidos em  │
   │  ⏳ em aberto     │   │  aberto      │
   └──────────────────┘   └──────────────┘
              │                  ▲
              │  ele responde    │
              └──────────────────┘
                 "fechei o 2 e o 3"
```

### Classificação — sinais usados

| Sinal | Peso | Origem |
|---|---|---|
| Caio no campo **Para** (não em Cópia) | Forte, positivo | Campo estruturado, grátis |
| Menção nominal no corpo ("Caio, favor…", "@Caio") | Forte, positivo | Leitura do corpo |
| Data ou prazo explícito no texto | Forte, positivo | Leitura do corpo |
| Verbo de pedido dirigido a ele ("podem enviar", "peço que") | Médio, positivo | Leitura do corpo |
| Remetente `noreply@` / sistema (IPMS, D4Sign, OneDrive) | Forte, negativo | Campo estruturado |
| Assunto contém "Flash Report" | Médio, negativo | Recorrente semanal, quase sempre informativo |
| Caio apenas em Cópia, sem menção nominal | Médio, negativo | Campo estruturado |

Nenhum sinal decide sozinho. O caso do dia 05 seria pego pelos três primeiros ao mesmo tempo.

### Estado — o que persiste

Cada pedido em aberto guarda:

| Campo | Para quê |
|---|---|
| `conversationId` | Amarra o pedido à thread do Outlook, sobrevive a respostas |
| `resumo` | Uma frase do que se pede |
| `remetente` | Quem pediu |
| `data_entrada` | Quando chegou |
| `prazo` | Data, ou vazio |
| `status` | `comigo` / `aguardando terceiro` / `fechado` |
| `dias_parado` | Calculado, alimenta a cobrança |

O status `aguardando terceiro` existe porque parte relevante do trabalho dele não é produzir a resposta, e sim **cobrar a administradora do ativo** (CBRE, Cushman, Innova) e esperar. Uma lista de feito/não-feito misturaria "a bola está comigo" com "estou esperando terceiro" — e é aí que a cobrança do cliente pega de surpresa.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Fonte dos dados | Microsoft Graph API (Outlook) | Única fonte; já autenticada; lê `toRecipients` e `ccRecipients` separadamente, que é o sinal mais barato |
| Classificação | LLM lendo assunto + corpo | O prazo vem em português corrido; regra fixa não pega "até sexta-feira" |
| Execução | Rotina agendada, sem servidor | Zero infra para manter. Um usuário só não justifica host |
| Estado | Arquivo único no OneDrive do usuário | Já pago, já sincronizado, ele mesmo consegue abrir e corrigir na mão |
| Interface | Uma mensagem de texto por dia | Ele abre no celular. Painel seria peça a mais sem uso |
| Entrega | **Email do usuário para o usuário**, assunto `[Triagem] …` | Ele já vive no Outlook do Android. O loop fecha dentro da própria caixa — ele responde o email para fechar pedidos, sem serviço externo no caminho |

## Decisões e trade-offs

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| **A máquina classifica, o humano confere** (E1) | Máquina só condensa e lista, humano classifica | Rafael defendeu a condensação pura: 13 emails/dia são triáveis em 2 min se vierem juntos e comparáveis. Perdeu porque é exatamente esse julgamento que falhou no dia 05 — o email foi lido e mal classificado. Repetir o julgamento numa lista mais bonita não conserta o modo de falha. |
| **Rotina agendada sem servidor** (E2) | Script próprio em host dedicado | Tomás: host, chave de API, rotação de credencial e chamado de sábado para um usuário só. Custo de manutenção maior que o problema. |
| Rotina agendada sem servidor | Power Automate | Já vem no M365 e resolveria a parte estrutural, mas não lê texto livre em português sem AI Builder pago — e metade do valor está em entender "até sexta-feira". |
| **1x/dia de manhã** (E3) | 2x/dia | O caso de referência chegou 17h47 de quarta com prazo sexta: um resumo na quinta de manhã dava 24h de folga. Começa com 1x; adiciona a segunda passagem se um caso real provar necessidade. |
| **Histórico de pedidos anteriores na lista** (E3) | Só as últimas 24h | Pedido do exigido pelo usuário e defendido por Marina: um prazo de sexta desaparece do resumo de quinta se a rotina só olha 24h. |
| **Estado em arquivo no OneDrive** | Estado derivado da caixa (respondeu × não respondeu) | Derivar seria mais elegante e sem estado, mas não representa "aguardando terceiro" nem "resolvi por telefone". |
| **Estado em arquivo no OneDrive** | Estado versionado no repositório do projeto | Git daria histórico grátis, mas o usuário não consegue abrir e corrigir na mão com a mesma facilidade. |
| **Entrega por email do usuário para ele mesmo** | Mensagem em app próprio | Formataria melhor, mas exige hábito novo — e o problema que originou o projeto é exatamente coisa que não é olhada. O Outlook do Android já é onde ele passa o dia. Bônus: a resposta dele volta para a própria caixa, então o loop de fechar pedidos não precisa de serviço externo. |
| **Categorias do Outlook fora de escopo** | Reaproveitar o esquema `1:`/`2: FYI`/… que ele já usa | Orientação explícita do usuário. |
| **WhatsApp fora da v1** | Integrar como segunda fonte | Rafael queria fora inteiramente; Marina queria como medição. Ficou como medição manual: cada cobrança por WhatsApp é um pedido que escapou, e é a única métrica honesta de sucesso. |
| **Um projeto, não dois** | Separar "triagem" de "acompanhamento de pendências" | O acompanhamento sem a triagem não tem o que acompanhar. |

## Riscos

- **Falso negativo é o risco caro.** Um pedido classificado como informativo vira outro dia 05. A lista de informativos precisa continuar visível e curta o bastante para ele bater o olho — não pode virar um "arquivado" invisível.
- **Falso positivo cansa.** Se a lista de demandas encher de coisa que não é demanda, ele para de confiar e volta a ignorar.
- **Deriva de domínio.** A Brookfield está migrando de `brookfieldproperties.com` para `bgre.com`, com os dois ativos ao mesmo tempo. Se surgir um terceiro domínio, a rotina fica cega sem avisar. Vale um alerta quando aparecer domínio novo com assinatura Brookfield.
- **Dependência de serviço externo.** A rotina roda fora do controle do usuário. Objeção levantada pelo próprio Tomás contra a própria proposta. Mitigação: se cair, ele volta a triar na mão — que é exatamente a situação de hoje, então o pior caso é o presente. **O usuário foi avisado explicitamente de que pode deixar de receber a mensagem sem ninguém avisar, e aceitou o risco (2026-08-10).** Por isso a rotina envia mensagem **também nos dias sem pedido**: silêncio total seria ambíguo entre "não teve pedido" e "quebrou".
- **O usuário subestimou o próprio volume em 20×** na Rodada 1. Outros números auto-relatados neste projeto devem ser medidos antes de virarem premissa.
- **Prazo implícito não é capturado.** "Urgente" e "assim que possível" não viram data. Ficam como demanda sem prazo.
- **`receivedDateTime` não é confiável nesta caixa.** O usuário edita a data de recebimento de alguns emails à mão, jogando para o futuro (2028), para fixá-los no topo do Outlook. Descoberto em 12/08/2026, quatro casos. A rotina precisa ordenar, filtrar a janela de 24h e contar dias parado por **`sentDateTime`** — por `receivedDateTime` esses emails nunca entrariam na varredura. Data futura é marcador de importância do usuário, não defeito: não avisar como erro e não propor correção.

## Critério de pronto (v1)

- [ ] A rotina lê os emails das últimas 24h dos dois domínios
- [ ] Cada email cai em demanda ou informativo
- [ ] Prazo declarado no texto vira data na lista
- [ ] A mensagem diária chega de manhã, com as três seções: demandas, informativos, em aberto de antes
- [ ] Pedidos de dias anteriores continuam aparecendo até serem fechados
- [ ] A mensagem chega **por email**, com assunto no padrão `[Triagem] <Dia> <DD/MM> — <n> pedido(s)`
- [ ] Em dia sem pedido nenhum, a mensagem **é enviada mesmo assim**, curta
- [ ] O usuário fecha um pedido **respondendo o próprio email**, em linguagem natural
- [ ] A rotina confirma no dia seguinte o que entendeu de cada resposta dele
- [ ] A rotina **não** classifica as próprias mensagens (filtro pelo remetente e pelo prefixo `[Triagem]`)
- [ ] Rodando o teste contra a semana de 03 a 09/08/2026, o email "Automatização de energia elétrica" aparece como **demanda com prazo 07/08**

O último item é o teste de aceitação de verdade: se a v1 não pega o caso que originou o projeto, ela não está pronta.

## Como saberíamos que resolveu

**Zero pedidos descobertos por cobrança do contratante.** Medido pelas cobranças por WhatsApp anotadas à mão. Revisão em 30 dias.

## Fora do escopo mas mapeado (v2+)

- Segunda passagem no fim da tarde, se um caso real provar que a matinal não basta
- WhatsApp como fonte de pedidos
- Cobrança automática da administradora quando um item passa X dias em `aguardando terceiro`
- Extensão a outros contratantes além da Brookfield
- Compartilhar a lista com Denise e Amanda
