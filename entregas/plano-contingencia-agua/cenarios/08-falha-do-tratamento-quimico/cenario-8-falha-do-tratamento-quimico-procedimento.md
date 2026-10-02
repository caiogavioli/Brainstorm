# Cenário 8 — Falha do tratamento químico da torre ou do chiller

**Projeto:** plano-contingencia-agua · **Versão:** 0.1 — rascunho para revisão técnica · **Data:** 2026-10-02

**Quem usa:** equipe de manutenção residente (ronda 24h), gestão predial, síndico

**Fluxograma de 1 página:** `cenario-8-falha-do-tratamento-quimico-fluxograma-A3.pdf` (para imprimir na sala de máquinas e na central)

> **Aviso.** Este procedimento orienta e organiza a resposta. **Não substitui responsável técnico habilitado, o fornecedor de tratamento químico nem a FISPQ dos produtos.** Os tempos-alvo, os valores de dosagem, os parâmetros de análise e os critérios de retorno marcados com ⚠ devem ser validados pelo fornecedor de tratamento e por engenheiro ou consultor especialista antes de o documento ser tratado como oficial. **Este documento não traz nenhum valor de concentração, pH, condutividade, frequência de purga ou limite microbiológico:** esses valores são do fornecedor e ficam na ficha do condomínio. As decisões de **parar a torre ou o chiller, comunicar e liberar o retorno** são do responsável da manutenção com o fornecedor e do síndico.

---

## 1. Quando usar este procedimento

Use **qualquer um** dos gatilhos abaixo. Na dúvida, **trate como falha de tratamento** e comece por segurança e contenção.

**Falta de tratamento (ramo A):**
- **Dosadora parada**, sem produto ou com a **bombona vazia** (inibidor, dispersante, biocida).
- **Controlador de condutividade** (ou de pH, ORP) **com falha, em alarme, em manual** desde a última visita, ou **sonda suja, solta ou sem leitura** (C35).
- **Purga parada ou travada** (aberta ou fechada) (C31).
- **Biocida não aplicado** na data prevista, ou o registro semanal da dosagem **não foi feito**.
- **Água da torre turva, com limo, com odor** de mofo ou de esgoto; bacia suja; enchimento com crescimento visível.
- **Incrustação ou corrosão** visíveis; água do circuito de cor ou aspecto diferente do padrão (a cor rosa **desbotada ou ausente** pode indicar diluição ou perda de produto).
- **Alarme do fornecedor** (telemetria, e-mail, ligação) ou **laudo fora do padrão** (microbiológico ou físico-químico).

**Excesso ou produto errado (ramo B):**
- **Erro de dosagem para mais** (dosadora disparada, dosando sem parar, controlador dosando contínuo) **ou para menos** (para menos, ver ramo A).
- **Produto errado** ou bombona trocada, produto sem rótulo ou sem FISPQ.
- **Espuma** na bacia ou saindo da torre, **odor químico forte**, irritação de olhos, nariz ou garganta de quem está perto, corrosão aparente.

**Derrame ou vazamento de produto (ramo C):**
- Poça, cheiro ou **bombona vazando**, bacia de contenção com líquido, linha ou mangueira da dosadora rompida (C34).

**Torre ou circuito parado (ramo D):**
- **Torre parada** ou **seca** (por falta de água, de energia, parada programada, falha) ou **chiller e circuito parados** por tempo, e agora vão voltar.

> **Cores, ligação com o Cenário 1.** O circuito de **água gelada tem corante rosa** (traçador planejado do tratamento padrão). **Se a cor rosa, ou odor ou espuma de produto, aparecer na água potável, vá também ao Cenário 1** e suspenda o consumo. As cores de cada condomínio estão na ficha.
>
> Sem BMS, **a ronda é o sensor**: olhar a bombona, a dosadora, o display do controlador, a água da bacia e o cheiro, e **anotar**. Com BMS, o alarme só vale se tiver **destinatário que responde** (H6).

## 2. Princípios (valem para qualquer ramo)

1. **Segurança química primeiro.** Pessoa, ventilação e contenção vêm **antes** de qualquer diagnóstico. Antes de manusear qualquer produto: **FISPQ** à mão, **EPI** indicado nela, **ventilação**, e saber onde está o **lava-olhos** (G6, G21).
2. **A ronda não improvisa química: ela contém, avisa e aciona.** O que a ronda pode fazer com produto e equipamento está **escrito na ficha**; o que não está escrito, ela **não faz**. Ajustar dosagem, trocar produto, "dar um choque" ou "limpar a torre" é do **fornecedor**.
3. **Nunca misturar produtos.** Há produtos **incompatíveis**: um exemplo do catálogo (C34) é hipoclorito com ácido, que libera cloro. Não juntar sobras, não passar produto para outro recipiente, não lavar com outro produto. **Nunca** usar embalagem de bebida ou sem rótulo.
4. **Não improvisar choque químico** (dose alta de biocida ou de cloro "para resolver") **sem o fornecedor.** Sobredosar para "compensar" a semana sem dosagem cria o problema do ramo B.
5. **Fornecedor de tratamento: sempre.** Qualquer gatilho aciona o fornecedor, porque é ele quem sabe a composição, a dosagem correta e o que é seguro fazer.
6. **Evidência antes de limpeza.** Coletar amostra e fotografar **antes** de drenar, de dar choque ou de mexer na dosagem. Descarregar apaga a prova.
7. **Falha de tratamento é risco de Legionella e de corrosão**, mesmo que nada pareça errado a olho nu. Torre sem biocida **continua gerando aerossol**: ver Cenário 3, ramo D.
8. **A água e o produto do circuito não podem chegar ao potável.** Reposição, drenagem e lavagem de circuito ou torre **nunca** com mangueira entre o potável e o circuito: ver seção 9 e Cenário 1.
9. **Efluente químico não vai para ralo, pluvial ou jardim sem orientação** (seção 9).
10. **"Não sei" = ramo mais restritivo.** Se a ficha não diz o que a ronda pode fazer, ou não se sabe a causa, aja como se fosse o pior caso (ramo E).
11. **Ferver, diluir "no olho" ou neutralizar por conta própria não resolve** e pode piorar. Só o fornecedor orienta.
12. **Registrar tudo** (quem, o quê, quando, leituras). A linha do tempo é parte da resposta.

## 3. Quem faz o quê (por função)

Os nomes e telefones de cada condomínio ficam na **ficha** (escada de escalonamento níveis 1, 2 e 3, fornecedores). Aqui só funções.

| Função | Papel neste cenário |
|---|---|
| **Operador de ronda** (primeiro a ver) | Faz segurança e contenção **dentro do que a ficha autoriza**, anota leituras, fotografa, aciona o nível 1. **Não ajusta dosagem nem manuseia produto além da ficha** |
| **Responsável da manutenção residente** (nível 1) | Comanda a contenção, aciona o fornecedor, **decide com o fornecedor parar ou não a torre ou o chiller**, coleta ou acompanha a amostra, acompanha o retorno |
| **Gestão predial / administradora** (nível 2) | Aciona o consultor e demais fornecedores, comunica locatários e pontos críticos, cuida do registro e do contrato (SLA do fornecedor) |
| **Síndico** (nível 3) | Decide: parada prolongada, comunicação, notificações externas, **autorização do retorno** |
| **Fornecedor de tratamento químico** | **Sempre acionado.** Entrega a FISPQ, orienta a contenção, corrige dosagem e controlador, define o que fazer com a água da torre e do circuito, acompanha a retomada |
| **Fornecedor de ar-condicionado / PMOC** | Parada e retomada seguras da torre e do chiller; consequências no conforto e nos pontos críticos |
| **Fornecedor de hidráulica** | Reposição segura, vazamento, purga e drenagem físicas |
| **Fornecedor de elétrica** | Controlador, sondas, quadro e bomba dosadora (parte elétrica), se a ficha indicar |
| **Consultor especialista** (contratado caso a caso) | Diagnostica, define análises e critério de retorno, dá o parecer (seção 7) |
| **Laboratório com acreditação** ⚠ | Análise das amostras, com cadeia de custódia (seção 8) |

### 3.1 O que a ronda faz e o que não faz (a ficha detalha)

| A ronda **pode** (se a ficha autorizar) | A ronda **não faz** (sempre) |
|---|---|
| Afastar pessoas, **ventilar**, isolar e sinalizar a área | Misturar, transferir ou "corrigir" produto |
| **Ler e anotar** o que o display do controlador mostra, sem interpretar | Pôr controlador ou dosadora em manual, ou fazer "jumper" em sonda |
| **Parar a dosadora** por chave ou botão **identificado na ficha** (só quando o produto estiver saindo errado ou em excesso) | Dar choque de biocida ou de cloro por conta própria |
| **Fechar um registro** da linha de produto **identificado na ficha**, sem desmontar nada | Drenar a torre ou o circuito antes de coletar |
| Conter derrame **só com o kit e o EPI da FISPQ** e sem contato direto | Lavar derrame para ralo, pluvial ou jardim |
| **Fotografar, anotar hora** e acionar o nível 1 e o fornecedor | Repor circuito ou torre com mangueira ligada ao potável |
| Silenciar alarme **e registrar** | Silenciar alarme e não registrar |

## 4. Procedimento por fases

Os tempos são **metas sugeridas** ⚠, contadas a partir do alerta (T+0).

### Fase 0 — Receber o alerta e checar segurança (T+0 a T+5 min)

1. Registrar: **hora**, **o quê** (gatilho), **onde** (torre, chiller, casa de máquinas, cobertura), **leitura do controlador** (como mostrada), **nível das bombonas**, **quem** relatou, **se alguém está exposto**.
2. **Alguém exposto ao produto** (olhos, pele, inalação, ingestão, mal-estar)? → **lava-olhos ou chuveiro** de emergência pelo tempo que a FISPQ indicar, retirar da área, **acionar SAMU 192**, mostrar a FISPQ ao atendimento. Orientação toxicológica: telefone do centro de informação toxicológica na ficha ⚠.
3. **Derrame grande, vapor ou odor forte, produto inflamável, fogo?** → afastar todos, **ventilar** se for seguro, **Bombeiros 193**, não entrar sem EPI.
4. Acionar o **nível 1** e abrir o **registro de incidente** (seção 13).

### Fase 1 — Contenção imediata (T+0 a T+15 min)

1. **Fazer só o que a ficha autoriza à ronda** (seção 3.1) e **parar por aí.** A contenção é: **proteger pessoas, ventilar, isolar a área, não misturar, não deixar produto correr**.
2. **Identificar o ramo** pela tabela da seção 5 (sinais). **Origem indefinida → ramo E** (mais restritivo).
3. **Produto saindo errado ou em excesso:** parar a dosadora se a ficha autoriza; senão, acionar já o fornecedor e o responsável da manutenção. **Não** "compensar" com mais produto nem com diluição sem orientação.
4. **Derrame ou vazamento:** seguir o ramo C. **Não lavar para ralo.**
5. **Circuito perdendo água ou reposição travada aberta** (litros por dia muito acima do normal): **fechar o registro do lado potável** da reposição e **acionar a hidráulica e o fornecedor**; **nenhuma mangueira** entre potável e circuito (Cenário 1).
6. **Checar o potável:** abrir a **torneira sentinela** e olhar contra fundo branco: **cor rosa, espuma ou odor químico no potável → Cenário 1 também.**
7. **Não drenar, não dar choque, não ajustar dosagem, não limpar** antes de coletar e de falar com o fornecedor.

### Fase 2 — Escalonar, acionar o fornecedor e comunicar (T+0 a T+30 min)

1. Escalar **nível 1 → 2 → 3**, na ordem da ficha.
2. **Acionar o fornecedor de tratamento (sempre)** e pedir: **orientação imediata** por telefone, **FISPQ** de cada produto envolvido, **visita** no prazo do contrato ⚠ (SLA na ficha). Usar o modelo da seção 11.
3. **Decidir com o fornecedor se a torre ou o chiller param** (seção 6), antes de qualquer outra mudança.
4. **Acionar o consultor** quando a seção 7 mandar. **Síndico decide** a comunicação e o que é externo.
5. **Avisar os pontos críticos** da ficha (data center, salas técnicas, clínicas) **antes** de qualquer parada de climatização.
6. Comunicar por escrito (seção 11). **Não afirmar a causa** antes de confirmada.

### Fase 3 — Diagnosticar e coletar evidência (T+30 min a T+4 h) ⚠

1. **Fotografar e anotar**: bombonas (rótulo, lote, nível), dosadora, controlador (tela, alarme), purga, bacia, água (cor, turbidez, limo, espuma, odor), bacia de contenção.
2. **Coletar amostra antes de drenar, de dar choque ou de ajustar dosagem** (seção 8), com laboratório e cadeia de custódia; o fornecedor indica pontos e parâmetros.
3. **Reunir o histórico**: registro semanal da dosagem (últimas semanas), último relatório do fornecedor, última análise, **reposição de água do circuito** (litros por dia), eventos de energia ou falta de água, troca de bombona.
4. **Perguntas de causa** (seção 5): a dosadora e o controlador são do fornecedor ou do condomínio? Houve falta de produto, de energia ou de água? Alguém mexeu em manual? Produto novo ou de outro fornecedor? A água de diluição da dosadora vem do potável? (C8)
5. Mapear a **extensão**: só a torre, só o circuito, ambos? Há pessoa afetada? O produto saiu da área (cobertura, pátio, ralo, pluvial)?

### Fase 4 — Corrigir a causa e tratar a água (com o fornecedor)

1. **Quem corrige é o fornecedor**, com a causa física eliminada: produto certo e correto na dosadora, controlador e sondas verificados, purga funcionando, vazamento reparado, contenção reposta.
2. **Choque, limpeza e desinfecção** da torre ou do circuito **só com orientação do fornecedor ou do consultor**, depois da coleta, com EPI, atenção a **aerossol** e a **espaço confinado e altura** (NR-33 e NR-35, ◻ a confirmar a aplicação à torre).
3. **Drenar, lavar e repor** com as regras da **seção 9**: **sem mangueira entre potável e circuito**; **destino do efluente** definido antes de drenar.
4. **Nova amostra** depois da correção, nos mesmos pontos da Fase 3.
5. **Torre ou circuito parado:** retomada conforme o ramo D.

### Fase 5 — Condições de retorno à normalidade (todas são necessárias)

- [ ] **Causa** identificada, **eliminada e verificada** por duas pessoas (uma do nível 2 ou superior).
- [ ] **Produto certo** conferido (rótulo e FISPQ), **dosadora testada**, **controlador e sondas** verificados ou calibrados pelo fornecedor, **controlador em automático**.
- [ ] **Parâmetros do circuito ou da torre** dentro da **faixa da ficha** ⚠ (valores definidos pelo fornecedor), medidos pelo fornecedor.
- [ ] **Análise conforme** nos pontos coletados, incluindo a microbiologia ⚠ (valores de referência do consultor e do laboratório).
- [ ] **Torre ou circuito limpos e desinfetados**, se o fornecedor ou o consultor mandou.
- [ ] **Sem vazamento**; contenção reposta; área limpa; **resíduo e efluente com destino correto** registrado.
- [ ] **Reposição de água** com proteção (folga de ar), **nenhuma mangueira** conectada; **pressão do circuito lida** quando houver ligação ao potável.
- [ ] **Potável sem a cor do traçador**, sem odor, sentinela normal.
- [ ] **Pontos críticos avisados** do retorno do ar-condicionado.
- [ ] **Autorização escrita do síndico**, com parecer do consultor quando ele foi acionado.
- [ ] **Registro reforçado** da dosagem e do aspecto da água por período ⚠ definido pelo fornecedor e pelo consultor.

**Retorno em etapas ⚠:** primeiro a **circulação**, depois a **dosagem em automático**, depois o **ventilador e a carga** (chiller e torre), com o fornecedor presente na partida.

### Fase 6 — Registro e lições

1. Fechar o **registro do incidente** (seção 13): linha do tempo, leituras, produtos, amostras, decisões, quem autorizou.
2. **Atualizar a ficha** (o que a ronda pode fazer, produtos, contatos, estoque mínimo, pontos críticos) e a **matriz sistema × cenário**.
3. **Revisar este procedimento** e a **frequência do registro semanal** com o que o incidente mostrou.
4. Preparar o **resumo ao proprietário** (o que aconteceu, o que foi feito, o que muda).

## 5. Ramos por configuração

A **ficha** diz o que existe (torre, chiller a água, circuito fechado, controlador, produtos, bacia de contenção) e o que a ronda pode fazer. Onde a ficha não diz, vale o ramo **mais restritivo**. Mais de um ramo pode valer ao mesmo tempo.

### Tabela de decisão: sinal → ramo

| Sinal | Provável origem | Ramo |
|---|---|---|
| Dosadora parada, bombona vazia, controlador ou sonda com falha ou em manual, purga parada ou travada, **biocida não aplicado**, água turva, limo, odor de mofo ou esgoto, incrustação, **laudo ou alarme do fornecedor** | Subdosagem ou falta de tratamento | **A** (e **Cenário 3, ramo D**, se há risco de Legionella) |
| **Espuma**, odor químico forte, irritação, **produto errado**, dosagem em excesso, corrosão acelerada, cor muito diferente do padrão | Sobredosagem ou produto errado | **B** |
| **Poça**, cheiro, **bombona vazando**, linha rompida, bacia de contenção com líquido, derrame no abastecimento | Derrame ou vazamento de produto | **C** |
| **Torre parada ou seca**, circuito parado por tempo, falta de água ou de energia, parada programada, retomada | Estagnação e perda de tratamento | **D** (e **Cenários 2 e 5**) |
| **Não se sabe**, vários sinais sem causa, laudo fora sem explicação | — | **E** |
| **Cor do traçador (rosa), espuma ou odor químico na torneira** | Água do circuito ou produto no potável | **Cenário 1** (em paralelo) |

### Ramo A — Subdosagem, dosagem parada ou biocida falhou

**Risco principal:** **biofilme e Legionella** (aerossol da torre), mais incrustação e corrosão. Liga ao **Cenário 3, ramo D**.

**Perguntas de causa:**
1. A **dosadora** funciona? Há produto na bombona (inibidor, dispersante, biocida)? A linha está entupida ou cristalizada (C8)?
2. O **controlador** está em automático? Há alarme? A **sonda** está lendo (C35)? A **purga** funciona, aberta ou fechada (C31)?
3. O **biocida** foi aplicado na data prevista? Quem registrou?
4. Houve **falta de produto** (estoque, entrega atrasada), **falta de energia** ou **troca de bombona**?
5. A **cor rosa do circuito** está desbotada ou ausente (C1)? A reposição de água está acima do normal?
6. A torre ficou **parada ou com pouca circulação** (ramo D)?

**Ações específicas:**
- **Acionar o fornecedor** e **não dar choque** por conta própria.
- **Coletar amostra antes de qualquer mudança** (seção 8): **microbiologia** é prioridade (heterotróficos, Legionella ⚠).
- Se há **Legionella suspeita** (laudo, caso de doença respiratória associado ao prédio, torre sem biocida por tempo): **acionar o consultor**, avaliar com o fornecedor **parar o ventilador ou a torre** (seção 6), e seguir o **Cenário 3, ramo D**. **Quem passa mal respiratório** procura atendimento e avisa a administração.
- **Dosadora parada por falta de produto:** o fornecedor repõe o produto **certo**, confere a dosagem e orienta a retomada; **a ronda não "completa" com produto de outra origem**.
- **Controlador ou sonda com falha:** não substituir por medida manual da ronda. O fornecedor repara e informa **o que fazer enquanto isso** (dosagem manual conduzida por ele, purga controlada) ⚠.
- **Purga travada aberta:** perde água e produto, o tratamento fica diluído e a reposição sobe; **fechar o registro do lado potável da reposição** só se o nível permitir e **avisar o fornecedor** (ver Cenário 2 se o consumo for grande). **Purga travada fechada:** a água concentra; **não abrir por conta própria** sem o fornecedor.

### Ramo B — Sobredosagem ou produto errado

**Risco principal:** **saúde** (exposição a produto, aerossol irritante), **corrosão**, **espuma** que sai da torre e cai na cobertura, no pátio ou no pluvial.

**Perguntas de causa:**
1. A dosadora **disparou ou dosou sem parar**? O controlador está em manual ou dosando contínuo?
2. A **bombona** é a do produto **certo**? Foi trocada? Há **lote, rótulo e FISPQ** compatíveis?
3. Alguém **dosou à mão** (choque, "ajuste")? Houve **dosagem dobrada** para compensar a semana sem dosagem?
4. Há **pessoa exposta** (cobertura, sala, andares sob a descarga da torre)?
5. A espuma ou o produto **saiu da bacia**?

**Ações específicas:**
- **Segurança** (Fase 0): afastar pessoas da cobertura e das áreas sob a exaustão da torre; lava-olhos e SAMU 192 se houver exposição.
- **Parar a dosadora** (se a ficha autoriza) ou **acionar o fornecedor para orientar já**. **Isolar a bombona suspeita**, rotulada "NÃO USAR", **sem misturar** com outro produto.
- **Não "lavar" a bacia com água em grande volume nem drenar** sem orientação: o volume e o destino do efluente com excesso de produto são decididos pelo fornecedor e pelo consultor (seção 9). **Não neutralizar** por conta própria.
- **Coletar amostra** (seção 8), inclusive **amostra do produto da bombona** quando o fornecedor orientar.
- **Parar a torre ou o chiller?** Avaliar com o fornecedor (seção 6), principalmente com **espuma** ou **aerossol** com odor forte.
- **Produto errado:** o fornecedor confere o que foi dosado e orienta. **Não** misturar o produto errado com o certo.
- Se houve **contato do produto com a água potável** (ponto de diluição ligado ao potável, mangueira, retorno): **Cenário 1**.

### Ramo C — Derrame ou vazamento de produto (liga ao catálogo C34, E16 e H)

**Risco principal:** exposição de pessoas, **incompatibilidade** entre produtos, vapores, **destino do líquido** (ralo, pluvial, reservatório, solo), inflamabilidade se o produto for inflamável (E16, NBR 17505 ◻ se aplicável).

**Ações da ronda:**
1. **Afastar pessoas**, **isolar e sinalizar** a área, **ventilar** (abrir portas ou ventilação sem espalhar o líquido).
2. **FISPQ à mão** e **EPI conforme a FISPQ** antes de chegar perto. Sem EPI adequado, **não entra**.
3. **Interromper a fonte só se for seguro**: fechar o registro ou a válvula **identificada na ficha**, endireitar ou tampar a bombona **sem tocar no produto**. Senão, deixar para o fornecedor e o Bombeiros 193 se houver risco.
4. **Conter** com o **kit de derrame** do local (**material absorvente indicado na FISPQ** ⚠), em volta e por cima, **sem lavar**. **Nunca** usar o mesmo material para dois produtos diferentes.
5. **Proteger os ralos e os pontos de saída** (pluvial, ralo, **tampa da cisterna ou da caixa d'água potável** se o derrame for perto, no pátio, na cobertura ou no subsolo) com barreira ou absorvente. **Não lavar para ralo ou pluvial sem orientação.**
6. **Se o produto atingiu ralo, pluvial, solo, reservatório ou ponto de água**: avisar o nível 1 e o fornecedor na hora; se chegou perto do reservatório potável, **Cenário 9**; se aparecer no potável, **Cenário 1**.
7. **Fotografar** e anotar quantidade estimada, produto, hora e quem teve contato.

**Depois:** quem **recolhe, embala, rotula e destina** o resíduo é o fornecedor ou empresa habilitada, conforme a **exigência local** ⚠. **Reposição da bacia de contenção** e correção do vazamento antes de voltar a dosar. **Vazamento sem contenção** (bacia ausente ou com dreno aberto) é falha de prevenção: registrar e corrigir.

### Ramo D — Torre ou circuito parado ou seco por tempo (liga aos Cenários 2 e 5)

**Risco principal:** água **parada** perde o tratamento: **biofilme e Legionella** na retomada, **incrustação** e **corrosão** em torre ou circuito seco, bomba ligando a seco.

**Perguntas de causa e de situação:**
1. A parada foi por **falta de água** (Cenário 2), de **energia** (Cenário 5), **programada** ou por **falha**? Por **quanto tempo** e com a **bacia cheia ou seca**?
2. A **dosagem** ficou parada nesse período? O **biocida** foi aplicado antes de parar?
3. Há **circulação** no circuito fechado? Houve perda de água, entrada de ar?
4. Quem vai **religar** e quem **acompanha** pelo lado do tratamento?

**Ações específicas:**
- **Não religar torre, chiller ou bomba de circuito** sem o **fornecedor de tratamento** e o responsável da manutenção. **Nunca ligar bomba a seco.**
- **Falta de água ou queda de pressão do potável:** a reposição ao potável **continua fechada** (Cenário 2); o fornecedor define como manter ou parar o tratamento durante a parada ⚠.
- **Torre parada com a bacia cheia:** a água parada **sem biocida** é risco. O fornecedor decide **circular, tratar ou drenar** antes da retomada ⚠.
- **Torre ou circuito seco:** inspeção, **limpeza e desinfecção**, **reenchimento** pela seção 9 (**folga de ar + bomba, nunca mangueira**) e **tratamento antes de a carga entrar**.
- **Tempo de parada que exige amostra, limpeza ou desinfecção antes de religar:** **definir na ficha ⚠** com o fornecedor e o responsável técnico (não há valor neste documento).
- **Retomada:** **amostra** microbiológica conforme o fornecedor e o consultor, **dosagem em automático** e **registro reforçado**, depois a carga.
- Se, depois da parada, a **cor rosa** aparecer em potável ou houver queda de pressão no potável com circuito em operação: **Cenário 1**.

### Ramo E — Causa indefinida (ramo mais restritivo)

Tratar como **A + B ao mesmo tempo**, e como C ou D se houver derrame ou parada:
- **Não ajustar dosagem, não dar choque, não drenar.**
- **Segurança e contenção** (Fases 0 e 1), **acionar o fornecedor e o consultor logo** ⚠.
- **Coletar amostra** completa (microbiologia e físico-química).
- **Avaliar com o fornecedor parar a torre e o chiller** como medida de precaução (seção 6).
- Trocar de ramo quando a causa aparecer.

## 6. Parar ou não parar a torre e o chiller

**Quem decide:** o **responsável da manutenção**, **com o fornecedor de tratamento** (e o de ar-condicionado), e **informa o síndico**. **A ronda não para o chiller sozinha.** A **única exceção** é **risco imediato a pessoas**, e mesmo assim só o que a ficha autoriza (por exemplo, desligar o ventilador da torre ou a dosadora).

**Quando considerar parar (qualquer um):**

| Situação | Por quê |
|---|---|
| **Risco imediato a pessoas** (produto em aerossol irritante, derrame com vapores, espuma saindo da torre) | Segurança de quem está perto e sob a exaustão |
| **Sobredosagem ou produto errado** com espuma ou excesso | Evita espalhar o produto e corroer |
| **Suspeita ou confirmação de Legionella** | Reduz o aerossol; decisão do responsável da manutenção, do fornecedor e do **consultor**, com o síndico (Cenário 3, ramo D) |
| **Circuito ou torre sem tratamento e com corrosão ou vazamento** que o fornecedor recomende parar | Evita dano maior |
| **Torre ou circuito sem água** | **Não operar a seco** (ramo D e Cenário 2) |

**Consequências a avisar antes (ficha):**
- **Conforto:** o ar-condicionado perde capacidade. **Chiller resfriado a água (C10) depende da torre**: parar a torre costuma significar parar o chiller, **salvo alternativa na ficha**.
- **Pontos críticos:** **data center (C12)**, salas técnicas, clínicas e consultórios (G23) e demais da ficha. **Avisar os responsáveis antes**, com o prazo estimado, e acionar o **plano alternativo do ponto crítico** ⚠.
- **Retorno:** a retomada tem passos (ramo D) e **não é imediata**.

**Quando não parar sozinho:** se o motivo é só "o alarme tocou" ou "a água parece suja", **primeiro** o fornecedor e o responsável da manutenção. Parar sem avaliar pode **deixar a torre parada com água sem tratamento**, que é outro risco (ramo D).

**Registrar:** hora da parada, quem decidiu, quem foi avisado, hora do retorno.

## 7. Quando acionar o fornecedor de tratamento e o consultor

**Fornecedor de tratamento — sempre.** Qualquer gatilho da seção 1. O prazo de resposta e de visita vem do **contrato** (SLA ⚠). **Se o fornecedor não responde no prazo da ficha**, escalar para o nível 2 e para a administradora e **acionar o consultor**.

**Consultor especialista (decisão do síndico, caso a caso)** nos casos:
- **Suspeita ou resultado de Legionella** ou microbiologia fora do padrão (Cenário 3, ramo D).
- **Sobredosagem com exposição de pessoas** ou produto **fora do circuito** (pluvial, solo, reservatório).
- **Derrame** com destino de efluente indefinido ou que atingiu pluvial ou rede.
- **Torre ou circuito parado por tempo** que exige limpeza e desinfecção antes de religar.
- **Causa indefinida** depois da primeira resposta do fornecedor (ramo E).
- **Cor do traçador ou produto no potável** (Cenário 1).
- **Fornecedor sem resposta** no prazo ⚠.

## 8. Coleta de amostras

1. **Antes** de drenar, de dar choque, de ajustar dosagem ou de limpar.
2. **Laboratório com acreditação ABNT NBR ISO/IEC 17025 ⚠**, frasco adequado e **cadeia de custódia**. O **laboratório e o fornecedor** dizem como coletar (principalmente Legionella).
3. **Pontos** (conforme a ficha e o fornecedor):
   - **água da bacia da torre** e **retorno do condensador**;
   - **água do circuito de água gelada** (como a ficha indicar);
   - **ponto de reposição** (água de entrada);
   - **água da purga**, se houver dúvida de efluente;
   - **produto da bombona**, se produto errado (o fornecedor orienta);
   - se houver suspeita no potável, **torneira sentinela** (e Cenário 1).
4. **Parâmetros:** definidos pelo fornecedor, pelo consultor e pelo laboratório a partir da **FISPQ** e do que se suspeita. Microbiologia (heterotróficos, Legionella ⚠) e físico-química do tratamento ⚠. **Sem valor de referência neste documento.**
5. **EPI e cuidado com aerossol** ao coletar na bacia (orientação do fornecedor e da FISPQ).
6. **Registrar:** ponto, hora, quem coletou, laboratório, número da cadeia de custódia.

## 9. Reposição, drenagem, lavagem e efluente

**Regra:** a **lição do episódio 2** vale aqui. **Depois de uma falha de tratamento é comum drenar, lavar e reencher o circuito ou a torre**, e é a hora em que a mangueira aparece. **Nada de mangueira entre o potável e o circuito ou a torre.**

**Reposição, reenchimento e lavagem (Cenário 1, ramo A):**
- **Folga de ar + bomba:** o potável **enche um tanque ou recipiente com folga de ar** (a água cai de cima); uma **bomba de transferência** leva ao ponto de reposição. A mangueira existe **só entre a bomba e o circuito** e **nunca fica ligada à torneira**.
- **Torre (circuito aberto):** funil ou tanque com folga de ar no ponto de reposição.
- **Sem estrutura segura: não repor com potável.** Escalar à gestão e ao fornecedor.
- **Antes de repor:** **ler a pressão do circuito e do potável**; se a do circuito é maior ou igual, **não conectar nada**. **Autorização** do responsável da manutenção; **registrar** responsável, hora e **litros**; **desconectar na hora**; segunda pessoa confere.
- **Lavagem de circuito, torre ou filtro lateral** (C30, C37, C38): **sem ligação ao potável** pelos mesmos motivos. **Serviço de terceiros** (limpeza química, passivação) **não traz mangueira ao ponto de potável**; conferir na saída do prestador se **ficou** alguma mangueira ou ligação provisória (C38, H13).
- **Linha de diluição da dosadora** ligada ao potável sem folga: **é interligação**. Se existir, tratar como C8 e **Cenário 1**.

**Efluente da purga e da drenagem (efluente com produto químico):**
- **Destino definido antes de drenar**, por **orientação do fornecedor e do consultor** e pela **exigência local** ⚠ (concessionária, órgão ambiental). CONAMA 430/2011 ◻ a confirmar a aplicação a rede pública.
- **Não** enviar a ralo, pluvial, jardim ou terra sem essa orientação. **Não** reaproveitar a purga (B15) enquanto houver falha de tratamento.
- Produto concentrado, resíduo de derrame e embalagem: **destinação por empresa habilitada** conforme a **exigência local** ⚠ (manifesto, se exigido).
- **Anotar** o volume e o destino no registro.

## 10. Quadro: o que não fazer

| Não faça | Porque |
|---|---|
| **Misturar produtos** ou juntar sobras | Incompatibilidade: gases tóxicos e reação perigosa |
| **Dar choque de biocida ou de cloro** sem o fornecedor | Risco de saúde, de corrosão e de espuma |
| **Sobredosar para "compensar"** a semana sem dosagem | Cria sobredosagem, corrosão e exposição |
| **Pôr controlador ou dosadora em manual** e esquecer, ou fazer "jumper" em sonda | Tratamento sem controle e sem alarme |
| **Drenar ou limpar antes de coletar** | Apaga a evidência e a causa |
| **Lavar derrame ou efluente para ralo, pluvial ou jardim** | Contaminação, risco ambiental e legal |
| **Repor ou lavar circuito ou torre com mangueira ligada ao potável** | Foi a causa do episódio 2 |
| **Ligar bomba, torre ou chiller a seco ou sem o fornecedor** na retomada | Danifica equipamento, e Legionella na partida |
| **Entrar em área de derrame sem EPI da FISPQ** | Exposição e intoxicação |
| **Usar embalagem sem rótulo ou de bebida** | Confusão e ingestão acidental |
| **Silenciar alarme e não registrar** | Falha invisível na próxima ronda |
| **Afirmar a causa** antes de confirmada | Gera passivo e perde credibilidade |
| **Liberar o retorno porque a água "parece limpa"** | Falha de tratamento pode ser invisível; só análise e parecer liberam |

## 11. Modelos de comunicação

**Acionamento do fornecedor de tratamento (a ronda ou o nível 1 usa):**
> Condomínio [nome], [torre / chiller / circuito], [hora]. **O que vimos:** [dosadora parada / bombona vazia / espuma / derrame / controlador em alarme / torre parada]. **Leitura do controlador:** [como mostrada]. **Produto envolvido:** [nome, lote]. **Há pessoa exposta?** [sim/não]. **O que foi feito:** [contenção, hora]. **Precisamos de:** orientação imediata, a FISPQ, e visita até [prazo do contrato]. Fotos enviadas em [canal]. Contato do nível 1: [nome e telefone da ficha].

**Aviso ao ocupante (odor, espuma ou ocorrência na cobertura ou casa de máquinas):**
> **AVISO — Ocorrência no sistema de climatização.** Identificamos uma alteração no tratamento da água da torre ou do circuito em [local], desde [hora]. Por precaução, **evite a área [cobertura / sala]** até novo aviso. O ar-condicionado [pode ser desligado de forma controlada às [hora]]. [**Incluir só se a ronda e a torneira sentinela não encontraram cor, odor ou gosto no potável:** Até agora não identificamos alteração na água potável. Avise a administração se notar **cor rosa, odor ou gosto estranho**.] Quem sentir irritação ou mal-estar deve procurar atendimento e avisar a administração. Próxima atualização às [hora].

**Aviso aos pontos críticos (antes de parar chiller ou torre):**
> **AVISO — Parada do resfriamento.** Por [motivo, sem afirmar causa], o resfriamento [chiller / torre] será [parado / reduzido] às [hora], com previsão de [prazo ou "sem previsão"]. Seu ponto [data center / sala / clínica] depende dele. Acione o **plano alternativo** [da ficha] e confirme o recebimento. Próxima atualização às [hora].

**Resumo ao síndico e ao proprietário:** o que aconteceu e quando; o que foi feito (contenção, parada, coleta); quem foi acionado; a causa **quando confirmada**; impactos (conforto, pontos críticos); se houve **exposição de pessoas**; se houve **efluente ou produto fora do circuito** e para onde foi; o que muda para não repetir; quando o retorno está previsto. **Sem culpar fornecedor ou pessoa** antes do laudo.

## 12. Prevenção (o que impede este cenário de acontecer)

- **Contrato com o fornecedor de tratamento** com **SLA de atendimento e de reposição de produto** ⚠, contatos e **telefone de plantão na ficha** (H21).
- **Estoque mínimo de produto** na casa de máquinas, definido com o fornecedor ⚠ (quanto e de qual produto). Estoque guardado **sem incompatíveis juntos** e com rótulo.
- **Ronda com checklist da casa de máquinas**: bombona (nível), dosadora (funcionando), controlador (automático, sem alarme), purga, bacia (cor, limo, espuma, odor), bacia de contenção (seca), **torneira sentinela**.
- **Registro semanal da dosagem** (pedido do projeto), na tabela abaixo.
- **Teste periódico da dosadora e do controlador** pelo fornecedor, registrado, com frequência ⚠ definida por ele.
- **Bacia de contenção** sob bombonas e tanques de produto, com **dreno fechado** e **sem ligação a ralo** (C34, E16); **kit de derrame** e **EPI** na casa de máquinas.
- **FISPQ acessível** na casa de máquinas, **impressa**, de cada produto, e **lava-olhos** testado (G6, G21).
- **Treinamento da ronda** neste cenário (o que faz e o que não faz) e **simulado** com a escada de escalonamento (H20).
- **Alarmes com destinatário** (H6); relatório mensal do fornecedor com o **checklist padrão** (H22), pedindo a **cadência semanal** nos itens críticos.
- **Reposição de água do circuito em litros por dia** (H19, C20): aumento é sinal de vazamento ou de purga travada.
- **Kit de reposição manual segura** (tanque com folga de ar e bomba de transferência) na casa de máquinas (Cenário 1); **proibir mangueira** entre potável e circuito.
- **PMOC e documentos** em dia (Lei 13.589/2018 e Portaria 3.523/1998 ◻ a confirmar com o responsável do PMOC).

### 12.1 Registro semanal da dosagem (pedido do projeto)

**Quem anota:** a ronda, **só o que vê**; o fornecedor mede e interpreta. Os valores medidos pelo controlador são anotados **como lidos**, e a comparação com a faixa é a **faixa da ficha** ⚠ (definida pelo fornecedor, **não** neste documento).

| Campo | O que anotar |
|---|---|
| Data, hora, quem | |
| Produto e nível da bombona (cheia, ¾, ½, ¼, quase vazia) | |
| Dosadora funcionando? (S/N) | |
| Controlador em **automático**? (S/N) | |
| Alarme ativo? (S/N e qual) | |
| Leitura do controlador (como mostrada) e **dentro da faixa da ficha?** (S/N/não sei) | |
| **Purga** funcionando? (S/N) | |
| **Biocida** aplicado na semana? (data) | |
| **Reposição de água** (litros ou leitura do hidrômetro) | |
| **Aspecto da água** (cor, turbidez, limo, espuma, odor) | |
| **Cor do circuito de água gelada** normal? (rosa, S/N) | |
| Bacia de contenção **seca**? Vazamento visível? (S/N) | |
| **FISPQ** e kit de derrame no lugar? (S/N) | |
| Observações e foto | |

**"Não sei" = fora do padrão:** item sem resposta vira **pendência** para o fornecedor e para o nível 1.

## 13. Registro de incidente (modelo)

| Campo | Preencher |
|---|---|
| Condomínio / data / hora do alerta | |
| Quem relatou / como | |
| Gatilho (dosadora, controlador, sonda, purga, biocida, produto errado, sobredosagem, derrame, torre parada, aspecto da água, laudo, alarme do fornecedor) | |
| Equipamento (torre, chiller, circuito) e produto envolvido (nome, lote) | |
| Leitura do controlador e nível da bombona (como mostrados) | |
| Pessoa exposta / atendimento (SAMU) | |
| Ramo identificado (A–E) e por quê | |
| Ações de contenção (o que, quem, hora) | |
| Cor do traçador no potável? Cenário 1 aberto? (S/N) | |
| Escalonamento (níveis acionados, hora) | |
| Fornecedor de tratamento acionado (hora, quem atendeu, hora da visita) | |
| Consultor acionado (S/N, hora) | |
| **Parada de torre ou chiller**: hora, quem decidiu, quem foi avisado, hora do retorno | |
| Pontos críticos avisados (quem, hora) | |
| Amostras: pontos, laboratório, hora, cadeia de custódia | |
| Efluente e resíduo: volume, destino, quem autorizou | |
| Reposição, drenagem ou lavagem: método, folga de ar, litros, quem, pressões lidas | |
| Causa confirmada / como foi verificada | |
| Correção (o que, quem, quando) | |
| Limpeza e desinfecção (o que, quando) | |
| Resultados das análises (data, parecer) | |
| Autorização do síndico (data, assinatura) | |
| Comunicações enviadas | |
| Lições e atualizações na ficha | |

## 14. O que precisa de validação técnica antes de ser oficial ⚠

- **Tudo que é valor:** faixas de dosagem, condutividade, pH, ORP, frequência de purga e de aplicação de biocida, limites microbiológicos (incluindo Legionella) e critérios de liberação: **definir na ficha com o fornecedor e o responsável técnico.** Este documento **não traz nenhum**.
- **Quais ações a ronda pode fazer** com dosadora, controlador, registros e kit de derrame em cada condomínio (seção 3.1).
- **Tempos-alvo** das fases e o **SLA** do fornecedor (atendimento e reposição de produto), e o **estoque mínimo** de cada produto.
- **Quando parar a torre e o chiller** (seção 6), a sequência de parada e de retomada, e o **tempo de parada** que exige limpeza, desinfecção ou amostra antes de religar.
- **Plano alternativo dos pontos críticos** (data center, clínicas) e **chiller dependente da torre** (C10) em cada prédio.
- **Choque, limpeza e desinfecção da torre e do circuito:** procedimento, EPI, aerossol, espaço confinado e altura (NR-33 e NR-35, ◻ aplicação à torre).
- **Destino do efluente** da purga, da drenagem e do derrame; **resíduos e embalagens**; quando é exigida **autorização** ou **notificação** (concessionária, órgão ambiental, vigilância sanitária) ⚠. CONAMA 430/2011 ◻ a confirmar a aplicação a rede pública.
- **Coleta de amostras** (pontos, método, Legionella), **laboratório com acreditação** e **parâmetros** a partir da FISPQ.
- **Telefone do centro de informação toxicológica** e demais contatos (na ficha).
- **Material do kit de derrame** e **EPI** por produto (FISPQ).
- **Referências:** **NBR 5626:2020**, **NBR 16783:2019** e **Portaria GM/MS nº 888/2021** tiveram existência e escopo conferidos; **ler as cláusulas no texto** antes de virarem exigência. **◻ a confirmar:** **NR-13**, **Lei 13.589/2018** e **Portaria 3.523/1998** (PMOC), **NBR 17505** (inflamáveis, se o produto for), **CONAMA 430/2011**. A **vigência da Resolução Anvisa RE 9/2003** e da **NBR 17037:2023** está **em dúvida** (ver catálogo C2/C6): **não foi afirmada aqui**; confirmar com o responsável do PMOC. **ASHRAE 188** e **Guideline 12** são **referências estrangeiras** ◻, não são norma brasileira.
