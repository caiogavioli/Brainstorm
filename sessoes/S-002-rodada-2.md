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

### Às perguntas a–e (recebidas em 2026-10-02, por áudio, transcrição sem edição)

**a.** O que é mais urgente?
> Bom, pergunta A. É, o mais importante hoje é ter o plano.

**b.** O corante rosa é do produto ou adicionado?
> É, corante, pergunta B, o corante da água, de, da água gelada, do tratamento, ele é um tratamento padrão. É, ele tem o tratamento lá com os produtos químicos e o corante já vai aplicado nela propositalmente para a gente ter essa diferença.

**c.** Há verba para vistoria física?
> É, C, não há verba para vistoria física, a vistoria física ela tem que ser realizada pelas equipes residentes, então equipe de manutenção, equipe de administração, a própria sindicância.

**d.** Qual foi o erro de operação do episódio 2?
> D, o erro de operação no episódio 2 foi o seguinte, a, o sistema de compensação de água, do sistema de água gelada, quebrou, ele parou de funcionar, e existia um micro vazamento numa válvula, e o sistema estava perdendo água. Para que o sistema não ficasse sem água, era preciso colocar água manualmente. Então a equipe de manutenção é, pegou uma mangueira, uma mangueira, ligou numa torneira de água potável e ligou essa mangueira em um ponto de entrada de água do sistema de água gelada. E aí eles ligavam a torneira, a água potável entrava no sistema de água gelada. O problema foi que eles deixaram essa mangueira conectada e o sistema de ar-condicionado passou a funcionar com uma pressão maior do que, o, do que o sistema de água potável. Então a água do sistema de ar-condicionado, a água gelada, por conta da pressão maior, ela retornou para o sistema de água potável e ficou na prumada.

**e.** Dá para buscar o mapeamento de um condomínio para virar piloto?
> É, letra E. Não sei se a gente consegue fazer um mapeamento de um condomínio para virar piloto. É, o que, que você precisa para esse mapeamento? É, quais são as informações necessárias? Quais são os arquivos? Dependendo da lista que você fizer, eu posso te orientar, eu posso verificar se a gente consegue.

### O que essas respostas mudam (anotado pelo time)

- **a → o plano vem antes** (Rafael). A prioridade declarada é ter o plano, não esperar a vistoria. Reforça D1-B (cenário 1 primeiro), agora com um caso real para escrever.
- **b → o corante é traçador planejado** (Tomás). Já existe na água gelada, por decisão do tratamento padrão. A opção D3-C **já está feita** nesse circuito; o que falta é a ronda **conferir** (torneira sentinela) e estender a prática a outros circuitos. Sensor (D3-B) perde força: sem verba, só onde já existe BMS.
- **c → a vistoria é das equipes residentes** (Rafael, Tomás). Sem verba para consultor, **D5 muda**: a vistoria deixa de ser contratação e passa a ser **autovistoria guiada** por checklist, feita por manutenção, administração e síndico. Isso a **traz para dentro do projeto** (o checklist é um entregável). Limite honesto (Marina): a autovistoria acha o que se enxerga — mangueira ligada, tubo direto, falta de separação atmosférica — mas **não certifica** teste de dispositivo antirretorno, que exige profissional habilitado. Esses casos ficam marcados "escalar ao síndico".
- **d → a causa tem nome e é mecânica, não só humana** (Marina, Tomás). A reposição automática do circuito de água gelada quebrou; havia microvazamento numa válvula; a equipe improvisou reposição manual com **mangueira da torneira de potável direto no ponto de entrada do circuito**; a mangueira **ficou conectada**; o circuito, com pressão maior que a do potável, **empurrou a água para a prumada** (contrapressão).
  - O elo que faltou não foi "esquecer a mangueira": foi **não existir um jeito seguro de repor à mão** quando o automático falha. A equipe fez o que a falta de procedimento mandava. O cenário 1 precisa de **procedimento de reposição manual sem ligação direta** (separação atmosférica: tanque ou funil com folga de ar, nunca mangueira ligada), de **regra de desconexão e registro de quem, quando e quanto**, e de **teste de pressão relativa** entre o circuito e o potável.
  - O microvazamento era detectável: reposição de água de circuito fechado é um **indicador** (litros por dia). Um hidrômetro ou registro na reposição teria avisado do vazamento antes da improvisação. Candidato a item de monitoramento.
  - Isto aparece no catálogo como **C3** (reposição), **C4** (tanque de expansão), **A13** (proteção contra refluxo) e **G10** (mangueira ligada a ponto de potável).
- **e → piloto depende de arquivos** (Marina). O usuário pediu a lista. Está abaixo.

### D5 reformulada (por causa de c)

| Opção | O que é |
|---|---|
| **A′** | **Autovistoria guiada:** checklist de interligações e pontos de refluxo, preenchido pelas equipes residentes; o que não dá para certificar é marcado "escalar ao síndico" |
| **B′** | Só procedimento; sem vistoria |

O time ainda **não votou** nesta versão; a posição original (consultor) caiu por falta de verba.

### Kit para o piloto (resposta ao usuário sobre a pergunta e)

O que se precisa, em ordem de prioridade. **Arquivos de condomínio não entram no GitHub** (preferência do usuário): ficam anexados na conversa ou no OneDrive, e só o que for aprendizado genérico vai para este branch.

**Mínimo (3 itens, já destravam o piloto):**
1. O **mapeamento feito depois dos incidentes** (pergunta 13), no formato em que estiver.
2. Diagrama de **princípio do ar-condicionado** mostrando chillers, bombas, torre, tanque de expansão e **onde entra a reposição de água**.
3. Esquema vertical ou planta da **água fria e do reúso**: ramal da concessionária, cisterna, recalque, caixa(s), barrilete, prumadas, e onde passa o reúso.

**Desejável:**
4. Lista de equipamentos com capacidade (bombas, reservatórios, chillers, torres, aquecedores).
5. Lista de fornecedores por sistema (quem, escopo, periodicidade) e a **escada de escalonamento** níveis 1-2-3 (só as funções; telefones pessoais não precisam vir).
6. Último relatório mensal consolidado de cada fornecedor (limpeza de reservatório, potabilidade, tratamento químico, PMOC).
7. Procedimentos de emergência e a **ficha de ronda** de hoje.

**Quando não houver desenho:** fotos da casa de máquinas, do ponto de reposição do chiller, da cisterna, das caixas d'água e da torre, **com plaqueta legível**, substituem boa parte do desenho.

**Escolha do piloto:** o time sugere o **prédio onde os episódios aconteceram**. Os fatos já são conhecidos e dá para testar se a ficha e o cenário 1 teriam apontado os dois episódios. Se for atípico demais para o portfólio, o usuário decide outro.

**Alternativa sem arquivo nenhum:** entrevista guiada por áudio sobre o catálogo (S / N / ?). A resposta já é a ficha do piloto. Menos precisa, mais rápida.

### Estado das decisões

Respondidas as perguntas a–e. **D1, D2, D3, D4 e D6 seguem sem decisão do usuário**; D5 foi reformulada e também aguarda.
