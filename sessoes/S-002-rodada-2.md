# S-002 — Rodada 2: decisão e recorte

**Data:** 2026-10-02
**Problema:** P-001 — Sistemas de água do prédio
**Fase:** Rodada 2 aberta — propostas feitas, aguardando decisão do usuário
**Insumo:** S-001 (Rodada 1 fechada, 14 respostas)

---

## O que a Rodada 1 estabeleceu (fatos, sem opinião)

- Escopo: portfólio inteiro, modelo replicável, moldado por condomínio depois.
- Todos os serviços são de terceiros, geridos pela administradora. Registros ficam com ela e chegam sob pedido; relatório consolidado só no fim do mês.
- Ninguém sabe de cabeça quais proteções contra refluxo existem em cada prédio. Já houve uma revisão completa e um mapeamento depois dos incidentes (fora deste repositório).
- Quem age numa emergência: equipe de manutenção 24h, com escalonamento em 3 níveis. Todos os prédios têm gerador.
- Os dois episódios foram detectados pelo ocupante, pela cor da água (azul no reúso, rosa na água gelada). O episódio 1 mandou gente ao hospital. O episódio 2 foi erro de operação.
- Decide o condomínio, com consultor especialista contratado caso a caso.

---

## Proposta de estrutura (o que o time propõe como forma do plano)

Contingência por **cenário**; manutenção e monitoramento por **família de sistema**; as duas ligadas por uma **matriz sistema × cenário** dentro da ficha de cada condomínio. Escrever 76 procedimentos, um por sistema, é inviável de manter e a ronda não acha nada no meio deles.

**Cenários candidatos (≈9 + 1 transversal):**
1. Contaminação cruzada (cor, odor ou sabor na torneira: reúso, água gelada, incêndio)
2. Falta de água / reservatório vazio
3. Água fora do padrão (cloro baixo, turva, suspeita microbiológica, Legionella)
4. Vazamento e alagamento (inclui subsolo, bombas de drenagem e esgoto)
5. Falha de bomba ou de energia (recalque, incêndio, drenagem)
6. Incêndio com reserva ou sistema indisponível
7. Refluxo ou retorno de esgoto
8. Falha do tratamento químico da torre/chiller
9. Contaminação do reservatório (sujeira, animal, infiltração)
10. **Transversal:** comunicação de crise — níveis 1-2-3, locatários, proprietário, vigilância sanitária

**Famílias de sistema (≈15):** os grupos A–G do catálogo, agrupados por tipo de manutenção (reservatórios, bombas, rede e pontos, tratamento de potável, água quente, proteção contra refluxo, reúso e alternativas, circuitos de climatização, torre, incêndio, esgoto e drenagem, ETE/ETA, piscinas e fontes, cozinhas, lava-olhos).

Isso é proposta, não decisão. Se alguma persona achar errado, aparece abaixo.

---

## Decisões para o usuário

Responder com o número e a letra (ex.: "D1: C"). Cada persona recomenda uma; onde discordam, as três posições estão lado a lado.

### D1 — Por onde começar

| Opção | O que é | Custa | Falha assim |
|---|---|---|---|
| **A** | Catálogo v2 completo → ficha → cenários, na ordem que você descreveu | Mais espera até o primeiro cenário pronto | O cenário que já aconteceu fica por último |
| **B** | Cenário 1 (contaminação cruzada) + checklist de refluxo primeiro; catálogo v2 e ficha depois | O cenário sai genérico, sem o mapa do prédio | Você tem fluxograma antes de saber o que cada prédio tem |
| **C** | Em paralelo: ficha de **um** condomínio-piloto (usando o mapeamento que já existe) + cenário 1 aplicado a ele; depois replica | Exige você buscar o mapeamento de um prédio | Piloto num prédio atípico não representa o portfólio |

- **Rafael — B.** Duas contaminações, gente no hospital, proprietário cobrando. O menor recorte que devolve segurança é o cenário que já aconteceu, com checklist de refluxo.
- **Marina — C.** Cenário escrito sem o mapa do prédio repete o erro da obra. O piloto mostra onde o modelo quebra antes de replicar para o portfólio.
- **Tomás — A.** Uma peça por vez. O catálogo v2 sai sem depender de você enquanto você busca o mapeamento. Paralelo é duas peças móveis para uma pessoa só.

### D2 — Pacote de formatos

Os cinco formatos que sugeri no chat (planilha-mestre, procedimento-modelo, fluxograma de 1 página, dossiê por condomínio, checklist por família).

| Opção | Conteúdo | Observação |
|---|---|---|
| **A** | Mínimo: planilha-mestre + procedimento-modelo + fluxograma de 1 página | O dossiê vem depois, gerado da planilha |
| **B** | Completo: os cinco | Mais para manter |
| **C** | Só planilha-mestre + fluxogramas | Sem procedimento escrito |

- **Rafael — A.** Planilha para você, fluxograma para a ronda, modelo para o síndico. Dossiê sai quando a planilha estiver preenchida.
- **Tomás — A.** Tudo em Excel, Word e PDF, nada novo. O checklist de manutenção entra como aba da planilha, não como formato separado.
- **Marina — A**, com a condição de que a planilha tenha **colunas estruturadas** (sim/não/não sei, data, fonte) para que o dossiê possa ser gerado dela sem retrabalho.

### D3 — Detectar antes do ocupante

Hoje o único alarme foi a água colorida na torneira.

| Opção | O que é |
|---|---|
| **A** | Só ronda: checklist de ronda 24h com cor, odor, pressão e nível nos pontos-chave, mais uma **torneira sentinela** por prédio |
| **B** | Sensores onde houver BMS (condutividade, cloro, nível, pressão ou fluxo reverso na linha de reposição) |
| **C** | **Corante como traçador padrão:** toda água não potável e todo circuito químico leva corante de cor própria; a ronda confere a sentinela |

- **Rafael — A + C.** A ronda já existe, custo zero. O corante que denunciou os dois episódios vira um alarme planejado.
- **Tomás — C** (com A). O corante é o sensor mais barato que existe. Sensor só onde já há BMS.
- **Marina — B** nos pontos de interligação (reposição da torre/chiller, reúso, reserva de incêndio). Corante detecta depois do dano; um sensor de fluxo reverso na reposição detecta antes de a água chegar ao andar.
- **Depende da sua resposta:** o corante rosa da água gelada é do produto de tratamento ou foi adicionado de propósito? Se for do produto, já é traçador gratuito.

### D4 — Registro e monitoramento via fornecedores

| Opção | O que é |
|---|---|
| **A** | Anexar um **checklist padrão** ao relatório mensal dos fornecedores, via administradora |
| **B** | Criar um registro único (planilha ou Monday) alimentado por alguém |
| **C** | Cadência mais curta (semanal ou quinzenal) só nos itens críticos: cloro residual, dosagem química, nível, teste de bomba de incêndio |

- **Tomás — A.** Não cria peça nova: usa o relatório que já chega no fim do mês, com formato padrão exigido por contrato.
- **Marina — A + C.** Um desvio pode levar 30 dias para aparecer em papel, e o relatório é a declaração do próprio fornecedor. Itens críticos precisam de dado semanal.
- **Rafael — A.** B cria uma tarefa humana que ninguém vai cumprir. C só se a administradora topar.

### D5 — Vistoria física dos pontos de refluxo

Isso **não é parte do projeto de documentação**: é contratar especialista. Mas é o que de fato impede o terceiro episódio.

| Opção | O que é |
|---|---|
| **A** | Pedir às administradoras uma vistoria por consultor nos pontos de maior risco: reposição da torre e do chiller, reúso, reserva de incêndio, trocadores de calor da água quente, dispositivos antirretorno |
| **B** | Só procedimento; confiar na operação |

- **Rafael — A.** É o único item que ataca a causa. Rafael também diz aqui: **isso não deveria ser projeto deste repositório**, é contratação.
- **Tomás — A**, só nesses cinco tipos de ponto. Não é vistoria de 76 sistemas.
- **Marina — A**, com um laudo padronizado (mesmo checklist em todos os prédios) para os resultados serem comparáveis.
- Sem desacordo. Falta saber se há verba (pergunta ainda sem resposta da Rodada 1).

### D6 — Onde o material mora

| Opção | O que é |
|---|---|
| **A** | Sem repositório novo. O modelo (catálogo, procedimentos, fluxogramas) fica **neste branch**; as fichas dos condomínios ficam no OneDrive |
| **B** | Repositório próprio só para o modelo; fichas no OneDrive |
| **C** | Tudo no OneDrive; este branch guarda só o histórico da decisão |

- **Rafael — C.** Não é software. A equipe abre Word e Excel, não GitHub.
- **Tomás — C.** Ninguém da equipe vai abrir GitHub; versão no OneDrive resolve.
- **Marina — A.** O modelo muda a cada incidente; o histórico git guarda o porquê de cada mudança.
- Precedente: dados de condomínios já ficam no OneDrive e não no GitHub (decisão do usuário em outro branch).
- **Lembrete da regra do repositório:** repositório novo **só** com o seu pedido explícito de "fecha o projeto". Fim da Rodada 2 não é gatilho.

---

## Recorte proposto

> **Isso é 1 projeto documental, chamado `plano-contingencia-agua`** (kit modelo com catálogo v2, cenários e checklists, mais a ficha por condomínio) **e 1 ação que não é projeto**: a vistoria física dos pontos de refluxo (D5).
>
> O projeto **não é software**: o entregável são arquivos (Excel, Word, PDF), não código. O catálogo v2 é a primeira parte dele, não um projeto separado.

---

## Perguntas que ainda mudam a decisão

- **a.** O que é mais urgente: ter o plano ou impedir o terceiro episódio? (Muda D1: se for o segundo, D5 sobe para o topo.)
- **b.** O corante rosa é do produto de tratamento ou adicionado? (Muda D3.)
- **c.** Há verba para a vistoria física? (Muda D5.)
- **d.** Qual foi o erro de operação do episódio 2? (Muda o cenário 1: procedimento ou barreira física.)
- **e.** Dá para buscar o mapeamento de um condomínio para virar piloto? (Muda D1-C.)

---

## Respostas do usuário

_Aguardando._
